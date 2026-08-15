export function LeadTableHeader() {
    return (
        <thead>
            <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">
                    Client
                </th>

                <th className="px-4 py-3 text-left font-medium">
                    Event
                </th>

                <th className="px-4 py-3 text-left font-medium">
                    Date
                </th>

                <th className="px-4 py-3 text-left font-medium">
                    Budget
                </th>

                <th className="px-4 py-3 text-left font-medium">
                    Status
                </th>

                <th className="px-4 py-3 text-left font-medium">
                    Source
                </th>
                <th className="px-4 py-3 text-left font-medium">
                    Assigned
                </th>
            </tr>
        </thead> 
        );
}