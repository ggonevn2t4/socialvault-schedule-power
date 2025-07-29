import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Palette, Upload, Plus, Trash2, Settings, FileText, Calendar, Bot } from "lucide-react";
import { useBrandGuidelines } from "@/hooks/useBrandGuidelines";
import { useAutomationSettings } from "@/hooks/useAutomationSettings";
import { useContentTemplates } from "@/hooks/useContentTemplates";
import { useToast } from "@/hooks/use-toast";

export default function BrandGuidelines() {
  const { guidelines, loading: guidelinesLoading, createGuidelines, updateGuidelines, uploadLogo } = useBrandGuidelines();
  const { settings, loading: settingsLoading, createSettings, updateSettings } = useAutomationSettings();
  const { templates, loading: templatesLoading, createTemplate, updateTemplate, deleteTemplate } = useContentTemplates();
  const { toast } = useToast();

  const [brandForm, setBrandForm] = useState({
    brand_name: "",
    primary_color: "#000000",
    secondary_color: "#ffffff",
    accent_color: "#0066cc",
    primary_font: "Inter",
    secondary_font: "Inter",
    brand_voice: "",
    tone_of_voice: "professional",
  });

  const [automationForm, setAutomationForm] = useState({
    auto_post_enabled: false,
    content_approval_required: true,
    auto_hashtag_enabled: false,
    auto_cross_post: false,
  });

  const [templateForm, setTemplateForm] = useState({
    name: "",
    template_type: "post",
    content_template: "",
    platforms: [] as string[],
    hashtags: [] as string[],
    is_public: false,
  });

  const [newHashtag, setNewHashtag] = useState("");
  const [newPlatform, setNewPlatform] = useState("");

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (guidelines) {
        await updateGuidelines(brandForm);
      } else {
        await createGuidelines(brandForm);
      }
    } catch (error) {
      console.error('Error saving brand guidelines:', error);
    }
  };

  const handleAutomationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (settings) {
        await updateSettings(automationForm);
      } else {
        await createSettings(automationForm);
      }
    } catch (error) {
      console.error('Error saving automation settings:', error);
    }
  };

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTemplate(templateForm);
      setTemplateForm({
        name: "",
        template_type: "post",
        content_template: "",
        platforms: [],
        hashtags: [],
        is_public: false,
      });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const logoUrl = await uploadLogo(file);
      if (guidelines) {
        await updateGuidelines({ logo_url: logoUrl });
      } else {
        setBrandForm(prev => ({ ...prev, logo_url: logoUrl }));
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  const addHashtag = () => {
    if (newHashtag && !templateForm.hashtags.includes(newHashtag)) {
      setTemplateForm(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, newHashtag]
      }));
      setNewHashtag("");
    }
  };

  const removeHashtag = (hashtag: string) => {
    setTemplateForm(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const addPlatform = () => {
    if (newPlatform && !templateForm.platforms.includes(newPlatform)) {
      setTemplateForm(prev => ({
        ...prev,
        platforms: [...prev.platforms, newPlatform]
      }));
      setNewPlatform("");
    }
  };

  const removePlatform = (platform: string) => {
    setTemplateForm(prev => ({
      ...prev,
      platforms: prev.platforms.filter(p => p !== platform)
    }));
  };

  // Initialize forms with existing data
  useEffect(() => {
    if (guidelines) {
      setBrandForm({
        brand_name: guidelines.brand_name,
        primary_color: guidelines.primary_color || "#000000",
        secondary_color: guidelines.secondary_color || "#ffffff",
        accent_color: guidelines.accent_color || "#0066cc",
        primary_font: guidelines.primary_font || "Inter",
        secondary_font: guidelines.secondary_font || "Inter",
        brand_voice: guidelines.brand_voice || "",
        tone_of_voice: guidelines.tone_of_voice,
      });
    }
  }, [guidelines]);

  useEffect(() => {
    if (settings) {
      setAutomationForm({
        auto_post_enabled: settings.auto_post_enabled,
        content_approval_required: settings.content_approval_required,
        auto_hashtag_enabled: settings.auto_hashtag_enabled,
        auto_cross_post: settings.auto_cross_post,
      });
    }
  }, [settings]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brand Guidelines & Automation</h1>
            <p className="text-muted-foreground">
              Manage your brand identity and automate your content workflow
            </p>
          </div>
        </div>

        <Tabs defaultValue="brand" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="brand">
              <Palette className="h-4 w-4 mr-2" />
              Brand Identity
            </TabsTrigger>
            <TabsTrigger value="automation">
              <Bot className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="scheduling">
              <Calendar className="h-4 w-4 mr-2" />
              Scheduling
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brand" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Identity</CardTitle>
                <CardDescription>
                  Define your brand's visual identity and voice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBrandSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="brand_name">Brand Name</Label>
                        <Input
                          id="brand_name"
                          value={brandForm.brand_name}
                          onChange={(e) => setBrandForm(prev => ({ ...prev, brand_name: e.target.value }))}
                          placeholder="Enter your brand name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand_voice">Brand Voice</Label>
                        <Textarea
                          id="brand_voice"
                          value={brandForm.brand_voice}
                          onChange={(e) => setBrandForm(prev => ({ ...prev, brand_voice: e.target.value }))}
                          placeholder="Describe your brand's personality and voice..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="tone_of_voice">Tone of Voice</Label>
                        <Select
                          value={brandForm.tone_of_voice}
                          onValueChange={(value) => setBrandForm(prev => ({ ...prev, tone_of_voice: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="playful">Playful</SelectItem>
                            <SelectItem value="authoritative">Authoritative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Brand Colors</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div>
                            <Label htmlFor="primary_color" className="text-sm">Primary</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="primary_color"
                                type="color"
                                value={brandForm.primary_color}
                                onChange={(e) => setBrandForm(prev => ({ ...prev, primary_color: e.target.value }))}
                                className="w-12 h-10 p-1 rounded"
                              />
                              <Input
                                value={brandForm.primary_color}
                                onChange={(e) => setBrandForm(prev => ({ ...prev, primary_color: e.target.value }))}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="secondary_color" className="text-sm">Secondary</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="secondary_color"
                                type="color"
                                value={brandForm.secondary_color}
                                onChange={(e) => setBrandForm(prev => ({ ...prev, secondary_color: e.target.value }))}
                                className="w-12 h-10 p-1 rounded"
                              />
                              <Input
                                value={brandForm.secondary_color}
                                onChange={(e) => setBrandForm(prev => ({ ...prev, secondary_color: e.target.value }))}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="accent_color" className="text-sm">Accent</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="accent_color"
                                type="color"
                                value={brandForm.accent_color}
                                onChange={(e) => setBrandForm(prev => ({ ...prev, accent_color: e.target.value }))}
                                className="w-12 h-10 p-1 rounded"
                              />
                              <Input
                                value={brandForm.accent_color}
                                onChange={(e) => setBrandForm(prev => ({ ...prev, accent_color: e.target.value }))}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Typography</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="primary_font" className="text-sm">Primary Font</Label>
                            <Select
                              value={brandForm.primary_font}
                              onValueChange={(value) => setBrandForm(prev => ({ ...prev, primary_font: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                                <SelectItem value="Open Sans">Open Sans</SelectItem>
                                <SelectItem value="Lato">Lato</SelectItem>
                                <SelectItem value="Montserrat">Montserrat</SelectItem>
                                <SelectItem value="Poppins">Poppins</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="secondary_font" className="text-sm">Secondary Font</Label>
                            <Select
                              value={brandForm.secondary_font}
                              onValueChange={(value) => setBrandForm(prev => ({ ...prev, secondary_font: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                                <SelectItem value="Open Sans">Open Sans</SelectItem>
                                <SelectItem value="Lato">Lato</SelectItem>
                                <SelectItem value="Montserrat">Montserrat</SelectItem>
                                <SelectItem value="Poppins">Poppins</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="logo_upload">Brand Logo</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          {guidelines?.logo_url && (
                            <img 
                              src={guidelines.logo_url} 
                              alt="Brand logo" 
                              className="w-16 h-16 object-contain border rounded"
                            />
                          )}
                          <div className="flex-1">
                            <Input
                              id="logo_upload"
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={guidelinesLoading}>
                    <Settings className="h-4 w-4 mr-2" />
                    {guidelines ? 'Update Brand Guidelines' : 'Create Brand Guidelines'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Settings</CardTitle>
                <CardDescription>
                  Configure automated workflows and content management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAutomationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-posting</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically publish approved content according to schedule
                        </p>
                      </div>
                      <Switch
                        checked={automationForm.auto_post_enabled}
                        onCheckedChange={(checked) => 
                          setAutomationForm(prev => ({ ...prev, auto_post_enabled: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Content Approval Required</Label>
                        <p className="text-sm text-muted-foreground">
                          Require approval before content can be published
                        </p>
                      </div>
                      <Switch
                        checked={automationForm.content_approval_required}
                        onCheckedChange={(checked) => 
                          setAutomationForm(prev => ({ ...prev, content_approval_required: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-hashtags</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically suggest relevant hashtags for content
                        </p>
                      </div>
                      <Switch
                        checked={automationForm.auto_hashtag_enabled}
                        onCheckedChange={(checked) => 
                          setAutomationForm(prev => ({ ...prev, auto_hashtag_enabled: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Cross-posting</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically post content to multiple platforms
                        </p>
                      </div>
                      <Switch
                        checked={automationForm.auto_cross_post}
                        onCheckedChange={(checked) => 
                          setAutomationForm(prev => ({ ...prev, auto_cross_post: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={settingsLoading}>
                    <Settings className="h-4 w-4 mr-2" />
                    {settings ? 'Update Automation Settings' : 'Create Automation Settings'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Template</CardTitle>
                  <CardDescription>
                    Create reusable content templates for your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTemplateSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="template_name">Template Name</Label>
                      <Input
                        id="template_name"
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Weekly Update Post"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="template_type">Template Type</Label>
                      <Select
                        value={templateForm.template_type}
                        onValueChange={(value) => setTemplateForm(prev => ({ ...prev, template_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post">Social Media Post</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="reel">Reel/Video</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="content_template">Content Template</Label>
                      <Textarea
                        id="content_template"
                        value={templateForm.content_template}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, content_template: e.target.value }))}
                        placeholder="Write your template content here... Use {{variable}} for dynamic content"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label>Platforms</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newPlatform}
                          onChange={(e) => setNewPlatform(e.target.value)}
                          placeholder="Add platform"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPlatform())}
                        />
                        <Button type="button" onClick={addPlatform} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {templateForm.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="cursor-pointer">
                            {platform}
                            <button
                              type="button"
                              onClick={() => removePlatform(platform)}
                              className="ml-2 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Hashtags</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newHashtag}
                          onChange={(e) => setNewHashtag(e.target.value)}
                          placeholder="#hashtag"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                        />
                        <Button type="button" onClick={addHashtag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {templateForm.hashtags.map((hashtag) => (
                          <Badge key={hashtag} variant="outline" className="cursor-pointer">
                            {hashtag}
                            <button
                              type="button"
                              onClick={() => removeHashtag(hashtag)}
                              className="ml-2 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_public"
                        checked={templateForm.is_public}
                        onCheckedChange={(checked) => 
                          setTemplateForm(prev => ({ ...prev, is_public: checked }))
                        }
                      />
                      <Label htmlFor="is_public">Make template public</Label>
                    </div>

                    <Button type="submit" disabled={templatesLoading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Templates</CardTitle>
                  <CardDescription>
                    Manage your existing content templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {templatesLoading ? (
                      <div className="text-center py-4">Loading templates...</div>
                    ) : templates.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No templates created yet
                      </div>
                    ) : (
                      templates.map((template) => (
                        <div key={template.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{template.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{template.template_type}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {template.content_template}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Used {template.usage_count} times</span>
                            {template.is_public && <Badge variant="secondary">Public</Badge>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Posting Schedule</CardTitle>
                <CardDescription>
                  Configure when your content should be automatically published
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Scheduling feature coming soon!</p>
                  <p className="text-sm">Set up automated posting schedules for different platforms.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}