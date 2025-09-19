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
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Download, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RequestDemo = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    companySize: "",
    phone: "",
    country: "",
    demoType: "",
    interests: [] as string[],
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demo Request Submitted!",
      description: "We'll send you demo materials and contact you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      company: "",
      industry: "",
      companySize: "",
      phone: "",
      country: "",
      demoType: "",
      interests: [],
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageLayout>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('requestDemo')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get instant access to our demo materials and schedule a consultation with our experts
            </p>
          </div>

          {/* Demo Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <Play className="w-12 h-12 text-accent mx-auto" />
                <h3 className="text-lg font-semibold">Video Demo</h3>
                <p className="text-sm text-muted-foreground">Watch a pre-recorded demonstration of key features</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <Download className="w-12 h-12 text-accent mx-auto" />
                <h3 className="text-lg font-semibold">Product Brochure</h3>
                <p className="text-sm text-muted-foreground">Download detailed product specifications and use cases</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <Phone className="w-12 h-12 text-accent mx-auto" />
                <h3 className="text-lg font-semibold">Expert Consultation</h3>
                <p className="text-sm text-muted-foreground">Schedule a call with our solution specialists</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">demo@vrukshachain.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+91 99725 24322</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-accent mb-2">24hrs</div>
                  <p className="text-sm text-muted-foreground">Average response time</p>
                </CardContent>
              </Card>
            </div>

            {/* Request Form */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Request Demo Materials</CardTitle>
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
                      <Label htmlFor="email">Work Email *</Label>
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
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="food-processing">Food Processing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demoType">What type of demo are you interested in?</Label>
                    <Select value={formData.demoType} onValueChange={(value) => handleInputChange('demoType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select demo type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Demo</SelectItem>
                        <SelectItem value="live">Live Demo Call</SelectItem>
                        <SelectItem value="trial">Free Trial Access</SelectItem>
                        <SelectItem value="materials">Product Materials Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Areas of Interest (select all that apply)</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Supply Chain Tracking",
                        "Quality Management",
                        "Compliance Reporting",
                        "Consumer Transparency",
                        "Inventory Management",
                        "Analytics & Insights"
                      ].map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.interests.includes(interest)}
                            onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                          />
                          <Label htmlFor={interest} className="text-sm">{interest}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your specific requirements or challenges..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Request Demo Materials
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

export default RequestDemo;