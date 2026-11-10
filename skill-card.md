## Description:

Audits and prepares OpenClaw skills for reviewed publishing to ClawHub, SkillHub, and GitHub.

This skill is ready for commercial/non-commercial use.

## Publisher:

[haiyangchenbj](https://clawhub.ai/user/haiyangchenbj)

### License/Terms of Use:

MIT-0

## Use Case:

Skill authors and developers use this workflow to audit a skill for sensitive content, prepare a publish-ready copy, obtain approval, and check the published release.

### Deployment Geography for Use:

Global

## Known Risks and Mitigations:

Risk: Post-publish writeback can overwrite the original local skill despite the stated promise to leave originals unchanged.

Mitigation: Use a publish-ready copy, and require an explicit diff and backup before approving any writeback to the original folder.

Risk: Publishing can expose unintended files or credentials to public services.

Mitigation: Review the exact upload file list and tokens before publishing, and run the sanitization checklist.

## Reference(s):

- [ClawHub skill listing](https://clawhub.ai/haiyangchenbj/skills/skill-audit-publish)
- [Sanitization checklist](artifact/sanitize.md)
- [Publish rules](artifact/references/publish-rules.md)
- [SkillHub publishing guide](artifact/references/skillhub-publish.md)

## Skill Output:

**Output Type(s):** [Guidance, Markdown, Shell commands, Files]

**Output Format:** [Markdown guidance and a publish-ready skill folder]

**Output Parameters:** [1D]

**Other Properties Related to Output:** [Includes a file manifest, approval summary, and post-publish install check.]

## Skill Version(s):

1.5.10 (source: server release and skill frontmatter)

## Ethical Considerations:

Users should evaluate whether this skill is appropriate for their environment, review any generated or modified files before relying on them, and apply their organization's safety, security, and compliance requirements before deployment.
