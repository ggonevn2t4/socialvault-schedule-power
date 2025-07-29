import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  subtitle?: string;
  sparklineData: Array<{ value: number }>;
  className?: string;
}

const trendIcons = {
  increase: TrendingUp,
  decrease: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  increase: "text-success",
  decrease: "text-destructive", 
  neutral: "text-muted-foreground",
};

const trendBgColors = {
  increase: "bg-success/10",
  decrease: "bg-destructive/10",
  neutral: "bg-muted/10",
};

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  subtitle, 
  sparklineData,
  className = "" 
}: StatCardProps) {
  const TrendIcon = trendIcons[changeType];
  const changeText = change > 0 ? `+${change}%` : `${change}%`;

  return (
    <Card className={`card-premium hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`${trendBgColors[changeType]} ${trendColors[changeType]} border-0`}
          >
            <TrendIcon className="h-3 w-3 mr-1" />
            {changeText}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-foreground">
              {value}
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Sparkline Chart */}
          <div className="w-20 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={changeType === "increase" ? "hsl(var(--success))" : 
                         changeType === "decrease" ? "hsl(var(--destructive))" : 
                         "hsl(var(--muted-foreground))"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}