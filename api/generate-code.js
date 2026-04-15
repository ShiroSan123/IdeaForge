import {
  buildStarterCodePrompt,
  extractText,
  getOpenAIClient,
  parseJsonBody,
  sendJson,
} from "./_lib/openai.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = parseJsonBody(req);
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: buildStarterCodePrompt(body),
    });

    const text = extractText(response);
    const parsed = JSON.parse(text);

    return sendJson(res, 200, {
      filename: parsed.filename || "IdeaApp.tsx",
      code: parsed.code || "",
      description: parsed.description || "",
    });
  } catch (error) {
    console.error("generate-code error", error);
    return sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate starter code",
    });
  }
}
