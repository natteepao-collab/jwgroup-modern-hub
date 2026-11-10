import { useMemo, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useOrgTree, type OrgNode, type OrgTreeNode } from "@/hooks/useOrgTree";
import { OrgNodeCard } from "./OrgNodeCard";
import { OrgDetailPanel } from "./OrgDetailPanel";
import OrganizationChart from "@/components/OrganizationChart";
import { useBusinessTypes } from "@/hooks/useBusinessTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  ChevronRight,
  FileImage,
  FileText,
  Maximize,
  Minus,
  Plus,
  Printer,
  RotateCcw,
  Search,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import "./orgTree.css";

interface Filter {
  level: string;
  department: string;
}

function collectIds(node: OrgTreeNode, acc: Set<string>) {
  acc.add(node.id);
  node.children.forEach((c) => collectIds(c, acc));
}

function findPath(nodes: OrgTreeNode[], id: string, path: OrgNode[] = []): OrgNode[] | null {
  for (const n of nodes) {
    const next = [...path, n];
    if (n.id === id) return next;
    const c = findPath(n.children, id, next);
    if (c) return c;
  }
  return null;
}

function filterTree(
  nodes: OrgTreeNode[],
  search: string,
  filter: Filter,
): OrgTreeNode[] {
  const q = search.trim().toLowerCase();
  const match = (n: OrgTreeNode): boolean => {
    if (filter.level !== "all" && String(n.organization_level) !== filter.level) return false;
    if (filter.department !== "all" && n.department !== filter.department) return false;
    if (!q) return true;
    return (
      n.position_th.toLowerCase().includes(q) ||
      (n.position_en ?? "").toLowerCase().includes(q) ||
      (n.employee_name ?? "").toLowerCase().includes(q) ||
      (n.department ?? "").toLowerCase().includes(q) ||
      (n.division ?? "").toLowerCase().includes(q)
    );
  };
  // return nodes where node OR any descendant matches (keeps tree structure)
  return nodes
    .map((n) => {
      const children = filterTree(n.children, search, filter);
      const self = match(n);
      if (self || children.length > 0) return { ...n, children };
      return null;
    })
    .filter(Boolean) as OrgTreeNode[];
}

// ---------- Desktop / SVG-ish CSS tree ----------
function TreeNode({
  node,
  expandedIds,
  onToggle,
  onSelect,
  matchIds,
  pathIds,
  selectedId,
}: {
  node: OrgTreeNode;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (n: OrgTreeNode) => void;
  matchIds: Set<string>;
  pathIds: Set<string>;
  selectedId?: string | null;
}) {
  const expanded = expandedIds.has(node.id);
  const hasChildren = node.children.length > 0;
  const onPath = pathIds.has(node.id);
  return (
    <li
      data-relationship={node.relationship_type}
      data-on-path={onPath ? "true" : undefined}
      onMouseEnter={(e) => {
        e.stopPropagation();
        if (hasChildren && !expanded) onToggle(node.id);
      }}
    >
      <OrgNodeCard
        node={node}
        onClick={onSelect}
        onToggle={onToggle}
        expanded={expanded}
        hasChildren={hasChildren}
        highlight={matchIds.has(node.id)}
        onPath={onPath}
        isSelected={selectedId === node.id}
      />
      {hasChildren && expanded && (
        <ul>
          {node.children.map((c) => (
            <TreeNode
              key={c.id}
              node={c}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
              matchIds={matchIds}
              pathIds={pathIds}
              selectedId={selectedId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}


// ---------- Mobile accordion tree ----------
function MobileTreeItem({
  node,
  onSelect,
  depth = 0,
}: {
  node: OrgTreeNode;
  onSelect: (n: OrgTreeNode) => void;
  depth?: number;
}) {
  if (node.children.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border bg-card p-3 shadow-sm active:scale-[0.99] transition",
          depth > 0 && "ml-3",
        )}
        onClick={() => onSelect(node)}
      >
        <MobileLine node={node} />
      </div>
    );
  }
  return (
    <AccordionItem value={node.id} className={cn("border-none", depth > 0 && "ml-3")}>
      <div className="rounded-lg border bg-card overflow-hidden">
        <AccordionTrigger className="px-3 py-3 hover:no-underline">
          <div className="flex-1 text-left" onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
            <MobileLine node={node} />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-2 pb-2">
          <Accordion type="multiple" className="space-y-2">
            {node.children.map((c) => (
              <MobileTreeItem key={c.id} node={c} onSelect={onSelect} depth={depth + 1} />
            ))}
          </Accordion>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
}

function MobileLine({ node }: { node: OrgTreeNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">
        {node.position_en}
      </div>
      <div className="text-sm font-bold">{node.position_th}</div>
      <div className="text-sm text-muted-foreground">
        {node.employee_name || (
          <em>{node.status === "vacant" ? "ตำแหน่งว่าง" : "รอระบุ"}</em>
        )}
      </div>
    </div>
  );
}

// ---------- Main component ----------
export default function OrgChartPage() {
  const { data: roots, isLoading } = useOrgTree();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>({ level: "all", department: "all" });
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<OrgNode | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [businessKey, setBusinessKey] = useState<string>("realestate");
  const captureRef = useRef<HTMLDivElement>(null);
  const { data: businessTypes = [] } = useBusinessTypes();
  const isRealEstate = businessKey === "realestate" || businessKey === "real_estate";

  const filteredRoots = useMemo(
    () => (roots ? filterTree(roots, search, filter) : []),
    [roots, search, filter],
  );

  const allIds = useMemo(() => {
    const s = new Set<string>();
    (roots ?? []).forEach((r) => collectIds(r, s));
    return s;
  }, [roots]);

  // Start with only the CEO expanded — sub-branches expand on hover
  useMemo(() => {
    if (roots && expandedIds.size === 0) {
      const rootIds = new Set(roots.map((r) => r.id));
      setExpandedIds(rootIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roots]);



  const matchIds = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q && filter.level === "all" && filter.department === "all") return new Set<string>();
    const s = new Set<string>();
    const walk = (n: OrgTreeNode) => {
      const hit =
        (!q ||
          n.position_th.toLowerCase().includes(q) ||
          (n.position_en ?? "").toLowerCase().includes(q) ||
          (n.employee_name ?? "").toLowerCase().includes(q) ||
          (n.department ?? "").toLowerCase().includes(q) ||
          (n.division ?? "").toLowerCase().includes(q)) &&
        (filter.level === "all" || String(n.organization_level) === filter.level) &&
        (filter.department === "all" || n.department === filter.department);
      if (hit) s.add(n.id);
      n.children.forEach(walk);
    };
    (roots ?? []).forEach(walk);
    return s;
  }, [roots, search, filter]);

  const departments = useMemo(() => {
    const s = new Set<string>();
    const walk = (n: OrgTreeNode) => {
      if (n.department) s.add(n.department);
      n.children.forEach(walk);
    };
    (roots ?? []).forEach(walk);
    return Array.from(s).sort();
  }, [roots]);

  const toggle = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const expandAll = () => setExpandedIds(new Set(allIds));
  const collapseAll = () => setExpandedIds(new Set());
  const expandToLevel = (maxLevel: number) => {
    const s = new Set<string>();
    const walk = (n: OrgTreeNode) => {
      if (n.organization_level < maxLevel) s.add(n.id);
      n.children.forEach(walk);
    };
    (roots ?? []).forEach(walk);
    setExpandedIds(s);
  };
  const [zoomPct, setZoomPct] = useState(85);

  const handleSelect = (n: OrgNode) => {
    setSelected(n);
    setPanelOpen(true);
    // auto-expand all ancestors so the branch stays visible
    if (roots) {
      const path = findPath(roots, n.id) ?? [];
      setExpandedIds((prev) => {
        const next = new Set(prev);
        path.slice(0, -1).forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const selectedPath = useMemo(() => {
    if (!selected || !roots) return [];
    return findPath(roots, selected.id) ?? [];
  }, [selected, roots]);

  const pathIds = useMemo(
    () => new Set(selectedPath.map((n) => n.id)),
    [selectedPath],
  );

  // ---- export ----
  const exportPNG = async () => {
    if (!captureRef.current) return;
    const dataUrl = await toPng(captureRef.current, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "jw-organization-chart.png";
    a.click();
  };

  const exportPDF = async () => {
    if (!captureRef.current) return;
    const dataUrl = await toPng(captureRef.current, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });
    const img = new Image();
    img.src = dataUrl;
    await new Promise((r) => (img.onload = r));
    const pdf = new jsPDF({
      orientation: img.width > img.height ? "l" : "p",
      unit: "px",
      format: [img.width, img.height],
    });
    pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
    pdf.save("jw-organization-chart.pdf");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">
        กำลังโหลดโครงสร้างองค์กร...
      </div>
    );
  }

  return (
    <div className="org-page space-y-6">
      <header className="org-page-header bg-secondary text-secondary-foreground px-6 py-7 md:px-8 md:py-9">
        <h1 className="text-2xl md:text-3xl font-bold leading-relaxed">ผังโครงสร้างองค์กรและผู้บริหาร</h1>
        <p className="mt-2 text-sm text-secondary-foreground/80">Organization Chart &amp; Management</p>
        <p className="mt-5 text-xs text-secondary-foreground/80">วันที่มีผลบังคับใช้: <span className="font-semibold text-secondary-foreground">1 กรกฎาคม 2569</span></p>
      </header>

      {/* Business Unit Selector */}
      <div className="org-section border-b border-border pb-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-[1px] w-6 bg-primary" />
          <span className="text-sm font-bold text-foreground">
            หน่วยธุรกิจ
          </span>
          <span className="text-[11px] text-muted-foreground">/ Business Unit</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {businessTypes.map((b) => {
            const active = b.business_key === businessKey;
            return (
              <Button
                variant="ghost"
                key={b.business_key}
                type="button"
                onClick={() => setBusinessKey(b.business_key)}
                className={cn(
                  "h-auto min-h-11 whitespace-normal rounded-md border px-4 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5",
                )}
                aria-pressed={active}
              >
                {b.name_th}
                {(b.business_key === "realestate" || b.business_key === "real_estate") && (
                  <span className={cn("ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold", active ? "bg-primary-foreground/20" : "bg-primary/10 text-primary")}>
                    แผนผังละเอียด
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {isRealEstate && (
      <>
      {/* Level Legend */}
      <div className="org-section border-b border-border pb-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-[1px] w-6 bg-primary" />
          <span className="text-sm font-bold text-foreground">
            คำอธิบายระดับ
          </span>
          <span className="text-[11px] text-muted-foreground">/ Level Guide</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { lv: 1, th: "บริหารสูงสุด", en: "Chief Executive", desc: "ประธานกรรมการบริหาร" },
            { lv: 2, th: "ผู้บริหาร", en: "Management", desc: "รองประธาน, กรรมการผู้จัดการ, ที่ปรึกษาอาวุโส, เลขานุการประธาน" },
            { lv: 3, th: "ฝ่าย", en: "Department", desc: "ผู้จัดการฝ่าย (ขาย, บัญชี, กฎหมาย, HR ฯลฯ)" },
            { lv: 4, th: "แผนก", en: "Division", desc: "หัวหน้าแผนก / ผู้ช่วยผู้จัดการ" },
          ].map((l) => (
            <div
              key={l.lv}
              className="px-1 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {l.lv}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground leading-tight">
                    ระดับ {l.lv} · {l.th}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {l.en}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {l.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="org-section border-b border-border pb-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_160px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อบุคคล ตำแหน่ง ฝ่าย หรือแผนก"
              aria-label="ค้นหาโครงสร้างองค์กร"
              className="pl-9"
            />
          </div>
          <Select value={filter.level} onValueChange={(v) => setFilter((f) => ({ ...f, level: v }))}>
            <SelectTrigger className="w-full"><SelectValue placeholder="ระดับ" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกระดับ</SelectItem>
              <SelectItem value="1">ระดับ 1 (บริหารสูงสุด)</SelectItem>
              <SelectItem value="2">ระดับ 2 (ผู้บริหาร)</SelectItem>
              <SelectItem value="3">ระดับ 3 (ฝ่าย)</SelectItem>
              <SelectItem value="4">ระดับ 4 (แผนก)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filter.department} onValueChange={(v) => setFilter((f) => ({ ...f, department: v }))}>
            <SelectTrigger className="w-full"><SelectValue placeholder="ฝ่าย" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกฝ่าย</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-3">
            <Button variant="outline" size="sm" onClick={() => expandToLevel(2)} className="gap-1" title="แสดงเฉพาะระดับ 1">
              ระดับ 1
            </Button>
            <Button variant="outline" size="sm" onClick={() => expandToLevel(3)} className="gap-1" title="ขยายถึงระดับ 2">
              ระดับ 2
            </Button>
            <Button variant="outline" size="sm" onClick={() => expandToLevel(4)} className="gap-1" title="ขยายถึงระดับ 3">
              ระดับ 3
            </Button>
            <Button variant="outline" size="sm" onClick={expandAll} className="gap-1">
              <ChevronsUpDown className="h-4 w-4" /> ขยายทั้งหมด
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll} className="gap-1">
              <ChevronsDownUp className="h-4 w-4" /> ย่อทั้งหมด
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-6 bg-border" /> สายบังคับบัญชา
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-6"
                style={{ borderTop: "2px dashed hsl(var(--accent))" }}
              />
              ที่ปรึกษา / สนับสนุน
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1">
              <Printer className="h-4 w-4" /> พิมพ์
            </Button>
            <Button variant="outline" size="sm" onClick={exportPNG} className="gap-1">
              <FileImage className="h-4 w-4" /> PNG
            </Button>
            <Button variant="outline" size="sm" onClick={exportPDF} className="gap-1">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb: CEO -> selected node */}
      {selectedPath.length > 0 && (
        <nav aria-label="เส้นทางตำแหน่งที่เลือก" className="flex flex-wrap items-center gap-2 border-y border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            เส้นทาง
          </span>
          <div className="flex flex-wrap items-center gap-1 text-sm">
            {selectedPath.map((p, i) => {
              const isLast = i === selectedPath.length - 1;
              return (
                <span key={p.id} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 text-primary/60" />
                  )}
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => handleSelect(p)}
                    className={cn(
                      "h-auto whitespace-normal rounded-md px-2 py-1 transition-colors",
                      isLast
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-primary/10",
                    )}
                  >
                    {p.position_th}
                    {p.employee_name && (
                      <span className={cn("ml-1 text-[11px]", isLast ? "opacity-80" : "text-muted-foreground")}>
                        · {p.employee_name}
                      </span>
                    )}
                  </Button>
                </span>
              );
            })}
          </div>
          <Button
            variant="ghost"
            type="button"
            onClick={() => { setSelected(null); setPanelOpen(false); }}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
          >
            ล้างเส้นทาง
          </Button>
        </nav>
      )}

      {/* Chart */}
      {filteredRoots.length === 0 ? (
        <p role="status" className="py-16 text-center text-muted-foreground">ไม่พบตำแหน่งที่ตรงกับการค้นหา</p>
      ) : isMobile ? (
        <div className="space-y-2">
          <Accordion type="multiple" defaultValue={Array.from(allIds)} className="space-y-2">
            {filteredRoots.map((r) => (
              <MobileTreeItem key={r.id} node={r} onSelect={handleSelect} />
            ))}
          </Accordion>
        </div>
      ) : (
        <TransformWrapper
          minScale={0.3}
          maxScale={2}
          initialScale={0.85}
          centerOnInit
          limitToBounds={false}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
          onTransform={(ref: any) => setZoomPct(Math.round((ref?.state?.scale ?? 1) * 100))}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <div className="relative">
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-lg border bg-card px-2 py-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => zoomOut()} title="ย่อผัง" aria-label="ย่อผัง"><Minus className="h-4 w-4" /></Button>
                <span className="min-w-[42px] text-center text-xs font-semibold tabular-nums text-foreground">
                  {zoomPct}%
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => zoomIn()} title="ขยายผัง" aria-label="ขยายผัง"><Plus className="h-4 w-4" /></Button>
                <span className="mx-1 h-4 w-px bg-border" />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => centerView(0.85)} title="จัดผังกึ่งกลาง" aria-label="จัดผังกึ่งกลาง"><Maximize className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => resetTransform()} title="คืนค่า 85%" aria-label="คืนค่า 85%"><RotateCcw className="h-4 w-4" /></Button>
              </div>
              <div className="min-h-[600px] cursor-grab overflow-hidden rounded-lg border bg-background active:cursor-grabbing org-canvas">
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "750px" }}
                  contentStyle={{ minWidth: "100%" }}
                >
                  <div ref={captureRef} className="w-max min-w-full px-6 pt-20 pb-10">
                    <ul className="org-tree org-tree--compact org-tree--branch-columns">
                      {filteredRoots.map((r) => (
                        <TreeNode
                          key={r.id}
                          node={r}
                          expandedIds={expandedIds}
                          onToggle={toggle}
                          onSelect={handleSelect}
                          matchIds={matchIds}
                          pathIds={pathIds}
                          selectedId={selected?.id}
                        />
                      ))}
                    </ul>
                  </div>
                </TransformComponent>
              </div>
            </div>
          )}
        </TransformWrapper>
      )}
      </>
      )}

      {/* Non-Real Estate business units: department layout */}
      {!isRealEstate && (
        <section className="org-business-chart">
          <OrganizationChart
            businessKey={businessKey}
            hideSelector
            hideHeader
          />
        </section>
      )}

      <OrgDetailPanel
        node={selected}
        path={selectedPath}
        open={panelOpen}
        onOpenChange={setPanelOpen}
      />
    </div>
  );
}
