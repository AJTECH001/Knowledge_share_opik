import OpenAI from "openai";
import { Opik } from "opik";
import { trackOpenAI } from "opik-openai";

/**
 * Opik TypeScript SDK client (env-based config).
 * @see https://www.comet.com/docs/opik/reference/typescript-sdk/overview
 */
function createOpikClient(): Opik | null {
  const apiKey = process.env.OPIK_API_KEY;
  if (!apiKey) return null;

  return new Opik({
    apiKey,
    apiUrl: process.env.OPIK_URL_OVERRIDE ?? "https://www.comet.com/opik/api",
    projectName: process.env.OPIK_PROJECT_NAME ?? "knowledgeshare",
    workspaceName: process.env.OPIK_WORKSPACE_NAME ?? undefined,
  });
}

/**
 * OpenAI client; when OPIK_API_KEY is set, wrapped with Opik tracing.
 * Business logic unchanged; only Opik wrapper added when configured.
 */
function createClient(): OpenAI | ReturnType<typeof trackOpenAI> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const openai = new OpenAI({ apiKey });
  const opikClient = createOpikClient();

  if (opikClient) {
    return trackOpenAI(openai, {
      client: opikClient,
      generationName: "KnowledgeShare-ExpertMatching",
      traceMetadata: {
        tags: ["knowledgeshare", "expert-matching"],
        component: "match-api",
      },
    }) as OpenAI & { chat: { completions: { create: any } } };
  }

  return openai;
}

let _client: OpenAI | ReturnType<typeof trackOpenAI> | null = null;

export function getTrackedOpenAIClient(): OpenAI | ReturnType<typeof trackOpenAI> {
  if (!_client) _client = createClient();
  return _client;
}

/** Call after LLM usage so traces are sent to Opik. */
export async function flushOpik(): Promise<void> {
  if (_client && typeof (_client as { flush?: () => Promise<void> }).flush === "function") {
    await (_client as { flush: () => Promise<void> }).flush();
  }
}
