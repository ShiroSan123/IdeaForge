import {
  buildIdeasPrompt,
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
      input: buildIdeasPrompt({
        ...body,
        count: body.prompt ? 2 : body.count || 3,
      }),
    });

    const text = extractText(response);
    const parsed = JSON.parse(text);

    return sendJson(res, 200, {
      ideas: Array.isArray(parsed.ideas) ? parsed.ideas : [],
    });
  } catch (error) {
    console.error("generate-ideas error", error);
    return sendJson(res, 500, {
      error:
        error instanceof Error ? error.message : "Failed to generate ideas",
    });
  }
}
