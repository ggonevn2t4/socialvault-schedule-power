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
      contentData,
      audienceData,
      brandVoice,
      scheduleData,
      performanceData,
      teamId
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

    switch (action) {
      case 'smart_scheduling':
        systemPrompt = `Bạn là chuyên gia tối ưu lịch đăng bài dựa trên hành vi audience và performance data.`;
        userPrompt = `Tối ưu lịch đăng cho:
Dữ liệu audience: ${JSON.stringify(audienceData)}
Performance lịch sử: ${JSON.stringify(performanceData)}
Nội dung dự kiến: ${JSON.stringify(contentData)}

Đề xuất:
1. Thời gian tối ưu cho 7 ngày tới
2. Frequency đăng bài
3. Platform priority
4. Peak hours dự đoán
5. Backup timing options`;
        break;

      case 'auto_response':
        systemPrompt = `Bạn là AI assistant đại diện cho brand, trả lời comments với tone và voice phù hợp.
Brand voice: ${brandVoice}
Luôn giữ thái độ chuyên nghiệp, hữu ích và phù hợp với giá trị brand.`;
        userPrompt = `Trả lời comment sau:
"${contentData.comment}"

Ngữ cảnh post: ${contentData.postContext}
Yêu cầu: Ngắn gọn, friendly, professional, tiếng Việt`;
        break;

      case 'content_curation':
        systemPrompt = `Bạn là chuyên gia content curation, đánh giá và lọc nội dung phù hợp với brand.`;
        userPrompt = `Đánh giá relevance của nội dung:
RSS/Content: ${JSON.stringify(contentData)}
Brand guidelines: ${JSON.stringify(brandVoice)}
Target audience: ${JSON.stringify(audienceData)}

Đánh giá:
1. Relevance score (1-10)
2. Brand fit assessment
3. Audience interest prediction
4. Suggested modifications
5. Posting recommendation`;
        break;

      case 'hashtag_research':
        systemPrompt = `Bạn là chuyên gia hashtag research và trend analysis.`;
        userPrompt = `Research hashtag cho:
Nội dung: ${JSON.stringify(contentData)}
Industry trends: ${JSON.stringify(performanceData)}
Audience behavior: ${JSON.stringify(audienceData)}

Đề xuất:
1. 10 hashtag chính trending
2. 5 hashtag niche relevant
3. 3 branded hashtag
4. Rotation strategy
5. Timing recommendations`;
        break;

      case 'platform_optimization':
        systemPrompt = `Bạn là chuyên gia tối ưu nội dung cho từng platform social media.`;
        userPrompt = `Tối ưu nội dung cho platforms:
Nội dung gốc: ${JSON.stringify(contentData)}
Platforms: ${JSON.stringify(contentData.platforms)}

Tối ưu cho mỗi platform:
1. Format adaptation
2. Length optimization
3. Visual requirements
4. Hashtag strategy
5. Call-to-action variation`;
        break;

      case 'performance_optimization':
        systemPrompt = `Bạn là chuyên gia tối ưu performance dựa trên data analytics.`;
        userPrompt = `Tối ưu performance cho:
Current metrics: ${JSON.stringify(performanceData)}
Content history: ${JSON.stringify(contentData)}
Goals: Increase engagement by 20%

Recommendations:
1. Content type adjustments
2. Timing optimizations
3. Format improvements
4. Audience targeting
5. A/B testing suggestions`;
        break;

      case 'workflow_optimization':
        systemPrompt = `Bạn là chuyên gia tối ưu workflow và team productivity.`;
        userPrompt = `Tối ưu workflow cho team:
Current process: ${JSON.stringify(scheduleData)}
Team performance: ${JSON.stringify(performanceData)}
Bottlenecks: ${JSON.stringify(contentData)}

Optimization:
1. Process improvements
2. Task prioritization
3. Automation opportunities
4. Resource allocation
5. Timeline optimization`;
        break;

      default:
        throw new Error('Invalid automation action');
    }

    console.log('Processing automation with Kimi AI:', { action });

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
        temperature: action === 'auto_response' ? 0.7 : 0.4,
        max_tokens: 2500,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error('No automation result generated');
    }

    // Store automation insights for future learning
    if (teamId && action === 'smart_scheduling') {
      try {
        await supabaseClient
          .from('ai_automation_insights')
          .insert({
            team_id: teamId,
            automation_type: action,
            insights: result,
            created_at: new Date().toISOString()
          });
      } catch (dbError) {
        console.warn('Failed to store automation insights:', dbError);
      }
    }

    // Structure response based on action
    let structuredResult = { content: result };

    if (action === 'smart_scheduling') {
      // Extract time recommendations
      const timePattern = /(\d{1,2}):(\d{2})|(\d{1,2}h)/g;
      const times = result.match(timePattern) || [];
      structuredResult = { ...structuredResult, suggestedTimes: times };
    } else if (action === 'hashtag_research') {
      // Extract hashtags
      const hashtags = result.match(/#\w+/g) || [];
      structuredResult = { ...structuredResult, hashtags };
    } else if (action === 'content_curation') {
      // Extract relevance score
      const scoreMatch = result.match(/(\d+)\/10|\b(\d)\s*điểm/);
      const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 5;
      structuredResult = { ...structuredResult, relevanceScore: score };
    }

    return new Response(JSON.stringify(structuredResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-automation:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      content: 'Không thể thực hiện automation. Vui lòng thử lại.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});