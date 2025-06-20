
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSecureElevenLabsIntegration } from '@/hooks/useSecureElevenLabsIntegration';
import { Loader2, Bot, Play, Volume2, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { AIAgent } from '@/hooks/useAIAgents';

interface AIAgentConfigProps {
  initialData?: AIAgent;
  onAgentCreated?: (agent: any) => void;
  onClose?: () => void;
  isEditing?: boolean;
}

export function AIAgentConfig({ initialData, onAgentCreated, onClose, isEditing = false }: AIAgentConfigProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getVoices, createElevenLabsAgent, testVoice } = useSecureElevenLabsIntegration();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    system_prompt: initialData?.system_prompt || 'You are a professional real estate lead qualification specialist. Your role is to qualify leads, gather their property preferences, and schedule appointments with human agents. Be friendly, professional, and helpful. Always ask permission before proceeding with questions and respect if they want to call back later.',
    first_message_script: initialData?.first_message_script || 'Hi, this is calling from Toronto Digital Real Estate. I hope I\'m catching you at a good time. I wanted to follow up on your interest in properties and see how we can help you find your ideal home. Do you have a few minutes to chat?',
    voice_id: initialData?.voice_id || '',
    max_call_duration: initialData?.max_call_duration || 300,
    language: initialData?.language || 'en',
    call_objectives: initialData?.call_objectives || ['Lead Qualification', 'Property Preferences', 'Appointment Scheduling']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting agent creation form with data:', formData);
      const result = await createElevenLabsAgent.mutateAsync(formData);
      console.log('Agent creation result:', result);
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

  const handleTestVoice = async () => {
    if (formData.voice_id) {
      try {
        console.log('Testing voice:', formData.voice_id);
        await testVoice.mutateAsync(formData.voice_id);
      } catch (error) {
        console.error('Voice test failed:', error);
      }
    }
  };

  const voices = getVoices.data?.voices || [];
  const voicesError = getVoices.error;
  const voicesLoading = getVoices.isLoading;

  console.log('Voices loading state:', voicesLoading);
  console.log('Voices error:', voicesError);
  console.log('Voices data:', voices);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          {isEditing ? 'Edit AI Agent' : 'Create AI Agent'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Voice Loading Error Alert */}
          {voicesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load voices from ElevenLabs. Please check your API configuration.
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 ml-2"
                  onClick={() => getVoices.refetch()}
                  disabled={voicesLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${voicesLoading ? 'animate-spin' : ''}`} />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

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
              <Label htmlFor="voice">Voice Selection</Label>
              <div className="flex gap-2">
                <Select 
                  value={formData.voice_id} 
                  onValueChange={(value) => updateFormData('voice_id', value)}
                  disabled={voicesLoading || !!voicesError}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={
                      voicesLoading ? "Loading voices..." : 
                      voicesError ? "Error loading voices" :
                      voices.length === 0 ? "No voices available" :
                      "Select Voice"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice: any) => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-3 h-3" />
                          {voice.name} ({voice.category || 'General'})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleTestVoice}
                  disabled={!formData.voice_id || testVoice.isPending}
                  title="Test selected voice"
                >
                  {testVoice.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
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
            <Button 
              type="submit" 
              disabled={isLoading || createElevenLabsAgent.isPending} 
              className="flex-1"
            >
              {(isLoading || createElevenLabsAgent.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? 'Updating Agent...' : 'Creating Agent...'}
                </>
              ) : (
                isEditing ? 'Update AI Agent' : 'Create AI Agent'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
