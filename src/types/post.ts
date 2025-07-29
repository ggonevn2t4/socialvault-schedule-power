export interface PostData {
  title?: string;
  content: string;
  media?: MediaFile[];
  platforms: string[];
  scheduledDate?: Date;
  scheduledTime?: string;
}

export interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size: number;
  thumbnail?: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  limit: number;
  enabled: boolean;
}

export interface PostPreviewProps {
  postData: PostData;
  platform: Platform;
  className?: string;
}