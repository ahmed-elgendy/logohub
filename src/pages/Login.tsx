import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";
import { login, isAuthenticated } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) navigate("/admin", { replace: true });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(username.trim(), password)) {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/admin", { replace: true });
      } else {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <section className="relative py-20 px-4 overflow-hidden min-h-[calc(100vh-4rem)] flex items-center">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border/60 rounded-3xl p-8 shadow-xl backdrop-blur-xl"
          >
            <div className="text-center mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                تسجيل دخول المسؤول
              </h1>
              <p className="text-muted-foreground text-sm">
                أدخل بياناتك للوصول إلى لوحة التحكم
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="pr-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10 h-11"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 rounded-full font-semibold">
                {loading ? "جاري التحقق..." : "تسجيل الدخول"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Login;
