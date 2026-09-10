## Description:

Audit-first pipeline for publishing OpenClaw skills to ClawHub with sanitization, verification, explicit approval, and install-check steps before release.

This skill is ready for commercial/non-commercial use.

## Publisher:

[haiyangchenbj](https://clawhub.ai/user/haiyangchenbj)

### License/Terms of Use:

MIT-0

## Use Case:

Developers and skill authors use this skill to prepare OpenClaw skills for public ClawHub release by auditing content, cleaning sensitive material, confirming publish metadata, and validating the installed result.

### Deployment Geography for Use:

Global

## Known Risks and Mitigations:

Risk: Publishing or GitHub sync can expose cleaned skill contents to public services.

Mitigation: Use audit-only mode until the slug, version, destination, and file list have been reviewed and explicitly approved.

Risk: The optional GitHub sync helper can create or update files in the configured repository when run with a GitHub token.

Mitigation: Run the helper only with an approved repository, branch, and file list; provide tokens through environment variables and review remote file state after major restructures.

Risk: Unsafe file selections such as absolute paths, parent-directory traversal, or symlinked content can publish material outside the intended skill package.

Mitigation: Use relative, reviewed file lists from a publish staging folder and avoid absolute paths, '..' components, and symlinks.

## Reference(s):

- [ClawHub Skill Listing](https://clawhub.ai/haiyangchenbj/skills/skill-audit-publish)
- [Publish Rules for ClawHub & GitHub](references/publish-rules.md)
- [README](README.md)
- [Sanitization Checklist](sanitize.md)
- [Verification Workflow](verify.md)

## Skill Output:

**Output Type(s):** [text, markdown, code, shell commands, configuration, guidance]

**Output Format:** [Markdown guidance with structured checklists, approval text, file outputs, and inline shell commands]

**Output Parameters:** [1D]

**Other Properties Related to Output:** [Produces a publish folder, rewritten skill metadata, a file manifest, an approval message, and optional publish or GitHub sync commands.]

## Skill Version(s):

1.5.3 (source: frontmatter, release evidence)

## Ethical Considerations:

Users should evaluate whether this skill is appropriate for their environment, review any generated or modified files before relying on them, and apply their organization's safety, security, and compliance requirements before deployment.
