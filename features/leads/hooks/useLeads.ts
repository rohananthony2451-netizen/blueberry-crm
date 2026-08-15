"use client";

import { useEffect, useState } from "react";

import { getLeads } from "../services/lead.service";
import { Lead } from "../types";

export function useLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getLeads();
            setLeads(data);
            setLoading(false);
        }

        load();
    }, []);

    return {
        leads,
        loading,
    };
}