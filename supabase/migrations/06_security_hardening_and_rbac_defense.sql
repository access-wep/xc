-- Migration: 06_security_hardening_and_rbac_defense.sql
-- Fekrto (فكرتو): Comprehensive Security Hardening & Privilege Escalation Defense

-- ==============================================================================
-- 1. FIX USER SIGNUP TRIGGER (PREVENT PRIVILEGE ESCALATION VIA METADATA)
-- ==============================================================================
-- Problem: Previously, coalesce(new.raw_user_meta_data->>'role', 'user') allowed
-- attackers to set their role to 'admin' during signup.
-- Fix: Force role to strictly 'user' on all public signups.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_age integer;
  user_phone text;
  user_fullname text;
BEGIN
  user_age := coalesce((new.raw_user_meta_data->>'age')::integer, 18);
  user_phone := new.raw_user_meta_data->>'phone';
  user_fullname := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  -- Minimum age check (18+)
  IF user_age < 18 THEN
    RAISE EXCEPTION 'يجب أن يكون العمر 18 عامًا على الأقل للتسجيل في المنصة';
  END IF;

  -- Strictly force role = 'user', ignoring any client-supplied role metadata
  INSERT INTO public.profiles (id, full_name, email, phone, age, role, is_active)
  VALUES (
    new.id,
    user_fullname,
    new.email,
    user_phone,
    user_age,
    'user',
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = excluded.full_name,
    email = excluded.email,
    phone = coalesce(public.profiles.phone, excluded.phone),
    updated_at = timezone('utc'::text, now());

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 2. PREVENT SELF-ROLE ESCALATION ON PROFILES UPDATE
-- ==============================================================================
-- Trigger to ensure non-admins CANNOT alter their own role or active status
CREATE OR REPLACE FUNCTION public.prevent_profile_role_self_escalation()
RETURNS trigger AS $$
BEGIN
  -- If role or is_active is changing
  IF (new.role IS DISTINCT FROM old.role OR new.is_active IS DISTINCT FROM old.is_active) THEN
    -- If caller is not an admin, revert those sensitive fields
    IF NOT public.is_admin(auth.uid()) THEN
      new.role := old.role;
      new.is_active := old.is_active;
    END IF;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_self_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_role_self_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_self_escalation();

-- ==============================================================================
-- 3. HARDEN RLS POLICIES ON SUBSCRIPTIONS & PAYMENT REQUESTS
-- ==============================================================================
-- Ensure users cannot tamper with status, subscription_id, or reviewed fields
CREATE OR REPLACE FUNCTION public.protect_payment_request_tampering()
RETURNS trigger AS $$
BEGIN
  -- If status or reviewed_by or subscription_id is changing
  IF (new.status IS DISTINCT FROM old.status OR
      new.reviewed_by IS DISTINCT FROM old.reviewed_by OR
      new.reviewed_at IS DISTINCT FROM old.reviewed_at OR
      new.subscription_id IS DISTINCT FROM old.subscription_id) THEN
    -- Only admin can approve/reject or attach subscriptions
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'غير مصرح لك بتعديل حالة أو اعتماد طلب الدفع';
    END IF;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_payment_request_tampering ON public.payment_requests;
CREATE TRIGGER trg_protect_payment_request_tampering
  BEFORE UPDATE ON public.payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_payment_request_tampering();
