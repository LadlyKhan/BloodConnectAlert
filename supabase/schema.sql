-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL,
  contact text,
  role text NOT NULL CHECK (role = ANY (ARRAY['Admin'::text, 'Verifier'::text, 'Donor'::text, 'Requester'::text, 'Hospital'::text, 'Blood Bank'::text])),
  account_status text NOT NULL DEFAULT 'Active'::text CHECK (account_status = ANY (ARRAY['Active'::text, 'Suspended'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.facilities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_profile_id uuid NOT NULL,
  facility_type text NOT NULL CHECK (facility_type = ANY (ARRAY['Hospital'::text, 'Blood Bank'::text])),
  name text NOT NULL,
  address text NOT NULL,
  contact text,
  representative_name text,
  verification_status text NOT NULL DEFAULT 'Pending'::text CHECK (verification_status = ANY (ARRAY['Pending'::text, 'Approved'::text, 'Rejected'::text, 'Suspended'::text])),
  verified_by uuid,
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT facilities_pkey PRIMARY KEY (id),
  CONSTRAINT facilities_owner_profile_id_fkey FOREIGN KEY (owner_profile_id) REFERENCES public.profiles(id),
  CONSTRAINT facilities_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.donors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE,
  blood_group text NOT NULL,
  availability text NOT NULL DEFAULT 'Available'::text CHECK (availability = ANY (ARRAY['Available'::text, 'Unavailable'::text, 'Paused'::text])),
  alert_consent boolean NOT NULL DEFAULT false,
  latitude numeric,
  longitude numeric,
  reliability_level text NOT NULL DEFAULT 'Medium'::text CHECK (reliability_level = ANY (ARRAY['High'::text, 'Medium'::text, 'Low'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT donors_pkey PRIMARY KEY (id),
  CONSTRAINT donors_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.blood_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  requester_profile_id uuid NOT NULL,
  patient_reference text,
  blood_group text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  quantity_unit text NOT NULL DEFAULT 'Units'::text,
  urgency text NOT NULL CHECK (urgency = ANY (ARRAY['Critical'::text, 'Urgent'::text, 'Normal'::text])),
  required_at timestamp with time zone NOT NULL,
  facility_name text,
  address text NOT NULL,
  latitude numeric,
  longitude numeric,
  requester_contact text,
  status text NOT NULL DEFAULT 'Pending'::text CHECK (status = ANY (ARRAY['Pending'::text, 'Verified'::text, 'Rejected'::text, 'Matching'::text, 'Partially Fulfilled'::text, 'Fulfilled'::text, 'Cancelled'::text, 'Expired'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blood_requests_pkey PRIMARY KEY (id),
  CONSTRAINT blood_requests_requester_profile_id_fkey FOREIGN KEY (requester_profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.request_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL,
  changed_by uuid,
  previous_status text,
  new_status text NOT NULL,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT request_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT request_status_history_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.blood_requests(id),
  CONSTRAINT request_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL,
  donor_id uuid NOT NULL,
  stage text NOT NULL,
  response_status text NOT NULL DEFAULT 'Pending'::text,
  delivery_status text NOT NULL DEFAULT 'Pending'::text,
  alerted_at timestamp with time zone NOT NULL DEFAULT now(),
  responded_at timestamp with time zone,
  withdrawn_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT alerts_pkey PRIMARY KEY (id),
  CONSTRAINT alerts_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.blood_requests(id),
  CONSTRAINT alerts_donor_id_fkey FOREIGN KEY (donor_id) REFERENCES public.donors(id)
);
CREATE TABLE public.donations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donation_code text NOT NULL UNIQUE,
  donor_id uuid NOT NULL,
  facility_id uuid NOT NULL,
  request_id uuid,
  donation_date timestamp with time zone,
  progress_status text NOT NULL DEFAULT 'Scheduled'::text,
  outcome text,
  recorded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT donations_pkey PRIMARY KEY (id),
  CONSTRAINT donations_donor_id_fkey FOREIGN KEY (donor_id) REFERENCES public.donors(id),
  CONSTRAINT donations_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id),
  CONSTRAINT donations_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.blood_requests(id),
  CONSTRAINT donations_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.external_donation_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL,
  reported_date timestamp with time zone NOT NULL,
  facility_name text NOT NULL,
  review_status text NOT NULL DEFAULT 'Pending'::text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT external_donation_reports_pkey PRIMARY KEY (id),
  CONSTRAINT external_donation_reports_donor_id_fkey FOREIGN KEY (donor_id) REFERENCES public.donors(id),
  CONSTRAINT external_donation_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.reliability_outcomes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL,
  alert_id uuid,
  donation_id uuid,
  outcome_type text NOT NULL,
  recorded_by uuid,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reliability_outcomes_pkey PRIMARY KEY (id),
  CONSTRAINT reliability_outcomes_donor_id_fkey FOREIGN KEY (donor_id) REFERENCES public.donors(id),
  CONSTRAINT reliability_outcomes_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES public.alerts(id),
  CONSTRAINT reliability_outcomes_donation_id_fkey FOREIGN KEY (donation_id) REFERENCES public.donations(id),
  CONSTRAINT reliability_outcomes_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.app_config (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  config_key text NOT NULL UNIQUE,
  config_value jsonb NOT NULL,
  updated_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT app_config_pkey PRIMARY KEY (id),
  CONSTRAINT app_config_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  record_type text NOT NULL,
  record_id uuid,
  change_summary text,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT audit_log_pkey PRIMARY KEY (id),
  CONSTRAINT audit_log_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.blood_units (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  unit_code text NOT NULL UNIQUE,
  donation_id uuid NOT NULL,
  facility_id uuid NOT NULL,
  blood_group text NOT NULL,
  unit_status text NOT NULL DEFAULT 'Pending'::text,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blood_units_pkey PRIMARY KEY (id),
  CONSTRAINT blood_units_donation_id_fkey FOREIGN KEY (donation_id) REFERENCES public.donations(id),
  CONSTRAINT blood_units_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id)
);
CREATE TABLE public.screening_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL,
  blood_unit_id uuid,
  progress_status text NOT NULL DEFAULT 'Pending'::text,
  clinical_decision text,
  decision_reason text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT screening_records_pkey PRIMARY KEY (id),
  CONSTRAINT screening_records_donation_id_fkey FOREIGN KEY (donation_id) REFERENCES public.donations(id),
  CONSTRAINT screening_records_blood_unit_id_fkey FOREIGN KEY (blood_unit_id) REFERENCES public.blood_units(id),
  CONSTRAINT screening_records_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.inventory_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  facility_id uuid NOT NULL,
  blood_unit_id uuid,
  transaction_type text NOT NULL,
  quantity integer NOT NULL,
  previous_status text,
  new_status text,
  reason text,
  recorded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_transactions_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id),
  CONSTRAINT inventory_transactions_blood_unit_id_fkey FOREIGN KEY (blood_unit_id) REFERENCES public.blood_units(id),
  CONSTRAINT inventory_transactions_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.stock_thresholds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  facility_id uuid NOT NULL,
  blood_group text NOT NULL,
  minimum_quantity integer NOT NULL DEFAULT 0,
  updated_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT stock_thresholds_pkey PRIMARY KEY (id),
  CONSTRAINT stock_thresholds_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id),
  CONSTRAINT stock_thresholds_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  hospital_facility_id uuid NOT NULL,
  blood_bank_facility_id uuid,
  blood_group text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  status text NOT NULL DEFAULT 'Pending'::text,
  response_time timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT inquiries_pkey PRIMARY KEY (id),
  CONSTRAINT inquiries_hospital_facility_id_fkey FOREIGN KEY (hospital_facility_id) REFERENCES public.facilities(id),
  CONSTRAINT inquiries_blood_bank_facility_id_fkey FOREIGN KEY (blood_bank_facility_id) REFERENCES public.facilities(id)
);