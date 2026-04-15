import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function ensureApiKey() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
}

export function getOpenAIClient() {
  ensureApiKey();
  return client;
}

export function parseJsonBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  return req.body;
}

export function extractText(response) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const fragments = [];

  for (const outputItem of response.output || []) {
    for (const contentItem of outputItem.content || []) {
      if (contentItem.type === "output_text" && contentItem.text) {
        fragments.push(contentItem.text);
      }
    }
  }

  return fragments.join("\n").trim();
}

export function sendJson(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export function buildIdeasPrompt(params) {
  return `Ты помогаешь придумывать реалистичные и интересные pet-проекты для разработчиков.

Нужно вернуть строго JSON без markdown и без пояснений.

Параметры пользователя:
- уровень: ${params.level || "не указан"}
- цель: ${params.goal || "не указана"}
- категория: ${params.category || "не указана"}
- срок: ${params.timeEstimate || "не указан"}
- стек: ${(params.stacks || []).join(", ") || "не указан"}
- монетизация: ${params.monetizable ? "да" : "нет"}
- пользовательский запрос: ${params.prompt || "нет"}
- количество идей: ${params.count || 3}

Верни объект вида:
{
  "ideas": [
    {
      "title": "string",
      "description": "string",
      "difficulty": "easy|medium|hard|expert",
      "technologies": ["string"],
      "category": "web|mobile|desktop|ai|gamedev|devtools",
      "time_estimate": "1_day|1_week|2_weeks|1_month|3_months",
      "monetizable": true,
      "goal": "portfolio|freelance|startup|learning",
      "features": ["string"],
      "architecture": "string",
      "tasks": [{"title": "string", "done": false}],
      "why_useful": "string",
      "what_youll_learn": ["string"],
      "level": "junior|middle|senior"
    }
  ]
}

Требования:
- ideas должно содержать ровно ${params.count || 3} элементов
- technologies: от 3 до 6 элементов
- features: от 4 до 7 элементов
- tasks: от 6 до 10 элементов
- architecture: компактная текстовая структура проекта
- проекты должны быть конкретными и пригодными для реальной реализации`;
}

export function buildStarterCodePrompt(idea) {
  return `Ты генерируешь стартовый код для идеи проекта. Верни строго JSON без markdown.

Идея:
- title: ${idea.title}
- description: ${idea.description}
- category: ${idea.category}
- difficulty: ${idea.difficulty}
- technologies: ${(idea.technologies || []).join(", ")}
- features: ${(idea.features || []).join(", ")}
- tasks: ${(idea.tasks || []).map((task) => task.title).join(", ")}

Верни объект вида:
{
  "filename": "string",
  "code": "string",
  "description": "string"
}

Требования:
- сгенерируй короткий, но рабочий стартовый файл
- если стек похож на React, верни React/TypeScript компонент
- код должен быть чистым и пригодным как стартовая точка`;
}
