"use client";

import { useEffect, useState } from "react";

import {
  createEvent as createEventService,
  deleteEvent as deleteEventService,
  getEvents,
  updateEvent as updateEventService,
} from "../services/event.service";

import type { EventInput } from "../services/event.service";
import type { Event } from "../types";

export function useEvents() {
  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

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

  async function createEvent(
    event: EventInput
  ) {
    try {
      setError(null);

      const createdEvent =
        await createEventService(event);

      setEvents((current) => [
        createdEvent,
        ...current,
      ]);

      return createdEvent;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create event.";

      setError(message);
      throw new Error(message);
    }
  }

  async function editEvent(
    id: string,
    data: Partial<EventInput>
  ) {
    try {
      setError(null);

      const updatedEvent =
        await updateEventService(
          id,
          data
        );

      setEvents((current) =>
        current.map((event) =>
          event.id === id
            ? updatedEvent
            : event
        )
      );

      return updatedEvent;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update event.";

      setError(message);
      throw new Error(message);
    }
  }

  async function removeEvent(
    id: string
  ) {
    try {
      setError(null);

      await deleteEventService(id);

      setEvents((current) =>
        current.filter(
          (event) => event.id !== id
        )
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete event.";

      setError(message);
      throw new Error(message);
    }
  }

  return {
    events,
    loading,
    error,
    createEvent,
    editEvent,
    removeEvent,
  };
}