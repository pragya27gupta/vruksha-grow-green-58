import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageLayout } from "@/components/ui/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare,
  Send
} from "lucide-react";

const Contact = () => {
  const { t } = useTranslation();

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-blue-600" />,
      title: t('phone'),
      content: "+91 99725 24322",
      description: t('callUs')
    },
    {
      icon: <Mail className="w-6 h-6 text-green-600" />,
      title: t('emailContact'),
      content: "info@vrukshachain.com",
      description: t('emailUs')
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-600" />,
      title: t('address'),
      content: "Bangalore, Karnataka, India",
      description: t('visitUs')
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: t('businessHours'),
      content: "Mon - Fri: 9:00 AM - 6:00 PM",
      description: t('workingHours')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageLayout>
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              {t('contactTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('contactDescription')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">{t('getInTouch')}</h2>
                <p className="text-muted-foreground mb-8">
                  {t('getInTouchDesc')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">{info.icon}</div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{info.title}</h3>
                          <p className="text-sm font-medium text-accent">{info.content}</p>
                          <p className="text-xs text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageSquare className="w-6 h-6 text-accent" />
                  {t('sendMessage')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('firstName')}</Label>
                      <Input 
                        id="firstName" 
                        placeholder={t('firstNamePlaceholder')}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('lastName')}</Label>
                      <Input 
                        id="lastName" 
                        placeholder={t('lastNamePlaceholder')}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder={t('emailPlaceholder')}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('subject')}</Label>
                    <Input 
                      id="subject" 
                      placeholder={t('subjectPlaceholder')}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('message')}</Label>
                    <Textarea 
                      id="message" 
                      placeholder={t('messagePlaceholder')}
                      rows={5}
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    {t('sendMessage')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default Contact;