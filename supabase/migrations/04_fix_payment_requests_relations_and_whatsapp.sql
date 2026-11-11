-- Migration: 04_fix_payment_requests_relations_and_whatsapp.sql
-- Fekrto (فكرتو): Fix Payment Requests Foreign Keys, Storage Bucket & Add WhatsApp Support Settings

-- 1. Ensure foreign key constraint between payment_requests and profiles exists
-- This allows PostgREST queries to join profiles if needed, while raw queries also work safely.
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'payment_requests_user_id_profiles_fkey'
  ) then
    alter table public.payment_requests
      add constraint payment_requests_user_id_profiles_fkey
      foreign key (user_id) references public.profiles(id) on delete cascade;
  end if;
exception
  when others then null;
end $$;

-- 2. Ensure payment_proofs storage bucket is configured
insert into storage.buckets (id, name, public)
values ('payment_proofs', 'payment_proofs', true)
on conflict (id) do update set public = true;

-- Storage policies for payment_proofs
drop policy if exists "Authenticated users can upload payment proofs" on storage.objects;
create policy "Authenticated users can upload payment proofs"
  on storage.objects for insert
  with check (bucket_id = 'payment_proofs' and auth.role() = 'authenticated');

drop policy if exists "Anyone can view payment proofs" on storage.objects;
create policy "Anyone can view payment proofs"
  on storage.objects for select
  using (bucket_id = 'payment_proofs');

-- 3. Update or Seed WhatsApp Support in site_settings
insert into public.site_settings (key, value, description)
values
  (
    'site_info',
    '{
      "site_name": "فكرتو",
      "site_name_en": "Fekrto",
      "description": "منصة الإنتاجية وتنظيم الجداول والمهام في الوطن العربي",
      "contact_email": "support@fekrto.com",
      "contact_phone": "+966500000000",
      "whatsapp_number": "+966500000000",
      "whatsapp_message": "مرحباً، أود الاستفسار بخصوص منصة فكرتو",
      "whatsapp_enabled": true,
      "currency": "ر.س",
      "currency_en": "SAR"
    }'::jsonb,
    'الإعدادات الأساسية للموقع وخدمة الدعم الفني'
  )
on conflict (key) do update
set value = public.site_settings.value || '{
  "whatsapp_number": "+966500000000",
  "whatsapp_message": "مرحباً، أود الاستفسار بخصوص منصة فكرتو",
  "whatsapp_enabled": true
}'::jsonb;
