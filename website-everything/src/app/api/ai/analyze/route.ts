import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy-key") {
      // Mock Response
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        isValid: true,
        title: "Mock: Unidentified Issue",
        category: "General",
        department: "Municipal Services",
        severity: "Medium"
      });
    }

    // Extract base64 part if it's a data URL
    let base64Data = image;
    if (image.startsWith('data:image')) {
      base64Data = image.split(',')[1];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI civic assistant for CVQ.
      Analyze this image to determine if it depicts a valid civic issue (e.g., pothole, garbage, broken streetlight, fallen wire, water leak, infrastructure damage).
      If the image is completely unrelated to civic issues (e.g., a person's face, a laptop screen, a random indoor object, a pet), mark it as invalid.
      
      Respond ONLY with a valid JSON object in this exact format, with no markdown formatting or backticks:
      {
        "isValid": <true or false>,
        "title": "<A short, descriptive title if valid, or 'Invalid Image' if not>",
        "category": "<General Category e.g. Roads, Garbage, Electrical, Water. Leave empty if invalid.>",
        "department": "<Specific Municipal Department. Leave empty if invalid.>",
        "severity": "<Low, Medium, High, or Critical. Leave empty if invalid.>",
        "reason": "<If invalid, a short explanation of why it was rejected. Empty if valid.>"
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);

    const responseText = result.response.text().trim();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ 
      isValid: true,
      title: "Unidentified Issue (AI Error)",
      category: "General",
      department: "Municipal Services",
      severity: "Medium"
    }, { status: 200 });
  }
}
