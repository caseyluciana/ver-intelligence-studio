---
name: no-large-files-in-chat
description: Never paste or load large files directly into chat — always use file path instead
metadata:
  node_type: memory
  type: feedback
  originSessionId: aeb5301a-83a8-4fb0-a536-00e54c88e81e
  modified: 2026-10-27T21:12:13.262Z
---

Never paste a large file's contents directly into the chat window, and do not open very large files that would load their full content into context.

**Why:** On Oct 27, 2026, Casey accidentally introduced a large file (RIS Squads context) directly into the chat. The session history grew to 723MB and froze the entire chat, forcing a /clear and losing all context. Casey was devastated.

**How to apply:** If Casey is about to share a file or says "let me add this file," remind her to give the file PATH instead — Ashborn reads it with tools, not by having it pasted in. If a file is very large (>1MB), read it in chunks with offset/limit rather than all at once. Never load the 723MB session history file (`fdd71aed-...jsonl`) — it will freeze things again.
