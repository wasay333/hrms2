import { ReactNode } from "react";

export function DashboardCard({
  title,
  content,
  children,
}: {
  title?: string;
  content?: string;
  children?: ReactNode;
}) {
  return (
    <div className="h-[380px] rounded-xl bg-muted/50 p-4 flex justify-between">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {content && (
        <div className="mt-2 text-sm text-muted-foreground">{content}</div>
      )}
      <div className="mt-4 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
