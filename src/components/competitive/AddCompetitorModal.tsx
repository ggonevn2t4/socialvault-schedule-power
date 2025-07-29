import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateCompetitor } from '@/hooks/useCompetitors';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  website_url: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  location: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddCompetitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId?: string;
}

export function AddCompetitorModal({ open, onOpenChange, teamId }: AddCompetitorModalProps) {
  const { user } = useAuth();
  const createCompetitor = useCreateCompetitor();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      website_url: '',
      description: '',
      industry: '',
      company_size: '',
      location: '',
      logo_url: '',
      tags: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!teamId || !user) return;

    const competitor = {
      name: data.name,
      website_url: data.website_url,
      description: data.description,
      industry: data.industry,
      company_size: data.company_size,
      location: data.location,
      logo_url: data.logo_url,
      team_id: teamId,
      created_by: user.id,
      social_handles: {},
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      is_active: true,
    };

    createCompetitor.mutate(competitor, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  const companySizes = [
    'Startup (1-10)',
    'Small (11-50)',
    'Medium (51-200)',
    'Large (201-1000)',
    'Enterprise (1000+)',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Competitor</DialogTitle>
          <DialogDescription>
            Add a new competitor to track and analyze their market presence.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the company and what they do..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SaaS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., direct competitor, enterprise, B2B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCompetitor.isPending}>
                {createCompetitor.isPending ? 'Adding...' : 'Add Competitor'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}