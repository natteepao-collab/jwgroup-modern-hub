import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Crown } from "lucide-react";
import type { OrgTreeNode } from "@/hooks/useOrgTree";

interface Props {
  node: OrgTreeNode;
  onClick?: (n: OrgTreeNode) => void;
  onToggle?: (id: string) => void;
  expanded?: boolean;
  hasChildren?: boolean;
  highlight?: boolean;
}

// Editorial / annual-report style tag per level
const levelTag: Record<number, string> = {
  1: "Chief Executive",
  2: "Management",
  3: "Department",
  4: "Division",
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
  const isLevel2 = node.organization_level === 2;
  const isAdvisory =
    node.relationship_type === "advisory" ||
    node.relationship_type === "executive-support";

  // ============ CEO card — minimal white with orange accent ============
  if (isCEO) {
    return (
      <div className="inline-block">
        <button
          type="button"
          onClick={() => onClick?.(node)}
          className={cn(
            "group relative rounded-2xl text-left transition-all duration-300",
            "border border-primary/40 bg-white",
            "shadow-[0_20px_60px_-25px_hsl(var(--primary)/0.35)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-25px_hsl(var(--primary)/0.5)]",
            "focus:outline-none focus:ring-2 focus:ring-primary/40",
            highlight && "ring-2 ring-primary",
          )}
        >
          <div className="relative flex items-center gap-5 rounded-2xl px-6 py-5 md:px-8 md:py-6 min-w-[320px] max-w-[420px]">
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-xl border border-primary/40 bg-primary/5 text-primary">
                <Crown className="h-8 w-8 md:h-9 md:w-9" />
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
                Level 1
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {node.position_en || levelTag[1]}
              </div>
              <div className="mt-1 text-lg md:text-xl font-bold leading-tight text-foreground">
                {node.position_th}
              </div>
              <div className="mt-1 truncate text-sm text-muted-foreground">
                {node.employee_name || (
                  <span className="italic">
                    {node.status === "vacant" ? "ตำแหน่งว่าง" : "รอระบุผู้รับผิดชอบ"}
                  </span>
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
              className="absolute -bottom-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          )}
        </button>
      </div>
    );
  }

  // ============ Level 2+ — editorial white card ============
  const widthCls = isLevel2
    ? "w-[190px]"
    : "w-[170px]";

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={() => onClick?.(node)}
        className={cn(
          "group relative rounded-xl bg-card p-4 md:p-5 text-left transition-all duration-300",
          "border border-border shadow-sm",
          "hover:-translate-y-0.5 hover:shadow-lg hover:border-secondary/40",
          "focus:outline-none focus:ring-2 focus:ring-secondary/40",
          widthCls,
          isLevel2 && "border-t-2 border-t-primary",
          isAdvisory && "border-l-[3px] border-l-primary/40 border-dashed",
          highlight && "ring-2 ring-primary/60 shadow-lg",
        )}
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {node.position_en || levelTag[node.organization_level] || "Position"}
        </div>
        <div
          className={cn(
            "mt-1 font-bold leading-tight text-foreground",
            isLevel2 ? "text-base md:text-lg" : "text-sm md:text-base",
          )}
        >
          {node.position_th}
        </div>
        <div className="mt-1 truncate text-sm text-muted-foreground">
          {node.employee_name || (
            <span className="italic">
              {node.status === "vacant" ? "ตำแหน่งว่าง" : "รอระบุ"}
            </span>
          )}
        </div>

        {(node.status === "vacant" ||
          node.status === "pending" ||
          isAdvisory) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1">
            {node.status === "vacant" && (
              <Badge
                variant="destructive"
                className="h-5 px-1.5 text-[10px]"
              >
                Vacant
              </Badge>
            )}
            {node.status === "pending" && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                รอระบุ
              </Badge>
            )}
            {node.relationship_type === "advisory" && (
              <Badge
                variant="outline"
                className="h-5 border-muted-foreground/40 px-1.5 text-[10px] text-muted-foreground"
              >
                ที่ปรึกษา
              </Badge>
            )}
            {node.relationship_type === "executive-support" && (
              <Badge
                variant="outline"
                className="h-5 border-muted-foreground/40 px-1.5 text-[10px] text-muted-foreground"
              >
                สนับสนุนผู้บริหาร
              </Badge>
            )}
          </div>
        )}


        {hasChildren && (
          <span
            role="button"
            aria-label={expanded ? "ย่อ" : "ขยาย"}
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(node.id);
            }}
            className="absolute -bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background text-secondary shadow-md transition-transform hover:scale-110 hover:border-secondary"
          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </span>
        )}
      </button>
    </div>
  );
}
