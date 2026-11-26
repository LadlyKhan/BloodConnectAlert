| permission_sql                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------- |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.alerts TO authenticated;                                  |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.app_config TO authenticated;                              |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.audit_log TO authenticated;                               |
| GRANT INSERT, SELECT ON TABLE public.blood_requests TO authenticated;                                                 |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.blood_units TO authenticated;                             |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.donations TO authenticated;                               |
| GRANT INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.donors TO authenticated;                          |
| GRANT INSERT, SELECT ON TABLE public.external_donation_reports TO authenticated;                                      |
| GRANT INSERT, SELECT ON TABLE public.facilities TO authenticated;                                                     |
| GRANT SELECT ON TABLE public.inquiries TO authenticated;                                                              |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.inventory_transactions TO authenticated;                  |
| GRANT INSERT, SELECT ON TABLE public.profiles TO authenticated;                                                       |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.reliability_outcomes TO authenticated;                    |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.request_status_history TO authenticated;                  |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.screening_records TO authenticated;                       |
| GRANT REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.stock_thresholds TO authenticated;                        |
| GRANT UPDATE (alert_consent, availability, blood_group, latitude, longitude) ON TABLE public.donors TO authenticated; |
| GRANT UPDATE (address, contact, name, representative_name) ON TABLE public.facilities TO authenticated;               |