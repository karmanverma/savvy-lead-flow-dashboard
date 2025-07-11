import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Building, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBusinessConfiguration, useUpdateBusinessConfiguration, useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/useBusinessConfig';
import { useAIAgents } from '@/hooks/useAIAgents';

const BusinessSettings: React.FC = () => {
  const { data: businessConfigs, isLoading: isLoadingConfigs } = useBusinessConfiguration();
  const { data: globalSettings, isLoading: isLoadingSettings } = useGlobalSettings();
  const { data: agents } = useAIAgents();
  const updateBusinessConfig = useUpdateBusinessConfiguration();
  const updateGlobalSetting = useUpdateGlobalSetting();

  const [activeConfig, setActiveConfig] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  React.useEffect(() => {
    if (businessConfigs && businessConfigs.length > 0) {
      const defaultConfig = businessConfigs.find(config => config.is_default) || businessConfigs[0];
      setActiveConfig(defaultConfig);
      setFormData(defaultConfig);
    }
  }, [businessConfigs]);

  const defaultAgentSetting = globalSettings?.find(setting => setting.setting_key === 'default_agent_id');
  const businessHoursSetting = globalSettings?.find(setting => setting.setting_key === 'business_hours');

  const handleSaveBusinessConfig = async () => {
    if (!activeConfig?.id) return;
    
    try {
      await updateBusinessConfig.mutateAsync({
        id: activeConfig.id,
        ...formData
      });
    } catch (error) {
      console.error('Error updating business config:', error);
    }
  };

  const handleUpdateGlobalSetting = async (key: string, value: any) => {
    try {
      await updateGlobalSetting.mutateAsync({
        setting_key: key,
        setting_value: value
      });
    } catch (error) {
      console.error('Error updating global setting:', error);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const addCustomField = () => {
    const newField = {
      name: '',
      type: 'text',
      options: [],
      required: false
    };
    updateFormData('custom_fields', [...(formData.custom_fields || []), newField]);
  };

  const updateCustomField = (index: number, field: string, value: any) => {
    const updatedFields = [...(formData.custom_fields || [])];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    updateFormData('custom_fields', updatedFields);
  };

  const removeCustomField = (index: number) => {
    const updatedFields = formData.custom_fields.filter((_: any, i: number) => i !== index);
    updateFormData('custom_fields', updatedFields);
  };

  if (isLoadingConfigs || isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading business settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Business Settings</h1>
          <p className="text-muted-foreground">Configure your business preferences and AI agents</p>
        </div>
        <Button onClick={handleSaveBusinessConfig} disabled={updateBusinessConfig.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateBusinessConfig.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
          <TabsTrigger value="terminology">Terminology</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Business Information
              </CardTitle>
              <CardDescription>
                Configure your business details and industry settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name || ''}
                    onChange={(e) => updateFormData('business_name', e.target.value)}
                    placeholder="Your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry || ''}
                    onValueChange={(value) => updateFormData('industry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Call Objectives</Label>
                <Textarea
                  value={formData.call_objectives?.join('\n') || ''}
                  onChange={(e) => updateFormData('call_objectives', e.target.value.split('\n').filter(Boolean))}
                  placeholder="Enter call objectives, one per line..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Define the types of calls your agents will make (e.g., Initial Contact, Qualification, Follow-up)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Default AI Agent
              </CardTitle>
              <CardDescription>
                Set the global default agent for new leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Global Default Agent</Label>
                  <Select
                    value={defaultAgentSetting?.setting_value || ''}
                    onValueChange={(value) => handleUpdateGlobalSetting('default_agent_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default AI agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No default agent</SelectItem>
                      {agents?.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          <div className="flex items-center space-x-2">
                            <span>{agent.name}</span>
                            {agent.is_active && <Badge variant="secondary" className="text-xs">Active</Badge>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    This agent will be automatically assigned to new leads unless overridden by campaign settings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Configure when calls can be made
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const dayData = businessHoursSetting?.setting_value?.[day];
                  return (
                    <div key={day} className="flex items-center space-x-2">
                      <Label className="w-20 capitalize">{day}</Label>
                      <Switch
                        checked={!!dayData}
                        onCheckedChange={(checked) => {
                          const newHours = { ...businessHoursSetting?.setting_value };
                          newHours[day] = checked ? { start: '09:00', end: '17:00' } : null;
                          handleUpdateGlobalSetting('business_hours', newHours);
                        }}
                      />
                      {dayData && (
                        <>
                          <Input
                            type="time"
                            value={dayData.start || '09:00'}
                            className="w-24"
                            onChange={(e) => {
                              const newHours = { ...businessHoursSetting?.setting_value };
                              newHours[day] = { ...newHours[day], start: e.target.value };
                              handleUpdateGlobalSetting('business_hours', newHours);
                            }}
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={dayData.end || '17:00'}
                            className="w-24"
                            onChange={(e) => {
                              const newHours = { ...businessHoursSetting?.setting_value };
                              newHours[day] = { ...newHours[day], end: e.target.value };
                              handleUpdateGlobalSetting('business_hours', newHours);
                            }}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Lead Fields</CardTitle>
              <CardDescription>
                Define additional fields to capture lead-specific information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.custom_fields?.map((field: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="space-y-2">
                        <Label>Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateCustomField(index, 'name', e.target.value)}
                          placeholder="Field name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) => updateCustomField(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="boolean">Yes/No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    {field.type === 'select' && (
                      <div className="space-y-2">
                        <Label>Options (comma-separated)</Label>
                        <Input
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => updateCustomField(index, 'options', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => updateCustomField(index, 'required', checked)}
                      />
                      <Label>Required field</Label>
                    </div>
                  </div>
                ))}
                
                <Button onClick={addCustomField} variant="outline">
                  Add Custom Field
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terminology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Terminology</CardTitle>
              <CardDescription>
                Customize terms used throughout the application for your industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.terminology || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key.replace('_', ' ')}</Label>
                    <Input
                      value={value}
                      onChange={(e) => updateFormData('terminology', { ...formData.terminology, [key]: e.target.value })}
                      placeholder={`Custom term for ${key}`}
                    />
                  </div>
                ))}
                
                <div className="space-y-2">
                  <Label>Lead</Label>
                  <Input
                    value={formData.terminology?.lead || 'lead'}
                    onChange={(e) => updateFormData('terminology', { ...formData.terminology, lead: e.target.value })}
                    placeholder="e.g., prospect, client"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Appointment</Label>
                  <Input
                    value={formData.terminology?.appointment || 'appointment'}
                    onChange={(e) => updateFormData('terminology', { ...formData.terminology, appointment: e.target.value })}
                    placeholder="e.g., meeting, consultation"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessSettings;