import { useState } from 'react';
import { MoreHorizontal, Globe, MapPin, Building2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Competitor, useDeleteCompetitor } from '@/hooks/useCompetitors';

interface CompetitorCardProps {
  competitor: Competitor;
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const deleteCompetitor = useDeleteCompetitor();

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this competitor?')) {
      deleteCompetitor.mutate(competitor.id);
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={competitor.logo_url} alt={competitor.name} />
              <AvatarFallback>
                {competitor.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{competitor.name}</h3>
              {competitor.website_url && (
                <a
                  href={competitor.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center"
                >
                  <Globe className="mr-1 h-3 w-3" />
                  Website
                </a>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {competitor.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {competitor.description}
          </p>
        )}
        
        <div className="space-y-2">
          {competitor.industry && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Building2 className="mr-1 h-3 w-3" />
              {competitor.industry}
            </div>
          )}
          
          {competitor.location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              {competitor.location}
            </div>
          )}
          
          {competitor.company_size && (
            <Badge variant="secondary" className="text-xs">
              {competitor.company_size}
            </Badge>
          )}
        </div>

        {competitor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {competitor.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {competitor.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{competitor.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}