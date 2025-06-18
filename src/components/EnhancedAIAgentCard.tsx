
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface EnhancedAIAgentCardProps {
  agent: AIAgent;
  onTest?: (agent: AIAgent) => void;
  onEdit?: (agent: AIAgent) => void;
  onDuplicate?: (agent: AIAgent) => void;
  onDelete?: (agent: AIAgent) => void;
  onPlayVoice?: (voiceId: string) => void;
}

export const EnhancedAIAgentCard = ({
  agent,
  onTest,
  onEdit,
  onDuplicate,
  onDelete,
  onPlayVoice
}: EnhancedAIAgentCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVoicePlay = async () => {
    if (agent.voice_id && onPlayVoice) {
      setIsPlaying(true);
      try {
        await onPlayVoice(agent.voice_id);
      } finally {
        setTimeout(() => setIsPlaying(false), 3000); // Reset after 3 seconds
      }
    }
  };

  const getAgentInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatCallObjectives = (objectives: string[] | null) => {
    if (!objectives || objectives.length === 0) return 'General';
    return objectives.slice(0, 2).join(', ') + (objectives.length > 2 ? '...' : '');
  };

  return (
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
              {(agent as any).language || 'en'}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => onTest?.(agent)}
          >
            <Phone className="w-3 h-3 mr-1" />
            Test Call
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={handleVoicePlay}
            disabled={!agent.voice_id || isPlaying}
          >
            <Mic className={`w-3 h-3 mr-1 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying ? 'Playing...' : 'Voice'}
          </Button>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Created: {new Date(agent.created_at).toLocaleDateString()}</span>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Ready</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
