import type { TripMember } from "@/types";

interface MemberListProps {
  members: TripMember[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <ul className="space-y-2">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex items-center gap-2 rounded-md border px-3 py-2"
        >
          <span className="text-sm">{member.name}</span>
          {member.userId && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
              account
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
