import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Send, Phone, Check, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/ui/page-layout';
import { useToast } from '@/hooks/use-toast';
import { aiSensyAPI } from '@/lib/aisensy-api';

export default function WhatsAppAPI() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('15558763649');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedMessages = [
    {
      title: "Farmer Onboarding",
      message: "Hi VrukshaChain! I want to learn about farmer onboarding.",
      campaignName: "farmer_onboarding",
      action: aiSensyAPI.sendFarmerOnboardingMessage
    },
    {
      title: "Product Information", 
      message: "Hi VrukshaChain! I need information about your products and services.",
      campaignName: "product_inquiry",
      action: aiSensyAPI.sendProductInquiry
    },
    {
      title: "Technical Support",
      message: "Hi VrukshaChain! I need technical support with the platform.",
      campaignName: "technical_support", 
      action: aiSensyAPI.sendTechnicalSupport
    },
    {
      title: "Partnership Inquiry",
      message: "Hi VrukshaChain! I'm interested in partnership opportunities.",
      campaignName: "partnership_inquiry",
      action: aiSensyAPI.sendPartnershipInquiry
    }
  ];

  const sendWhatsAppMessage = async (customMessage?: string, campaignType?: string) => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }

    const messageToSend = customMessage || message;
    if (!messageToSend.trim()) {
      toast({
        title: "Message Required", 
        description: "Please enter a message to send.",
        variant: "destructive"
      });
      return;
    }

    // Format phone number for AiSensy (ensure it has + prefix)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    setIsLoading(true);
    
    try {
      let result;
      
      // Use specific campaign methods for predefined messages
      if (campaignType === 'farmer_onboarding') {
        result = await aiSensyAPI.sendFarmerOnboardingMessage(formattedPhone, userName);
      } else if (campaignType === 'product_inquiry') {
        result = await aiSensyAPI.sendProductInquiry(formattedPhone, userName, messageToSend);
      } else if (campaignType === 'technical_support') {
        result = await aiSensyAPI.sendTechnicalSupport(formattedPhone, userName, messageToSend);
      } else if (campaignType === 'partnership_inquiry') {
        result = await aiSensyAPI.sendPartnershipInquiry(formattedPhone, userName, messageToSend);
      } else {
        // Custom message - use general campaign
        result = await aiSensyAPI.sendWhatsAppMessage({
          campaignName: 'general_inquiry',
          destination: formattedPhone,
          userName,
          source: 'Website Custom Message',
          templateParams: [messageToSend],
          tags: ['custom-message']
        });
      }

      if (result.success) {
        toast({
          title: "Message Sent Successfully",
          description: "Your WhatsApp message has been sent via AiSensy API.",
        });
        setMessage(''); // Clear the message field
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to Send Message",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <MessageCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                WhatsApp Integration
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Connect with VrukshaChain instantly through WhatsApp for support, inquiries, and onboarding assistance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Quick Contact Cards */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                {predefinedMessages.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{item.message}</p>
                      <Button 
                        onClick={() => sendWhatsAppMessage(item.message, item.campaignName)}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading || !userName.trim()}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MessageCircle className="h-4 w-4 mr-2" />}
                        Send via WhatsApp API
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Message Form */}
              <div>
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-blue-600" />
                      Send Custom Message
                    </CardTitle>
                    <CardDescription>
                      Send a personalized message directly through WhatsApp
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+15558763649"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={4}
                      />
                    </div>
                    
                    <Button 
                      onClick={() => sendWhatsAppMessage()}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={isLoading || !userName.trim() || !message.trim()}
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <MessageCircle className="h-5 w-5 mr-2" />}
                      Send WhatsApp Message
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">WhatsApp</p>
                          <p className="text-sm text-gray-600">+1 (555) 876-3649</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Business Hours</p>
                          <p className="text-sm text-gray-600">Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
}