
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Bot, Loader2 } from "lucide-react";
import { useAIAgents } from "@/hooks/useAIAgents";
import { useInitiateCall } from "@/hooks/useCallQueue";

interface AICallTriggerProps {
  leadId: string;
  leadName: string;
  leadPhone: string;
  onCallStarted?: () => void;
}

const callObjectives = [
  'Lead Qualification',
  'Property Preferences',
  'Appointment Scheduling',
  'Follow-up Call',
  'Budget Verification',
  'Market Update',
  'Custom'
];

export const AICallTrigger = ({ leadId, leadName, leadPhone, onCallStarted }: AICallTriggerProps) => {
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedObjective, setSelectedObjective] = useState<string>('');
  const [customObjective, setCustomObjective] = useState<string>('');
  
  const { data: aiAgents, isLoading: agentsLoading } = useAIAgents();
  const initiateCall = useInitiateCall();

  const handleInitiateCall = async () => {
    if (!selectedAgent || !selectedObjective) return;

    const objective = selectedObjective === 'Custom' ? customObjective : selectedObjective;
    
    try {
      await initiateCall.mutateAsync({
        lead_id: leadId,
        ai_agent_id: selectedAgent,
        call_objective: objective,
        priority: 1 // Immediate call
      });
      
      setShowObjectiveModal(false);
      onCallStarted?.();
    } catch (error) {
      console.error('Failed to initiate call:', error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowObjectiveModal(true)}
        disabled={initiateCall.isPending}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        {initiateCall.isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Phone className="w-4 h-4 mr-2" />
        )}
        AI Call
      </Button>

      <Dialog open={showObjectiveModal} onOpenChange={setShowObjectiveModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Initiate AI Call
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Calling:</p>
              <p className="font-medium">{leadName}</p>
              <p className="text-sm text-gray-500">{leadPhone}</p>
            </div>

            <div>
              <Label>Select AI Agent</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose an AI agent" />
                </SelectTrigger>
                <SelectContent>
                  {agentsLoading ? (
                    <SelectItem value="loading" disabled>Loading agents...</SelectItem>
                  ) : (
                    aiAgents?.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Call Objective</Label>
              <Select value={selectedObjective} onValueChange={setSelectedObjective}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select call purpose" />
                </SelectTrigger>
                <SelectContent>
                  {callObjectives.map((objective) => (
                    <SelectItem key={objective} value={objective}>
                      {objective}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedObjective === 'Custom' && (
              <div>
                <Label>Custom Objective</Label>
                <Textarea
                  value={customObjective}
                  onChange={(e) => setCustomObjective(e.target.value)}
                  placeholder="Describe the purpose of this call..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowObjectiveModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInitiateCall}
              disabled={!selectedAgent || !selectedObjective || (selectedObjective === 'Custom' && !customObjective.trim()) || initiateCall.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {initiateCall.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Phone className="w-4 h-4 mr-2" />
              )}
              Start Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
