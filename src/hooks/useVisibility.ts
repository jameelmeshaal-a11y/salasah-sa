import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type VisibilityRow = { item_type: string; item_id: string; hidden: boolean };

export function useVisibility(itemType: "platform" | "sector" | "nav") {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("visibility_settings")
      .select("item_id,hidden")
      .eq("item_type", itemType)
      .then(({ data }) => {
        if (!alive) return;
        const s = new Set<string>();
        (data ?? []).forEach((r: any) => { if (r.hidden) s.add(r.item_id); });
        setHiddenIds(s);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [itemType]);

  return { hiddenIds, loading };
}

export function filterVisible<T extends { id?: string; name?: string }>(
  items: T[],
  hiddenIds: Set<string>,
  keyFn: (item: T) => string,
) {
  return items.filter((i) => !hiddenIds.has(keyFn(i)));
}
