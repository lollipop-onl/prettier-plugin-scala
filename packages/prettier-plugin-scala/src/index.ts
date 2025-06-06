import { createScalaPrinter } from "./printer.js";
import { type Plugin, type SupportOption } from "prettier";
import { parse } from "scala-parser";

// Language definition
const languages = [
  {
    name: "Scala",
    parsers: ["scala"],
    extensions: [".scala", ".sc"],
    vscodeLanguageIds: ["scala"],
  },
];

// Parser definition
const parsers = {
  scala: {
    parse: (text: string) => {
      const result = parse(text);

      // シンプルなコメント保持: ASTに格納してvisitorで処理
      const ast = {
        ...result.cst,
        comments: [], // Prettierの検証を回避
        originalComments: result.comments || [], // プラグイン独自のコメント格納
        type: "compilationUnit",
      };
      return ast;
    },
    astFormat: "scala-cst",
    locStart: (node: any) => {
      // Handle comment tokens (from Chevrotain lexer)
      if (node.startOffset !== undefined) {
        return node.startOffset;
      }
      // Handle CST nodes
      if (node.location?.startOffset !== undefined) {
        return node.location.startOffset;
      }
      return 0;
    },
    locEnd: (node: any) => {
      // Handle comment tokens (from Chevrotain lexer)
      if (node.endOffset !== undefined) {
        return node.endOffset + 1; // Chevrotain endOffset is inclusive, Prettier expects exclusive
      }
      // Handle CST nodes
      if (node.location?.endOffset !== undefined) {
        return node.location.endOffset + 1; // Chevrotain endOffset is inclusive, Prettier expects exclusive
      }
      return 1;
    },
    hasPragma: () => false,
  },
};

// Printer definition
const printers = {
  "scala-cst": createScalaPrinter(),
};

// Options (scalafmt compatibility - Phase 1)
const options: Record<string, SupportOption> = {
  // Prettier standard options with Scala-specific defaults
  semi: {
    type: "boolean",
    default: false, // Scala convention: omit semicolons
    description: "Add semicolons at the end of statements",
    category: "Global",
  } as const,

  // Deprecated options (backward compatibility)
  scalaLineWidth: {
    type: "int",
    default: 80,
    description: "Maximum line width (DEPRECATED: use printWidth instead)",
    category: "Scala",
  } as const,
  scalaIndentStyle: {
    type: "choice",
    default: "spaces",
    choices: [
      { value: "spaces", description: "Use spaces for indentation" },
      { value: "tabs", description: "Use tabs for indentation" },
    ],
    description: "Indentation style (DEPRECATED: use useTabs instead)",
    category: "Scala",
  } as const,
};

// Export the plugin
const plugin: Plugin = {
  languages,
  parsers,
  printers,
  options,
};

export default plugin;
