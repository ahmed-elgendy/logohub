import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layers, Settings, Home, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logout } from "@/lib/auth";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === "/admin";
  const isContact = location.pathname === "/contact";
  const isLogin = location.pathname === "/login";

  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    const update = () => setAuthed(isAuthenticated());
    update();
    window.addEventListener("auth-change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("auth-change", update);
      window.removeEventListener("storage", update);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Logo<span className="text-primary">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {!isContact && !isAdmin && !isLogin && (
            <Button variant="outline" size="sm" asChild className="gap-2 rounded-full px-5 font-semibold">
              <Link to="/contact">
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
                <Link to={isAdmin ? "/" : "/admin"}>
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
