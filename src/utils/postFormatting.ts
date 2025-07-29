// Utility functions for formatting post content across platforms

export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex) || [];
  return matches.map(tag => tag.slice(1)); // Remove the # symbol
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex) || [];
  return matches.map(mention => mention.slice(1)); // Remove the @ symbol
}

export function extractLinks(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

export function getCharacterCount(text: string, platform: string): { count: number; status: 'safe' | 'warning' | 'error' } {
  const count = text.length;
  const limits = {
    twitter: 280,
    facebook: 63206,
    instagram: 2200,
    linkedin: 3000,
  };
  
  const limit = limits[platform as keyof typeof limits] || 3000;
  const warningThreshold = limit * 0.8;
  
  let status: 'safe' | 'warning' | 'error' = 'safe';
  if (count > limit) status = 'error';
  else if (count > warningThreshold) status = 'warning';
  
  return { count, status };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function formatTimestamp(date: Date = new Date()): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours === 0) return 'now';
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w`;
  
  return date.toLocaleDateString();
}

export function splitIntoLines(text: string, maxLength: number = 80): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length > maxLength && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
  
  return lines;
}