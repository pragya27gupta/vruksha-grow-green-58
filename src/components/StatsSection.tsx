import { useTranslation } from "react-i18next";

const StatsSection = () => {
  const { t } = useTranslation();
  
  const stats = [
    {
      percentage: "100%",
      title: t('stat1'),
      color: "bg-accent"
    },
    {
      percentage: "40%",
      title: t('stat2'),
      color: "bg-accent"
    },
    {
      percentage: "70%",
      title: t('stat3'),
      color: "bg-accent"
    },
    {
      percentage: "50%",
      title: t('stat4'),
      color: "bg-accent"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,200,50,0.1),transparent_50%)]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('whyVrukshaChain')}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            {t('digitizeTrace')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`${stat.color} text-accent-foreground rounded-2xl p-8 mb-6 mx-auto w-32 h-32 flex items-center justify-center shadow-lg hover:shadow-xl transform group-hover:scale-110 transition-all duration-300 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="text-3xl font-bold relative z-10">{stat.percentage}</span>
              </div>
              <p className="text-foreground font-medium leading-relaxed group-hover:text-accent transition-colors duration-200">
                {stat.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;