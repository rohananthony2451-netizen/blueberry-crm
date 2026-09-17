export const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Card",
  "Cheque",
  "Other",
] as const;

export const PAYMENT_METHOD_LABELS = {
  Cash: "Cash",
  UPI: "UPI",
  "Bank Transfer": "Bank Transfer",
  Card: "Card",
  Cheque: "Cheque",
  Other: "Other",
} as const;