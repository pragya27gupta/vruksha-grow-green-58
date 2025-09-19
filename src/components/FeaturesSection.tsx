import { Map, Package, QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";
import farmHero from "@/assets/farm-hero.jpg";
import processManufacturing from "@/assets/process-manufacturing.jpg";
import batchSerialization from "@/assets/batch-serialization.png";
import qrTransparency from "@/assets/qr-transparency.png";

const FeaturesSection = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      title: t('firstMileFarm'),
      description: t('firstMileFarmDesc'),
      image: farmHero,
      reverse: false
    },
    {
      title: t('processManufacturing'), 
      description: t('processManufacturingDesc'),
      image: processManufacturing,
      reverse: true
    },
    {
      title: t('batchSerialization'),
      description: t('batchSerializationDesc'),
      image: batchSerialization,
      reverse: false
    },
    {
      title: t('qrConsumerTransparency'),
      description: t('qrConsumerTransparencyDesc'),
      image: qrTransparency,
      reverse: true
    }
  ];

  const actionCards = [
    {
      icon: Map,
      title: t('precisionMapping'),
      color: "bg-accent"
    },
    {
      icon: QrCode,
      title: t('traceabilityQR'),
      color: "bg-primary"
    },
    {
      icon: Package,
      title: t('manageFarms'),
      color: "bg-accent"
    },
    {
      icon: Package,
      title: t('scanFarmerProduct'),
      color: "bg-primary"
    },
    {
      icon: Package,
      title: t('onboardInventory'), 
      color: "bg-accent"
    },
    {
      icon: Package,
      title: t('manageWarehouses'),
      color: "bg-primary"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {features.map((feature, index) => (
          <div key={index} className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 mb-20`}>
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {feature.title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {feature.description}
              </p>
              
              {/* Action Cards - only show on last feature */}
              {index === features.length - 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {actionCards.map((card, cardIndex) => (
                    <div key={cardIndex} className={`${card.color} text-accent-foreground rounded-lg p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
                      <card.icon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{card.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image */}
            <div className="flex-1">
              <div className="relative">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full rounded-2xl shadow-xl"
                />
                {index === 0 && (
                  <>
                    <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
                      <div className="text-center">
                        <div className="w-4 h-4 bg-accent rounded-full mx-auto mb-1"></div>
                        <p className="text-xs font-medium">{t('gpsTagged')}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-accent text-accent-foreground rounded-lg px-3 py-2 shadow-lg">
                      <span className="text-sm font-medium">{t('precisionMapping')}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;