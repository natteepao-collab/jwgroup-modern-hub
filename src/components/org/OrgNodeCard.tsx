import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, User, Crown, Sparkles } from "lucide-react";
import type { OrgTreeNode } from "@/hooks/useOrgTree";

interface Props {
  node: OrgTreeNode;
  onClick?: (n: OrgTreeNode) => void;
  onToggle?: (id: string) => void;
  expanded?: boolean;
  hasChildren?: boolean;
  highlight?: boolean;
}

const levelStyles: Record<number, string> = {
  1: "min-w-[260px] max-w-[320px] bg-gradient-to-br from-primary to-primary/85 text-primary-foreground border-accent/60 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.5)]",
  2: "min-w-[220px] max-w-[280px] bg-card border-primary/30 shadow-md",
  3: "min-w-[200px] max-w-[240px] bg-card border-border shadow-sm",
  4: "min-w-[190px] max-w-[220px] bg-muted/40 border-border shadow-sm",
};

export function OrgNodeCard({
  node,
  onClick,
  onToggle,
  expanded,
  hasChildren,
  highlight,
}: Props) {
  const isCEO = node.organization_level === 1;
  const style = levelStyles[node.organization_level] ?? levelStyles[4];

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={() => onClick?.(node)}
        className={cn(
          "group relative rounded-2xl border-2 px-4 py-3 text-left transition-all duration-300",
          "hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/60",
          style,
          highlight && "ring-2 ring-accent shadow-accent/40 shadow-lg",
        )}
      >
        {isCEO && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-accent px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground shadow">
            <Crown className="h-3 w-3" /> CEO
          </div>
        )}

        <div className="flex items-start gap-2">
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isCEO
                ? "bg-accent/25 text-accent-foreground"
                : "bg-primary/10 text-primary",
            )}
          >
            {isCEO ? <Crown className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "text-[11px] uppercase tracking-wider opacity-80",
                isCEO ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {node.position_en || "Position"}
            </div>
            <div
              className={cn(
                "font-bold leading-tight",
                isCEO ? "text-base" : "text-sm",
              )}
            >
              {node.position_th}
            </div>
            <div
              className={cn(
                "mt-1.5 truncate text-sm font-medium",
                isCEO ? "text-primary-foreground" : "text-foreground",
              )}
            >
              {node.employee_name || (
                <span className="italic opacity-70">
                  {node.status === "vacant" ? "ตำแหน่งว่าง" : "รอระบุผู้รับผิดชอบ"}
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1">
              {node.status === "vacant" && (
                <Badge variant="destructive" className="h-5 gap-1 px-1.5 text-[10px]">
                  <Sparkles className="h-2.5 w-2.5" /> Vacant
                </Badge>
              )}
              {node.status === "pending" && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  รอระบุ
                </Badge>
              )}
              {node.relationship_type === "advisory" && (
                <Badge variant="outline" className="h-5 border-accent/60 px-1.5 text-[10px] text-accent">
                  ที่ปรึกษา
                </Badge>
              )}
              {node.relationship_type === "executive-support" && (
                <Badge variant="outline" className="h-5 border-accent/60 px-1.5 text-[10px] text-accent">
                  สนับสนุนผู้บริหาร
                </Badge>
              )}
            </div>
          </div>
        </div>

        {hasChildren && (
          <span
            role="button"
            aria-label={expanded ? "ย่อ" : "ขยาย"}
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(node.id);
            }}
            className={cn(
              "absolute -bottom-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-md transition-transform",
              isCEO
                ? "border-accent bg-accent text-accent-foreground"
                : "border-primary bg-background text-primary",
              "hover:scale-110",
            )}
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </span>
        )}
      </button>
    </div>
  );
}
