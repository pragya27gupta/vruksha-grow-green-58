import vrukshaLogo from "@/assets/vrukshachain-logo-main.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  const footerSections = [
    {
      title: t('company'),
      links: [t('about'), "Partnership", "Media", "Careers", t('contact')]
    },
    {
      title: t('resources'), 
      links: ["Case Studies", "Blogs", "Ebooks", "Whitepapers", "Glossary", "Webinars"]
    },
    {
      title: t('quickLinks'),
      links: ["EUDR", "Climate Smart Agriculture", "DMRV", "CSRD", "ESG for the Food and Agribusiness"]
    },
    {
      title: "Value Chains",
      links: ["Dairy Value Chain", "Spice Value Chain", "Plantation Crops Value Chain", "Field Crops Value Chain", "Fruits & Vegetable Value Chain"]
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-primary-foreground/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src={vrukshaLogo} alt="VrukshaChain Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold">VrukshaChain</span>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="font-semibold text-lg mb-2">Subscribe to VrukshaChain Times</h3>
              <p className="text-primary-foreground/80 text-sm">
                {t('poweredBy')}
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 VrukshaChain. {t('allRightsReserved')} | {t('privacyPolicy')} | {t('termsOfService')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;