
-- Drop and recreate the client_complete_summary view with security_invoker=true
-- This ensures the view respects the RLS policies of the querying user, not the view creator

DROP VIEW IF EXISTS public.client_complete_summary;

CREATE VIEW public.client_complete_summary
WITH (security_invoker = true)
AS
SELECT 
  c.id,
  c.name,
  c.last_name,
  c.phone,
  c.email,
  c.created_at AS client_since,
  COUNT(DISTINCT a.id) AS total_appointments,
  COUNT(DISTINCT CASE WHEN a.status = 'completada' THEN a.id ELSE NULL END) AS completed_appointments,
  SUM(CASE WHEN cb.status = 'activo' THEN cb.services_remaining ELSE 0 END) AS active_bonus_services,
  COUNT(DISTINCT cb.id) AS total_bonuses_purchased,
  COALESCE(SUM(p.amount), 0) AS total_spent,
  MAX(a.appointment_date) AS last_visit_date
FROM clients c
LEFT JOIN appointments a ON c.id = a.client_id
LEFT JOIN client_bonuses cb ON c.id = cb.client_id
LEFT JOIN payments p ON c.id = p.client_id
GROUP BY c.id, c.name, c.last_name, c.phone, c.email, c.created_at;
