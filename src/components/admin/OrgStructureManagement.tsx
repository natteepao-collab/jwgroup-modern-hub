import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAllOrgNodes, type OrgNode } from "@/hooks/useOrgTree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertTriangle, Edit, Plus, Trash2 } from "lucide-react";

interface Draft {
  id?: string;
  parent_id: string | null;
  position_th: string;
  position_en: string;
  employee_name: string;
  department: string;
  division: string;
  organization_level: number;
  relationship_type: OrgNode["relationship_type"];
  status: OrgNode["status"];
  display_order: number;
  effective_date: string;
  is_active: boolean;
  notes: string;
}

const empty: Draft = {
  parent_id: null,
  position_th: "",
  position_en: "",
  employee_name: "",
  department: "",
  division: "",
  organization_level: 3,
  relationship_type: "direct",
  status: "active",
  display_order: 0,
  effective_date: "2026-07-01",
  is_active: true,
  notes: "",
};

export default function OrgStructureManagement() {
  const { data: nodes, isLoading } = useAllOrgNodes();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(empty);

  const validationIssues = useMemo(() => {
    if (!nodes) return [];
    const issues: string[] = [];
    const ceos = nodes.filter((n) => n.organization_level === 1 && n.is_active);
    if (ceos.length > 1) issues.push("มี CEO มากกว่าหนึ่งตำแหน่ง");
    nodes.forEach((n) => {
      if (n.is_active && n.status === "active" && !n.employee_name)
        issues.push(`ตำแหน่ง "${n.position_th}" เป็น Active แต่ไม่มีชื่อผู้ดำรงตำแหน่ง`);
      if (n.is_active && !n.parent_id && n.organization_level !== 1)
        issues.push(`ตำแหน่ง "${n.position_th}" ไม่มีผู้บังคับบัญชา`);
    });
    return issues;
  }, [nodes]);

  const openNew = () => {
    setDraft(empty);
    setOpen(true);
  };
  const openEdit = (n: OrgNode) => {
    setDraft({
      id: n.id,
      parent_id: n.parent_id,
      position_th: n.position_th,
      position_en: n.position_en ?? "",
      employee_name: n.employee_name ?? "",
      department: n.department ?? "",
      division: n.division ?? "",
      organization_level: n.organization_level,
      relationship_type: n.relationship_type,
      status: n.status,
      display_order: n.display_order,
      effective_date: n.effective_date,
      is_active: n.is_active,
      notes: n.notes ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!draft.position_th.trim()) {
      toast.error("กรุณาระบุชื่อตำแหน่ง");
      return;
    }
    if (draft.id && draft.parent_id === draft.id) {
      toast.error("ห้ามกำหนดตำแหน่งเป็นผู้บังคับบัญชาของตัวเอง");
      return;
    }
    const payload = {
      parent_id: draft.parent_id,
      position_th: draft.position_th,
      position_en: draft.position_en || null,
      employee_name: draft.employee_name || null,
      department: draft.department || null,
      division: draft.division || null,
      organization_level: draft.organization_level,
      relationship_type: draft.relationship_type,
      status: draft.status,
      display_order: draft.display_order,
      effective_date: draft.effective_date,
      is_active: draft.is_active,
      notes: draft.notes || null,
    };
    const { error } = draft.id
      ? await supabase.from("organization_nodes").update(payload).eq("id", draft.id)
      : await supabase.from("organization_nodes").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("บันทึกสำเร็จ");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["organization_nodes"] });
    qc.invalidateQueries({ queryKey: ["organization_nodes_all"] });
  };

  const remove = async (id: string) => {
    if (!confirm("ยืนยันการลบตำแหน่งนี้?")) return;
    const { error } = await supabase.from("organization_nodes").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("ลบแล้ว");
    qc.invalidateQueries({ queryKey: ["organization_nodes"] });
    qc.invalidateQueries({ queryKey: ["organization_nodes_all"] });
  };

  const toggleActive = async (n: OrgNode) => {
    const { error } = await supabase
      .from("organization_nodes")
      .update({ is_active: !n.is_active })
      .eq("id", n.id);
    if (error) toast.error(error.message);
    else {
      qc.invalidateQueries({ queryKey: ["organization_nodes"] });
      qc.invalidateQueries({ queryKey: ["organization_nodes_all"] });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>จัดการโครงสร้างองค์กร</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            เพิ่ม แก้ไข หรือลบตำแหน่งในผังองค์กร JW Real Estate
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> เพิ่มตำแหน่ง
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationIssues.length > 0 && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm">
            <div className="mb-1 flex items-center gap-2 font-medium text-yellow-800">
              <AlertTriangle className="h-4 w-4" /> คำเตือน ({validationIssues.length})
            </div>
            <ul className="ml-6 list-disc space-y-0.5 text-yellow-900/90">
              {validationIssues.slice(0, 6).map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        )}

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">กำลังโหลด...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-2 text-left">ระดับ</th>
                  <th className="p-2 text-left">ตำแหน่ง</th>
                  <th className="p-2 text-left">ชื่อ</th>
                  <th className="p-2 text-left">ฝ่าย</th>
                  <th className="p-2 text-left">สายงาน</th>
                  <th className="p-2 text-left">สถานะ</th>
                  <th className="p-2 text-left">Active</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {(nodes ?? []).map((n) => (
                  <tr key={n.id} className="border-t hover:bg-muted/30">
                    <td className="p-2">{n.organization_level}</td>
                    <td className="p-2 font-medium">
                      {n.position_th}
                      <div className="text-xs text-muted-foreground">{n.position_en}</div>
                    </td>
                    <td className="p-2">
                      {n.employee_name || <em className="text-muted-foreground">—</em>}
                    </td>
                    <td className="p-2 text-muted-foreground">{n.department || "—"}</td>
                    <td className="p-2">
                      {n.relationship_type === "advisory" ? (
                        <Badge variant="outline">ที่ปรึกษา</Badge>
                      ) : n.relationship_type === "executive-support" ? (
                        <Badge variant="outline">สนับสนุน</Badge>
                      ) : (
                        <Badge variant="secondary">ตรง</Badge>
                      )}
                    </td>
                    <td className="p-2">
                      {n.status === "active" && <Badge className="bg-emerald-500/15 text-emerald-700">Active</Badge>}
                      {n.status === "vacant" && <Badge variant="destructive">Vacant</Badge>}
                      {n.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                    </td>
                    <td className="p-2">
                      <Switch checked={n.is_active} onCheckedChange={() => toggleActive(n)} />
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(n)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(n.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.id ? "แก้ไขตำแหน่ง" : "เพิ่มตำแหน่งใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ตำแหน่ง (ไทย) *">
              <Input value={draft.position_th} onChange={(e) => setDraft({ ...draft, position_th: e.target.value })} />
            </Field>
            <Field label="Position (English)">
              <Input value={draft.position_en} onChange={(e) => setDraft({ ...draft, position_en: e.target.value })} />
            </Field>
            <Field label="ชื่อผู้ดำรงตำแหน่ง">
              <Input value={draft.employee_name} onChange={(e) => setDraft({ ...draft, employee_name: e.target.value })} />
            </Field>
            <Field label="ฝ่าย">
              <Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
            </Field>
            <Field label="แผนก">
              <Input value={draft.division} onChange={(e) => setDraft({ ...draft, division: e.target.value })} />
            </Field>
            <Field label="ผู้บังคับบัญชา">
              <Select
                value={draft.parent_id ?? "none"}
                onValueChange={(v) => setDraft({ ...draft, parent_id: v === "none" ? null : v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="none">— ไม่มี (Root / CEO) —</SelectItem>
                  {(nodes ?? [])
                    .filter((n) => n.id !== draft.id)
                    .map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        [ระดับ {n.organization_level}] {n.position_th}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="ระดับ (1-5)">
              <Input
                type="number"
                min={1}
                max={5}
                value={draft.organization_level}
                onChange={(e) => setDraft({ ...draft, organization_level: Number(e.target.value) })}
              />
            </Field>
            <Field label="ประเภทสายงาน">
              <Select
                value={draft.relationship_type}
                onValueChange={(v: OrgNode["relationship_type"]) => setDraft({ ...draft, relationship_type: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">สายบังคับบัญชาโดยตรง</SelectItem>
                  <SelectItem value="advisory">ที่ปรึกษา (เส้นประ)</SelectItem>
                  <SelectItem value="executive-support">สนับสนุนผู้บริหาร</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="สถานะ">
              <Select
                value={draft.status}
                onValueChange={(v: OrgNode["status"]) => setDraft({ ...draft, status: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="vacant">Vacant (ตำแหน่งว่าง)</SelectItem>
                  <SelectItem value="pending">Pending (รอระบุ)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="ลำดับการแสดงผล">
              <Input
                type="number"
                value={draft.display_order}
                onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })}
              />
            </Field>
            <Field label="วันที่มีผล">
              <Input
                type="date"
                value={draft.effective_date}
                onChange={(e) => setDraft({ ...draft, effective_date: e.target.value })}
              />
            </Field>
            <Field label="เปิดใช้งาน">
              <div className="flex h-10 items-center">
                <Switch checked={draft.is_active} onCheckedChange={(v) => setDraft({ ...draft, is_active: v })} />
              </div>
            </Field>
            <div className="sm:col-span-2">
              <Field label="หมายเหตุ">
                <Textarea rows={3} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={save}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
