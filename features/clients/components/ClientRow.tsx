import { Client } from "../types";

interface ClientRowProps {
  client: Client;
}

export function ClientRow({
  client,
}: ClientRowProps) {
  return (
    <tr className="border-t transition-colors hover:bg-slate-50">
      <td className="px-4 py-4 font-medium">
        {client.name}
      </td>

      <td className="px-4 py-4">
        {client.phone || "—"}
      </td>

      <td className="px-4 py-4">
        {client.email || "—"}
      </td>

      <td className="px-4 py-4">
        {client.address || "—"}
      </td>
    </tr>
  );
}