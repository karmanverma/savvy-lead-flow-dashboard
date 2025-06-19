
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useSecureElevenLabsIntegration } from '@/hooks/useSecureElevenLabsIntegration';
import { Loader2, Bot } from 'lucide-react';

interface AIAgentConfigProps {
  onAgentCreated?: (agent: any) => void;
  onClose?: () => void;
}

export function AIAgentConfig({ onAgentCreated, onClose }: AIAgentConfigProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getVoices, createElevenLabsAgent } = useSecureElevenLabsIntegration();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    system_prompt: 'You are a professional real estate lead qualification specialist. Your role is to qualify leads, gather their property preferences, and schedule appointments with human agents. Be friendly, professional, and helpful. Always ask permission before proceeding with questions and respect if they want to call back later.',
    first_message_script: 'Hi, this is calling from Toronto Digital Real Estate. I hope I\'m catching you at a good time. I wanted to follow up on your interest in properties and see how we can help you find your ideal home. Do you have a few minutes to chat?',
    voice_id: '',
    voice_settings: {
      stability: 0.8,
      similarity_boost: 0.6,
      style: 0.2,
      use_speaker_boost: true
    },
    llm_config: {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000
    },
    max_call_duration: 300,
    language: 'en',
    call_objectives: ['Lead Qualification', 'Property Preferences', 'Appointment Scheduling']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createElevenLabsAgent.mutateAsync(formData);
      onAgentCreated?.(result.agent);
      onClose?.();
    } catch (error: any) {
      console.error('Agent creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateVoiceSettings = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      voice_settings: {
        ...prev.voice_settings,
        [field]: value
      }
    }));
  };

  const updateLLMConfig = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      llm_config: {
        ...prev.llm_config,
        [field]: value
      }
    }));
  };

  const voices = getVoices.data?.voices || [];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Create AI Agent
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="e.g., Sarah - Lead Qualification Specialist"
                required
              />
            </div>
            <div>
              <Label htmlFor="voice">Voice</Label>
              <Select value={formData.voice_id} onValueChange={(value) => updateFormData('voice_id', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder={getVoices.isLoading ? "Loading voices..." : "Select Voice"} />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice: any) => (
                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                      {voice.name} ({voice.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Brief description of the agent's purpose"
            />
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Voice Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Stability: {formData.voice_settings.stability}</Label>
                <Slider
                  value={[formData.voice_settings.stability]}
                  onValueChange={(value) => updateVoiceSettings('stability', value[0])}
                  max={1}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Similarity Boost: {formData.voice_settings.similarity_boost}</Label>
                <Slider
                  value={[formData.voice_settings.similarity_boost]}
                  onValueChange={(value) => updateVoiceSettings('similarity_boost', value[0])}
                  max={1}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Style: {formData.voice_settings.style}</Label>
                <Slider
                  value={[formData.voice_settings.style]}
                  onValueChange={(value) => updateVoiceSettings('style', value[0])}
                  max={1}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.voice_settings.use_speaker_boost}
                onCheckedChange={(checked) => updateVoiceSettings('use_speaker_boost', checked)}
              />
              <Label>Use Speaker Boost</Label>
            </div>
          </div>

          {/* Scripts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Agent Scripts</h3>
            <div>
              <Label htmlFor="system_prompt">System Prompt</Label>
              <Textarea
                id="system_prompt"
                value={formData.system_prompt}
                onChange={(e) => updateFormData('system_prompt', e.target.value)}
                rows={4}
                placeholder="Define the agent's role and behavior..."
                required
              />
            </div>
            <div>
              <Label htmlFor="first_message_script">First Message Script</Label>
              <Textarea
                id="first_message_script"
                value={formData.first_message_script}
                onChange={(e) => updateFormData('first_message_script', e.target.value)}
                rows={3}
                placeholder="Hi, this is [Agent Name] calling from..."
                required
              />
            </div>
          </div>

          {/* LLM Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">LLM Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={formData.llm_config.model} onValueChange={(value) => updateLLMConfig('model', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Temperature: {formData.llm_config.temperature}</Label>
                <Slider
                  value={[formData.llm_config.temperature]}
                  onValueChange={(value) => updateLLMConfig('temperature', value[0])}
                  max={2}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="max_tokens">Max Tokens</Label>
                <Input
                  id="max_tokens"
                  type="number"
                  value={formData.llm_config.max_tokens}
                  onChange={(e) => updateLLMConfig('max_tokens', parseInt(e.target.value))}
                  min={100}
                  max={4000}
                />
              </div>
            </div>
          </div>

          {/* Call Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_call_duration">Max Call Duration (seconds)</Label>
              <Input
                id="max_call_duration"
                type="number"
                value={formData.max_call_duration}
                onChange={(e) => updateFormData('max_call_duration', parseInt(e.target.value))}
                min={60}
                max={1800}
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={(value) => updateFormData('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading || createElevenLabsAgent.isPending} className="flex-1">
              {(isLoading || createElevenLabsAgent.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Agent...
                </>
              ) : (
                'Create AI Agent'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
