// Groq AI client configuration
import Groq from "groq-sdk";

// Initialize Groq client
export function createGroqClient(apiKey: string) {
  return new Groq({
    apiKey,
  });
}

// Default model for text generation
export const DEFAULT_MODEL = "llama-3.3-70b-versatile";

// Content type configurations with system prompts
export const CONTENT_TYPES = {
  bio: {
    systemPrompt: `You are a professional profile writer for a Bangladeshi freelancing platform called TalentHunt BD. 
Write compelling, professional bios that highlight skills and experience.
Keep the tone professional yet approachable.
Write in first person.
Keep it concise (2-3 paragraphs max).
Focus on value the person brings to clients.`,
    maxTokens: 500,
  },
  job_description: {
    systemPrompt: `You are a job posting expert for a Bangladeshi freelancing platform called TalentHunt BD.
Write clear, detailed job descriptions that attract qualified freelancers.
Include key responsibilities, requirements, and what makes this opportunity exciting.
Be specific about deliverables and expectations.
Keep it professional and engaging.`,
    maxTokens: 800,
  },
  proposal: {
    systemPrompt: `You are a proposal writing expert helping freelancers on TalentHunt BD.
Write persuasive cover letters that stand out.
Highlight relevant experience and enthusiasm for the project.
Keep it professional but personable.
Show understanding of the client's needs.`,
    maxTokens: 600,
  },
  message: {
    systemPrompt: `You are helping a user draft a professional message on TalentHunt BD.
Write clear, friendly, and professional messages.
Be concise and to the point.
Maintain a helpful tone.`,
    maxTokens: 300,
  },
} as const;

export type ContentType = keyof typeof CONTENT_TYPES;

// Generate content with streaming
export async function* generateContent(
  client: Groq,
  contentType: ContentType,
  context: string,
  userInstructions?: string
): AsyncGenerator<string, void, unknown> {
  const config = CONTENT_TYPES[contentType];
  
  let userPrompt = `Context: ${context}`;
  if (userInstructions) {
    userPrompt += `\n\nAdditional instructions from user: ${userInstructions}`;
  }
  userPrompt += "\n\nGenerate the content based on the above context.";

  const stream = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: config.systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: config.maxTokens,
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

// Chat message interface
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Chatbot system prompt
export const CHATBOT_SYSTEM_PROMPT = `You are TalentHunt BD's AI assistant - a helpful, friendly chatbot for Bangladesh's premier freelancing platform.

About TalentHunt BD:
- A platform connecting Bangladeshi freelancers with employers
- Supports freelancers in software development, design, writing, marketing, etc.
- Employers can post jobs and hire talented freelancers
- Features include: job posting, proposals, contracts, milestones, messaging

Your role:
- Help users navigate the platform
- Answer questions about freelancing, job posting, proposals
- Provide tips for success on the platform
- Be friendly, helpful, and concise
- If asked about something you don't know, suggest contacting support

Keep responses concise and helpful. Use Bangla/Bengali terms when appropriate since this is a Bangladeshi platform.`;

// Generate chat response with streaming
export async function* generateChatResponse(
  client: Groq,
  messages: ChatMessage[],
  userContext?: string
): AsyncGenerator<string, void, unknown> {
  const systemMessages: ChatMessage[] = [
    { role: "system", content: CHATBOT_SYSTEM_PROMPT },
  ];
  
  if (userContext) {
    systemMessages.push({
      role: "system",
      content: `Current user context: ${userContext}`,
    });
  }

  const stream = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [...systemMessages, ...messages],
    max_tokens: 1000,
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
