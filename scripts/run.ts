/**
 * TVA Extension Runner / Verification Script
 * Simulates a pi-coding-agent session with the TVA extension loaded.
 */

import initTVA from "../src/index.ts";

console.log("⚡ Starting TVA Extension Runner...\n");

// Mock pi extension interface
const listeners: Record<string, Array<(...args: any[]) => any>> = {};
const tools: Record<string, any> = {};
const commands: Record<string, any> = {};

const mockCtx = {
  ui: {
    notify: (msg: string, level: string = "info") => {
      console.log(`  [UI Notification (${level})]: ${msg}`);
    }
  }
};

const mockPi = {
  on(event: string, handler: (...args: any[]) => any) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(handler);
    console.log(`✓ Event registered: ${event}`);
  },
  registerTool(tool: any) {
    tools[tool.name] = tool;
    console.log(`✓ Tool registered: ${tool.name} (${tool.description})`);
  },
  registerCommand(name: string, command: any) {
    commands[name] = command;
    console.log(`✓ Command registered: /${name} (${command.description})`);
  }
};

// 1. Initialize Extension
console.log("---------------------------------------------");
console.log("1. Initializing TVA Extension");
console.log("---------------------------------------------");
initTVA(mockPi);

// 2. Trigger session_start event
console.log("\n---------------------------------------------");
console.log("2. Simulating 'session_start' event");
console.log("---------------------------------------------");
if (listeners["session_start"]) {
  for (const fn of listeners["session_start"]) {
    await fn({}, mockCtx);
  }
}

// 3. Trigger before_agent_start event (Context Injection)
console.log("\n---------------------------------------------");
console.log("3. Simulating 'before_agent_start' (Prompt Injection)");
console.log("---------------------------------------------");
if (listeners["before_agent_start"]) {
  for (const fn of listeners["before_agent_start"]) {
    const res = await fn({}, mockCtx);
    if (res?.message?.content) {
      console.log("Injected Context to Agent:");
      console.log(res.message.content);
    } else {
      console.log("No context injected.");
    }
  }
}

// 4. Test registered tools
console.log("\n---------------------------------------------");
console.log("4. Testing TVA Tools");
console.log("---------------------------------------------");

if (tools["tva_status"]) {
  console.log("\n--> Executing Tool: tva_status");
  const res = tools["tva_status"].execute();
  console.log(res.content[0].text);
}

if (tools["tva_query"]) {
  console.log("\n--> Executing Tool: tva_query (topic: 'soul')");
  const resSoul = tools["tva_query"].execute({}, { topic: "soul" });
  console.log(resSoul.content[0].text);

  console.log("\n--> Executing Tool: tva_query (topic: 'pending')");
  const resPending = tools["tva_query"].execute({}, { topic: "pending" });
  console.log(resPending.content[0].text);
}

if (tools["tva_refresh"]) {
  console.log("\n--> Executing Tool: tva_refresh");
  const resRefresh = tools["tva_refresh"].execute();
  console.log(resRefresh.content[0].text);
}

// 5. Test registered commands
console.log("\n---------------------------------------------");
console.log("5. Testing TVA Commands");
console.log("---------------------------------------------");

if (commands["tva"]) {
  console.log("\n--> Executing Command: /tva");
  const cmdRes = commands["tva"].handler({}, mockCtx);
  console.log("Command return:", cmdRes);
}

if (commands["tva-last"]) {
  console.log("\n--> Executing Command: /tva-last");
  const cmdLast = commands["tva-last"].handler({}, mockCtx);
  console.log("Command return:", cmdLast);
}

console.log("\n=============================================");
console.log("🎉 All TVA functions executed successfully!");
console.log("=============================================\n");
