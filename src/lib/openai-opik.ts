import OpenAI from "openai";
import { Opik } from "opik";
import { trackOpenAI } from "opik-openai";

/**
 * Opik TypeScript SDK configuration per official docs.
 * @see https://www.comet.com/docs/opik/reference/typescript-sdk/overview
 */
function createOpikClient(): Opik | null {
  const apiKey = process.env.OPIK_API_KEY;
  if (!apiKey) return null;

  return new Opik({
    apiKey,
    apiUrl: process.env.OPIK_URL_OVERRIDE ?? "https://www.comet.com/opik/api",
    projectName: process.env.OPIK_PROJECT_NAME ?? "Default Project",
    workspaceName: process.env.OPIK_WORKSPACE_NAME ?? undefined,
  });
}

/**
 * OpenAI client for expert matching. When OPIK_API_KEY is set,
 * uses Opik TypeScript SDK + opik-openai so all LLM calls are traced.
 */
function createClient(): OpenAI | ReturnType<typeof trackOpenAI> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const openai = new OpenAI({ apiKey });
  const opikClient = createOpikClient();

  if (opikClient) {
    return trackOpenAI(openai, { client: opikClient });
  }

  return openai;
}

let _client: OpenAI | ReturnType<typeof trackOpenAI> | null = null;

export function getTrackedOpenAIClient(): OpenAI | ReturnType<typeof trackOpenAI> {
  if (!_client) _client = createClient();
  return _client;
}

export async function flushOpik(): Promise<void> {
  const client = _client;
  if (client && typeof (client as { flush?: () => Promise<void> }).flush === "function") {
    await (client as { flush: () => Promise<void> }).flush();
  }
}
