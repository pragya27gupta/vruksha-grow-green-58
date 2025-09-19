import { Wheat, Apple, Milk, Sparkles, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";

const TraceabilitySection = () => {
  const { t } = useTranslation();
  
  const categories = [
    {
      icon: Wheat,
      title: t('fieldCrops'),
      description: t('fieldCropsDesc')
    },
    {
      icon: Apple,
      title: t('fruitsVegetables'),
      description: t('fruitsVegetablesDesc')
    },
    {
      icon: Milk,
      title: t('dairy'),
      description: t('dairyDesc')
    },
    {
      icon: Sparkles,
      title: t('spice'),
      description: t('spiceDesc')
    },
    {
      icon: Sprout,
      title: t('plantationCrops'),
      description: t('plantationCropsDesc')
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/5 to-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_25%,rgba(120,200,50,0.03)_25%,rgba(120,200,50,0.03)_50%,transparent_50%)]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('ensureTraceability')}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {categories.map((category, index) => (
            <div key={index} className="text-center group">
              <div className="bg-card border border-border rounded-2xl p-8 mb-4 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <category.icon className="w-16 h-16 text-accent mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            {t('howVrukshaChain')}
          </h3>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('ensureFoodSafety')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TraceabilitySection;