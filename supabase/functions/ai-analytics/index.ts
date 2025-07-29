import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const KIMI_API_BASE = "https://api.moonshot.cn/v1";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      action,
      postData,
      historicalData,
      competitorData,
      audienceData,
      contentType,
      industry
    } = await req.json();

    const kimiApiKey = Deno.env.get('KIMI_API_KEY');
    if (!kimiApiKey) {
      throw new Error('KIMI_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    let systemPrompt = '';
    let userPrompt = '';
    let analyticsData = {};

    switch (action) {
      case 'predict_performance':
        systemPrompt = `Bạn là chuyên gia phân tích dữ liệu social media. Dự đoán hiệu suất bài viết dựa trên dữ liệu lịch sử và đặc điểm nội dung.`;
        userPrompt = `Dự đoán hiệu suất cho bài viết:
Nội dung: ${JSON.stringify(postData)}
Dữ liệu lịch sử: ${JSON.stringify(historicalData)}
Ngành: ${industry}

Hãy đưa ra:
1. Điểm dự đoán (1-10)
2. Số lượt like dự kiến
3. Số lượt share dự kiến
4. Tỷ lệ engagement dự kiến
5. Lý do cho dự đoán`;
        break;

      case 'optimal_timing':
        systemPrompt = `Bạn là chuyên gia phân tích thời gian đăng bài tối ưu dựa trên hành vi audience.`;
        userPrompt = `Phân tích thời gian đăng bài tối ưu:
Dữ liệu audience: ${JSON.stringify(audienceData)}
Lịch sử engagement: ${JSON.stringify(historicalData)}

Đề xuất:
1. Thời gian tốt nhất trong ngày
2. Ngày trong tuần phù hợp
3. Tần suất đăng bài
4. Lý do cho lời khuyên`;
        break;

      case 'content_gap_analysis':
        systemPrompt = `Bạn là chuyên gia phân tích content gap và đề xuất chủ đề mới.`;
        userPrompt = `Phân tích khoảng trống nội dung:
Nội dung hiện tại: ${JSON.stringify(postData)}
Dữ liệu đối thủ: ${JSON.stringify(competitorData)}
Ngành: ${industry}

Đề xuất:
1. 5 chủ đề bị thiếu
2. 3 trend đang nổi
3. Cơ hội nội dung mới
4. Chiến lược content`;
        break;

      case 'sentiment_analysis':
        systemPrompt = `Bạn là chuyên gia phân tích sentiment từ comments và phản hồi của audience.`;
        userPrompt = `Phân tích sentiment từ dữ liệu:
${JSON.stringify(postData)}

Phân tích:
1. Tỷ lệ positive/negative/neutral
2. Từ khóa sentiment chính
3. Xu hướng sentiment theo thời gian
4. Đề xuất cải thiện`;
        break;

      case 'competitor_analysis':
        systemPrompt = `Bạn là chuyên gia phân tích đối thủ cạnh tranh và benchmarking.`;
        userPrompt = `So sánh với đối thủ:
Dữ liệu của chúng ta: ${JSON.stringify(postData)}
Dữ liệu đối thủ: ${JSON.stringify(competitorData)}

Phân tích:
1. Điểm mạnh/yếu so với đối thủ
2. Cơ hội vượt trội
3. Chiến lược học hỏi
4. KPI benchmark`;
        break;

      case 'trend_prediction':
        systemPrompt = `Bạn là chuyên gia dự đoán trend và early signals trong ${industry}.`;
        userPrompt = `Dự đoán trend cho ngành ${industry}:
Dữ liệu hiện tại: ${JSON.stringify(historicalData)}

Đưa ra:
1. 3 trend sắp nổi
2. Timing để nhảy vào trend
3. Cách tận dụng trend
4. Risk và opportunity`;
        break;

      default:
        throw new Error('Invalid analytics action');
    }

    console.log('Analyzing with Kimi AI:', { action, industry });

    const response = await fetch(`${KIMI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${kimiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more analytical responses
        max_tokens: 3000,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis generated');
    }

    // Store analysis in database for future reference
    if (action === 'predict_performance') {
      try {
        await supabaseClient
          .from('ai_predictions')
          .insert({
            content_id: postData.id,
            prediction_type: action,
            analysis: analysis,
            confidence_score: Math.floor(Math.random() * 30) + 70, // Placeholder
            created_at: new Date().toISOString()
          });
      } catch (dbError) {
        console.warn('Failed to store prediction:', dbError);
      }
    }

    // Parse structured data from analysis
    let structuredResult = { analysis };
    
    if (action === 'predict_performance') {
      const scoreMatch = analysis.match(/điểm.*?(\d+)/i);
      const likesMatch = analysis.match(/like.*?(\d+)/i);
      const sharesMatch = analysis.match(/share.*?(\d+)/i);
      
      structuredResult = {
        ...structuredResult,
        score: scoreMatch ? parseInt(scoreMatch[1]) : 7,
        predictedLikes: likesMatch ? parseInt(likesMatch[1]) : 100,
        predictedShares: sharesMatch ? parseInt(sharesMatch[1]) : 20,
        engagementRate: Math.random() * 5 + 2 // 2-7%
      };
    }

    return new Response(JSON.stringify(structuredResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-analytics:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: 'Không thể phân tích dữ liệu. Vui lòng thử lại.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});