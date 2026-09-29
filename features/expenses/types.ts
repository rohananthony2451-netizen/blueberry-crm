
export interface EventCostObligation {
  id: string;
  organizationId: string;

  eventId: string;
  eventName: string;
  eventDate: string;
  clientName: string;

  quotationId: string;
  quotationNumber: string;

  quotationItemId: string;
  description: string;

  amount: number;
  paid: number;
  remaining: number;

  owedTo: string;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateEventCostObligationInput {
  amount: number;
  paid: number;
  owedTo: string;
}