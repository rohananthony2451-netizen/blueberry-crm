
-- Eventos: quotation audit trail
-- Records quotation header and line-item changes.
-- Audit history is intentionally not FK-linked to quotations,
-- so deleting a quotation does not delete its history.

CREATE TABLE IF NOT EXISTS public.quotation_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  quotation_id uuid NOT NULL,
  quotation_number text,
  entity_type text NOT NULL
    CHECK (entity_type IN ('quotation', 'quotation_item')),
  entity_id uuid NOT NULL,
  action text NOT NULL
    CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  actor_user_id uuid,
  actor_name text NOT NULL DEFAULT 'Unknown user',
  changed_at timestamptz NOT NULL DEFAULT now(),
  before_data jsonb,
  after_data jsonb
);

CREATE INDEX IF NOT EXISTS idx_quotation_audit_logs_history
  ON public.quotation_audit_logs
  (organization_id, quotation_id, changed_at DESC);

ALTER TABLE public.quotation_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own organization quotation history"
  ON public.quotation_audit_logs;

CREATE POLICY "Users can view own organization quotation history"
  ON public.quotation_audit_logs
  FOR SELECT
  TO authenticated
  USING (
    organization_id = public.get_user_organization_id()
  );

-- Audit records are written by database triggers, not directly
-- by browser clients.
REVOKE ALL ON public.quotation_audit_logs FROM anon, authenticated;
GRANT SELECT ON public.quotation_audit_logs TO authenticated;

CREATE OR REPLACE FUNCTION public.log_quotation_audit_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_quotation_id uuid;
  v_quotation_number text;
  v_entity_id uuid;
  v_entity_type text;
  v_action text;
  v_actor_id uuid;
  v_actor_name text;
  v_before jsonb;
  v_after jsonb;
  v_items jsonb;
BEGIN
  v_actor_id := auth.uid();

  SELECT COALESCE(
    NULLIF(BTRIM(p.full_name), ''),
    NULLIF(BTRIM(p.email), ''),
    auth.jwt() ->> 'email',
    'Unknown user'
  )
  INTO v_actor_name
  FROM (SELECT 1) AS seed
  LEFT JOIN public.profiles p
    ON p.id = v_actor_id;

  v_actor_name := COALESCE(v_actor_name, 'Unknown user');

  IF TG_TABLE_NAME = 'quotations' THEN
    v_entity_type := 'quotation';
    v_entity_id := CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END;

    v_quotation_id := v_entity_id;
    v_org_id := CASE
      WHEN TG_OP = 'DELETE' THEN OLD.organization_id
      ELSE NEW.organization_id
    END;
    v_quotation_number := CASE
      WHEN TG_OP = 'DELETE' THEN OLD.quotation_number
      ELSE NEW.quotation_number
    END;

    IF TG_OP = 'INSERT' THEN
      v_action := 'INSERT';
      v_after := to_jsonb(NEW);

    ELSIF TG_OP = 'UPDATE' THEN
      IF to_jsonb(OLD) = to_jsonb(NEW) THEN
        RETURN NEW;
      END IF;

      v_action := 'UPDATE';
      v_before := to_jsonb(OLD);
      v_after := to_jsonb(NEW);

    ELSE
      v_action := 'DELETE';

      SELECT COALESCE(
        jsonb_agg(to_jsonb(qi) ORDER BY qi.created_at, qi.id),
        '[]'::jsonb
      )
      INTO v_items
      FROM public.quotation_items qi
      WHERE qi.quotation_id = OLD.id;

      v_before := to_jsonb(OLD) ||
        jsonb_build_object('items', v_items);
    END IF;

  ELSE
    v_entity_type := 'quotation_item';
    v_entity_id := CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END;

    v_quotation_id := CASE
      WHEN TG_OP = 'DELETE' THEN OLD.quotation_id
      ELSE NEW.quotation_id
    END;

    IF TG_OP = 'INSERT' THEN
      v_action := 'INSERT';
      v_after := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
      IF to_jsonb(OLD) = to_jsonb(NEW) THEN
        RETURN NEW;
      END IF;

      v_action := 'UPDATE';
      v_before := to_jsonb(OLD);
      v_after := to_jsonb(NEW);
    ELSE
      v_action := 'DELETE';
      v_before := to_jsonb(OLD);
    END IF;

    SELECT q.organization_id, q.quotation_number
    INTO v_org_id, v_quotation_number
    FROM public.quotations q
    WHERE q.id = v_quotation_id;

    -- During a quotation deletion, its own audit entry captures
    -- all line items before cascading deletes remove them.
    IF v_org_id IS NULL THEN
      RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
    END IF;
  END IF;

  INSERT INTO public.quotation_audit_logs (
    organization_id,
    quotation_id,
    quotation_number,
    entity_type,
    entity_id,
    action,
    actor_user_id,
    actor_name,
    before_data,
    after_data
  )
  VALUES (
    v_org_id,
    v_quotation_id,
    v_quotation_number,
    v_entity_type,
    v_entity_id,
    v_action,
    v_actor_id,
    v_actor_name,
    v_before,
    v_after
  );

  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

DROP TRIGGER IF EXISTS quotation_audit_log_trigger
  ON public.quotations;

CREATE TRIGGER quotation_audit_log_trigger
BEFORE INSERT OR UPDATE OR DELETE ON public.quotations
FOR EACH ROW
EXECUTE FUNCTION public.log_quotation_audit_change();

DROP TRIGGER IF EXISTS quotation_item_audit_log_trigger
  ON public.quotation_items;

CREATE TRIGGER quotation_item_audit_log_trigger
BEFORE INSERT OR UPDATE OR DELETE ON public.quotation_items
FOR EACH ROW
EXECUTE FUNCTION public.log_quotation_audit_change();
