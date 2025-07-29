import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  Smile,
  MessageSquare,
  Users,
  Phone,
  Video
} from 'lucide-react';
import { useTeamPresence } from '@/hooks/useTeamPresence';
import { formatDistanceToNow } from 'date-fns';

// Mock chat messages
const mockMessages = [
  {
    id: '1',
    user: { name: 'Sarah Johnson', avatar: '' },
    message: 'Hey team! The summer campaign assets are ready for review. @Michael can you check the video edit?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
    mentions: ['Michael Chen']
  },
  {
    id: '2',
    user: { name: 'Michael Chen', avatar: '' },
    message: 'On it! Will have feedback by EOD.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 min ago
    mentions: []
  },
  {
    id: '3',
    user: { name: 'Emma Wilson', avatar: '' },
    message: 'Great work everyone! The client feedback has been fantastic 🎉',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    mentions: []
  },
  {
    id: '4',
    user: { name: 'James Rodriguez', avatar: '' },
    message: 'Analytics report is almost done. Should I wait for the video review before finalizing?',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    mentions: []
  }
];

const onlineMembers = [
  { name: 'Sarah Johnson', avatar: '', status: 'online' },
  { name: 'Michael Chen', avatar: '', status: 'away' },
  { name: 'Emma Wilson', avatar: '', status: 'online' }
];

interface QuickTeamChatProps {
  teamId?: string;
}

export function QuickTeamChat({ teamId }: QuickTeamChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const { presences, onlineCount, getOnlineMembers } = useTeamPresence(teamId);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="card-premium flex flex-col h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Team Chat
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {onlineCount} online
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Online Members */}
        <div className="flex items-center gap-2 pb-2 border-b">
          <span className="text-sm text-muted-foreground">Online:</span>
          <div className="flex items-center gap-2">
            {getOnlineMembers().slice(0, 4).map((member) => (
              <div key={member.user_id} className="relative">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.avatar_url} alt={member.display_name || member.username} />
                  <AvatarFallback className="text-xs">
                    {(member.display_name || member.username || 'U').split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${
                  member.status === 'online' ? 'bg-success' : 
                  member.status === 'away' ? 'bg-warning' : 'bg-muted'
                }`} />
              </div>
            ))}
            {getOnlineMembers().length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{getOnlineMembers().length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {mockMessages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.user.avatar} alt={message.user.name} />
                  <AvatarFallback className="text-xs">
                    {message.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {message.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {message.message}
                  </p>
                  
                  {message.mentions.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {message.mentions.map((mention) => (
                        <Badge key={mention} variant="outline" className="text-xs">
                          @{mention}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message... @mention teammates"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Paperclip className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Smile className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}