// src/index.ts
import { compileTemplate } from "@jqhtml/parser";
import { createFilter } from "vite";
function jqhtmlPlugin(options = {}) {
  const {
    include = ["**/*.jqhtml"],
    exclude = ["node_modules/**"],
    sourcemap
  } = options;
  const filter = createFilter(include, exclude);
  let isDev = false;
  return {
    name: "vite-plugin-jqhtml",
    configResolved(config) {
      isDev = config.command === "serve";
    },
    transform(code, id) {
      if (!id.endsWith(".jqhtml")) return null;
      if (!filter(id)) return null;
      try {
        const compiled = compileTemplate(code, id, {
          format: "esm",
          // ES module output
          sourcemap: sourcemap ?? isDev
        });
        const output = `
${compiled.code}

// Export component name for manual registration
export const __jqhtml_component_name = ${JSON.stringify(compiled.componentName)};
`;
        return {
          code: output,
          map: null
          // Sourcemap is embedded inline when enabled
        };
      } catch (error) {
        let message = error.message || "jqhtml compilation failed";
        if (error.context) {
          message += `

Context: ${error.context}`;
        }
        if (error.suggestion) {
          message += `
Suggestion: ${error.suggestion}`;
        }
        const line = error.line || 1;
        const column = error.column || 0;
        this.error({
          message: `jqhtml compilation error: ${message}`,
          id,
          loc: { line, column }
        });
      }
    },
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith(".jqhtml")) {
        const module = ctx.server.moduleGraph.getModuleById(ctx.file);
        if (module) {
          ctx.server.moduleGraph.invalidateModule(module);
          return [module];
        }
      }
    }
  };
}
export {
  jqhtmlPlugin as default,
  jqhtmlPlugin
};
