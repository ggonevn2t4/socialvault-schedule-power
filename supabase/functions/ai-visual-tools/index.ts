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
      imageData,
      brandColors,
      platformSpecs,
      contentDescription,
      targetLanguage = 'vi'
    } = await req.json();

    const kimiApiKey = Deno.env.get('KIMI_API_KEY');
    if (!kimiApiKey) {
      throw new Error('KIMI_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'generate_alt_text':
        systemPrompt = `Bạn là chuyên gia tạo alt text cho hình ảnh, tối ưu cho accessibility và SEO.`;
        userPrompt = `Tạo alt text cho hình ảnh có mô tả: ${contentDescription}. 
Yêu cầu: Ngắn gọn, mô tả chính xác, phù hợp cho screen reader.
Ngôn ngữ: ${targetLanguage}`;
        break;

      case 'color_palette_suggestion':
        systemPrompt = `Bạn là chuyên gia thiết kế màu sắc và brand identity.`;
        userPrompt = `Đề xuất bảng màu cho brand:
Màu hiện tại: ${JSON.stringify(brandColors)}
Mô tả brand: ${contentDescription}

Đề xuất:
1. 5 màu chính phù hợp
2. Màu phụ bổ trợ
3. Lý do lựa chọn
4. Ứng dụng cho từng platform`;
        break;

      case 'font_pairing':
        systemPrompt = `Bạn là chuyên gia typography và font pairing.`;
        userPrompt = `Đề xuất cặp font cho:
Loại nội dung: ${contentDescription}
Platform: ${JSON.stringify(platformSpecs)}
Style: Modern, clean, professional

Đề xuất:
1. Font chính cho heading
2. Font phụ cho body text
3. Lý do kết hợp
4. Alternative options`;
        break;

      case 'layout_optimization':
        systemPrompt = `Bạn là chuyên gia UX/UI design và layout optimization cho social media.`;
        userPrompt = `Tối ưu layout cho:
Platform: ${JSON.stringify(platformSpecs)}
Nội dung: ${contentDescription}
Kích thước: ${imageData?.dimensions || 'không xác định'}

Đề xuất:
1. Bố cục tối ưu
2. Vị trí text/logo
3. Hierarchy thông tin
4. Call-to-action placement`;
        break;

      case 'smart_cropping_guide':
        systemPrompt = `Bạn là chuyên gia tối ưu hình ảnh cho các platform social media khác nhau.`;
        userPrompt = `Hướng dẫn crop hình ảnh cho:
Kích thước gốc: ${imageData?.dimensions}
Platforms cần: ${JSON.stringify(platformSpecs)}
Nội dung chính: ${contentDescription}

Hướng dẫn:
1. Vùng quan trọng cần giữ
2. Tỷ lệ crop cho từng platform
3. Điểm focus chính
4. Lưu ý khi resize`;
        break;

      case 'logo_placement':
        systemPrompt = `Bạn là chuyên gia brand placement và visual hierarchy.`;
        userPrompt = `Đề xuất vị trí logo tối ưu:
Kích thước hình: ${imageData?.dimensions}
Platform: ${JSON.stringify(platformSpecs)}
Nội dung: ${contentDescription}

Đề xuất:
1. Vị trí logo (góc nào, %)
2. Kích thước phù hợp
3. Opacity/transparency
4. Màu sắc harmonize`;
        break;

      case 'video_thumbnail':
        systemPrompt = `Bạn là chuyên gia tối ưu video thumbnail để tăng click-through rate.`;
        userPrompt = `Tạo concept thumbnail cho video:
Nội dung video: ${contentDescription}
Platform: ${JSON.stringify(platformSpecs)}
Target audience: ${imageData?.audience || 'general'}

Concept:
1. Visual chính (object/person)
2. Text overlay (nếu có)
3. Color scheme
4. Emotion/mood
5. CTR optimization tips`;
        break;

      default:
        throw new Error('Invalid visual action');
    }

    console.log('Processing visual request with Kimi AI:', { action });

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
        temperature: 0.6,
        max_tokens: 2000,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error('No result generated');
    }

    // Structure the response based on action type
    let structuredResult = { content: result };

    if (action === 'color_palette_suggestion') {
      // Extract color codes if mentioned
      const colorCodes = result.match(/#[A-Fa-f0-9]{6}/g) || [];
      structuredResult = { ...structuredResult, colors: colorCodes };
    } else if (action === 'font_pairing') {
      // Extract font names
      const fonts = result.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
      structuredResult = { ...structuredResult, fonts: fonts.slice(0, 4) };
    }

    return new Response(JSON.stringify(structuredResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-visual-tools:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      content: 'Không thể xử lý yêu cầu visual. Vui lòng thử lại.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});