"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => jqhtmlPlugin,
  jqhtmlPlugin: () => jqhtmlPlugin
});
module.exports = __toCommonJS(index_exports);
var import_parser = require("@jqhtml/parser");
var import_vite = require("vite");
function jqhtmlPlugin(options = {}) {
  const {
    include = ["**/*.jqhtml"],
    exclude = ["node_modules/**"],
    sourcemap
  } = options;
  const filter = (0, import_vite.createFilter)(include, exclude);
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
        const compiled = (0, import_parser.compileTemplate)(code, id, {
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
        const module2 = ctx.server.moduleGraph.getModuleById(ctx.file);
        if (module2) {
          ctx.server.moduleGraph.invalidateModule(module2);
          return [module2];
        }
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  jqhtmlPlugin
});
