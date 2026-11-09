export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'postponed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ScheduleType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending'
export type PaymentStatus = 'pending' | 'approved' | 'rejected'
export type UserRole = 'user' | 'admin' | 'super_admin'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  age: number
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  name_ar?: string
  description: string | null
  price_monthly: number
  price_yearly: number
  features: Json
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: SubscriptionStatus
  start_date: string
  end_date: string
  is_yearly: boolean
  amount_paid: number
  discount_amount: number
  coupon_id: string | null
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: string
  name: string
  name_ar: string
  description: string | null
  instructions: string | null
  account_details: Json | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PaymentRequest {
  id: string
  user_id: string
  subscription_id: string | null
  plan_id?: string | null
  is_yearly?: boolean
  coupon_id?: string | null
  payment_method_id: string
  amount: number
  currency: string
  proof_url: string | null
  status: PaymentStatus
  admin_note: string | null
  rejection_reason: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses: number | null
  used_count: number
  min_amount: number | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CouponUsage {
  id: string
  coupon_id: string
  user_id: string
  used_at: string
}

export interface Schedule {
  id: string
  user_id: string
  name: string
  description: string | null
  type: ScheduleType
  start_date: string
  end_date: string
  is_active: boolean
  color: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ScheduleDay {
  id: string
  schedule_id: string
  date: string
  day_name: string | null
  notes: string | null
  is_completed: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  schedule_day_id: string
  schedule_id: string
  user_id: string
  title: string
  description: string | null
  start_time: string | null
  end_time: string | null
  duration_minutes: number | null
  priority: TaskPriority
  status: TaskStatus
  is_completed: boolean
  notes: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface TaskCategory {
  id: string
  user_id: string
  name: string
  color: string
  icon: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  action_url: string | null
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: Json
  description: string | null
  updated_at: string
  updated_by: string | null
}

export interface LegalPage {
  id: string
  slug: string
  title: string
  content: string
  is_published: boolean
  updated_at: string
  updated_by: string | null
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  details: Json | null
  ip_address: string | null
  created_at: string
}
