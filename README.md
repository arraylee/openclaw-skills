# openclaw-folotoy

OpenClaw plugin for FoloToy and other hardware voice channels.

## What it does

**Hook 1 — Instant acknowledgment** (`message:received`)
Before the LLM even starts processing, immediately sends a short acknowledgment to the hardware channel so the toy starts speaking right away.

**Hook 2 — TTS content filter** (`message:sent`)
Intercepts outgoing responses and:
- Strips all Markdown formatting (bold, headers, bullets, code blocks)
- Redirects code / JSON / tables → tells user to check Feishu instead
- Preserves stories and poems in full
- Requires OpenClaw ≥ 2026.3.2

## Install

```
openclaw plugins install github:arraylee/openclaw-skills
```

## Channel detection

By default, any channel that is **not** one of the known rich-text surfaces (webchat, feishu, discord, slack, telegram, whatsapp, signal, matrix, msteams, imessage) is treated as a hardware channel.

To pin it to a specific channel ID:
```
# in ~/.openclaw/.env
FOLOTOY_CHANNEL=your_channel_id
```

## License

MIT-0
