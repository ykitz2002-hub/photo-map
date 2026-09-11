// Basic認証で写真マップを保護するWorker
// ユーザー名・パスワードはCloudflareダッシュボードの環境変数(Secrets)に設定する
// （このファイル自体にはID/パスワードを書かない = GitHub上に公開されても安全）

export default {
  async fetch(request, env) {
    const authHeader = request.headers.get("Authorization");

    // Secretsの前後に余分な空白・改行が入っていても比較できるようtrim
    const user = (env.BASIC_AUTH_USER || "").trim();
    const pass = (env.BASIC_AUTH_PASS || "").trim();
    const expected = "Basic " + btoa(`${user}:${pass}`);

    if (authHeader !== expected) {
      return new Response("認証が必要です / Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Photo Map"',
        },
      });
    }

    // 認証OKなら静的ファイル（index.html等）を返す
    return env.ASSETS.fetch(request);
  },
};

