import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CustomItem = {
  id: string;
  item_type: "platform" | "sector";
  slug: string;
  name: string;
  name_ar: string | null;
  description: string;
  icon: string;
  url: string | null;
  tags: string[];
};

export function useCustomItems(itemType: "platform" | "sector") {
  const [items, setItems] = useState<CustomItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("custom_items")
      .select("*")
      .eq("item_type", itemType)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!alive) return;
        setItems((data ?? []) as CustomItem[]);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [itemType]);

  return { items, loading };
}
