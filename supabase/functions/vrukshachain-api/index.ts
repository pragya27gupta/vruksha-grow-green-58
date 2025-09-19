import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    const apiKey = Deno.env.get('VRUKSHACHAIN_API_KEY')

    if (!apiKey) {
      throw new Error('VrukshaChain API key not found')
    }

    let response
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }

    switch (action) {
      case 'addProcessStep':
        response = await fetch('https://api.vrukshachain.com/process/add-step', {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        })
        break
      
      case 'uploadCertificate':
        response = await fetch('https://api.vrukshachain.com/certificates/upload', {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        })
        break
      
      case 'updateEfficiency':
        response = await fetch('https://api.vrukshachain.com/processing/efficiency', {
          method: 'PUT',
          headers,
          body: JSON.stringify(data)
        })
        break
      
      case 'getBatchDetails':
        response = await fetch(`https://api.vrukshachain.com/batches/${data.batchId}`, {
          method: 'GET',
          headers
        })
        break
      
      default:
        throw new Error('Invalid action')
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.ok ? 200 : 400,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})