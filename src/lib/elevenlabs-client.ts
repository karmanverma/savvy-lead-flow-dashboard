
const ELEVENLABS_API_KEY = 'sk_3916f6f66157e20925991c16f906e8984d1219f3f0be85ab';
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

export interface ElevenLabsAgent {
  agent_id: string;
  name: string;
  voice_id: string;
  language: string;
  prompt: {
    prompt: string;
  };
  first_message: string;
  created_at: string;
}

export interface ConversationConfig {
  agent_id: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

export interface CallRequest {
  agent_id: string;
  customer_phone_number: string;
  customer_name?: string;
}

export interface CallResponse {
  call_id: string;
  status: string;
  agent_id: string;
  customer_phone_number: string;
  created_at: string;
}

class ElevenLabsClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = ELEVENLABS_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = ELEVENLABS_BASE_URL;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createAgent(config: {
    name: string;
    voice_id: string;
    prompt: string;
    first_message: string;
    language?: string;
  }): Promise<ElevenLabsAgent> {
    const response = await this.makeRequest('/convai/agents', {
      method: 'POST',
      body: JSON.stringify({
        name: config.name,
        voice_id: config.voice_id,
        prompt: {
          prompt: config.prompt,
        },
        first_message: config.first_message,
        language: config.language || 'en',
      }),
    });

    return response;
  }

  async getAgent(agentId: string): Promise<ElevenLabsAgent> {
    return this.makeRequest(`/convai/agents/${agentId}`);
  }

  async updateAgent(agentId: string, updates: Partial<ElevenLabsAgent>): Promise<ElevenLabsAgent> {
    return this.makeRequest(`/convai/agents/${agentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.makeRequest(`/convai/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  async initiateCall(callRequest: CallRequest): Promise<CallResponse> {
    return this.makeRequest('/convai/calls', {
      method: 'POST',
      body: JSON.stringify(callRequest),
    });
  }

  async getCallStatus(callId: string): Promise<any> {
    return this.makeRequest(`/convai/calls/${callId}`);
  }

  async getVoices(): Promise<any[]> {
    return this.makeRequest('/voices');
  }

  async testVoice(voiceId: string, text: string = "Hello, this is a test of my voice."): Promise<ArrayBuffer> {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Voice test failed: ${response.status}`);
    }

    return response.arrayBuffer();
  }
}

export const elevenLabsClient = new ElevenLabsClient();
