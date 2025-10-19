import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "active" | "pending" | "blocked" | "refused" | "accepted" | "success" | "failed";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    active: { label: "Active", variant: "default" as const, className: "bg-success text-success-foreground" },
    pending: { label: "Pending", variant: "secondary" as const, className: "bg-warning text-warning-foreground" },
    blocked: { label: "Blocked", variant: "destructive" as const, className: "" },
    refused: { label: "Refused", variant: "destructive" as const, className: "" },
    accepted: { label: "Accepted", variant: "default" as const, className: "bg-success text-success-foreground" },
    success: { label: "Success", variant: "default" as const, className: "bg-success text-success-foreground" },
    failed: { label: "Failed", variant: "destructive" as const, className: "" },
  };

  const config = statusConfig[status.toLowerCase() as StatusType] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
