"use strict";
import * as dotenv from "dotenv";
dotenv.config();

// PostgreSQL
import pg from "pg";
import pgvector from "pgvector/pg";
const { Client } = pg;
const connectionString = `${process.env.POSTGRES_URL}` ?? "";
const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect();

// コンテンツとembeddingをもとにレコード作成
const insertDoc = async ({ content, embedding }) => {
  await client.query("INSERT INTO docs (embedding, content) VALUES($1, $2);", [
    pgvector.toSql(embedding),
    content,
  ]);
};

// コサイン類似度での近似ドキュメントを上位２つ取得
const getSimilarDocs = async (embedding) => {
  const { rows } = await client.query(
    "SELECT content FROM docs ORDER BY 1 - (embedding <=> $1) DESC LIMIT 2;",
    [pgvector.toSql(embedding)]
  );
  const contents = rows.map(({ content }) => {
    return content;
  });
  return contents;
};

export { insertDoc, getSimilarDocs };
