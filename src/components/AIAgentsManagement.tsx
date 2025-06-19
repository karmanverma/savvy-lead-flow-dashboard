
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { useAIAgents } from "@/hooks/useAIAgents";
import { AIAgentConfig } from "@/components/AIAgentConfig";
import { EnhancedAIAgentCard } from "@/components/EnhancedAIAgentCard";
import { AIAgentTester } from "@/components/AIAgentTester";
import type { AIAgent } from "@/hooks/useAIAgents";

export const AIAgentsManagement = () => {
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [testingAgent, setTestingAgent] = useState<AIAgent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: agents, isLoading, refetch } = useAIAgents();

  const filteredAgents = agents?.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAgentCreated = (newAgent: AIAgent) => {
    setShowCreateAgent(false);
    refetch();
  };

  const handleEdit = (agent: AIAgent) => {
    setEditingAgent(agent);
  };

  const handleTest = (agent: AIAgent) => {
    setTestingAgent(agent);
  };

  const handleDuplicate = (agent: AIAgent) => {
    // TODO: Implement agent duplication
    console.log("Duplicate agent:", agent);
  };

  const handleDelete = (agent: AIAgent) => {
    // TODO: Implement agent deletion
    if (confirm(`Are you sure you want to delete ${agent.name}?`)) {
      console.log("Delete agent:", agent);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Agent Management</h2>
          <p className="text-gray-600 mt-1">Create and manage your ElevenLabs AI calling agents</p>
        </div>
        <Button 
          onClick={() => setShowCreateAgent(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search agents by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading agents...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAgents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500 text-lg mb-4">
              {searchTerm ? "No agents found matching your search" : "No AI agents created yet"}
            </div>
            <p className="text-gray-400 mb-6">
              {searchTerm ? "Try adjusting your search terms" : "Create your first AI agent to get started with automated calling"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateAgent(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Agent
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agents Grid */}
      {!isLoading && filteredAgents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <EnhancedAIAgentCard
              key={agent.id}
              agent={agent}
              onEdit={handleEdit}
              onTest={handleTest}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Agent Dialog */}
      <Dialog open={showCreateAgent} onOpenChange={setShowCreateAgent}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New AI Agent</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[80vh]">
            <AIAgentConfig 
              onAgentCreated={handleAgentCreated}
              onClose={() => setShowCreateAgent(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={!!editingAgent} onOpenChange={(open) => !open && setEditingAgent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit AI Agent</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[80vh]">
            {editingAgent && (
              <AIAgentConfig 
                initialData={editingAgent}
                onAgentCreated={(updatedAgent) => {
                  setEditingAgent(null);
                  refetch();
                }}
                onClose={() => setEditingAgent(null)}
                isEditing={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Agent Dialog */}
      <Dialog open={!!testingAgent} onOpenChange={(open) => !open && setTestingAgent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Test AI Agent - {testingAgent?.name}</DialogTitle>
          </DialogHeader>
          {testingAgent && (
            <AIAgentTester agent={testingAgent} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
