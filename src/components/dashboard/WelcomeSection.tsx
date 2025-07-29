import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Sun, 
  Cloud, 
  CloudRain,
  Thermometer 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Mock weather data - in real app, you'd fetch from weather API
const weatherData = {
  location: "Hà Nội, Việt Nam",
  temperature: 28,
  condition: "sunny", // sunny, cloudy, rainy
  description: "Nắng đẹp",
  humidity: 65,
  feelsLike: 32
};

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
};

export function WelcomeSection() {
  const { user } = useAuth();
  const currentDate = new Date();
  const timeOfDay = currentDate.getHours() < 12 ? "sáng" : 
                   currentDate.getHours() < 18 ? "chiều" : "tối";
  
  const displayName = user?.user_metadata?.display_name || 'Bạn';
  const WeatherIcon = weatherIcons[weatherData.condition as keyof typeof weatherIcons];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="card-premium bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-primary/20">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Welcome Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
              <AvatarFallback className="bg-gradient-primary text-white text-lg font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Chào {timeOfDay}, {displayName}! 👋
              </h1>
              <p className="text-muted-foreground">
                Hôm nay là ngày tuyệt vời để tạo nên những nội dung ấn tượng
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(currentDate)}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatTime(currentDate)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-0 lg:space-y-2 xl:space-y-0 xl:space-x-6">
            <Card className="glass-card p-4 min-w-fit">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-full">
                  <WeatherIcon className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{weatherData.temperature}°C</span>
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {weatherData.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{weatherData.location}</span>
              </div>
            </Card>

            <div className="space-y-2">
              <Button className="btn-premium h-12 px-6 font-medium">
                🚀 Bắt đầu ngày mới
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Cảm ứng như {weatherData.feelsLike}°C • Độ ẩm {weatherData.humidity}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}