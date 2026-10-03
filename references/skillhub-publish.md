# Publishing to SkillHub (stage 5b)

> Loaded by stage 5 of the pipeline. Kept out of the skill file on purpose — the skill file stays a routing surface; operational detail lives here.

SkillHub is the third platform in the unified-version rule. **There is no maintained CLI for it.** A helper named `skills_store_cli.py` used to exist and no longer ships anywhere on a typical machine — do not spend time searching for it. Build the request directly.

---

## Endpoint

```
POST https://api.skillhub.cn/api/v1/community/skills/publish
```

## Auth

Bearer token from `~/.skillhub/credentials.json` → **`user.token`**.
The file has no top-level `token` key; reading `d["token"]` yields null and produces a misleading 401/403.

## Request — multipart/form-data

**Part 1** — field `payload`, `Content-Type: application/json`:

```json
{
  "slug": "my-skill",
  "displayName": "My Skill",
  "version": "1.2.3",
  "description": "one-line English summary",
  "changelog": "what changed",
  "category": "",
  "subCategories": [],
  "source": "community",
  "tags": ["tag-a", "tag-b"]
}
```

**Parts 2..n** — one per file:

- field name **must be `files`** (`file` and `files[]` are wrong)
- `filename` = repo-relative path with forward slashes, e.g. `references/guardian-patterns.md`
- `Content-Type: text/markdown`

## Response

| Code | Meaning |
|---|---|
| **201** | accepted — body carries `ok:true`, `version`, `fileCount`, `skillId`, `fingerprint`, and `pending` review/scan statuses |
| 400 | frontmatter or payload validation failed |
| 409 | slug tombstoned, or version already exists → bump and retry. **Never delete a `source=community` skill to force a republish** — the slug becomes an unrecoverable tombstone |
| 429 | consecutive publishes rate-limited → wait ~90s (a single 90 s backoff has been the reliable fix in practice; 20 s retries can fail repeatedly) |
| 503 | transient → wait ~20s and retry once |

## Constraints

- **No read API.** Every `GET` under `/api/v1/community/skills/*` returns 405, including `/mine`, `/list`, and `/rankings`, with or without a Bearer token. You cannot verify remotely whether a skill is already on SkillHub. Use side evidence instead: `clawhub inspect <slug> --versions` plus the existence of the GitHub mirror repo.
- **Stricter frontmatter than ClawHub.** Required: leading `---` delimiter, `slug`, `displayName`, `version`. Files retrieved via `clawhub install` often lose the leading `---` in ClawHub storage — backfill it before publishing.
- **`LICENSE` is rejected.** Publish from a staging copy that excludes it.
- **Version must match ClawHub and GitHub exactly.** No platform-local version numbers.

## Ordering inside stage 5

1. ClawHub publish (async — settle with `inspect --json` → `latestVersion.version`)
2. **SkillHub publish (this file)**
3. GitHub sync from the staging dir (never from an install dir)
4. Install-check against ClawHub

Skipping step 2 is the most common way the three-platform version rule breaks: the skill lands on two platforms, the version registry drifts apart, and the next publish has to guess which number is authoritative.

## Registry API notes (from the 2026-09-27 publish round)

1. **`GET /api/v1/skills/{slug}/scan` re-triggers a scan.** Every call resets the scanner state
   (`isPendingScan`, SkillSpector/LLM fields emptied) — do not poll it. For read-only checks use
   `GET /api/v1/skills/{slug}/versions/{version}` (the response carries the full `security` block).
2. **Duplicate slugs across owners.** If a slug exists under two accounts (e.g. `chinese-fortune-telling`
   by haiyangchenbj and jakezhang739), `clawhub inspect/install` fail with `AMBIGUOUS_SKILL_SLUG` and the
   `@owner/slug` ref form is rejected by the CLI. Direct API calls accept `?owner=<handle>` — use it.
3. **SkillSpector per-issue detail is not exposed by the API.** Only `issueCount` / `score` /
   `severity` / `recommendation`. Locate individual issues via the LLM scanner's `findings` text
   (AR/EA/RA/T/SQP/SDI/SC codes) and `dimensions`.
4. **`GET /api/v1/skills/{slug}/file?path=...&version=...&owner=...` returns the raw file**
   (`text/markdown`), not JSON. Useful for install-check when the CLI cannot resolve an ambiguous slug.
5. **SkillHub credentials may not exist at the documented path.** On this machine
   `~/.skillhub/credentials.json` is absent (`~/.skillhub/config.json` holds only URLs). When the token
   is missing, stop and ask the user — do not guess tokens from traces.
