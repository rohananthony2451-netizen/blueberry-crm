import { Client } from "../types";
import { ClientRow } from "./ClientRow";
import { TableEmpty } from "@/components/tables/TableEmpty";

interface ClientTableBodyProps {
  clients: Client[];
}

export function ClientTableBody({
  clients,
}: ClientTableBodyProps) {
  return (
    <tbody>
      {clients.length === 0 ? (
        <TableEmpty message="No clients found." />
      ) : (
        clients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
          />
        ))
      )}
    </tbody>
  );
}