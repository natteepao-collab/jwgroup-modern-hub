import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OrgRelationship = "direct" | "advisory" | "executive-support";
export type OrgStatus = "active" | "vacant" | "pending";

export interface OrgNode {
  id: string;
  parent_id: string | null;
  position_th: string;
  position_en: string | null;
  employee_name: string | null;
  department: string | null;
  division: string | null;
  organization_level: number;
  relationship_type: OrgRelationship;
  status: OrgStatus;
  display_order: number;
  effective_date: string;
  is_active: boolean;
  notes: string | null;
}

export interface OrgTreeNode extends OrgNode {
  children: OrgTreeNode[];
}

export function buildTree(nodes: OrgNode[]): OrgTreeNode[] {
  const byId = new Map<string, OrgTreeNode>();
  nodes.forEach((n) => byId.set(n.id, { ...n, children: [] }));
  const roots: OrgTreeNode[] = [];
  byId.forEach((n) => {
    if (n.parent_id && byId.has(n.parent_id)) {
      byId.get(n.parent_id)!.children.push(n);
    } else {
      roots.push(n);
    }
  });
  const sortRec = (arr: OrgTreeNode[]) => {
    arr.sort((a, b) => a.display_order - b.display_order);
    arr.forEach((c) => sortRec(c.children));
  };
  sortRec(roots);
  return roots;
}

export function useOrgTree() {
  return useQuery({
    queryKey: ["organization_nodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_nodes")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return buildTree((data ?? []) as OrgNode[]);
    },
  });
}

export function useAllOrgNodes() {
  return useQuery({
    queryKey: ["organization_nodes_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_nodes")
        .select("*")
        .order("organization_level", { ascending: true })
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as OrgNode[];
    },
  });
}
