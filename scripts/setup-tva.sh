#!/bin/bash

# TVA Setup Script - Creates ~/Documents/TVA with default files

TVA_PATH="$HOME/Documents/TVA"
echo "🚀 Setting up TVA at $TVA_PATH..."

# Create structure
mkdir -p "$TVA_PATH"/{projects,skills,extensions,sessions/active,notes}

# Last Session Template
cat > "$TVA_PATH/last-session.md" << 'EOF'
# Session: YYYY-MM-DD - Title

**What happened:** 

**What's next:** 

**Blockers:** None

---
*Session date: YYYY-MM-DD*
EOF

# Soul - Operating Principles
cat > "$TVA_PATH/soul.md" << 'EOF'
# Soul

## Operating Principles

1. **Compound Everything** - Every decision, every file, every mistake compounds
2. **Speed Is a Feature** - If it doesn't make you faster, don't build it
3. **Radical Honesty** - Tell the truth, even when it's hard
4. **Context is King** - Fight context loss with documentation
5. **Ship Mentality** - Perfect is the enemy of shipped

---
*Last updated: YYYY-MM-DD*
EOF

# Identity - Who you are
cat > "$TVA_PATH/identity.md" << 'EOF'
# Identity

## Who I Am

[Caption]'s second brain. Cognitive amplifier.

## Relationship

- **Partner, not servant** - Think alongside, not just execute
- **External memory** - Remember so you don't have to
- **Truth teller** - Honest feedback, not validation

## Commitment

- Read TVA before every session
- Maintain complete context
- Track what worked, what didn't
- Surface connections between work

---
*Last updated: YYYY-MM-DD*
EOF

# Memory - System docs
cat > "$TVA_PATH/memory.md" << 'EOF'
# Memory

## File Structure

```
~/Documents/TVA/
├── last-session.md    ← What happened last
├── soul.md            ← Operating principles
├── identity.md        ← Who you are
├── memory.md          ← This file
├── pending.md         ← Current tasks
├── blockers.md        ← What's blocking you
├── projects/         ← Project documentation
├── skills/            ← Capabilities
├── extensions/        ← Tools
└── notes/             ← General notes
```

## Refresh Order

1. last-session.md
2. soul.md
3. identity.md
4. memory.md
5. pending.md
6. blockers.md
7. projects/*/README.md

---
*Last updated: YYYY-MM-DD*
EOF

# Pending Tasks
cat > "$TVA_PATH/pending.md" << 'EOF'
# Pending Tasks

## Active

## Backlog

---
*Last updated: YYYY-MM-DD*
EOF

# Blockers
cat > "$TVA_PATH/blockers.md" << 'EOF'
# Blockers

| Project | Blocker | Status |
|---------|---------|--------|
| — | — | — |

---
*Last updated: YYYY-MM-DD*
EOF

# Projects README
cat > "$TVA_PATH/projects/README.md" << 'EOF'
# Projects

Add a subdirectory for each project with its own README.md.

Example project structure:
```
projects/
├── my-project/
│   └── README.md
└── README.md
```

---
*Last updated: YYYY-MM-DD*
EOF

echo "✅ TVA setup complete!"
echo ""
echo "Created files at $TVA_PATH:"
ls -la "$TVA_PATH"
echo ""
echo "Edit the .md files to add your memory, then start a new pi session!"