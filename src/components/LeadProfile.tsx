
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Phone, 
  Calendar, 
  Edit, 
  Plus,
  TrendingUp,
  Clock,
  FileText,
  Save,
  X,
  Bot,
  Loader2
} from "lucide-react";
import { useLeads, type Lead } from "@/hooks/useLeads";
import { useCalls } from "@/hooks/useCalls";
import { useNotes, useCreateNote } from "@/hooks/useNotes";

interface LeadProfileProps {
  leadId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LeadProfile = ({ leadId, open, onOpenChange }: LeadProfileProps) => {
  const { data: leads } = useLeads();
  const { data: calls } = useCalls();
  const { data: notes } = useNotes(leadId);
  const createNote = useCreateNote();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showManualCallModal, setShowManualCallModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAICallModal, setShowAICallModal] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [noteFilter, setNoteFilter] = useState("all");
  const [newNote, setNewNote] = useState("");

  const lead = leads?.find(l => l.id === leadId);
  const leadCalls = calls?.filter(call => call.lead_id === leadId) || [];

  if (!lead) {
    return null;
  }

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving lead:", lead);
  };

  const handleAICall = async () => {
    setIsCalling(true);
    setShowAICallModal(false);
    setTimeout(() => {
      setIsCalling(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualified": return "bg-green-100 text-green-800";
      case "contacted": return "bg-blue-100 text-blue-800";
      case "new": return "bg-gray-100 text-gray-800";
      case "appointment": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const addNote = async () => {
    if (newNote.trim()) {
      try {
        await createNote.mutateAsync({
          lead_id: leadId,
          content: newNote,
          note_type: 'general'
        });
        setNewNote("");
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const filteredNotes = notes?.filter(note => {
    if (noteFilter === "all") return true;
    if (noteFilter === "ai") return note.author_type === "ai";
    if (noteFilter === "manual") return note.author_type === "agent";
    return true;
  }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="text-lg">
                  {lead.first_name[0]}{lead.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{lead.first_name} {lead.last_name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(lead.status)} variant="secondary">
                    {lead.status}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Score: <span className={getScoreColor(lead.lead_score)}>{lead.lead_score}/100</span>
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-1" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button
                onClick={() => setShowAICallModal(true)}
                disabled={isCalling}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Bot className="w-4 h-4 mr-1" />
                {isCalling ? "Calling..." : "AI Call Now"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(true)}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-[calc(90vh-120px)] overflow-hidden">
          {/* Left Panel - Lead Information */}
          <div className="w-2/5 p-6 border-r overflow-y-auto">
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="text-sm mt-1">{lead.first_name} {lead.last_name}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm mt-1">{lead.phone}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm mt-1">{lead.email}</p>
                    </div>
                    <div>
                      <Label>Lead Source</Label>
                      <Badge variant="secondary" className="ml-0 mt-1">
                        {lead.lead_source}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Preferences */}
              {lead.lead_preferences && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Property Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lead.lead_preferences.budget_min && lead.lead_preferences.budget_max && (
                      <div>
                        <Label>Budget Range</Label>
                        <p className="text-sm mt-1">
                          ${lead.lead_preferences.budget_min.toLocaleString()} - ${lead.lead_preferences.budget_max.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {lead.lead_preferences.preferred_areas && lead.lead_preferences.preferred_areas.length > 0 && (
                      <div>
                        <Label>Preferred Areas</Label>
                        <div className="flex gap-2 mt-1">
                          {lead.lead_preferences.preferred_areas.map((area) => (
                            <Badge key={area} variant="outline">{area}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      {lead.lead_preferences.property_types && lead.lead_preferences.property_types.length > 0 && (
                        <div>
                          <Label>Property Type</Label>
                          <p className="text-sm mt-1">{lead.lead_preferences.property_types[0]}</p>
                        </div>
                      )}
                      {lead.lead_preferences.bedrooms_min && (
                        <div>
                          <Label>Bedrooms</Label>
                          <p className="text-sm mt-1">{lead.lead_preferences.bedrooms_min}+</p>
                        </div>
                      )}
                      {lead.lead_preferences.bathrooms_min && (
                        <div>
                          <Label>Bathrooms</Label>
                          <p className="text-sm mt-1">{lead.lead_preferences.bathrooms_min}+</p>
                        </div>
                      )}
                    </div>
                    
                    {lead.lead_preferences.move_timeline && (
                      <div>
                        <Label>Move Timeline</Label>
                        <p className="text-sm mt-1">{formatDate(lead.lead_preferences.move_timeline)}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Qualification Data */}
              {lead.lead_qualification && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Qualification Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Pre-approval Status</Label>
                      <Badge className={
                        lead.lead_qualification.pre_approval_status === 'yes' ? "bg-green-100 text-green-800" : 
                        lead.lead_qualification.pre_approval_status === 'no' ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }>
                        {lead.lead_qualification.pre_approval_status || 'Unknown'}
                      </Badge>
                    </div>
                    
                    {lead.lead_qualification.current_situation && (
                      <div>
                        <Label>Current Situation</Label>
                        <p className="text-sm mt-1">{lead.lead_qualification.current_situation}</p>
                      </div>
                    )}
                    
                    {lead.lead_qualification.family_size && (
                      <div>
                        <Label>Family Size</Label>
                        <p className="text-sm mt-1">{lead.lead_qualification.family_size} people</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Panel - Call History */}
          <div className="w-3/5 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Call History & Notes</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotesModal(true)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Notes ({notes?.length || 0})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualCallModal(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Call
                </Button>
              </div>
            </div>

            {/* Call History Timeline */}
            <div className="space-y-4 mb-8">
              {leadCalls.length > 0 ? (
                leadCalls.map((call) => (
                  <Card key={call.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{call.call_type.replace('_', ' ')}</Badge>
                            {call.lead_score_change && call.lead_score_change > 0 && (
                              <Badge className="bg-green-100 text-green-800">
                                +{call.lead_score_change} points
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{formatDateTime(call.created_at)}</p>
                          {call.call_objective && (
                            <p className="text-xs text-gray-500">Objective: {call.call_objective}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {call.duration_seconds && (
                            <p className="text-sm font-medium">
                              {Math.floor(call.duration_seconds / 60)}:{(call.duration_seconds % 60).toString().padStart(2, '0')}
                            </p>
                          )}
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            {call.call_status}
                          </Badge>
                        </div>
                      </div>
                      
                      {call.call_summary && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-gray-700">{call.call_summary}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {call.recording_url && (
                          <Button variant="outline" size="sm">
                            <Phone className="w-3 h-3 mr-1" />
                            Listen Recording
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No call history yet</p>
                </div>
              )}
            </div>

            {/* Recent Notes */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Recent Notes</h4>
              {notes && notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.slice(0, 3).map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={note.author_type === "ai" ? "secondary" : "outline"}>
                            {note.author_type}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDateTime(note.created_at)}</span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {notes.length > 3 && (
                    <Button variant="outline" size="sm" onClick={() => setShowNotesModal(true)}>
                      View All Notes ({notes.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No notes yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes Management Modal */}
        <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Lead Notes - {lead.first_name} {lead.last_name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col h-[60vh]">
              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={noteFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNoteFilter("all")}
                >
                  All Notes
                </Button>
                <Button 
                  variant={noteFilter === "ai" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNoteFilter("ai")}
                >
                  AI Notes
                </Button>
                <Button 
                  variant={noteFilter === "manual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNoteFilter("manual")}
                >
                  Agent Notes
                </Button>
              </div>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {filteredNotes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={note.author_type === "ai" ? "secondary" : "outline"}>
                            {note.author_type}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDateTime(note.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add Note Section */}
              <div className="border-t pt-4">
                <Label>Add New Note</Label>
                <Textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note here..."
                  className="mt-1 mb-2"
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{newNote.length}/500</span>
                  <Button 
                    onClick={addNote} 
                    disabled={!newNote.trim() || createNote.isPending}
                  >
                    {createNote.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Call Modal */}
        <Dialog open={showAICallModal} onOpenChange={setShowAICallModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Initiate AI Call - {lead.first_name} {lead.last_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Lead Context Summary</h4>
                <p className="text-sm text-gray-700">
                  {lead.status} lead from {lead.lead_source}. Current score: {lead.lead_score}/100.
                </p>
              </div>
              <div>
                <Label>Call Objective</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Follow-up on property interest</option>
                  <option>Budget qualification</option>
                  <option>Schedule property viewing</option>
                  <option>Check mortgage pre-approval status</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAICallModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAICall} className="bg-blue-600 hover:bg-blue-700">
                <Bot className="w-4 h-4 mr-1" />
                Start AI Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
