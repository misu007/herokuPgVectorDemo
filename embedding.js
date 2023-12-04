"use strict";
import * as dotenv from "dotenv";
dotenv.config();

// Hugging Face
import { HfInference } from "@huggingface/inference";
const model = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";
const token = process.env.HUGGING_FACE_TOKEN ?? "";
const hf = new HfInference(token);

// embeddingを計算
const getEmbedding = async (text) => {
  const inputs = [text];
  const [embedding, ..._trash] = await hf.featureExtraction({
    model,
    inputs,
  });
  return embedding;
};

export { getEmbedding };
