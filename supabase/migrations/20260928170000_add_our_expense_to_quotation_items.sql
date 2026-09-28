-- ============================================================
-- Eventify
-- Quotation Item: Our Expense
--
-- Purpose:
-- Mark whether a quotation line item represents money that
-- Eventify's business will owe to someone else.
--
-- OFF:
-- Customer-facing quotation item only.
--
-- ON:
-- Becomes a potential business expense/obligation after the
-- quotation is accepted and a confirmed Event exists.
-- ============================================================


ALTER TABLE public.quotation_items
ADD COLUMN IF NOT EXISTS our_expense boolean
NOT NULL
DEFAULT false;


COMMENT ON COLUMN public.quotation_items.our_expense IS
  'Whether this quotation item represents money the organization expects to owe to another person or business after quotation acceptance.';