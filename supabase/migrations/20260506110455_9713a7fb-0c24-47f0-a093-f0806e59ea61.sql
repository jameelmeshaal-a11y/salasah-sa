
-- Fix search_path on update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Lock down SECURITY DEFINER functions (only triggers/internal use)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten public insert policies with basic validation
DROP POLICY "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings" ON public.bookings
FOR INSERT WITH CHECK (
  length(full_name) BETWEEN 2 AND 120
  AND length(phone) BETWEEN 6 AND 30
  AND length(meeting_time) BETWEEN 1 AND 20
);

DROP POLICY "Anyone can send messages" ON public.contact_messages;
CREATE POLICY "Anyone can send messages" ON public.contact_messages
FOR INSERT WITH CHECK (
  length(full_name) BETWEEN 2 AND 120
  AND length(message) BETWEEN 2 AND 5000
);
