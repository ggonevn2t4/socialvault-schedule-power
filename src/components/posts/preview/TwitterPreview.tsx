import React from 'react';
import { PostPreviewProps } from '@/types/post';
import { getCharacterCount } from '@/utils/postFormatting';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TwitterPreview({ postData, platform, className }: PostPreviewProps) {
  const formatContent = (text: string) => {
    const parts = text.split(/(@\w+|#\w+|https?:\/\/[^\s]+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-500 hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-blue-500 hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.match(/https?:\/\/[^\s]+/)) {
        return (
          <span key={index} className="text-blue-500 hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const charData = getCharacterCount(postData.content || '', 'twitter');
  const circleColor = charData.status === 'error' ? 'text-red-500' : 
                     charData.status === 'warning' ? 'text-yellow-500' : 'text-blue-500';

  return (
    <div className={cn("bg-white border rounded-lg shadow-sm p-4", className)}>
      {/* Tweet Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          YB
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-bold text-gray-900 hover:underline cursor-pointer">
              Your Brand
            </span>
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-500">@yourbrand</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-gray-500 text-sm hover:underline cursor-pointer">2h</span>
          </div>

          {/* Tweet Content */}
          <div className="text-gray-900 text-[15px] leading-5 whitespace-pre-wrap mb-3">
            {formatContent(postData.content || "What's happening?")}
          </div>

          {/* Character Count Indicator */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("w-5 h-5 border-2 rounded-full flex items-center justify-center", circleColor)}>
                <div className={cn("w-2 h-2 rounded-full", circleColor.replace('text-', 'bg-'))}></div>
              </div>
              <span className={cn("text-xs", circleColor)}>
                {charData.count}/280
              </span>
            </div>
            {charData.status === 'error' && (
              <span className="text-red-500 text-xs">Character limit exceeded</span>
            )}
          </div>

          {/* Media Preview */}
          {postData.media && postData.media.length > 0 && (
            <div className="mb-3 border rounded-2xl overflow-hidden">
              {postData.media[0].type === 'image' && (
                <img 
                  src={postData.media[0].url} 
                  alt="Tweet media"
                  className="w-full max-h-80 object-cover"
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

          {/* Link Preview Card */}
          {postData.content && postData.content.includes('http') && (
            <div className="mb-3 border rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                    🔗
                  </div>
                  <p className="text-xs">Link preview</p>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  Article Title
                </h4>
                <p className="text-xs text-gray-500 mb-1">
                  A brief description of the linked content...
                </p>
                <span className="text-xs text-gray-400">🔗 example.com</span>
              </div>
            </div>
          )}

          {/* Tweet Actions */}
          <div className="flex items-center justify-between max-w-md mt-3">
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 group">
              <div className="p-2 rounded-full group-hover:bg-blue-50">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">24</span>
            </button>
            
            <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 group">
              <div className="p-2 rounded-full group-hover:bg-green-50">
                <Repeat2 className="w-5 h-5" />
              </div>
              <span className="text-sm">12</span>
            </button>
            
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 group">
              <div className="p-2 rounded-full group-hover:bg-red-50">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-sm">89</span>
            </button>
            
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 group">
              <div className="p-2 rounded-full group-hover:bg-blue-50">
                <Share className="w-5 h-5" />
              </div>
            </button>

            <div className="flex items-center gap-1">
              <button className="text-gray-500 hover:text-blue-500 group">
                <div className="p-2 rounded-full group-hover:bg-blue-50">
                  <Bookmark className="w-5 h-5" />
                </div>
              </button>
              
              <button className="text-gray-500 hover:text-blue-500 group">
                <div className="p-2 rounded-full group-hover:bg-blue-50">
                  <MoreHorizontal className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}