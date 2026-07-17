export interface Lead {
  id: number;

  clientName: string;

  phone: string;

  eventType: string;

  eventDate: string;

  status:
    | "New"
    | "Contacted"
    | "Quoted"
    | "Booked";

  salesperson: string;
}