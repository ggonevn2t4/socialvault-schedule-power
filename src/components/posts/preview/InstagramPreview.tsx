import React from 'react';
import { PostPreviewProps } from '@/types/post';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InstagramPreview({ postData, platform, className }: PostPreviewProps) {
  const formatContent = (text: string) => {
    const parts = text.split(/(@\w+|#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-900 font-medium cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-blue-900 cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const hasMedia = postData.media && postData.media.length > 0;
  const mediaUrl = hasMedia ? postData.media[0].url : null;

  return (
    <div className={cn("bg-white border rounded-lg shadow-sm max-w-md mx-auto", className)}>
      {/* Post Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                YB
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">yourbrand</span>
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Sponsored</span>
          </div>
        </div>
        <button className="p-1">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Post Image/Video */}
      <div className="aspect-square bg-gray-100 relative">
        {hasMedia ? (
          postData.media[0].type === 'image' ? (
            <img 
              src={mediaUrl!} 
              alt="Post content"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center relative">
              <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                REEL
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                0:30
              </div>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                📷
              </div>
              <p className="text-sm">Add a photo or video</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button className="hover:text-gray-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:text-gray-500 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:text-gray-500 transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:text-gray-500 transition-colors">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm">142 likes</span>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">yourbrand</span>
          <span className="whitespace-pre-wrap">
            {formatContent(postData.content || "Add your caption here...")}
          </span>
        </div>

        {/* View Comments */}
        <button className="text-gray-500 text-sm mt-2 block">
          View all 24 comments
        </button>

        {/* Add Comment */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
            <input 
              type="text" 
              placeholder="Add a comment..."
              className="flex-1 text-sm text-gray-500 bg-transparent outline-none"
              readOnly
            />
          </div>
        </div>

        {/* Timestamp */}
        <div className="mt-2">
          <span className="text-xs text-gray-400 uppercase">2 hours ago</span>
        </div>
      </div>
    </div>
  );
}