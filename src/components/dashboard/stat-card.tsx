import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "orange" | "red";
}

const colorMap = {
  blue: "border-l-[#1e3a8a] bg-blue-50/50",
  green: "border-l-[#22c55e] bg-green-50/50",
  orange: "border-l-orange-500 bg-orange-50/50",
  red: "border-l-red-500 bg-red-50/50",
};

const iconColorMap = {
  blue: "text-[#1e3a8a] bg-blue-100",
  green: "text-[#22c55e] bg-green-100",
  orange: "text-orange-500 bg-orange-100",
  red: "text-red-500 bg-red-100",
};

export function StatCard({
  title,
  value,
  description,
  icon,
  color = "blue",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-l-4 shadow-sm hover:shadow-md transition-shadow",
        colorMap[color]
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "rounded-lg p-2.5",
              iconColorMap[color]
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
