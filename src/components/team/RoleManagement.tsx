import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Edit3, 
  Eye, 
  Plus,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

// Mock roles and permissions data
const defaultRoles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all features and settings',
    color: 'bg-destructive/10 text-destructive',
    memberCount: 2,
    permissions: [
      'create_content', 'edit_content', 'delete_content', 'publish_content',
      'view_analytics', 'export_analytics', 'manage_team', 'manage_billing',
      'approve_content', 'manage_workflows'
    ]
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can create and edit content, view analytics',
    color: 'bg-primary/10 text-primary',
    memberCount: 4,
    permissions: [
      'create_content', 'edit_content', 'publish_content',
      'view_analytics', 'approve_content'
    ]
  },
  {
    id: 'content_creator',
    name: 'Content Creator',
    description: 'Can create content and request approvals',
    color: 'bg-success/10 text-success',
    memberCount: 3,
    permissions: [
      'create_content', 'edit_content', 'view_analytics'
    ]
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Can view and export analytics data',
    color: 'bg-warning/10 text-warning',
    memberCount: 2,
    permissions: [
      'view_analytics', 'export_analytics'
    ]
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to content and basic analytics',
    color: 'bg-muted/10 text-muted-foreground',
    memberCount: 1,
    permissions: [
      'view_analytics'
    ]
  }
];

const allPermissions = [
  { id: 'create_content', name: 'Create Content', category: 'Content', description: 'Create new content' },
  { id: 'edit_content', name: 'Edit Content', category: 'Content', description: 'Edit existing content' },
  { id: 'delete_content', name: 'Delete Content', category: 'Content', description: 'Delete content' },
  { id: 'publish_content', name: 'Publish Content', category: 'Content', description: 'Publish content to platforms' },
  { id: 'view_analytics', name: 'View Analytics', category: 'Analytics', description: 'View analytics and reports' },
  { id: 'export_analytics', name: 'Export Analytics', category: 'Analytics', description: 'Export analytics data' },
  { id: 'manage_team', name: 'Manage Team', category: 'Team', description: 'Manage team members and roles' },
  { id: 'manage_billing', name: 'Manage Billing', category: 'Billing', description: 'Access billing and subscription settings' },
  { id: 'approve_content', name: 'Approve Content', category: 'Workflow', description: 'Approve content for publishing' },
  { id: 'manage_workflows', name: 'Manage Workflows', category: 'Workflow', description: 'Create and manage approval workflows' }
];

const permissionCategories = ['Content', 'Analytics', 'Team', 'Billing', 'Workflow'];

export function RoleManagement() {
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCreateRole, setShowCreateRole] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Role Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
          <TabsTrigger value="builder">Role Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Role Overview */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Team Roles</h2>
              <p className="text-muted-foreground">Manage roles and permissions for your team</p>
            </div>
            <Button onClick={() => setShowCreateRole(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultRoles.map((role) => (
              <Card key={role.id} className="card-premium hover:shadow-glow transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={role.color}>
                      {role.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {role.memberCount} members
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {role.description}
                  </p>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Permissions ({role.permissions.length})
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => {
                        const perm = allPermissions.find(p => p.id === permission);
                        return (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {perm?.name}
                          </Badge>
                        );
                      })}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                    {role.id !== 'admin' && (
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {/* Permission Matrix */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-foreground">Permission</th>
                      {defaultRoles.map((role) => (
                        <th key={role.id} className="text-center p-3 font-medium text-foreground">
                          <Badge className={`${role.color} text-xs`}>
                            {role.name}
                          </Badge>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionCategories.map((category) => (
                      <>
                        <tr key={`category-${category}`}>
                          <td colSpan={defaultRoles.length + 1} className="p-3 font-medium text-sm text-muted-foreground bg-muted/30">
                            {category}
                          </td>
                        </tr>
                        {allPermissions
                          .filter(perm => perm.category === category)
                          .map((permission) => (
                            <tr key={permission.id} className="border-b hover:bg-muted/50">
                              <td className="p-3">
                                <div>
                                  <div className="font-medium text-foreground text-sm">
                                    {permission.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </div>
                                </div>
                              </td>
                              {defaultRoles.map((role) => (
                                <td key={`${role.id}-${permission.id}`} className="text-center p-3">
                                  <Checkbox
                                    checked={role.permissions.includes(permission.id)}
                                    disabled={role.id === 'admin'} // Admin always has all permissions
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          {/* Custom Role Builder */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Custom Role Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input id="role-name" placeholder="Enter role name" />
                  </div>
                  
                  <div>
                    <Label htmlFor="role-description">Description</Label>
                    <Input id="role-description" placeholder="Describe this role" />
                  </div>
                  
                  <div>
                    <Label htmlFor="role-template">Start from Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">Editor Template</SelectItem>
                        <SelectItem value="content_creator">Content Creator Template</SelectItem>
                        <SelectItem value="analyst">Analyst Template</SelectItem>
                        <SelectItem value="custom">Start from scratch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
                    {permissionCategories.map((category) => (
                      <div key={category} className="space-y-2 mb-4">
                        <Label className="text-sm font-medium text-muted-foreground">
                          {category}
                        </Label>
                        <div className="space-y-2 ml-4">
                          {allPermissions
                            .filter(perm => perm.category === category)
                            .map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox id={permission.id} />
                                <Label htmlFor={permission.id} className="text-sm">
                                  {permission.name}
                                </Label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button>Create Role</Button>
                <Button variant="outline">Save as Template</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}