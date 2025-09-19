import React from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl'
};

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className,
  maxWidth = '7xl'
}) => {
  return (
    <div className={cn("min-h-screen bg-background p-4 md:p-6", className)}>
      <div className={cn("mx-auto space-y-6", maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </div>
  );
};

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle, 
  className 
}) => {
  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};

interface AuthLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  showLanguageSelector?: boolean;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  showBackButton = true,
  showLanguageSelector = true,
  className 
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4",
      className
    )}>
      {showBackButton && (
        <div className="absolute top-6 left-6 z-10">
          {/* Back button would be rendered here */}
        </div>
      )}
      
      {showLanguageSelector && (
        <div className="absolute top-6 right-6 z-10">
          {/* Language selector would be rendered here */}
        </div>
      )}
      
      <div className="w-full max-w-md mx-4 mt-16 lg:mt-0">
        {children}
      </div>
    </div>
  );
};