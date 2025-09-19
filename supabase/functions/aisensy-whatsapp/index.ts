import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface AiSensyRequest {
  campaignName: string;
  destination: string;
  userName: string;
  source?: string;
  templateParams?: string[];
  tags?: string[];
  attributes?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { campaignName, destination, userName, source, templateParams, tags, attributes } = await req.json() as AiSensyRequest

    // Get API key from environment
    const apiKey = Deno.env.get('AISENSY_API_KEY')
    if (!apiKey) {
      throw new Error('AiSensy API key not configured')
    }

    // Prepare the payload for AiSensy API
    const payload = {
      apiKey,
      campaignName,
      destination,
      userName,
      source: source || 'VrukshaChain Website',
      templateParams: templateParams || [],
      tags: tags || ['vrukshachain-contact'],
      attributes: attributes || {}
    }

    // Make request to AiSensy API
    const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('AiSensy API error:', errorData)
      throw new Error(`AiSensy API error: ${response.status}`)
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp message sent successfully',
        data: result 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})