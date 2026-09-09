import { Card } from "@/components/ui/card";

import { Client } from "../types";
import { ClientTableHeader } from "./ClientTableHeader";
import { ClientTableBody } from "./ClientTableBody";

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({
  clients,
}: ClientTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <table className="w-full">
        <ClientTableHeader />

        <ClientTableBody
          clients={clients}
        />
      </table>
    </Card>
  );
}