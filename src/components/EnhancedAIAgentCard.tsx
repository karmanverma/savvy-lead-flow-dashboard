
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bot, 
  MoreVertical, 
  Play, 
  Edit, 
  Copy, 
  Trash,
  Phone,
  Mic,
  Settings,
  Activity
} from "lucide-react";
import type { AIAgent } from "@/hooks/useAIAgents";
import { useSecureElevenLabsIntegration } from "@/hooks/useSecureElevenLabsIntegration";

interface EnhancedAIAgentCardProps {
  agent: AIAgent;
  onTest?: (agent: AIAgent) => void;
  onEdit?: (agent: AIAgent) => void;
  onDuplicate?: (agent: AIAgent) => void;
  onDelete?: (agent: AIAgent) => void;
}

export const EnhancedAIAgentCard = ({
  agent,
  onTest,
  onEdit,
  onDuplicate,
  onDelete
}: EnhancedAIAgentCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTestWidget, setShowTestWidget] = useState(false);
  const { testVoice } = useSecureElevenLabsIntegration();

  const handleVoicePlay = async () => {
    if (agent.voice_id) {
      setIsPlaying(true);
      try {
        await testVoice.mutateAsync(agent.voice_id);
      } finally {
        setIsPlaying(false);
      }
    }
  };

  const handleTestCall = () => {
    if (!agent.elevenlabs_agent_id) {
      alert('Agent not synced with ElevenLabs');
      return;
    }
    setShowTestWidget(true);
  };

  const getAgentInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatCallObjectives = (objectives: string[] | null) => {
    if (!objectives || objectives.length === 0) return 'General';
    return objectives.slice(0, 2).join(', ') + (objectives.length > 2 ? '...' : '');
  };

  const isElevenLabsSynced = Boolean(agent.elevenlabs_agent_id);

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600">
                <AvatarFallback className="bg-transparent text-white font-bold">
                  {getAgentInitials(agent.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg leading-tight">{agent.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    className={agent.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    variant="secondary"
                  >
                    {agent.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {agent.voice_id && (
                    <Badge variant="outline" className="text-xs">
                      <Mic className="w-3 h-3 mr-1" />
                      Voice
                    </Badge>
                  )}
                  {isElevenLabsSynced && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      <Bot className="w-3 h-3 mr-1" />
                      EL Synced
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(agent)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(agent)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTest?.(agent)}>
                  <Play className="w-4 h-4 mr-2" />
                  Test Agent
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(agent)}>
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {agent.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{agent.description}</p>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Objectives:</span>
              <span className="font-medium text-right max-w-[200px] truncate">
                {formatCallObjectives(agent.call_objectives)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Max Duration:</span>
              <span className="font-medium">{agent.max_call_duration || 300}s</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Language:</span>
              <Badge variant="outline" className="text-xs">
                {agent.language || 'en'}
              </Badge>
            </div>

            {isElevenLabsSynced && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">EL Agent ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {agent.elevenlabs_agent_id?.slice(0, 8)}...
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs"
              onClick={handleTestCall}
            >
              <Phone className="w-3 h-3 mr-1" />
              Test Call
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs"
              onClick={handleVoicePlay}
              disabled={!agent.voice_id || isPlaying || testVoice.isPending}
            >
              <Mic className={`w-3 h-3 mr-1 ${isPlaying ? 'animate-pulse' : ''}`} />
              {isPlaying || testVoice.isPending ? 'Playing...' : 'Voice'}
            </Button>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created: {new Date(agent.created_at).toLocaleDateString()}</span>
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>{isElevenLabsSynced ? 'Ready' : 'Needs Sync'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTestWidget} onOpenChange={setShowTestWidget}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Test AI Agent: {agent.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div 
              dangerouslySetInnerHTML={{
                __html: `
                  <elevenlabs-convai agent-id="${agent.elevenlabs_agent_id}"></elevenlabs-convai>
                  <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
                `
              }}
            />
            <p className="text-sm text-gray-600 text-center">
              Click the microphone icon above to start testing your AI agent
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
