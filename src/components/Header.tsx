import { Button } from "@/components/ui/button";
import { LogIn, User, LogOut } from "lucide-react";
import vrukshaLogo from "@/assets/vrukshachain-logo-main.png";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = (role: string) => {
    return `/dashboard/${role}`;
  };

  return (
    <header className="w-full bg-background/95 border-b border-border/30 sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src={vrukshaLogo} alt="VrukshaChain Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-foreground">VrukshaChain</span>
          </div>

          {/* Navigation - Simplified */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigate('/about')} 
              className="text-foreground hover:text-accent transition-colors font-medium hover:scale-105 transform duration-200"
            >
              {t('about')}
            </button>
            <button 
              onClick={() => navigate('/features')} 
              className="text-foreground hover:text-accent transition-colors font-medium hover:scale-105 transform duration-200"
            >
              {t('features')}
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="text-foreground hover:text-accent transition-colors font-medium hover:scale-105 transform duration-200"
            >
              {t('contact')}
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground bg-accent/5 px-4 py-2 rounded-full border border-accent/20">
              <span className="text-accent font-medium">📞 +91 99725 24322</span>
            </div>
            
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath(user.role))}>
                    <User className="w-4 h-4 mr-2" />
                    {t('dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('login')}
                </Button>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="hidden md:inline-flex"
                  onClick={() => navigate('/request-demo')}
                >
                  {t('requestDemo')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;