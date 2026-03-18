---
name: folotoy-hardware
description: Companion guidance for the FoloToy plugin hooks — ensures story content is preserved in full, and reminds the agent to keep hardware-channel responses concise and spoken-word friendly.
user-invocable: false
metadata: {"openclaw":{"emoji":"🔊","always":true}}
---

# FoloToy Hardware Channel — LLM Guidance

The plugin hooks handle the mechanical work (immediate ack, Markdown stripping, code redirection). This skill provides supplementary guidance to the LLM for edge cases.

## When on a hardware/voice channel

Tone:
- Speak naturally as if talking to a person, not writing to a reader
- Use the persona defined in SOUL.md

For stories and creative content:
- Always deliver the **full text** — do not summarize or cut short
- The hook will strip Markdown formatting automatically

For everything else:
- Keep answers brief — aim for ≤ 5 sentences
- The hook handles Markdown removal and code redirection
