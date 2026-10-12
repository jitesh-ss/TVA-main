/**
 * Terminal Velocity Amplifier (TVA)
 * 
 * Your second brain that never forgets.
 * https://github.com/jitesh-ss/TVA-main
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { homedir } from "node:os";

const home = process.env.HOME || homedir();
const defaultPath = join(home, "Documents", "TVA");
const oneDrivePath = join(home, "OneDrive", "Documents", "TVA");
const TVA_PATH = existsSync(defaultPath) ? defaultPath : existsSync(oneDrivePath) ? oneDrivePath : defaultPath;

function readFile(filePath: string): string {
  try {
    if (existsSync(filePath)) {
      return readFileSync(filePath, "utf-8");
    }
  } catch {}
  return "";
}

function parseProjects(): Record<string, { name: string; state: string }> {
  const projects: Record<string, { name: string; state: string }> = {};
  const projectsDir = join(TVA_PATH, "projects");
  
  if (!existsSync(projectsDir)) return projects;
  
  try {
    const dirs = readdirSync(projectsDir, { withFileTypes: true });
    for (const dir of dirs) {
      if (!dir.isDirectory()) continue;
      const readme = readFile(join(projectsDir, dir.name, "README.md"));
      projects[dir.name] = {
        name: dir.name,
        state: readme.includes("Active") ? "Active" : readme.includes("Paused") ? "Paused" : "—"
      };
    }
  } catch {}
  
  return projects;
}

function loadTVA() {
  return {
    lastSession: readFile(join(TVA_PATH, "last-session.md")),
    soul: readFile(join(TVA_PATH, "soul.md")),
    identity: readFile(join(TVA_PATH, "identity.md")),
    memory: readFile(join(TVA_PATH, "memory.md")),
    pending: readFile(join(TVA_PATH, "pending.md")),
    blockers: readFile(join(TVA_PATH, "blockers.md")),
    projects: parseProjects()
  };
}

function buildContext(tva: ReturnType<typeof loadTVA>): string {
  if (!tva.lastSession && !tva.memory) return "";
  
  const today = new Date().toISOString().split("T")[0];
  const session = tva.lastSession?.substring(0, 400) || "";
  const pending = tva.pending?.match(/- .+/g)?.slice(0, 5).join("\n") || "None";
  
  let blockers = "";
  if (tva.blockers) {
    const lines = tva.blockers.split("\n").filter(l => l.includes("|") || l.trim().startsWith("-"));
    blockers = lines.slice(0, 5).join("\n") || "None";
  }
  
  let ctx = "\n\n";
  ctx += `═══════════════════════════════════════════\n`;
  ctx += `TVA MEMORY ACTIVE — ${today}\n`;
  ctx += `═══════════════════════════════════════════\n\n`;
  ctx += `LAST SESSION:\n${session}\n\n`;
  ctx += `PENDING:\n${pending}\n\n`;
  ctx += `BLOCKERS:\n${blockers}\n\n`;
  
  const active = Object.values(tva.projects).filter(p => p.state === "Active");
  if (active.length) {
    ctx += `ACTIVE PROJECTS:\n`;
    for (const p of active) ctx += `• ${p.name}\n`;
    ctx += "\n";
  }
  
  ctx += `═══════════════════════════════════════════\n`;
  ctx += `Full context in ~/Documents/TVA/\n`;
  ctx += `═══════════════════════════════════════════\n\n`;
  
  return ctx;
}

export default function (pi: any) {
  let tva = loadTVA();
  
  pi.on("session_start", async (_: any, ctx: any) => {
    tva = loadTVA();
    if (tva.lastSession) ctx.ui.notify("TVA loaded", "info");
  });
  
  pi.on("before_agent_start", async (_: any, ctx: any) => {
    tva = loadTVA();
    const msg = buildContext(tva);
    if (msg) return { message: { customType: "tva-context", content: msg, display: false } };
  });
  
  pi.registerTool({
    name: "tva_status",
    description: "Check current TVA memory state",
    parameters: { type: "object", properties: {}, required: [] },
    execute() {
      tva = loadTVA();
      return {
        content: [{
          type: "text",
          text: `TVA Status:\n\nLast Session: ${tva.lastSession ? "✓" : "✗"}\nSoul: ${tva.soul ? "✓" : "✗"}\nIdentity: ${tva.identity ? "✓" : "✗"}\nProjects: ${Object.keys(tva.projects).length}`
        }]
      };
    }
  });
  
  pi.registerTool({
    name: "tva_query",
    description: "Query TVA memory by topic",
    parameters: {
      type: "object",
      properties: { topic: { type: "string" } },
      required: ["topic"]
    },
    execute(_: any, params: any) {
      const { topic } = params;
      let result = "";
      
      if (topic === "pending" || topic === "tasks") result = tva.pending || "None";
      else if (topic === "blockers") result = tva.blockers || "None";
      else if (topic === "soul") result = tva.soul || "None";
      else if (topic === "identity") result = tva.identity || "None";
      else if (topic === "memory") result = tva.memory || "None";
      else {
        const key = topic.toLowerCase().replace(/\s+/g, "-");
        result = readFile(join(TVA_PATH, "projects", key, "README.md")) || `No data for: ${topic}`;
      }
      
      return { content: [{ type: "text", text: result.substring(0, 4000) }] };
    }
  });
  
  pi.registerTool({
    name: "tva_refresh",
    description: "Force refresh TVA context",
    parameters: { type: "object", properties: {}, required: [] },
    execute() {
      tva = loadTVA();
      return { content: [{ type: "text", text: `TVA refreshed. Projects: ${Object.keys(tva.projects).length}` }] };
    }
  });
  
  pi.registerCommand("tva", {
    description: "Show TVA status",
    handler: (_: any, ctx: any) => {
      tva = loadTVA();
      const active = Object.values(tva.projects).filter((p: any) => p.state === "Active").length;
      ctx.ui.notify(`TVA: ${active} active, ${Object.keys(tva.projects).length} total`, "info");
      return { result: tva.lastSession?.substring(0, 200) || "No session" };
    }
  });
  
  pi.registerCommand("tva-last", {
    description: "Show last session",
    handler: (_: any, ctx: any) => {
      const summary = tva.lastSession?.substring(0, 150) || "No session";
      ctx.ui.notify(summary, "info");
      return { result: summary };
    }
  });
}