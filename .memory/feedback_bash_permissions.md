---
name: Bash Permissions — How to pre-approve
description: Casey wants bash commands auto-approved; explain how to set this in Claude Code settings
type: feedback
---

Casey wants all bash commands auto-approved across sessions. This is a Claude Code setting, not something that can be changed from inside a session.

**Why:** Avoids approval prompts interrupting build flow, especially for validation, backup, and git commands.

**How to apply:**

In VS Code with Claude Code extension:
1. Open command palette → "Claude Code: Open Settings"
2. Set `"permissions.mode"` to `"acceptEdits"` (approves edits + bash)
   OR set specific `"allowedTools"` to include `"Bash"`
3. Alternatively, add to project `.claude/settings.json`:
   ```json
   { "permissions": { "allow": ["Bash"] } }
   ```

Remind Casey of this path if she asks again — it's a one-time setup per machine/project.
