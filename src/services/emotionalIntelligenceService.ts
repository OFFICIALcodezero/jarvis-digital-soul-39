import OpenAI from 'openai';

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Define the EmotionData type
export type EmotionData = {
  dominant: string;
  joy: number;
  surprise: number;
  anger: number;
  sadness: number;
  neutral: number;
};

// Function to analyze emotion in text using OpenAI
export const analyzeEmotion = async (text: string): Promise<EmotionData> => {
  try {
    const prompt = `Analyze the sentiment of the following text and provide a breakdown of the emotions detected.
      Text: "${text}"
      Respond with a JSON object that includes the dominant emotion and the intensity of each emotion (joy, surprise, anger, sadness, neutral) as a percentage.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI trained to analyze emotions in text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message?.content;

    if (content) {
      try {
        const emotionData = JSON.parse(content);
        return {
          dominant: emotionData.dominant || "neutral",
          joy: emotionData.joy || 0,
          surprise: emotionData.surprise || 0,
          anger: emotionData.anger || 0,
          sadness: emotionData.sadness || 0,
          neutral: emotionData.neutral || 0,
        };
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        return {
          dominant: "neutral",
          joy: 0,
          surprise: 0,
          anger: 0,
          sadness: 0,
          neutral: 1,
        };
      }
    } else {
      console.warn("No content in OpenAI completion");
      // This is where the type error occurs, likely around line 103
      // Adding the missing properties to match the EmotionData type
      return {
        dominant: "neutral",
        joy: 0,
        surprise: 0,
        anger: 0, 
        sadness: 0,
        neutral: 1
      };
    }
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return {
      dominant: "neutral",
      joy: 0,
      surprise: 0,
      anger: 0,
      sadness: 0,
      neutral: 1,
    };
  }
};
