
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Pause } from "lucide-react";
import { useVoices } from "@/hooks/useVoices";
import { elevenLabsService } from "@/services/elevenLabsService";

interface VoiceSelectorProps {
  selectedVoiceId?: string;
  onVoiceSelect: (voiceId: string) => void;
  testText?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onVoiceSelect,
  testText = "Hello, this is a test of this voice. How does it sound for our AI agent?"
}) => {
  const { data: voices, isLoading } = useVoices();
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleVoiceTest = async (voiceId: string) => {
    if (playingVoice === voiceId) {
      // Stop current audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setPlayingVoice(null);
      setAudioElement(null);
      return;
    }

    try {
      setPlayingVoice(voiceId);
      const audioUrl = await elevenLabsService.testVoice(voiceId, testText);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlayingVoice(null);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setPlayingVoice(null);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
      };

      setAudioElement(audio);
      await audio.play();
    } catch (error) {
      console.error('Voice test error:', error);
      setPlayingVoice(null);
      setAudioElement(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading voices...</span>
        </CardContent>
      </Card>
    );
  }

  const selectedVoice = voices?.find(v => v.voice_id === selectedVoiceId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Voice Selection</CardTitle>
          <CardDescription>
            Choose a voice for your AI agent from ElevenLabs library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedVoiceId} onValueChange={onVoiceSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices?.map((voice) => (
                <SelectItem key={voice.voice_id} value={voice.voice_id}>
                  {voice.name} - {voice.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedVoice && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedVoice.name}
              <Badge variant="secondary">{selectedVoice.category}</Badge>
            </CardTitle>
            <CardDescription>{selectedVoice.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVoiceTest(selectedVoice.voice_id)}
                disabled={playingVoice !== null && playingVoice !== selectedVoice.voice_id}
              >
                {playingVoice === selectedVoice.voice_id ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Test
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Voice
                  </>
                )}
              </Button>
              
              {playingVoice === selectedVoice.voice_id && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Playing...
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Stability:</span> {selectedVoice.settings?.stability || 0.5}
              </div>
              <div>
                <span className="font-medium">Similarity:</span> {selectedVoice.settings?.similarity_boost || 0.8}
              </div>
              <div>
                <span className="font-medium">Style:</span> {selectedVoice.settings?.style || 0.0}
              </div>
              <div>
                <span className="font-medium">Speaker Boost:</span> {selectedVoice.settings?.use_speaker_boost ? 'Yes' : 'No'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
