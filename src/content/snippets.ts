export const CLI_COMMANDS = [
  { cmd: "repro init", desc: "Scaffold .repro/ and REPRO.md" },
  { cmd: "repro record -- <cmd>", desc: "Record an agent run through the proxy" },
  { cmd: "repro run <id>", desc: "Replay a recorded run" },
  { cmd: "repro save <id>", desc: "Promote a recording into REPRO.md" },
  { cmd: "repro test", desc: "Replay all open failures in CI" },
  { cmd: "repro list", desc: "List all recordings" },
  { cmd: "repro inspect <id>", desc: "Show trace timeline" },
  { cmd: "repro diff <a> <b>", desc: "Align and compare two traces" },
  { cmd: "repro explain <a> <b>", desc: "Report first divergence point" },
  { cmd: "repro minimize <id>", desc: "Delta-debug to find minimal reproducing set" },
] as const;

export const FILE_STRUCTURE = `REPRO.md
.repro/
├── r-7f3a91/
│   ├── trace.json
│   ├── meta.json
│   ├── assertions.json
│   └── blobs/
│       ├── sha256-a1b2c3...
│       └── sha256-d4e5f6...
└── r-2b8e04/
    ├── trace.json
    ├── meta.json
    └── assertions.json`;

export const REPRO_MD_CONTENT = `# REPRO.md — Known Agent Failures

This file is maintained by repro. Each row is a recorded agent failure
that replays without an API key.

Run \`repro test\` to replay all open failures.

| ID | Title | Status | First Seen |
|----|-------|--------|------------|
| r-7f3a91 | agent modifies generated files | open | 2026-08-15 |
| r-31fa22 | infinite tool loop on large file | fixed | 2026-08-10 |
| r-2b8e04 | writes outside project directory | open | 2026-08-12 |`;

export const TRACE_EXCERPT = `[
  {
    "seq": 0,
    "type": "process.start",
    "timestamp": "2026-08-15T10:00:00.000Z",
    "data": {
      "command": ["claude", "fix the auth bug"],
      "pid": 12345
    }
  },
  {
    "seq": 1,
    "type": "model.request",
    "timestamp": "2026-08-15T10:00:01.000Z",
    "data": {
      "normalizedHash": "sha256-abc123...",
      "messageHashes": ["sha256-111...", "sha256-222..."],
      "body": {
        "model": "claude-sonnet-4-20250514",
        "messages": [...]
      }
    }
  },
  {
    "seq": 2,
    "type": "model.response",
    "timestamp": "2026-08-15T10:00:03.000Z",
    "data": {
      "body": {
        "content": [
          {
            "type": "tool_use",
            "name": "read_file",
            "input": { "path": "src/auth.ts" }
          }
        ],
        "stop_reason": "tool_use"
      }
    }
  }
]`;

export const HERO_TERMINAL_HTML = `<span class="prompt">$</span> repro record -- claude
  repro: agent failed after 41 events
  repro: saved r-7f3a91

<span class="prompt">$</span> repro run r-7f3a91
  repro: <span class="pass">✓</span> reproduced — 41 events, 0 API calls, 0 API keys

<span class="prompt">$</span> repro test
  repro: <span class="pass">✓</span> 2 passed, <span class="fail">✗</span> 1 failed, <span class="warn">⚠</span> 0 diverged`;

export const RECORD_OUTPUT_HTML = `<span class="prompt">$</span> repro record -- claude
repro: recording r-7f3a91
repro: proxy listening on http://127.0.0.1:54321
repro: agent failed after 41 events
repro: saved r-7f3a91`;

export const REPLAY_OUTPUT_HTML = `<span class="prompt">$</span> repro run r-7f3a91
repro: replaying r-7f3a91 (41 events)
repro: mode: strict
repro: worktree at /tmp/repro-wt-abc123
repro: <span class="pass">✓</span> reproduced — 41 events, 0 API calls, 0 API keys
repro: <span class="pass">✓</span> working tree restored`;

export const TEST_OUTPUT_HTML = `<span class="prompt">$</span> repro test
repro: <span class="pass">✓</span> r-31fa22 — fixed tool loop
repro: <span class="pass">✓</span> r-82d101 — fixed generated file writes
repro: <span class="fail">✗</span> r-7f3a91 — assertion failed
repro:   <span class="fail">✗</span> Forbidden path src/gen/** matched: seq 14: model.response touched src/gen/output.ts

repro: <span class="pass">✓</span> 2 passed, <span class="fail">✗</span> 1 failed, <span class="warn">⚠</span> 0 diverged`;

export const MINIMIZE_HTML = `<span class="dim">47 context items → 19 → 7 → 3</span>

AGENTS.md
src/generated/user_pb.ts
edit_file`;

export const CTA_HTML = `<span class="prompt">$</span> repro record -- &lt;agent&gt;`;

export const INIT_HTML = `<span class="prompt">$</span> repro init
repro: created .repro/
repro: created REPRO.md`;

export const ASSERTION_TYPES = [
  { type: "forbidden_path:<glob>", desc: "Fail if any tool call touches a matching path" },
  { type: "no_repeat:<n>", desc: "Fail if same tool call (name+args) repeats > n times" },
  { type: "max_calls:<n>", desc: "Fail if total model API calls exceed n" },
  { type: "command:<cmd>", desc: "Run shell command in worktree; non-zero = failure" },
] as const;

export const SAVE_EXAMPLE = `repro save r-7f3a91 \\
  --title "agent modifies generated files" \\
  --assertion forbidden_path:src/gen/** \\
  --assertion max_calls:5`;

export const CI_WORKFLOW = `# .github/workflows/repro.yml
name: Repro Tests
on: [push, pull_request]
jobs:
  repro-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci && npm run build
      - run: npx repro test`;
