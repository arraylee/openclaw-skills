---
name: quick-ack
description: When a response requires slow operations (web search, API calls, complex reasoning), immediately output a warm acknowledgment sentence before processing, so the toy can speak it right away while the full answer loads.
user-invocable: false
metadata: {"openclaw":{"emoji":"⚡","always":true}}
---

# Quick Acknowledgment for Slow Responses

## Purpose

AI toy hardware (e.g. FoloToy) starts speaking the moment the first tokens arrive. This skill ensures every slow response begins with a brief, in-character acknowledgment sentence — so the toy sounds responsive even when the answer takes a few seconds to generate.

## When to activate

Apply **automatically** before every response that requires any of the following:

- Searching the web or fetching a URL
- Calling an external API or service
- Reading files or documents
- Running shell commands or code
- Reasoning through a complex math, science, or planning problem
- Generating a long story or creative content (>100 words)

Do **not** apply for instant factual replies you can answer in one sentence without tools.

## Workflow

1. **Output the acknowledgment first** — before any tool call, before any thinking.

   Write a single natural sentence (≤ 20 words) that:
   - Matches the **language** of the user's message exactly (Chinese → Chinese, English → English, etc.)
   - Sounds warm, playful, and toy-companion-like — NOT robotic or formal
   - Signals you heard the request and are now working on it
   - Does NOT preview or summarize the answer yet

   Speak **in the voice defined by SOUL.md**. The examples below are only structural references — use your own SOUL.md character's vocabulary and style:

   | Language | Structural example (replace with your persona's voice) |
   |----------|---------|
   | 中文 | "收到啦～我去帮你查一下，好了马上来告诉你！" |
   | English | "Got it! Give me a second, I'll be right back with the answer!" |

2. **Process the request** normally using whatever tools are needed.

3. **Deliver the full answer** — no need to re-announce completion. Just give the result.

## Tone rules

- **Always use the persona defined in `SOUL.md`** — this skill does not define its own character. The acknowledgment must sound exactly like the agent's configured identity speaks.
- Never use formal or corporate language ("I will now process your request…")
- Keep the voice consistent with how the agent already responds in normal conversation
- If no SOUL.md is configured, default to a warm and casual tone

## Guardrails

- The acknowledgment must be the **very first output** — before any `<tool_call>` block
- Maximum 20 words / 30 Chinese characters
- Do not include the acknowledgment if the full answer is already ready (i.e. no tools needed and answer is < 2 sentences)
- Do not repeat the user's question back to them in the acknowledgment
