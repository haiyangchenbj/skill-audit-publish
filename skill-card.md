## Description: <br>
Audit-first pipeline for preparing and publishing an OpenClaw skill to ClawHub with sanitization, verification, explicit approval, and install-check steps. <br>

This skill is ready for commercial/non-commercial use. <br>

## Publisher: <br>
[haiyangchenbj](https://clawhub.ai/user/haiyangchenbj) <br>

### License/Terms of Use: <br>
MIT-0 <br>


## Use Case: <br>
Developers and skill authors use this agent skill to prepare a public ClawHub release, sanitize skill content, verify slug/name/version/files, and require explicit approval before publishing. <br>

### Deployment Geography for Use: <br>
Global <br>

## Known Risks and Mitigations: <br>
Risk: Publishing can expose private data, credentials, internal paths, or model-specific references if the generated folder is not reviewed. <br>
Mitigation: Review the publish folder, sanitization checklist, kept-with-reason items, slug, name, version, and file list before approving any ClawHub publish command. <br>
Risk: A mistaken slug, version, or file set could create a public release that needs correction. <br>
Mitigation: Use the verification gate and install-check workflow before and after publishing, then publish a corrected version or use ClawHub edit controls if needed. <br>


## Reference(s): <br>
- [ClawHub Skill Page](https://clawhub.ai/haiyangchenbj/skills/skill-audit-publish) <br>
- [ClawHub Publisher Profile](https://clawhub.ai/user/haiyangchenbj) <br>


## Skill Output: <br>
**Output Type(s):** [text, markdown, shell commands, configuration, guidance] <br>
**Output Format:** [Markdown guidance with inline shell commands and generated publish-folder files] <br>
**Output Parameters:** [1D] <br>
**Other Properties Related to Output:** [Produces a local publish folder, manifest, auxiliary checklist files, and an approval message before any publish command.] <br>

## Skill Version(s): <br>
1.1.2 (source: server release metadata; artifact frontmatter reports 1.1.0) <br>

## Ethical Considerations: <br>
Users should evaluate whether this skill is appropriate for their environment, review any generated or modified files before relying on them, and apply their organization's safety, security, and compliance requirements before deployment. <br>
