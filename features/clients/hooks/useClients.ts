"use client";

import { useEffect, useState } from "react";

import {
  getClients,
  createClientRecord,
  updateClient,
  deleteClient,
} from "../services/client.service";

import { Client } from "../types";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients();
        setClients(data);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);

  async function createClient(
    client: Omit<Client, "id" | "createdAt" | "updatedAt">
  ) {
    const newClient = await createClientRecord(client);

    setClients((current) => [
      newClient,
      ...current,
    ]);

    return newClient;
  }

  async function editClient(
    id: string,
    client: Partial<Client>
  ) {
    const updatedClient = await updateClient(id, client);

    setClients((current) =>
      current.map((item) =>
        item.id === id ? updatedClient : item
      )
    );

    return updatedClient;
  }

  async function removeClient(id: string) {
    await deleteClient(id);

    setClients((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  return {
    clients,
    loading,
    createClient,
    editClient,
    removeClient,
  };
}