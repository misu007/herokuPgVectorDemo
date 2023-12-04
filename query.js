"use strict";
import { getEmbedding } from "./embedding.js";
import { getSimilarDocs } from "./db.js";
import { askToLlm } from "./llm.js";

// 引数を取得
const input = process.argv[2];
if (input) await execute(input);
process.exit(0);

async function execute(input) {
  // 引数で渡されたプロンプトのembeddingを取得
  const embedding = await getEmbedding(input);

  // embeddingをもとに類似ドキュメントを取得
  const contents = await getSimilarDocs(embedding);
  console.log(`<<<ドキュメント #1>>>\n${contents[0]}\n\n`);
  console.log(`<<<ドキュメント #2>>>\n${contents[1]}\n\n`);

  // 類似ドキュメント、プロンプトから回答を生成
  const response = await askToLlm({ contents, input });
  console.log(`<<<生成AIの回答>>>\n${response}\n\n`);
}
