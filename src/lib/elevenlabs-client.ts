
import { supabase } from '@/integrations/supabase/client';

export interface ElevenLabsAgent {
  agent_id: string;
  name: string;
  system_prompt: string;
  first_message: string;
  voice: {
    voice_id: string;
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  llm: {
    model: string;
    temperature: number;
    max_tokens: number;
  };
  max_duration_seconds: number;
  language: string;
  conversation_config: any;
}

export interface CallRequest {
  agent_id: string;
  customer_phone_number: string;
  system_prompt_override?: string;
  first_message_override?: string;
  max_duration_seconds?: number;
  webhook_url?: string;
}

export class ElevenLabsClient {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createAgent(agentData: Partial<ElevenLabsAgent>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/agents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create agent: ${response.statusText}`);
    }

    return response.json();
  }

  async initiateCall(callData: CallRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/convai/twilio/outbound_call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callData),
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate call: ${response.statusText}`);
    }

    return response.json();
  }

  async getAgents(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/agents`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.statusText}`);
    }

    const data = await response.json();
    return data.agents || [];
  }

  async getVoices(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices || [];
  }
}

// Initialize client with environment variable (to be set in edge function)
export const elevenLabsClient = new ElevenLabsClient(process.env.ELEVENLABS_API_KEY || '');
