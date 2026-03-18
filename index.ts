/**
 * openclaw-folotoy plugin
 *
 * Provides two hooks for FoloToy (and any non-rich-text hardware channel):
 *   1. message:received  → push an immediate acknowledgment before the LLM starts
 *   2. message:sent      → strip Markdown / redirect code to Feishu before TTS delivery
 *
 * Channel detection:
 *   - If FOLOTOY_CHANNEL env var is set, only that channel is treated as hardware.
 *   - Otherwise, any channel NOT in the RICH_TEXT_CHANNELS exclusion list is treated as hardware.
 */

const RICH_TEXT_CHANNELS = new Set([
  "webchat",
  "feishu",
  "lark",
  "discord",
  "slack",
  "telegram",
  "whatsapp",
  "signal",
  "matrix",
  "msteams",
  "imessage",
]);

function isHardwareChannel(channelId: string): boolean {
  const configured = process.env.FOLOTOY_CHANNEL;
  if (configured) return channelId === configured;
  const id = channelId.toLowerCase();
  return ![...RICH_TEXT_CHANNELS].some((c) => id.includes(c));
}

function detectLanguage(text: string): "zh" | "en" {
  return /[\u4e00-\u9fff]/.test(text) ? "zh" : "en";
}

function isStoryOrPoem(text: string): boolean {
  const storyMarkers =
    /从前|once upon|很久很久以前|the end|故事开始|第[一二三四五六七八九十]+章/i;
  // Heuristic: long continuous prose with no code blocks
  return storyMarkers.test(text) || (text.length > 500 && !/```/.test(text));
}

function hasCodeOrData(text: string): boolean {
  return /```[\s\S]*?```/.test(text) || /^\s*\{[\s\S]*\}\s*$/m.test(text);
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "") // remove code blocks
    .replace(/`[^`]+`/g, "") // inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/#{1,6}\s+/g, "") // headings
    .replace(/>\s+/g, "") // blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → label only
    .replace(/^[-*+]\s+/gm, "") // bullet points
    .replace(/^\d+\.\s+/gm, "") // numbered lists
    .replace(/\n{3,}/g, "\n\n") // collapse blank lines
    .trim();
}

export default function (api: any) {
  // ── Hook 1: Immediate acknowledgment ──────────────────────────────────────
  api.registerHook(
    "message:received",
    async (event: any) => {
      const channelId = event.context?.channelId ?? "";
      if (!isHardwareChannel(channelId)) return;

      const userText =
        event.context?.content ?? event.context?.bodyForAgent ?? "";
      const lang = detectLanguage(userText);

      const ack =
        lang === "zh"
          ? "收到啦～我去处理一下，好了马上告诉你！"
          : "Got it! Give me a moment, I'll be right back!";

      event.messages.push(ack);
    },
    { name: "folotoy.quick-ack" }
  );

  // ── Hook 2: TTS-friendly content filter ───────────────────────────────────
  // Requires OpenClaw ≥ 2026.3.2 (message:sent + event.transform support)
  api.registerHook(
    "message:sent",
    async (event: any) => {
      const channelId = event.context?.channelId ?? "";
      if (!isHardwareChannel(channelId)) return;

      const text: string = event.context?.text ?? "";
      if (!text) return;

      const lang = detectLanguage(text);

      // 1. Code / structured data → redirect to Feishu
      if (hasCodeOrData(text)) {
        event.transform = {
          text:
            lang === "zh"
              ? "详细内容我已经发到飞书了，你去飞书查看一下吧～"
              : "I've sent the details to Feishu — check it there!",
        };
        return;
      }

      // 2. Story / poem → preserve full text, only strip Markdown formatting
      if (isStoryOrPoem(text)) {
        const cleaned = stripMarkdown(text);
        if (cleaned !== text) event.transform = { text: cleaned };
        return;
      }

      // 3. Everything else → strip Markdown for clean TTS output
      const cleaned = stripMarkdown(text);
      if (cleaned !== text) event.transform = { text: cleaned };
    },
    { name: "folotoy.tts-filter" }
  );
}
