
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// AI TASK ANALYSIS
app.post("/api/analyze", async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
        Analyze this college task.

        Title: ${title}
        Description: ${description}
        Deadline: ${deadline}

        Recommend priority: High, Medium or Low.
        Explain the reason and suggest how to complete it.
      `
    });

    res.json({ result: response.text });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI analysis failed"
    });
  }
});

// AI CHATBOT
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
        You are CampusFlow AI, a college task scheduling assistant.
        Answer the student's question simply and clearly.

        Question: ${message}
      `
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Chatbot response failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `CampusFlow running at http://localhost:${PORT}`
  );
});
