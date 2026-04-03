import { DASHBOARD_COPY } from "./DashboardContent.copy";

interface DashboardContentViewProps {
  isEmpty: boolean;
}

export function DashboardContentView({ isEmpty }: DashboardContentViewProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{DASHBOARD_COPY.title}</h1>
      {isEmpty && (
        <p className="text-muted-foreground mt-2">{DASHBOARD_COPY.empty}</p>
      )}
    </div>
  );
}
