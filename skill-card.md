## Description:

Audit-first pipeline to publish an OpenClaw skill to ClawHub without leaking personal data, credentials, or model-specific references.

This skill is ready for commercial/non-commercial use.

## Publisher:

[haiyangchenbj](https://clawhub.ai/user/haiyangchenbj)

### License/Terms of Use:

MIT-0

## Use Case:

Developers and skill publishers use this skill to audit, sanitize, package, publish, and install-check SKILL.md-based OpenClaw skills for ClawHub and optional GitHub mirroring.

### Deployment Geography for Use:

Global

## Known Risks and Mitigations:

Risk: The bundled GitHub sync helper can upload files outside the intended publish folder when unsafe file paths are supplied.

Mitigation: Inspect the exact --files list, avoid absolute paths and ../ entries, run from a clean staging directory, and add path-containment checks before providing a GitHub token.

Risk: Publish mode can transmit cleaned skill contents to public ClawHub and GitHub services using user-provided credentials.

Mitigation: Run audit mode first, confirm the file list and version explicitly, and treat all published content as public before invoking publish or GitHub sync commands.

## Reference(s):

- [ClawHub skill page](https://clawhub.ai/haiyangchenbj/skills/skill-audit-publish)
- [Publish Rules for ClawHub & GitHub](artifact/references/publish-rules.md)
- [Sanitize checklist](artifact/sanitize.md)
- [Transform workflow](artifact/transform.md)
- [Verify workflow](artifact/verify.md)

## Skill Output:

**Output Type(s):** [text, markdown, code, shell commands, configuration, guidance]

**Output Format:** [Markdown guidance with file manifests, approval text, shell commands, and generated skill files]

**Output Parameters:** [1D]

**Other Properties Related to Output:** [May produce a publish folder containing SKILL.md, FILES.txt, supporting markdown files, _meta.json, and an approval summary before any publish action.]

## Skill Version(s):

1.5.4 (source: server release metadata and SKILL.md frontmatter)

## Ethical Considerations:

Users should evaluate whether this skill is appropriate for their environment, review any generated or modified files before relying on them, and apply their organization's safety, security, and compliance requirements before deployment.
