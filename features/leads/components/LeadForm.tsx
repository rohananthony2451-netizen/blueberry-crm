"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeadForm() {
    return (
        <form className="space-y-5">

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Client Name
                </label>

                <Input placeholder="John Doe" />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Phone
                </label>

                <Input placeholder="+91 9876543210" />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Event Type
                </label>

                <Input placeholder="Wedding" />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Event Date
                </label>

                <Input type="date" />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Budget
                </label>

                <Input placeholder="₹ 500000" />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Source
                </label>

                <Input placeholder="Instagram" />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Assigned To
                </label>

                <Input placeholder="Rohit" />
            </div>

            <div className="flex justify-end gap-3 pt-3">

                <Button
                    type="button"
                    variant="outline"
                >
                    Cancel
                </Button>

                <Button type="submit">
                    Save Lead
                </Button>

            </div>

        </form>
    );
}