// 同步本地 skill-audit-publish 1.4.0 到 GitHub repo（PAT 直连 REST API）
// 用法: node sync_skill_to_github.js
const https = require("https");
const fs = require("fs");
const path = require("path");

const PAT = fs.readFileSync(path.join(process.env.HOME || "C:\\Users\\haiyangchen", ".workbuddy", "connectors", "default", "tokens", "github.txt"), "utf8").trim();
const OWNER = "haiyangchenbj";
const REPO = "skill-audit-publish";
const LOCAL_DIR = "C:\\Users\\haiyangchen\\.workbuddy\\skills\\skill-audit-publish";
const BRANCH = "main";
const COMMIT_MSG = "v1.4.0: add Release Type Gate (new-release / update / patch lanes, frozen list)";

// 进 GitHub 的白名单文件（_meta.json 只进 ClawHub）
const FILES = [
  "SKILL.md",
  "README.md",
  "README_zh.md",
  "sanitize.md",
  "transform.md",
  "verify.md",
  "references/publish-rules.md",
];

function api(method, p, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: "api.github.com",
        path: p,
        method,
        headers: {
          "User-Agent": "skill-sync",
          Authorization: `token ${PAT}`,
          Accept: "application/vnd.github+json",
          ...(data ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try { resolve({ status: res.statusCode, json: JSON.parse(buf || "{}") }); }
          catch (e) { resolve({ status: res.statusCode, json: { raw: buf } }); }
        });
      }
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

// 计算本地文件的 git blob sha（与 GitHub contents API 返回的 sha 同口径）
function gitBlobSha(content) {
  const header = Buffer.from(`blob ${Buffer.byteLength(content)}\0`);
  const store = Buffer.concat([header, Buffer.from(content, "utf8")]);
  return require("crypto").createHash("sha1").update(store).digest("hex");
}

async function main() {
  // 1) 拿远端现有文件 sha
  const remote = {};
  for (const f of FILES) {
    const r = await api("GET", `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(f)}?ref=${BRANCH}`);
    if (r.status === 200) remote[f] = r.json.sha;
  }
  console.log("remote files:", Object.keys(remote).length, "/", FILES.length);

  // 2) 比对本地内容 sha
  const toPush = [];
  for (const f of FILES) {
    const local = fs.readFileSync(path.join(LOCAL_DIR, f), "utf8");
    const localSha = gitBlobSha(local);
    if (remote[f] === localSha) {
      console.log(`  = ${f} (unchanged)`);
    } else {
      toPush.push({ f, local, sha: remote[f] || null, why: remote[f] ? "modified" : "new" });
      console.log(`  ${remote[f] ? "~" : "+"} ${f} (${remote[f] ? "modified" : "new"})`);
    }
  }
  if (!toPush.length) { console.log("nothing to push."); return; }

  // 3) 逐文件 PUT
  for (const { f, local, sha } of toPush) {
    const body = {
      message: `${COMMIT_MSG} [${f}]`,
      content: Buffer.from(local, "utf8").toString("base64"),
      branch: BRANCH,
    };
    if (sha) body.sha = sha;
    const r = await api("PUT", `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(f)}`, body);
    if (r.status === 200 || r.status === 201) {
      console.log(`  pushed ${f} -> commit ${r.json.commit.sha.slice(0, 8)}`);
    } else {
      console.log(`  FAILED ${f}: HTTP ${r.status}`, JSON.stringify(r.json).slice(0, 300));
      process.exitCode = 1;
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
