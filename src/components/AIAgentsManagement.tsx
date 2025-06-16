
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bot, 
  Plus, 
  MoreVertical, 
  Play, 
  Edit, 
  Copy, 
  Trash,
  Phone,
  Mic
} from "lucide-react";

const mockAgents = [
  {
    id: 1,
    name: "Sarah - Lead Qualifier",
    description: "Primary agent for initial lead qualification calls",
    voice: "Female Professional",
    status: "Active",
    callsMade: 234,
    successRate: 78,
    avatar: "SP"
  },
  {
    id: 2,
    name: "Michael - Follow-up Specialist",
    description: "Handles follow-up calls and appointment scheduling",
    voice: "Male Friendly",
    status: "Active",
    callsMade: 156,
    successRate: 85,
    avatar: "MF"
  },
  {
    id: 3,
    name: "Emma - Property Consultant",
    description: "Specialized in property information and market updates",
    voice: "Female Warm",
    status: "Inactive",
    callsMade: 89,
    successRate: 72,
    avatar: "EP"
  }
];

const voiceOptions = [
  { id: "female-professional", name: "Female Professional", sample: "sample1.mp3" },
  { id: "male-friendly", name: "Male Friendly", sample: "sample2.mp3" },
  { id: "female-warm", name: "Female Warm", sample: "sample3.mp3" },
  { id: "male-authoritative", name: "Male Authoritative", sample: "sample4.mp3" }
];

const personalityTraits = [
  "Empathetic", "Professional", "Friendly", "Confident", "Patient", "Persuasive"
];

const callObjectives = [
  "Lead Qualification",
  "Follow-up Contact",
  "Appointment Scheduling",
  "Property Information",
  "Budget Verification",
  "Market Updates"
];

export const AIAgentsManagement = () => {
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  
  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    voice: "female-professional",
    status: true,
    speakingPace: [1],
    personality: [],
    firstMessage: "",
    systemPrompt: "",
    objectives: [],
    callTimeout: 300,
    retryAttempts: 3
  });

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAgent = () => {
    console.log("Creating agent:", newAgent);
    setShowAddAgentModal(false);
    // Reset form
    setNewAgent({
      name: "",
      description: "",
      voice: "female-professional",
      status: true,
      speakingPace: [1],
      personality: [],
      firstMessage: "",
      systemPrompt: "",
      objectives: [],
      callTimeout: 300,
      retryAttempts: 3
    });
  };

  const handleTestAgent = (agent: any) => {
    console.log("Testing agent:", agent);
  };

  const playVoiceSample = (voiceId: string) => {
    console.log("Playing voice sample:", voiceId);
  };

  const togglePersonality = (trait: string) => {
    setNewAgent(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(t => t !== trait)
        : [...prev.personality, trait]
    }));
  };

  const toggleObjective = (objective: string) => {
    setNewAgent(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(o => o !== objective)
        : [...prev.objectives, objective]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Agent Management</h2>
          <p className="text-gray-600 mt-1">Configure and manage your AI calling agents</p>
        </div>
        <Button 
          onClick={() => setShowAddAgentModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Agent
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search agents by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">{agent.avatar}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge 
                      className={agent.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      variant="secondary"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingAgent(agent)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTestAgent(agent)}>
                      <Play className="w-4 h-4 mr-2" />
                      Test Agent
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Voice Type</span>
                  <Badge variant="outline">{agent.voice}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Calls Made</span>
                  <span className="text-sm font-medium">{agent.callsMade}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Success Rate</span>
                  <span className="text-sm font-medium text-green-600">{agent.successRate}%</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="w-3 h-3 mr-1" />
                  Test Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Mic className="w-3 h-3 mr-1" />
                  Voice Sample
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Agent Modal */}
      <Dialog open={showAddAgentModal || editingAgent} onOpenChange={(open) => {
        if (!open) {
          setShowAddAgentModal(false);
          setEditingAgent(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingAgent ? "Edit AI Agent" : "Configure New AI Agent"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex h-[70vh]">
            {/* Tab Navigation */}
            <div className="w-1/4 border-r pr-4">
              <div className="space-y-2">
                {[
                  { id: "basic", label: "Basic Settings", icon: Bot },
                  { id: "voice", label: "Voice & Personality", icon: Mic },
                  { id: "scripts", label: "Scripts & Prompts", icon: Edit },
                  { id: "advanced", label: "Advanced Settings", icon: Plus }
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 pl-6 overflow-y-auto">
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div>
                    <Label>Agent Name</Label>
                    <Input
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                      placeholder="e.g., Sarah - Lead Qualifier"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newAgent.description}
                      onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                      placeholder="Brief description of the agent's role and purpose"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Agent Status</Label>
                    <Switch
                      checked={newAgent.status}
                      onCheckedChange={(checked) => setNewAgent({...newAgent, status: checked})}
                    />
                  </div>
                </div>
              )}

              {activeTab === "voice" && (
                <div className="space-y-6">
                  <div>
                    <Label>Voice Selection</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {voiceOptions.map((voice) => (
                        <div
                          key={voice.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            newAgent.voice === voice.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          }`}
                          onClick={() => setNewAgent({...newAgent, voice: voice.id})}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{voice.name}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                playVoiceSample(voice.id);
                              }}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Play Sample
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Speaking Pace</Label>
                    <div className="mt-2">
                      <Slider
                        value={newAgent.speakingPace}
                        onValueChange={(value) => setNewAgent({...newAgent, speakingPace: value})}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Slow (0.5x)</span>
                        <span>Normal ({newAgent.speakingPace[0]}x)</span>
                        <span>Fast (2x)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Personality Traits</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {personalityTraits.map((trait) => (
                        <div key={trait} className="flex items-center space-x-2">
                          <Checkbox 
                            id={trait}
                            checked={newAgent.personality.includes(trait)}
                            onCheckedChange={() => togglePersonality(trait)}
                          />
                          <Label htmlFor={trait} className="text-sm">{trait}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "scripts" && (
                <div className="space-y-4">
                  <div>
                    <Label>First Message Script</Label>
                    <Textarea
                      value={newAgent.firstMessage}
                      onChange={(e) => setNewAgent({...newAgent, firstMessage: e.target.value})}
                      placeholder="Hello! This is Sarah calling from Royal Canadian Realty..."
                      className="mt-1"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">Character limit: 500</p>
                  </div>
                  <div>
                    <Label>System Prompt</Label>
                    <Textarea
                      value={newAgent.systemPrompt}
                      onChange={(e) => setNewAgent({...newAgent, systemPrompt: e.target.value})}
                      placeholder="You are a professional real estate agent specializing in..."
                      className="mt-1"
                      rows={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Define the agent's behavior and knowledge</p>
                  </div>
                  <div>
                    <Label>Call Objectives</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {callObjectives.map((objective) => (
                        <div key={objective} className="flex items-center space-x-2">
                          <Checkbox 
                            id={objective}
                            checked={newAgent.objectives.includes(objective)}
                            onCheckedChange={() => toggleObjective(objective)}
                          />
                          <Label htmlFor={objective} className="text-sm">{objective}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "advanced" && (
                <div className="space-y-4">
                  <div>
                    <Label>Call Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={newAgent.callTimeout}
                      onChange={(e) => setNewAgent({...newAgent, callTimeout: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Retry Attempts</Label>
                    <Input
                      type="number"
                      value={newAgent.retryAttempts}
                      onChange={(e) => setNewAgent({...newAgent, retryAttempts: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Integration Preferences</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auto-scoring" />
                        <Label htmlFor="auto-scoring" className="text-sm">Auto-update lead scoring</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auto-scheduling" />
                        <Label htmlFor="auto-scheduling" className="text-sm">Auto-schedule follow-ups</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="crm-sync" />
                        <Label htmlFor="crm-sync" className="text-sm">Sync with external CRM</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => playVoiceSample(newAgent.voice)}>
              <Play className="w-4 h-4 mr-1" />
              Preview Agent
            </Button>
            <Button variant="outline" onClick={() => setShowAddAgentModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgent}>
              {editingAgent ? "Update Agent" : "Create Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
