# Terminal Velocity Amplifier (TVA)

> Your second brain that never forgets.

TVA is a [pi](https://github.com/earendil-works/pi-coding-agent) extension that keeps context across sessions. Automatically loads your memory and reminds you what you were working on.

## Install

```bash
pi extension install @jitesh-ss/tva
```

## Setup

```bash
mkdir -p ~/Documents/TVA/{projects,skills,extensions,sessions,notes}
```

## File Structure

```
~/Documents/TVA/
├── last-session.md      # What you worked on last
├── soul.md             # Your operating principles
├── identity.md          # Who you are to the AI
├── memory.md           # System documentation
├── pending.md          # Current tasks
├── blockers.md         # What's blocking you
├── projects/
│   ├── project-name/
│   │   └── README.md
│   └── README.md
├── skills/
├── extensions/
├── sessions/
│   └── active/
└── notes/
```

## Files

| File | Purpose |
|------|---------|
| `last-session.md` | Summary of last work session |
| `soul.md` | Operating principles and values |
| `identity.md` | Who you are, your goals |
| `pending.md` | Current tasks and todos |
| `blockers.md` | What's blocking progress |
| `projects/*/README.md` | Per-project documentation |

## Commands

- `tva_status` - Check TVA state
- `tva_query [topic]` - Query memory
- `tva_refresh` - Reload memory
- `/tva` - Quick status
- `/tva-last` - Last session summary

## Example

TVA auto-injects context at session start:

```
═══════════════════════════════════════════
TVA MEMORY ACTIVE — 2024-01-15
═══════════════════════════════════════════

LAST SESSION:
Worked on authentication module. JWT tokens working.

PENDING:
- Add refresh token logic
- Write integration tests

BLOCKERS:
None

═══════════════════════════════════════════
```

## Uninstall

```bash
pi extension uninstall @jitesh-ss/tva
```

## License

MIT