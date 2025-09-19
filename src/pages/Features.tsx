import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageLayout } from "@/components/ui/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Shield, 
  BarChart3, 
  Users, 
  Smartphone, 
  CheckCircle,
  Leaf,
  Database,
  Bell
} from "lucide-react";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <QrCode className="w-8 h-8 text-blue-600" />,
      title: t('qrCodeTracing'),
      description: t('qrCodeTracingDesc'),
      badge: t('core')
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: t('blockchainSecurity'),
      description: t('blockchainSecurityDesc'),
      badge: t('security')
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: t('realTimeAnalytics'),
      description: t('realTimeAnalyticsDesc'),
      badge: t('analytics')
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: t('stakeholderManagement'),
      description: t('stakeholderManagementDesc'),
      badge: t('collaboration')
    },
    {
      icon: <Smartphone className="w-8 h-8 text-pink-600" />,
      title: t('mobileFirst'),
      description: t('mobileFirstDesc'),
      badge: t('accessibility')
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-teal-600" />,
      title: t('qualityAssurance'),
      description: t('qualityAssuranceDesc'),
      badge: t('quality')
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      title: t('sustainabilityTracking'),
      description: t('sustainabilityTrackingDesc'),
      badge: t('environment')
    },
    {
      icon: <Database className="w-8 h-8 text-indigo-600" />,
      title: t('dataIntegration'),
      description: t('dataIntegrationDesc'),
      badge: t('integration')
    },
    {
      icon: <Bell className="w-8 h-8 text-red-600" />,
      title: t('alertSystem'),
      description: t('alertSystemDesc'),
      badge: t('notifications')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageLayout>
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              {t('featuresTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('featuresDescription')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex justify-center">{feature.icon}</div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6 bg-accent/5 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground">{t('readyToStart')}</h2>
            <p className="text-muted-foreground">{t('readyToStartDesc')}</p>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default Features;