import React from 'react';
import { PostPreviewProps } from '@/types/post';
import { extractHashtags, extractMentions, formatTimestamp } from '@/utils/postFormatting';
import { ThumbsUp, MessageCircle, Share2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FacebookPreview({ postData, platform, className }: PostPreviewProps) {
  const formatContent = (text: string) => {
    // Split text and format hashtags and mentions
    const parts = text.split(/(@\w+|#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-600 hover:underline cursor-pointer font-medium">
            {part}
          </span>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-blue-600 hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={cn("bg-white border rounded-lg shadow-sm font-['Segoe_UI']", className)}>
      {/* Post Header */}
      <div className="p-4 border-b">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            YB
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 hover:underline cursor-pointer">
                Your Brand
              </span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="text-gray-500 text-sm hover:underline cursor-pointer">
                {formatTimestamp()}
              </span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="text-gray-500 text-sm">🌐</span>
            </div>
            <span className="text-gray-500 text-sm">Page</span>
          </div>
          <button className="text-gray-500 hover:bg-gray-100 p-1 rounded">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {postData.title && (
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">
            {postData.title}
          </h3>
        )}
        <div className="text-gray-900 whitespace-pre-wrap leading-5 text-sm">
          {formatContent(postData.content || "Your post content will appear here...")}
        </div>
      </div>

      {/* Media Preview */}
      {postData.media && postData.media.length > 0 && (
        <div className="border-t border-b">
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
                0:30
              </div>
            </div>
          )}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <ThumbsUp className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">❤️</span>
              </div>
            </div>
            <span className="ml-1">24 others</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">8 comments</span>
            <span className="hover:underline cursor-pointer">3 shares</span>
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
            <Share2 className="w-5 h-5" />
            <span className="font-medium text-sm">Share</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 flex-1 justify-center">
            <Send className="w-5 h-5" />
            <span className="font-medium text-sm">Send</span>
          </button>
        </div>
      </div>

      {/* Comment Section Preview */}
      <div className="px-4 pb-4 border-t bg-gray-50">
        <div className="flex items-start gap-2 pt-3">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <div className="flex-1 bg-gray-200 rounded-full px-3 py-2">
            <span className="text-gray-500 text-sm">Write a comment...</span>
          </div>
        </div>
      </div>
    </div>
  );
}