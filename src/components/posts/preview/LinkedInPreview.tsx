import React from 'react';
import { PostPreviewProps } from '@/types/post';
import { ThumbsUp, MessageCircle, Repeat2, Send, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LinkedInPreview({ postData, platform, className }: PostPreviewProps) {
  const formatContent = (text: string) => {
    const parts = text.split(/(@\w+|#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-700 hover:underline cursor-pointer font-medium">
            {part}
          </span>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-blue-700 hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={cn("bg-white border rounded-lg shadow-sm", className)}>
      {/* Post Header */}
      <div className="p-4 border-b">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-semibold text-lg">
            YB
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 hover:underline cursor-pointer">
                Your Brand
              </span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="text-gray-500 text-sm">Company Page</span>
            </div>
            <div className="text-sm text-gray-500">
              10,425 followers
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <span>2h</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>🌐</span>
            </div>
          </div>
          <button className="text-gray-500 hover:bg-gray-100 p-1 rounded">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <div className="text-gray-900 whitespace-pre-wrap leading-6 text-sm mb-3">
          {formatContent(postData.content || "Share your professional insights here...")}
        </div>

        {/* Link Preview (if URL detected) */}
        {postData.content && postData.content.includes('http') && (
          <div className="border rounded-lg overflow-hidden mt-3">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                  🔗
                </div>
                <p className="text-xs">Link preview</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50">
              <h4 className="font-medium text-sm text-gray-900 mb-1">
                Article Title
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                A brief description of the linked content will appear here...
              </p>
              <span className="text-xs text-gray-500">example.com</span>
            </div>
          </div>
        )}

        {/* Media Preview */}
        {postData.media && postData.media.length > 0 && (
          <div className="mt-3 border rounded-lg overflow-hidden">
            {postData.media[0].type === 'image' && (
              <img 
                src={postData.media[0].url} 
                alt="Post media"
                className="w-full h-64 object-cover"
              />
            )}
            {postData.media[0].type === 'video' && (
              <div className="w-full h-64 bg-black flex items-center justify-center relative">
                <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  2:15
                </div>
              </div>
            )}
            {postData.media[0].type === 'document' && (
              <div className="p-4 bg-gray-50 flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center text-white font-bold">
                  PDF
                </div>
                <div>
                  <p className="font-medium text-sm">{postData.media[0].name}</p>
                  <p className="text-xs text-gray-500">
                    {(postData.media[0].size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-t border-b bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <ThumbsUp className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👏</span>
              </div>
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">❤️</span>
              </div>
            </div>
            <span className="ml-1">Sarah Johnson and 47 others</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">12 comments</span>
            <span className="hover:underline cursor-pointer">5 reposts</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-2">
        <div className="flex items-center justify-around">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 flex-1 justify-center">
            <ThumbsUp className="w-5 h-5" />
            <span className="font-medium text-sm">Like</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 flex-1 justify-center">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Comment</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 flex-1 justify-center">
            <Repeat2 className="w-5 h-5" />
            <span className="font-medium text-sm">Repost</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 flex-1 justify-center">
            <Send className="w-5 h-5" />
            <span className="font-medium text-sm">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}