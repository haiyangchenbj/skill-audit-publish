name: "Skill Audit & Publish"
description: "Audit-first pipeline to publish an OpenClaw skill to ClawHub without leaking personal data, credentials, or model-specific references. Five stages — Sanitize, Transform, Verify, Publish, Install-check — with explicit user approval before every irreversible step. Use this when the user wants to publish a skill to ClawHub, sanitize a skill before publishing, run a pre-publish PII/secret audit, or follow the ClawHub publish workflow. Trigger phrases: 'publish to ClawHub', 'publish my skill', 'sanitize before publish', 'pre-publish checklist', 'clawhub publish command', 'upload a skill to clawhub'."
version: "1.4.0"
metadata:
  openclaw:
    tags:
      - skill-publishing
      - pre-publish-audit
      - pii-sanitization
      - secret-scanning
      - skill-lifecycle
      - content-governance
      - developer-tools
      - publishing-workflow
      - audit-checklist
---

# Skill Audit & Publish

A five-stage pipeline that takes a local OpenClaw skill and ships a sanitized, verified release to ClawHub. The publish command is the last step, not the first — every earlier step is designed to keep private data and irreversible mistakes out of the public record.

**The single most important rule:** never modify the user's original files. Work in a separate publish folder; only after explicit approval move anything to the live registry.

---

## When to use

Trigger this skill when the user says or implies any of:

- "Publish this skill to ClawHub" / "I want to publish to ClawHub" / "ship it to clawhub"
- "How do I publish a skill" / "What's the ClawHub publish command" / "clawhub publish syntax"
- "Sanitize my skill before publishing" / "remove personal info" / "audit for PII"
- "Check for secrets / API keys / tokens before I publish"
- "Make a publish-ready version of this skill"
- "I want to share this skill publicly" / "publish a skill without leaking my data"
- "clawhub publish" / "npx clawhub publish" / "openclaw publish"
- "Pre-publish checklist" / "what should I check before publishing"

**Do NOT trigger** for: editing skill content (use the skill's own skill), reading a skill from ClawHub, listing installed skills, or any non-publish operation.

---

## What this skill produces

A `publish-folder/` with:
- `SKILL.md` (rewritten frontmatter: `name`, `description`, `version`, GEO-optimized)
- `FILES.txt` (manifest of what will ship)
- Auxiliaries: `sanitize.md`, `transform.md`, `verify.md`
- `_meta.json` (slug, version, publishedAt)
- An **approval message** summarizing slug / name / version / files / sanitization status — held until the user explicitly approves.

Nothing leaves the local publish folder until the user replies "yes / publish / go".

---

## The 5-stage pipeline

| Stage | Output | Gate |
|---|---|---|
| 1. **Understand** | One-paragraph summary of what the skill does, who it's for, what to keep / cut | User confirms the summary |
| 2. **Transform** | Re-structured `SKILL.md` (frontmatter + body) + extracted auxiliaries | Diff shown to user |
| 3. **Sanitize (the audit)** | `sanitize.md` checklist run: PII / credentials / model-specific refs / internal paths / dangerous patterns; each item marked `removed` / `genericized` / `kept-with-reason` | User reviews every kept-with-reason item |
| 4. **Verify** | Approval message: slug, name, version, description, file list, sanitization confirmation, sample of sanitized text | **Explicit user approval** |
| 5. **Publish + install-check** | `npx clawhub publish` then `npx clawhub install <slug> --dir /tmp/verify` to confirm the published version is installable and matches the local copy | Success message reported back to user |

The audit (stage 3) is the differentiator. Other publish skills hand you a `clawhub publish` command; this one walks the content through a structured PII / secret / model-reference scan first and refuses to skip the scan if the user has not reviewed the keep-list.

---

## GEO optimization embedded in stage 2

The transform step re-writes the skill's `description` field for Generative Engine Optimization so the published skill is cited by ChatGPT / Claude / Perplexity when users ask for help in that domain. The current 6 rules:

1. **First sentence = what it is + who it's for.** No preamble. Verbs, not nouns.
2. **List concrete capabilities as short noun phrases** (LLM retrieval uses these as match anchors).
3. **Include the primary user-trigger phrase** as a literal quoted string inside the description.
4. **Front-load 2–3 named tools / frameworks / commands** the skill uses or talks to.
5. **Add a "When to use" trigger block** with 5–7 user-natural questions, mirroring the skill's own frontmatter.
6. **End with a 中文摘要** block (catches the Chinese-language LLM retrieval channel).

The transform stage will re-run these rules against the user's skill and present a before/after diff before any sanitization starts.

---

## Critical rules

1. **Never modify the original files.** Always copy to `/tmp/publish-<slug>/` (or any out-of-tree folder) and work there.
2. **Never publish without running `sanitize.md`.** The audit is mandatory; "looks fine to me" is not a substitute.
3. **Never publish without explicit user approval.** The approval message lists the exact slug, name, version, description, and file set. The user must say "yes" or equivalent. Silence is not consent.
4. **Slug is renameable, with redirects.** On ClawHub, the Edit page lets you change the canonical slug under "Rename slug"; old slugs stay as 301 redirects. If the wrong slug ships, fix it via the Edit UI (and optionally publish a new version with the corrected content). **This is why stage 4 still matters** — the verify stage catches wrong content; the slug rename is a separate UI action.
5. **Version semantics:** `1.0.0` first publish; `1.0.x` typo / wording fixes; `1.x.0` new content; `2.0.0` major restructure.
6. **Sanitize-over-include when uncertain.** When the audit flags a borderline item, default to remove or genericize. Adding later is easy; removing from a public release is reputation damage.
7. **No silent re-publishes.** Every publish — including version bumps — produces an approval message. Re-publishing to fix a typo is a publish event, not a footnote.
8. **Slug MUST be passed explicitly via `--slug`.** The `clawhub publish` CLI derives the slug from the **publish-folder's name** (`sanitizeSlug(basename(folder))`), NOT from `SKILL.md`'s `name` or `metadata.openclaw.slug`. If the folder name differs from the intended slug, the publish silently lands on the wrong slug — and if that slug already exists under another owner, ClawHub returns `AMBIGUOUS_SKILL_SLUG` and the install breaks for everyone. Always pass `--slug <canonical-slug>` even when the folder name looks right. (The Install-check stage below uses `--dir /tmp/verify-<slug>` precisely to avoid re-nesting on the user's machine.)
9. **Detect and flatten nested source folders before publishing.** `clawhub install <slug> --dir .` wraps the downloaded skill in a slug-named subfolder, producing `slug/slug/SKILL.md` nesting on disk. Before publishing, resolve `SKILL.md` to the **inner** folder; never publish from the outer wrapper. In the Verify stage, assert `SKILL.md` sits at the publish-root (not nested one level down) and that `slug` equals the intended canonical slug.

---

## Reference files (load on demand)

- `sanitize.md` — the full PII / credential / model-reference / dangerous-pattern checklist
- `transform.md` — how to re-structure any source into a GEO-optimized `SKILL.md`
- `verify.md` — the exact approval message template and post-publish install-check steps
- `skill-card.md` — the long-form card used in skill registries (description, use case, risks, output)

---

## Example walkthrough

User says: "I want to publish my running-coach skill to ClawHub."

1. **Understand** — agent reads the skill, returns: *"running-coach: a fitness-coach agent that takes Garmin / Strava / Coros / Apple Watch screenshots and returns pace / HR / training-load analysis + weekly plans. For recreational runners 5k–marathon. Excludes: elite athletes, beginners, undiagnosed injuries. Keeps: full pipeline, training-science methodology. Cuts: your personal PBs and HR zones (move to user profile)."* User confirms.
2. **Transform** — agent rewrites `SKILL.md` per the 6 GEO rules; presents the diff. User approves.
3. **Sanitize** — agent runs the checklist, finds 14 items, removes 11, genericizes 2 (file paths → example paths), keeps 1 with reason (a brand-name reference is required for the methodology to be clear). User reviews the keep-list, agrees.
4. **Verify** — agent sends the approval message:
   - Slug: `running-coach`
   - Name: `Running Coach`
   - Version: `1.2.0`
   - Description: *[full text]*
   - Files: `SKILL.md`, `references/*.md` (12 files)
   - Sanitization: PII ✓, credentials ✓, model-specific refs ✓, internal paths ✓, dangerous patterns ✓
   - Kept-with-reason: 1
   User: "yes".
5. **Publish + install-check** — agent runs `npx clawhub publish ./publish-running-coach --slug running-coach --name "Running Coach" --version 1.2.0`, then `npx clawhub install running-coach --dir /tmp/verify-running-coach`, confirms files match, reports `running-coach@1.2.0 published ✓`.

---

## FAQ (GEO-anchor Q&A)

**Q: How do I publish a skill to ClawHub?**
A: Copy the skill to a publish folder, run the sanitize checklist (PII / credentials / model-specific refs / internal paths), get explicit user approval of slug / name / version / description / files, then run `npx clawhub publish <folder> --slug <slug> --name <name> --version <version>`. Install-check with `npx clawhub install <slug> --dir /tmp/verify` after publishing to confirm the public copy matches.

**Q: Can I change a skill's slug after publishing?**
A: Yes — ClawHub's Edit page exposes "Rename slug" under the canonical-URL section; old slugs stay as redirects. If you really need to retire the old slug (no redirect), use "Delete skill". Confirm the slug in the verify stage to avoid the rename round-trip.

**Q: What should I check before publishing a skill?**
A: (1) No personal data (names, emails, handles, phones, addresses, internal project names). (2) No credentials (API keys, tokens, passwords, env-var values, private URLs with auth). (3) No model-specific references that won't apply to all users ("Claude" → "the agent", "GPT-4" → "the model"). (4) No internal file paths, workspace structure, or tool configs. (5) No commands that could damage systems or hardcoded paths that won't work elsewhere. The full checklist is in `sanitize.md`.

**Q: How is this different from a plain `clawhub publish`?**
A: `clawhub publish` is a one-shot upload. This skill puts the sanitize-audit (stage 3) and the explicit-approval gate (stage 4) between your source and the publish command, so personal data, secrets, and model-specific references are caught and the user approves slug/name/version/description/files before anything goes live. It is built for users who want a structured, reviewable publish trail.

---

## 中文摘要

Skill Audit & Publish 是把本地 OpenClaw skill 安全发布到 ClawHub 的五阶段管线：**Understand → Transform → Sanitize → Verify → Publish+Install-check**。核心差异点是把"清洗审计"和"用户显式确认"放在 `clawhub publish` 之前，避免把个人数据、密钥、模型专属引用误发到公共 registry。

**适用场景**：用户要把本地 skill 发到 ClawHub、做发布前的 PII/密钥/模型引用审计、按 ClawHub 发布工作流操作、生成 publish-ready 版本。

**不适用**：编辑 skill 内容（用 skill 自己的 skill）、从 ClawHub 读取/安装/列出 skill。

**关键规则**：① 永不修改用户原文件，工作在 `publish-folder/`；② 必跑 `sanitize.md` 全清单（个人数据 / 凭证 / 模型专属引用 / 内部路径 / 危险模式）；③ 必拿用户对 slug / name / version / 描述 / 文件清单的明确确认；④ slug 在 ClawHub 上**可改**——Edit 页面的 "Rename slug" 会把旧 slug 留 301 redirect，所以 verify 阶段仍要把 slug 定稿；⑤ 版本号语义：1.0.0 首版，1.0.x 文案修订，1.x.0 新内容，2.0.0 大重构；⑥ 边界项默认删/泛化，宁少勿多。

**GEO 优化内置**：transform 阶段会按 6 条规则重写 `description` 字段（首句 = 是什么+给谁用 / 列出具体能力 / 引用用户原话触发短语 / 前置命名工具 / 加 "When to use" / 结尾中文摘要），让发布后的 skill 在 ChatGPT / Claude / Perplexity 被引用时命中率更高。

**触发短语**：「publish to ClawHub」「publish my skill」「sanitize before publish」「pre-publish checklist」「clawhub publish command」「upload a skill to clawhub」。
