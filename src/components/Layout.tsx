import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Leaf, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { Button } from "./ui/button";
import { Toaster } from "@/components/ui/sonner";
const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold text-green-600">
              <Leaf className="w-7 h-7" />
              <span className="font-display">ALST</span>
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-green-600",
                    isActive ? "text-green-600" : "text-muted-foreground"
                  )
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/schemes"
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-green-600",
                    isActive ? "text-green-600" : "text-muted-foreground"
                  )
                }
              >
                Schemes
              </NavLink>
            </nav>
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-sm text-muted-foreground">{user?.email}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
const Footer = () => (
  <footer className="border-t">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Agri-Loan & Subsidy Tracker ALST. All rights reserved.</p>
      <p className="mt-1">Built with ❤️ at Cloudflare</p>
    </div>
  </footer>
);
export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-background">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors closeButton />
    </div>
  );
}