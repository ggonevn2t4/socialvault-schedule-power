import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
      content, 
      tone = 'professional', 
      industry,
      platform,
      language = 'vi',
      contentType = 'post'
    } = await req.json();

    const kimiApiKey = Deno.env.get('KIMI_API_KEY');
    if (!kimiApiKey) {
      throw new Error('KIMI_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'generate_content':
        systemPrompt = `Bạn là một chuyên gia content marketing cho ${industry || 'doanh nghiệp'}. Hãy tạo nội dung ${contentType} với tone ${tone} cho platform ${platform || 'social media'}.`;
        userPrompt = `Tạo nội dung từ ý tưởng: ${content}. Trả về kết quả bằng tiếng ${language}.`;
        break;
        
      case 'expand_content':
        systemPrompt = `Bạn là chuyên gia mở rộng nội dung. Chuyển đổi bullet points thành bài viết đầy đủ với tone ${tone}.`;
        userPrompt = `Mở rộng các ý chính sau thành bài viết hoàn chỉnh:\n${content}`;
        break;
        
      case 'generate_hashtags':
        systemPrompt = `Bạn là chuyên gia hashtag. Tạo hashtag phù hợp và trending cho nội dung social media.`;
        userPrompt = `Tạo 10-15 hashtag cho nội dung sau: ${content}. Bao gồm cả hashtag phổ biến và hashtag thích hợp cho ${industry || 'doanh nghiệp'}.`;
        break;
        
      case 'adjust_tone':
        systemPrompt = `Bạn là chuyên gia điều chỉnh tone nội dung. Giữ nguyên ý chính nhưng thay đổi tone theo yêu cầu.`;
        userPrompt = `Viết lại nội dung sau với tone ${tone}:\n${content}`;
        break;
        
      case 'translate_content':
        systemPrompt = `Bạn là chuyên gia dịch thuật. Dịch nội dung một cách tự nhiên và phù hợp với văn hóa địa phương.`;
        userPrompt = `Dịch nội dung sau sang tiếng ${language}: ${content}`;
        break;
        
      case 'analyze_originality':
        systemPrompt = `Bạn là chuyên gia phân tích tính độc đáo của nội dung. Đánh giá tính sáng tạo và gợi ý cải thiện.`;
        userPrompt = `Phân tích tính độc đáo của nội dung: ${content}. Cho điểm từ 1-10 và gợi ý cải thiện.`;
        break;
        
      case 'generate_caption':
        systemPrompt = `Bạn là chuyên gia viết caption cho hình ảnh. Tạo caption hấp dẫn dựa trên mô tả hình ảnh.`;
        userPrompt = `Viết caption cho hình ảnh có mô tả: ${content}. Tone: ${tone}, Platform: ${platform}`;
        break;
        
      default:
        throw new Error('Invalid action specified');
    }

    console.log('Sending request to Kimi API:', { action, tone, industry, platform });

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
        temperature: action === 'analyze_originality' ? 0.3 : 0.7,
        max_tokens: 2000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Kimi API error:', errorData);
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated from Kimi API');
    }

    console.log('Generated content:', generatedContent.substring(0, 100) + '...');

    // Parse specific response formats
    let result = { content: generatedContent };
    
    if (action === 'generate_hashtags') {
      const hashtags = generatedContent.match(/#\w+/g) || [];
      result = { hashtags, content: generatedContent };
    } else if (action === 'analyze_originality') {
      const scoreMatch = generatedContent.match(/(\d+)\/10|\b(\d)\s*điểm/);
      const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 5;
      result = { score, analysis: generatedContent, content: generatedContent };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-content-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      content: 'Đã xảy ra lỗi khi tạo nội dung. Vui lòng thử lại.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});