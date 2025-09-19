import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { aiSensyAPI } from "@/lib/aisensy-api";

import dashboardMockup from "@/assets/dashboard-mockup.png";
import farmToForkHero from "@/assets/farm-to-fork-hero.jpg";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleWhatsAppClick = () => {
    // Navigate to the WhatsApp integration page
    navigate('/whatsapp-api');
  };
  
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={farmToForkHero} 
          alt="Farm to fork journey" 
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95"></div>
      </div>
      
      {/* Blockchain Network Pattern */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,_hsl(var(--accent)/0.06)_0_12px,_transparent_12px_24px)] opacity-40"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-80px)] py-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight drop-shadow-sm">
              {t('farmToFork')}
              <br />
              <span className="text-accent font-black">{t('traceabilityPlatform')}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
              {t('endToEndJourney')}
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl leading-relaxed">
              {t('heroDescription')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="rounded-full h-14 px-8 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/book-demo')}
              >
                {t('bookDemo')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="flex-1 relative">
            <div className="relative z-10">
              <img 
                src={dashboardMockup} 
                alt="VrukshaChain Dashboard" 
                className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border border-border/20"
              />
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-card border border-border rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold">5.2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t('acresMapped')}</p>
                    <p className="text-xs text-muted-foreground">{t('realTimeTracking')}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-lg p-4 shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground font-bold">✓</span>
                  </div>
                  <p className="font-semibold text-sm">{t('verifiedOrigin')}</p>
                  <p className="text-xs text-muted-foreground">{t('blockchainSecured')}</p>
                </div>
              </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl blur-3xl scale-110 -z-10"></div>
          </div>
        </div>

        {/* Trust Markers */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">{t('trustedBy')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <Badge variant="outline" className="px-4 py-2">AYUSH Ministry</Badge>
            <Badge variant="outline" className="px-4 py-2">NMPB Board</Badge>
            <Badge variant="outline" className="px-4 py-2">Organic India NGO</Badge>
            <Badge variant="outline" className="px-4 py-2">Fair Trade Alliance</Badge>
          </div>
        </div>
      </div>

      {/* WhatsApp/Chatbot Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl p-4 animate-pulse"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-6 w-6 mr-2" />
          <span className="hidden sm:inline">{t('farmerOnboarding')}</span>
        </Button>
      </div>
    </section>
  );
};

export default Hero;