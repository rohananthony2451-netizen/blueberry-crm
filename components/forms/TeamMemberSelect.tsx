"use client";

import { useEffect, useState } from "react";

import { FormSelect } from "./FormSelect";
import { getTeamMembers } from "@/features/team/services/team.service";
import type { TeamMember } from "@/features/team/types";

interface TeamMemberSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function TeamMemberSelect({
  value,
  onValueChange,
  placeholder = "Select team member",
}: TeamMemberSelectProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadMembers() {
      try {
        const data = await getTeamMembers();

        if (active) {
          setMembers(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMembers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <FormSelect
      value={value}
      onValueChange={onValueChange}
      placeholder={
        loading ? "Loading team members..." : placeholder
      }
      options={members.map((member) => ({
        label: member.fullName,
        value: member.id,
      }))}
    />
  );
}