"use strict";
import * as dotenv from "dotenv";
dotenv.config();

// AWS Bedrock
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

// 使用するモデル
//const modelId = "anthropic.claude-instant-v1";
const modelId = "anthropic.claude-v2:1";
const anthropicVersion = "bedrock-2023-05-31";

// トークン数上限
const maxTokensToSmaple = 500;

const askToLlm = async ({ contents, input }) => {
  const prompt =
    `あなたはAIアシスタントです。以下の提供されたドキュメントを参考にしてください。\n` +
    `\n` +
    `<documents>\n` +
    `<document>${contents[0]}</document>\n` +
    `<document>${contents[1]}</document>\n` +
    `</documents>\n` +
    `\n` +
    `上記のドキュメントを参考にしてユーザーの質問に答えてください。ドキュメントに記載がない内容については、無理に答えようとせず、正直に「知りません」と答えましょう。また、要点を絞って完結に回答してください。\n` +
    `\n` +
    `Human: ${input}\n` +
    `\n` +
    `Assistant:`;
  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt,
      max_tokens_to_sample: maxTokensToSmaple,
      anthropic_version: anthropicVersion,
    }),
  });
  const { body } = await client.send(command);
  const decoder = new TextDecoder();
  const text = decoder.decode(body);
  const { completion } = JSON.parse(text);
  return completion;
};

export { askToLlm };
