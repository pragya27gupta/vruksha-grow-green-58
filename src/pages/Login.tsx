import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import vrukshaLogo from '@/assets/vrukshachain-logo-new.png';
import authenticFarmer from '@/assets/authentic-farmer.jpg';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '' as UserRole | ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: 'farmer', label: t('farmer'), icon: '🌱', description: 'Record harvests and track origins' },
    { value: 'processor', label: t('processor'), icon: '⚙️', description: 'Process raw materials and add steps' },
    { value: 'laboratory', label: t('laboratory'), icon: '🔬', description: 'Test quality and validate batches' },
    { value: 'manufacturer', label: t('manufacturer'), icon: '🏭', description: 'Create products and generate QR codes' },
    { value: 'regulator', label: t('regulator'), icon: '🏛️', description: 'Monitor compliance and regulations' },
    { value: 'consumer', label: t('consumer'), icon: '👤', description: 'Scan products and view transparency' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(formData.email, formData.password, formData.role);
      if (success) {
        toast({
          title: "Success",
          description: `Welcome! Redirecting to ${formData.role} dashboard...`
        });
        navigate(`/dashboard/${formData.role}`);
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials. Try demo@vrukshachain.com / demo123",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Back to Home Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        
        {/* Language Selector */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg p-2 border border-border/20 shadow-lg">
            <LanguageSelector />
          </div>
        </div>
        <Card className="w-full max-w-md shadow-2xl border-border/20 bg-card/98 backdrop-blur-sm mt-20 lg:mt-0 mx-4">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <img src={vrukshaLogo} alt="VrukshaChain" className="h-16" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">{t('welcomeBack')}</CardTitle>
            <CardDescription className="text-lg">
              {t('loginToAccount')}
            </CardDescription>
            <div className="mt-4 p-3 bg-accent/10 rounded-lg">
              <p className="text-sm text-accent font-medium">
                🆕 New User? Sign up with Aadhaar/Phone in 2 mins
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">{t('selectRole')}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t('selectRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-3 py-2">
                          <span className="text-lg">{role.icon}</span>
                          <div>
                            <span className="font-medium">{role.label}</span>
                            <p className="text-xs text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="demo@vrukshachain.com"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="demo123"
                  className="h-12"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
                {isLoading ? "Loading..." : t('login')}
              </Button>

              <div className="flex justify-between text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  {t('forgotPassword')}
                </Link>
                <Link to="/signup" className="text-primary hover:underline">
                  {t('signup')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Authentic Farmer Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-trust-organic/30"></div>
        <img 
          src={authenticFarmer} 
          alt="Authentic Indian farmer in field" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{t('heroTitle')}</h2>
          <p className="text-lg opacity-90">{t('heroSubtitle')}</p>
          <div className="mt-4 flex gap-2">
            <Badge className="bg-white/20 text-white border-white/30">Blockchain Verified</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Fair Trade</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;