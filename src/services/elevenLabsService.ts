
export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  description: string;
  preview_url: string;
  available_for_tiers: string[];
  settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface TTSRequest {
  text: string;
  voice_id: string;
  voice_settings?: VoiceSettings;
  model_id?: string;
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = 'sk_3916f6f66157e20925991c16f906e8984d1219f3f0be85ab';
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
      const error = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
    }

    return response;
  }

  async getVoices(): Promise<Voice[]> {
    const response = await this.makeRequest('/voices');
    const data = await response.json();
    return data.voices || [];
  }

  async getVoice(voiceId: string): Promise<Voice> {
    const response = await this.makeRequest(`/voices/${voiceId}`);
    return response.json();
  }

  async textToSpeech(request: TTSRequest): Promise<ArrayBuffer> {
    const response = await this.makeRequest(`/text-to-speech/${request.voice_id}`, {
      method: 'POST',
      body: JSON.stringify({
        text: request.text,
        voice_settings: request.voice_settings || {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
        model_id: request.model_id || 'eleven_monolingual_v1',
      }),
    });

    return response.arrayBuffer();
  }

  async getVoiceSettings(voiceId: string): Promise<VoiceSettings> {
    const response = await this.makeRequest(`/voices/${voiceId}/settings`);
    return response.json();
  }

  async updateVoiceSettings(voiceId: string, settings: VoiceSettings): Promise<void> {
    await this.makeRequest(`/voices/${voiceId}/settings/edit`, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  createAudioUrl(audioBuffer: ArrayBuffer): string {
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }

  async testVoice(voiceId: string, text: string = "Hello, this is a voice test."): Promise<string> {
    const audioBuffer = await this.textToSpeech({
      text,
      voice_id: voiceId,
    });
    return this.createAudioUrl(audioBuffer);
  }
}

export const elevenLabsService = new ElevenLabsService();
