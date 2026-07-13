import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, ChevronRight, User } from "lucide-react";
import type { OrgNode } from "@/hooks/useOrgTree";

interface Props {
  node: OrgNode | null;
  path: OrgNode[]; // breadcrumb path from root -> node
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function OrgDetailPanel({ node, path, open, onOpenChange }: Props) {
  if (!node) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {path.map((p, i) => (
              <span key={p.id} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span className={i === path.length - 1 ? "font-medium text-foreground" : ""}>
                  {p.position_th}
                </span>
              </span>
            ))}
          </div>
          <SheetTitle className="text-2xl">{node.position_th}</SheetTitle>
          <SheetDescription>{node.position_en}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  ผู้ดำรงตำแหน่ง
                </div>
                <div className="text-lg font-semibold">
                  {node.employee_name || (
                    <span className="italic text-muted-foreground">— ยังไม่ระบุ —</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="ฝ่าย" value={node.department} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="แผนก" value={node.division} />
            <InfoRow label="ระดับในองค์กร" value={`ระดับ ${node.organization_level}`} />
            <InfoRow label="ประเภทสายงาน" value={relLabel(node.relationship_type)} />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="วันที่มีผล"
              value={new Date(node.effective_date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <div className="rounded-lg border bg-card p-3">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                สถานะ
              </div>
              <StatusBadge status={node.status} />
            </div>
          </div>

          {node.notes && (
            <>
              <Separator />
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                  หมายเหตุ
                </div>
                <p className="text-sm leading-relaxed">{node.notes}</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 text-sm font-medium">
        {value || <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrgNode["status"] }) {
  if (status === "active")
    return <Badge className="mt-1 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20">Active</Badge>;
  if (status === "vacant") return <Badge variant="destructive" className="mt-1">Vacant</Badge>;
  return <Badge variant="secondary" className="mt-1">Pending</Badge>;
}

function relLabel(r: OrgNode["relationship_type"]) {
  if (r === "advisory") return "ที่ปรึกษา (เส้นประ)";
  if (r === "executive-support") return "สนับสนุนผู้บริหาร";
  return "สายบังคับบัญชาโดยตรง";
}
