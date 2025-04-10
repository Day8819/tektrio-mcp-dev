#!/usr/bin/env node

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "TEKTRIO-MCP-DEV",
  version: "1.0.0",
});

server.resource(
  "estrutura-projeto",
  new ResourceTemplate("tekproto://estrutura", { list: undefined }),
  async () => ({
    contents: [
      {
        uri: "tekproto://estrutura",
        text: `Estrutura obrigatória do projeto TEKTRIO:\n
- parent-system/\n- child-systems/\n- plugins/\n- docs/\n- scripts/\n- .github/`
      }
    ]
  })
);

server.tool(
  "validarCommit",
  "Valida mensagem de commit seguindo Conventional Commits",
  {
    mensagem: z.string().describe("Mensagem de commit para validação")
  },
  async ({ mensagem }) => {
    const regex = /^(feat|fix|chore|docs|refactor|style|test)(\(.+\))?: .+$/;
    const valido = regex.test(mensagem);
    return {
      content: [
        {
          type: "text",
          text: valido ? "✅ Commit válido." : "❌ Commit inválido. Use Conventional Commits."
        }
      ]
    };
  }
);

server.prompt(
  "instrucoesEstrutura",
  {
    tipo: z.string().describe("Tipo de componente: parent, child ou plugin")
  },
  ({ tipo }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Me mostre como deve ser a estrutura do diretório para um componente do tipo: ${tipo}`
        }
      }
    ]
  })
);

process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
});

(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
