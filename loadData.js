"use strict";
import fs from "fs";
import { insertDoc } from "./db.js";
import { getEmbedding } from "./embedding.js";

await execute();
process.exit(0);

async function execute() {
  // doc1.txt 〜 doc6.txt まで順番に処理実行
  await executeDoc("./docs/doc1.txt");
  await executeDoc("./docs/doc2.txt");
  await executeDoc("./docs/doc3.txt");
  await executeDoc("./docs/doc4.txt");
  await executeDoc("./docs/doc5.txt");
  await executeDoc("./docs/doc6.txt");
}

async function executeDoc(path) {
  // ファイルを読み込み文章を取得
  const content = fs.readFileSync(path, "utf8");

  // 文章のembeddingを取得
  const embedding = await getEmbedding(content);

  // 文章、embeddingをもとにレコード作成
  await insertDoc({ content, embedding });
}
