interface TableEmptyProps {
  message: string;
}

export function TableEmpty({
  message,
}: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={20}
        className="py-12 text-center text-slate-500"
      >
        {message}
      </td>
    </tr>
  );
}