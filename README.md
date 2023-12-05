<div align="center">
 <br/>
  <h1>Heroku Postgres + AWS Bedrock + Hugging Face <br/>検索拡張生成RAGデモApp</h1>
  <p>
    Heroku Postgres + pgvector をナレッジベース&ベクトルデータベースとして利用した、RAGのCLIアプリケーションです。Qiita記事で紹介したサンプルコードになります。
  </p>
  <br/>
</div>

## 詳細

### ベクトルデータベース

- Heroku
  - [Heroku Postgres (PostgreSQL)](https://elements.heroku.com/addons/heroku-postgresql)
  - [pgvector](https://github.com/pgvector/pgvector)

### 大規模言語モデル

- AWS Bedrock
  - [Claude 2.1](https://aws.amazon.com/about-aws/whats-new/2023/11/claude-2-1-foundation-model-anthropic-amazon-bedrock/)

### Embedding モデル

- Hugging Face
  - [sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2)

## セットアップ手順

Heroku アプリに、以下 Heroku CLI コマンドで、Heroku Postgres を追加

```shell
% heroku addons:create heroku-postgresql:standard-0 --app [HerokuAppName]
```

DB 接続情報を取得

```shell
% heroku pg:credentials:url DATABASE --app [HerokuAppName]
```

psql モード

```shell
% heroku pg:psql --app [HerokuAppName]
```

pgvector 有効化

```sql
> CREATE EXTENSION vector;
```

`docs` テーブルを作成

```sql
> CREATE TABLE docs (id bigserial PRIMARY KEY, embedding vector(384), content text);
```

以下コマンドを実行

```
% git clone https://github.com/misu007/herokuPgVectorDemo
% cd herokuPgVectorDemo
% npm install
```

`.env`ファイルを作成し、Heroku Postgres、AWS Bedrock 実行 IAM ユーザ認証情報、Hugging Face のトークン等を以下のように格納

```toml:.env
# Heroku Postgres
POSTGRES_URL="postgres://xxxxxxxxxxxxxxxxxxx:xxxx/xxxxxx"

# AWS Bedrock
AWS_ACCESS_KEY_ID="xxxxxxxxxxx"
AWS_SECRET_ACCESS_KEY="xxxxxxxxxxx"
AWS_REGION="xx-xxxx-x"

# Hugging Face
HUGGING_FACE_TOKEN="xxxxxxxxxxx"
```

以下を実行すると、ナレッジベース & ベクトルデータが `docs`テーブルに INSERT されます

```shell
% node loadData.js
```

## プロンプト実行方法

文章を引数に渡して `query.js`を実行

```shell
% node query.js [質問文章]
```

例）ヴィタリティ 360 をお得に購入するには？

```text
% node query.js ヴィタリティ360をお得に購入するには？
<<<生成AIの回答>>>
ドキュメントによると、ヴィタリティ360をお得に購入する方法としては公式オンラインストアが挙げられています。

公式ストアでは「最新モデルや専用アクセサリーが充実」しており、「特別なプロモーションやキャンペーンも随時開催中」だと記載があります。

したがって、お得に購入したい場合は公式オンラインストアを利用することをおすすめします。
```

## 参考 - Qiita 記事

Heroku Postgres と AWS Bedrock と Hugging Face で RAG を作ってみた  
https://qiita.com/misu007/items/60db3364992566f389a5

## ライセンス

MIT
