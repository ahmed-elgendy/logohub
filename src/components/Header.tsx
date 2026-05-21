"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layers, Settings, Home, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname === "/admin";
  const isContact = pathname === "/contact";
  const isLogin = pathname === "/login";

  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setAuthed(!!user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Logo<span className="text-primary">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {!isContact && !isAdmin && !isLogin && (
            <Button variant="outline" size="sm" asChild className="gap-2 rounded-full px-5 font-semibold">
              <Link href="/contact">
                <PlusCircle className="w-4 h-4" />
                أضف علامتك
              </Link>
            </Button>
          )}

          {authed && (
            <>
              <Button
                variant={isAdmin ? "default" : "outline"}
                size="sm"
                asChild
                className="gap-2 rounded-full px-5 font-semibold"
              >
                <Link href={isAdmin ? "/" : "/admin"}>
                  {isAdmin ? <Home className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                  {isAdmin ? "عرض الموقع" : "لوحة التحكم"}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 rounded-full px-4 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
