
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, Phone, Loader2 } from 'lucide-react';
import { useSecureElevenLabsIntegration } from '@/hooks/useSecureElevenLabsIntegration';
import type { AIAgent } from '@/hooks/useAIAgents';

interface AIAgentTesterProps {
  agent: AIAgent;
}

export function AIAgentTester({ agent }: AIAgentTesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { testVoice, initiateSecureCall } = useSecureElevenLabsIntegration();

  const openTestWidget = () => {
    if (!agent.elevenlabs_agent_id) {
      alert('Agent not synced with ElevenLabs');
      return;
    }

    const widgetUrl = `https://elevenlabs.io/convai-widget/?agent_id=${agent.elevenlabs_agent_id}`;
    
    window.open(
      widgetUrl,
      'elevenLabs-test',
      'width=400,height=600,scrollbars=yes,resizable=yes'
    );
  };

  const handleVoiceTest = async () => {
    if (!agent.voice_id) {
      alert('No voice configured for this agent');
      return;
    }

    try {
      await testVoice.mutateAsync(agent.voice_id);
    } catch (error) {
      console.error('Voice test failed:', error);
    }
  };

  const initiateTestCall = async () => {
    setIsLoading(true);
    try {
      // This would require a test phone number - for demo purposes
      const testPhoneNumber = prompt('Enter test phone number (e.g., +1234567890):');
      if (!testPhoneNumber) return;

      await initiateSecureCall.mutateAsync({
        lead_id: 'test-lead-id', // This would need to be a real lead ID
        ai_agent_id: agent.id,
        call_objective: 'Agent testing and validation',
        priority: 1
      });
    } catch (error) {
      console.error('Test call failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isElevenLabsSynced = Boolean(agent.elevenlabs_agent_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Test AI Agent</span>
          <Badge variant={isElevenLabsSynced ? "default" : "secondary"}>
            {isElevenLabsSynced ? "Synced" : "Not Synced"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={openTestWidget}
            disabled={!isElevenLabsSynced}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Test Widget
          </Button>
          
          <Button
            onClick={handleVoiceTest}
            disabled={!agent.voice_id || testVoice.isPending}
            variant="outline"
            className="w-full"
          >
            {testVoice.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Test Voice
          </Button>
        </div>

        <Button
          onClick={initiateTestCall}
          disabled={!isElevenLabsSynced || isLoading || initiateSecureCall.isPending}
          className="w-full"
          variant="default"
        >
          {(isLoading || initiateSecureCall.isPending) ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Phone className="w-4 h-4 mr-2" />
          )}
          Test Call to Phone
        </Button>

        {!isElevenLabsSynced && (
          <p className="text-sm text-amber-600">
            This agent needs to be synced with ElevenLabs before testing.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
