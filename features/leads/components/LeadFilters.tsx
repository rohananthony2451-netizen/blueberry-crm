import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/forms/FormSelect";
import {
    LEAD_STATUS,
    LEAD_SOURCES,
    LEAD_SORT_OPTIONS,
} from "../constants";
interface LeadFiltersProps {
  search: string;
  status: string;
  source: string;
  sortBy: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onSortChange: (value: string) => void;
}
export function LeadFilters({
    search,
    status,
    source,
    sortBy,
    onSearchChange,
    onStatusChange,
    onSourceChange,
    onSortChange,
}: LeadFiltersProps){
    return (
        <div className="mb-6 flex flex-wrap gap-4">

            <div className="w-56">
                <FormSelect
                value={status}
                onValueChange={onStatusChange}
                placeholder="All Status"
                options={[...LEAD_STATUS]}
                />
            </div>

            <div className="w-56">
                <FormSelect
                value={source}
                onValueChange={onSourceChange}
                placeholder="All Sources"
                options={[...LEAD_SOURCES]}
                />
                <div className="w-56">
                <FormSelect
                 value={sortBy}
        onValueChange={onSortChange}
        placeholder="Sort By"
        options={[...LEAD_SORT_OPTIONS]}
    />
            </div>
             </div>

        </div>
    );
}