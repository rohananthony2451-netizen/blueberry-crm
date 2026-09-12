"use client";

import { useEffect, useState } from "react";

import { getEvents } from "../services/event.service";
import { Event } from "../types";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const data = await getEvents();


setEvents(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load events."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return {
    events,
    loading,
    error,
  };
}