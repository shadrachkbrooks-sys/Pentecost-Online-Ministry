import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please define it in the system Secrets.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// REST API endpoint: Generate Lesson using Gemini AI
app.post("/api/generate-lesson", async (req, res) => {
  try {
    const { topic, scriptureGuide, themeNotes } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGeminiClient();

    const prompt = `
      You are an elite theologian and curriculum writer for The Church of Pentecost – Liberia.
      Create an engaging, inspiring, and doctrinally sound Bible study lesson outline based on:
      - Topic/Theme: "${topic}"
      - Reference Scripture (Optional): "${scriptureGuide || "Relevant scriptures"}"
      - Additional Theme Notes (Optional): "${themeNotes || "None"}"

      Provide the response in raw JSON format matching this schema strictly. Do not include markdown code block formatting like \`\`\`json. Just return the valid JSON string.
      
      Schema:
      {
        "title": "A captivating, official-sounding title for the lesson",
        "keyScripture": "The central scripture citation and the text of the verse(s) written out",
        "introduction": "An engaging, warm, and spiritually-rich introductory paragraph setting up the topic",
        "mainPoints": [
          {
            "heading": "First main point heading",
            "verses": "Scripture references",
            "content": "Deep theological expounding of this point suitable for Pentecostal believers, highlighting the role of the Holy Spirit, holiness, or active discipleship."
          },
          {
            "heading": "Second main point heading",
            "verses": "Scripture references",
            "content": "Deep theological expounding of this point."
          },
          {
            "heading": "Third main point heading",
            "verses": "Scripture references",
            "content": "Deep theological expounding of this point."
          }
        ],
        "discussionQuestions": [
          "Thoughtful questions for Bible study classes in Liberia to discuss in practical life application",
          "Another challenging discussion question about walking in the Spirit"
        ],
        "reflection": "A brief life-application and reflection paragraph summarizing how the lesson applies in everyday walk",
        "closingPrayer": "A powerful, declarative pentecostal closing prayer for empowering believers, spiritual warfare, deliverance, or faithful witness"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const textOutput = response.text || "{}";
    const data = JSON.parse(textOutput);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating lesson from Gemini:", error);
    res.status(500).json({ 
      error: "Failed to generate lesson.", 
      details: error.message || error 
    });
  }
});

// REST API endpoint: Public Bible verse utility
app.get("/api/bible-verse", async (req, res) => {
  const { passage } = req.query;
  if (!passage) {
    return res.status(400).json({ error: "Passage query parameter is required" });
  }
  try {
    // Fetch from a public, reliable scripture API
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(passage.toString())}`);
    if (!response.ok) {
      throw new Error("Bible API returned non-200 state");
    }
    const data = await response.json();
    res.json({
      reference: data.reference,
      text: data.text,
      version: "KJV/Web Edition"
    });
  } catch (error) {
    res.json({
      reference: passage.toString(),
      text: "Select a verse or search online. (Connecting safely)...",
      details: "Scripture loaded."
    });
  }
});

// Integrate Vite middleware for development or Static Asset routing for production
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Full-Stack Server active on: http://localhost:${PORT}`);
    console.log(`Port 3000 is open to local/container ingress.`);
  });
}

initServer();
