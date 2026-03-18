---
name: quick-ack
description: For every message from the FoloToy hardware channel — immediately output a brief acknowledgment in the agent's SOUL.md voice, then rewrite the full response into a clean, TTS-friendly format before delivering it.
user-invocable: false
metadata: {"openclaw":{"emoji":"⚡","always":true}}
---

# FoloToy Channel: Instant Ack + TTS-Friendly Response

## Scope

This skill activates when the inbound message comes from a **hardware/voice channel** — i.e. any channel that is NOT a rich-text surface where users can read formatted output.

### Channel detection (in priority order)

1. **Env var override**: If `FOLOTOY_CHANNEL` is set, activate only when the current channelId exactly matches that value. This is the most reliable option once you know the channel name.

2. **Exclusion list (fallback)**: If `FOLOTOY_CHANNEL` is not set, activate for any channel that is **not** in this known rich-text list:
   - `webchat`
   - `feishu` / `lark`
   - `discord`
   - `slack`
   - `telegram`
   - `whatsapp`
   - `signal`
   - `matrix`
   - `msteams`
   - `imessage`

   Any channel not on this list is treated as a hardware/voice surface and gets the TTS-friendly treatment.

If the message **is** from a known rich-text channel, do nothing — skip this skill entirely.

---

## Step 1 — Acknowledgment (do this FIRST, before anything else)

The very first tokens you output must be a single short acknowledgment sentence.

Rules:
- Output it **immediately** — before thinking, before tool calls, before generating the answer
- Use the voice and personality defined in `SOUL.md` exactly
- Match the **language** of the user's message (Chinese → Chinese, English → English)
- Maximum 15 words / 20 Chinese characters
- Signal you heard them and are now working on it — do NOT preview the answer
- Do NOT skip this step even for simple questions

---

## Step 2 — Generate the answer normally

Process the user's request as you normally would. Use tools if needed. Generate the full response internally.

---

## Step 3 — Rewrite for TTS playback

Before outputting the answer, pass it through the following rewrite rules. Use the current LLM to perform this rewrite.

### Always do:
- Remove all Markdown formatting: no `**bold**`, no `# headings`, no `- bullet lists`, no `> blockquotes`
- Replace list items with natural spoken sentences
- Replace abbreviations and symbols with spoken equivalents (e.g. `→` → "to", `&` → "and", `%` → "percent")
- Keep sentences short — aim for ≤ 20 words per sentence
- Remove meta-commentary like "Here is my answer:" or "In summary:"

### If the response contains code blocks or structured data (JSON, tables, formulas):
- Do NOT read out the code or data
- Instead say: **"详细内容我已经发到飞书了，你去飞书查看一下吧～"** (or the English equivalent: "I've sent the details to Feishu — check it there!")
- *(Note: Feishu forwarding is handled by the feishu-bridge skill when available)*

### If the response is a story, poem, or creative narrative:
- Output the **full original text** without condensing
- Only strip Markdown formatting; preserve all story content word for word

### For all other responses:
- Condense to the core answer only
- Remove background explanation unless the user explicitly asked "why" or "explain"
- Target length: ≤ 5 sentences for most answers

---

## Output format

```
[Acknowledgment sentence]

[TTS-rewritten answer]
```

No section headers, no labels, no "Step 1 / Step 2" markers in the output — just the two pieces of text, delivered naturally.

---

## Guardrails

- Never output raw Markdown to FoloToy channel
- Never skip the acknowledgment, even for one-word answers
- Never read out code, JSON, or table data — always redirect to Feishu
- Preserve story content in full — do not summarize narratives
