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

      // For now, disable comments entirely by returning empty array
      const ast = {
        ...result.cst,
        comments: [],
        type: "compilationUnit",
      };
      return ast;
    },
    astFormat: "scala-cst",
    locStart: (node: any) => node.location?.startOffset || 0,
    locEnd: (node: any) => node.location?.endOffset || 1,
    hasPragma: () => false,
  },
};

// Printer definition
const printers = {
  "scala-cst": createScalaPrinter(),
};

// Options (to be expanded for scalafmt compatibility)
const options: Record<string, SupportOption> = {
  scalaIndentStyle: {
    type: "choice",
    default: "spaces",
    choices: [
      { value: "spaces", description: "Use spaces for indentation" },
      { value: "tabs", description: "Use tabs for indentation" },
    ],
    description: "Indentation style",
    category: "Scala",
  } as const,
  scalaLineWidth: {
    type: "int",
    default: 80,
    description: "Maximum line width",
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
