import { useTranslation } from "react-i18next";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageLayout } from "@/components/ui/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BookDemo = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    participants: "",
    requirements: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demo Scheduled!",
      description: "We'll contact you shortly to confirm your demo session.",
    });
    setFormData({
      name: "",
      email: "",
      company: "",
      role: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      participants: "",
      requirements: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('bookDemo')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Schedule a personalized demonstration of VrukshaChain's farm-to-fork traceability platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Demo Benefits */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    What You'll See
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">Complete supply chain visualization</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">Real-time tracking capabilities</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">Quality control workflows</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">Compliance reporting tools</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <Calendar className="w-8 h-8 text-accent mx-auto" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">30 mins</div>
                    <p className="text-sm text-muted-foreground">Personalized demo session</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Schedule Your Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Your Role</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="processor">Processor</SelectItem>
                          <SelectItem value="manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="regulator">Regulator</SelectItem>
                          <SelectItem value="consumer">Consumer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredDate">Preferred Date</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime">Preferred Time</Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (1 PM - 5 PM)</SelectItem>
                          <SelectItem value="evening">Evening (6 PM - 8 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="participants">Number of Participants</Label>
                    <Select value={formData.participants} onValueChange={(value) => handleInputChange('participants', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select participants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 person</SelectItem>
                        <SelectItem value="2-5">2-5 people</SelectItem>
                        <SelectItem value="6-10">6-10 people</SelectItem>
                        <SelectItem value="10+">More than 10 people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Specific Requirements or Questions</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Tell us about your specific needs or any questions you'd like addressed during the demo..."
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Schedule Demo
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

export default BookDemo;