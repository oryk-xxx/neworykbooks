import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PageContent } from "./blocks";

const MODEL_NAME = "gemini-2.0-flash-thinking";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

function extractPageText(content: PageContent) {
  const parts: string[] = [];
  for (const block of content.blocks) {
    if (block.type === "heading") {
      parts.push(block.data.text);
    } else if (block.type === "paragraph" || block.type === "quote") {
      parts.push(block.data.text);
    } else if (block.type === "list") {
      parts.push(...block.data.items);
    } else if (block.type === "callout") {
      parts.push(block.data.text);
    } else if (block.type === "wrong_right") {
      for (const pair of block.data.pairs) {
        parts.push(pair.right);
        if (pair.explanation) {
          parts.push(pair.explanation);
        }
      }
    }
  }
  return parts.join("\n");
}

export async function evaluateSummaryWithAI(summary: string, content: PageContent) {
  const client = getClient();
  if (!client) {
    return null;
  }

  const pageText = extractPageText(content);

  const prompt = `
Você é um professor avaliando o resumo de um aluno sobre uma página de um livro.

Conteúdo da página (referência):
"""
${pageText}
"""

Resumo do aluno:
"""
${summary}
"""

Analise se o resumo demonstra compreensão real do conteúdo, usando critérios:
- Capta as principais ideias
- Usa as próprias palavras
- Não apenas copia frases
- Está coerente e específico

Responda em JSON válido, sem texto extra, no formato:
{
  "score": number entre 0 e 1,
  "passed": boolean,
  "explanation": string curta explicando o resultado
}
`;

  const model = client.getGenerativeModel({ model: MODEL_NAME });
  const response = await model.generateContent(prompt);
  const text = response.response.text();

  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const slice =
      jsonStart !== -1 && jsonEnd !== -1
        ? text.slice(jsonStart, jsonEnd + 1)
        : text;
    const parsed = JSON.parse(slice) as {
      score?: number;
      passed?: boolean;
      explanation?: string;
    };
    if (typeof parsed.score !== "number") {
      return null;
    }
    return {
      score: Math.min(1, Math.max(0, parsed.score)),
      approved: parsed.passed ?? parsed.score >= 0.55,
      explanation: parsed.explanation
    };
  } catch {
    return null;
  }
}
