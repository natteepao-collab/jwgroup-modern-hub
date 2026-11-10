import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { OrgTreeNode } from "@/hooks/useOrgTree";

interface Props {
  node: OrgTreeNode;
  onClick?: (n: OrgTreeNode) => void;
  onToggle?: (id: string) => void;
  expanded?: boolean;
  hasChildren?: boolean;
  highlight?: boolean;
  onPath?: boolean;
  isSelected?: boolean;
}

export function OrgNodeCard({ node, onClick, onToggle, expanded, hasChildren, highlight, onPath, isSelected }: Props) {
  const isCEO = node.organization_level === 1;
  const isAdvisory = node.relationship_type !== "direct";
  return (
    <div className={cn("org-node-shell relative inline-block", isCEO ? "org-node-ceo" : "org-node-standard")}>
      <Button
        variant="ghost"
        onClick={() => onClick?.(node)}
        aria-label={`${node.position_th}${node.employee_name ? ` · ${node.employee_name}` : ""}`}
        className={cn(
          "org-node-main group relative block h-auto w-full whitespace-normal rounded-lg border p-4 text-left transition-all duration-300",
          isCEO ? "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary hover:text-secondary-foreground" : "bg-card text-card-foreground border-border hover:bg-card hover:border-primary/60 hover:text-card-foreground",
          isAdvisory && "border-dashed",
          (highlight || isSelected) && "ring-2 ring-primary border-primary",
          onPath && "border-primary",
        )}
      >
        <span className={cn("mb-2 block text-xs font-medium", isCEO ? "text-secondary-foreground/80" : "text-muted-foreground")}>
          ระดับ {node.organization_level}
        </span>
        <span className="block text-base font-bold leading-relaxed">{node.position_th}</span>
        <span className={cn("mt-1 block text-xs leading-relaxed", isCEO ? "text-secondary-foreground/80" : "text-muted-foreground")}>
          {node.position_en}
        </span>
        <span className={cn("mt-3 block text-sm leading-relaxed", isCEO ? "text-secondary-foreground" : "text-card-foreground")}>
          {node.employee_name || (node.status === "vacant" ? "ตำแหน่งว่าง" : "รอระบุ")}
        </span>
        {(node.status !== "active" || isAdvisory) && (
          <span className="mt-3 flex flex-wrap gap-1">
            {node.status === "vacant" && <Badge variant="destructive">ตำแหน่งว่าง</Badge>}
            {node.status === "pending" && <Badge variant="secondary">รอระบุ</Badge>}
            {isAdvisory && <Badge variant="outline" className="text-muted-foreground">{node.relationship_type === "advisory" ? "ที่ปรึกษา" : "สนับสนุนผู้บริหาร"}</Badge>}
          </span>
        )}
      </Button>
      {hasChildren && (
        <Button
          variant="outline"
          size="icon"
          aria-label={`${expanded ? "ย่อ" : "ขยาย"}สาขา ${node.position_th}`}
          aria-expanded={Boolean(expanded)}
          title={`${expanded ? "ย่อ" : "ขยาย"}สาขา ${node.position_th}`}
          onClick={() => onToggle?.(node.id)}
          className="org-node-toggle absolute -bottom-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-card text-primary"
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      )}
    </div>
  );
}