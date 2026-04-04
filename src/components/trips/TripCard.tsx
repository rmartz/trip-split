import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TRIP_CARD_COPY } from "./TripCard.copy";

interface TripCardProps {
  description?: string;
  id: string;
  memberCount?: number;
  name: string;
}

export function TripCard({
  description,
  id,
  memberCount,
  name,
}: TripCardProps) {
  return (
    <Link href={`/trips/${id}`} className="block">
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
          {memberCount !== undefined && (
            <p className="text-muted-foreground text-xs">
              {TRIP_CARD_COPY.memberCount(memberCount)}
            </p>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
