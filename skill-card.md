## Description:

Skill Audit & Publish guides agents through an audit-first workflow for sanitizing, verifying, publishing, and install-checking OpenClaw skills on ClawHub.

This skill is ready for commercial/non-commercial use.

## Publisher:

[haiyangchenbj](https://clawhub.ai/user/haiyangchenbj)

### License/Terms of Use:

MIT-0

## Use Case:

Developers and skill maintainers use this skill to prepare SKILL.md-based OpenClaw skills for public release. It supports pre-publish auditing, personal-data and secret checks, user approval gates, ClawHub publishing, optional GitHub mirroring, and post-publish install verification.

### Deployment Geography for Use:

Global

## Known Risks and Mitigations:

Risk: The GitHub sync helper can be steered to upload files outside the intended publish folder if --files values come from untrusted input.

Mitigation: Enforced in code (fail-closed): absolute paths, ".." components, symlinked path segments, and any entry resolving outside the local skill directory are rejected before anything is read or uploaded. Use a manually checked file list from the publish staging folder.

Risk: Publish mode and optional GitHub mirroring transmit cleaned skill contents to public services.

Mitigation: Run the sanitization checklist and require explicit user approval of the slug, version, description, and file list before publishing.

Risk: The optional GitHub sync helper requires a GitHub token at runtime.

Mitigation: Provide credentials only through GITHUB_TOKEN or GITHUB_PAT environment variables, keep token values out of files and logs, and use the least privilege needed for the target repository.

## Reference(s):

- [ClawHub Skill Page](https://clawhub.ai/haiyangchenbj/skills/skill-audit-publish)
- [README](README.md)
- [Sanitize Checklist](sanitize.md)
- [Verification Workflow](verify.md)
- [Publish Rules for ClawHub and GitHub](references/publish-rules.md)

## Skill Output:

**Output Type(s):** [text, markdown, code, shell commands, configuration, files, guidance]

**Output Format:** [Markdown guidance with command snippets and generated skill files]

**Output Parameters:** [1D]

**Other Properties Related to Output:** [May include a local publish folder, approval message, ClawHub publish command, optional GitHub sync command, and verification checklist.]

## Skill Version(s):

1.5.6 (source: server release evidence and SKILL.md frontmatter)

## Ethical Considerations:

Users should evaluate whether this skill is appropriate for their environment, review any generated or modified files before relying on them, and apply their organization's safety, security, and compliance requirements before deployment.
