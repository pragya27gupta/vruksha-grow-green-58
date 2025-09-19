import { supabase } from './supabase';

export interface WhatsAppMessage {
  campaignName: string;
  destination: string;
  userName: string;
  source?: string;
  templateParams?: string[];
  tags?: string[];
  attributes?: Record<string, string>;
}

export interface WhatsAppResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

class AiSensyAPI {
  async sendWhatsAppMessage(messageData: WhatsAppMessage): Promise<WhatsAppResponse> {
    try {
      // Check if Supabase is properly connected
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return {
          success: false,
          error: 'Supabase integration not activated. Please connect to Supabase first.'
        };
      }

      const { data, error } = await supabase.functions.invoke('aisensy-whatsapp', {
        body: messageData
      });

      if (error) {
        console.error('Supabase function error:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to send WhatsApp message' 
        };
      }

      return data as WhatsAppResponse;
    } catch (error) {
      console.error('API request error:', error);
      
      // Provide specific error message for Supabase connection issues
      if (error instanceof Error && error.message.includes('Supabase not connected')) {
        return { 
          success: false, 
          error: 'Please connect your project to Supabase using the green Supabase button in the top right corner.' 
        };
      }
      
      return { 
        success: false, 
        error: 'Network error while sending WhatsApp message' 
      };
    }
  }

  // Predefined campaign methods
  async sendFarmerOnboardingMessage(destination: string, userName: string): Promise<WhatsAppResponse> {
    return this.sendWhatsAppMessage({
      campaignName: 'farmer_onboarding',
      destination,
      userName,
      source: 'Website Hero',
      tags: ['farmer-onboarding', 'hero-cta']
    });
  }

  async sendProductInquiry(destination: string, userName: string, message: string): Promise<WhatsAppResponse> {
    return this.sendWhatsAppMessage({
      campaignName: 'product_inquiry',
      destination,
      userName,
      source: 'Website Contact',
      templateParams: [message],
      tags: ['product-inquiry', 'contact-form']
    });
  }

  async sendTechnicalSupport(destination: string, userName: string, issue: string): Promise<WhatsAppResponse> {
    return this.sendWhatsAppMessage({
      campaignName: 'technical_support',
      destination,
      userName,
      source: 'Website Support',
      templateParams: [issue],
      tags: ['technical-support', 'contact-form']
    });
  }

  async sendPartnershipInquiry(destination: string, userName: string, details: string): Promise<WhatsAppResponse> {
    return this.sendWhatsAppMessage({
      campaignName: 'partnership_inquiry',
      destination,
      userName,
      source: 'Website Partnership',
      templateParams: [details],
      tags: ['partnership', 'business-inquiry']
    });
  }
}

export const aiSensyAPI = new AiSensyAPI();