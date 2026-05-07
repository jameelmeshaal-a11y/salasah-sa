import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkRole(uid: string) {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) setIsAdmin(!!data);
    }

    async function init() {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) await checkRole(s.user.id);
      if (mounted) setLoading(false);
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => { checkRole(s.user.id); }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return { session, user, isAdmin, loading };
}
