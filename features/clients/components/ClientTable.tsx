import { Card } from "@/components/ui/card";

import { Client } from "../types";
import { ClientTableHeader } from "./ClientTableHeader";
import { ClientTableBody } from "./ClientTableBody";

interface ClientTableProps {
  clients: Client[];
  onEdit?: (
    id: string,
    data: Partial<Client>
  ) => Promise<unknown>;
}

export function ClientTable({
  clients,
  onEdit,
}: ClientTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <table className="w-full">
        <ClientTableHeader />

        <ClientTableBody
          clients={clients}
          onEdit={onEdit}
        />
      </table>
    </Card>
  );
}