import { ReactNode } from "react";

export function DashboardSection({
  title,
  children,
  layout = "vertical",
}: {
  title?: string;
  children?: ReactNode;
  layout?: "vertical" | "horizontal";
}) {
  return (
    <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 p-4 md:min-h-min">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div
        className={
          layout === "horizontal"
            ? "flex gap-4 flex-col justify-around md:flex-row"
            : ""
        }
      >
        {children}
      </div>
    </div>
  );
}
