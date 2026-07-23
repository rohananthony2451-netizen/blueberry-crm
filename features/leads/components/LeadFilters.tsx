import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { FormSelect } from "@/components/forms/FormSelect";

import { LEAD_STATUS, LEAD_SOURCES } from "../constants";

export function LeadFilters() {
    return (
        <div className="mb-6 flex flex-wrap gap-4">

            <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <Input
                    placeholder="Search client..."
                    className="pl-10"
                />
            </div>

            <div className="w-56">
                <FormSelect
                    placeholder="All Status"
                    options={[...LEAD_STATUS]}
                />
            </div>

            <div className="w-56">
                <FormSelect
                    placeholder="All Sources"
                    options={[...LEAD_SOURCES]}
                />
            </div>

        </div>
    );
}