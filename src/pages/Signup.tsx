import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import vrukshaLogo from '@/assets/vrukshachain-logo-new.png';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(formData.email, formData.password, formData.role, formData.name);
      if (success) {
        toast({
          title: "Success",
          description: "Account created successfully!"
        });
        navigate(`/dashboard/${formData.role}`);
      } else {
        toast({
          title: "Error",
          description: "User already exists",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Signup failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
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
      
      <Card className="w-full max-w-md shadow-2xl border-border/20 bg-card/98 backdrop-blur-sm mt-16 lg:mt-0 mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={vrukshaLogo} alt="VrukshaChain" className="h-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">{t('createAccount')}</CardTitle>
          <CardDescription>
            {t('selectRole')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">{t('selectRole')}</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <span>{role.icon}</span>
                          <span className="font-medium">{role.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : t('createAccount')}
            </Button>

            <div className="text-center text-sm">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('login')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;