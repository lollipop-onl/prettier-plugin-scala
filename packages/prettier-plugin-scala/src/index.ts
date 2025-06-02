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
      // Flatten comments into the CST for now
      return {
        ...result.cst,
        comments: result.comments || [],
      };
    },
    astFormat: "scala-cst",
    locStart: () => 0,
    locEnd: () => 1,
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
