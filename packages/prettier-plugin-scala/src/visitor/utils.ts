import type { ScalaCstNode, IToken } from "@simochee/scala-parser";

/**
 * Shared utilities and formatting helpers for the visitor pattern
 */

export interface PrettierOptions {
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: "all" | "multiline" | "none";
  scalaLineWidth?: number; // Deprecated, for backward compatibility
}

// Union type for CST elements (nodes or tokens)
export type CSTNode = ScalaCstNode | IToken;

export type PrintContext = {
  path: unknown;
  options: PrettierOptions;
  print: (node: CSTNode) => string;
  indentLevel: number;
};

/**
 * Safe access to node children with null check
 */
export function getChildren(node: CSTNode): Record<string, CSTNode[]> {
  if ("children" in node && node.children) {
    return node.children as Record<string, CSTNode[]>;
  }
  return {};
}

/**
 * Get specific child nodes by key with null safety
 */
export function getChildNodes(node: CSTNode, key: string): CSTNode[] {
  return getChildren(node)[key] || [];
}

/**
 * Get first child node by key with null safety
 */
export function getFirstChild(node: CSTNode, key: string): CSTNode | undefined {
  const children = getChildNodes(node, key);
  return children.length > 0 ? children[0] : undefined;
}

/**
 * Get node image with safe fallback
 */
export function getNodeImage(node: CSTNode): string {
  if ("image" in node && node.image) {
    return node.image;
  }
  return "";
}

/**
 * Get node image with safe fallback for potentially null nodes
 */
export function getNodeImageSafe(node: CSTNode | undefined | null): string {
  if (node && "image" in node && node.image) {
    return node.image;
  }
  return "";
}

/**
 * Helper method to get effective printWidth (supports scalafmt compatibility)
 */
export function getPrintWidth(ctx: PrintContext): number {
  // Use Prettier's printWidth (scalafmt maxColumn compatible)
  if (ctx.options.printWidth) {
    return ctx.options.printWidth;
  }

  // Fallback to deprecated scalaLineWidth for backward compatibility
  if (ctx.options.scalaLineWidth) {
    // Show deprecation warning in development
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "scalaLineWidth is deprecated. Use printWidth instead for scalafmt compatibility.",
      );
    }
    return ctx.options.scalaLineWidth;
  }

  // Default value
  return 80;
}

/**
 * Helper method to get effective tabWidth (supports scalafmt compatibility)
 */
export function getTabWidth(ctx: PrintContext): number {
  // Use Prettier's tabWidth (scalafmt indent.main compatible)
  if (ctx.options.tabWidth) {
    return ctx.options.tabWidth;
  }

  // Default value
  return 2;
}

/**
 * Helper method to handle semicolon formatting (supports Prettier semi option)
 */
export function formatStatement(statement: string, ctx: PrintContext): string {
  // Use Prettier's semi option
  // The plugin sets default semi=false for Scala, but respect explicit user choice
  const useSemi = ctx.options.semi === true;

  // Remove existing trailing semicolon
  const cleanStatement = statement.replace(/;\s*$/, "");

  // Add semicolon if requested
  if (useSemi) {
    return cleanStatement + ";";
  }

  return cleanStatement;
}

/**
 * Helper method to handle string quote formatting (supports Prettier singleQuote option)
 */
export function formatStringLiteral(
  content: string,
  ctx: PrintContext,
): string {
  // Use Prettier's singleQuote option
  const useSingleQuote = ctx.options.singleQuote === true;

  // Skip string interpolation (starts with s", f", raw", etc.)
  if (content.match(/^[a-zA-Z]"/)) {
    return content; // Don't modify interpolated strings
  }

  // Extract the content
  let innerContent = content;

  if (content.startsWith('"') && content.endsWith('"')) {
    innerContent = content.slice(1, -1);
  } else if (content.startsWith("'") && content.endsWith("'")) {
    innerContent = content.slice(1, -1);
  } else {
    return content; // Not a string literal
  }

  // Choose target quote based on option
  const targetQuote = useSingleQuote ? "'" : '"';

  // Handle escaping if necessary
  if (targetQuote === "'") {
    // Converting to single quotes: escape single quotes, unescape double quotes
    innerContent = innerContent.replace(/\\"/g, '"').replace(/'/g, "\\'");
  } else {
    // Converting to double quotes: escape double quotes, unescape single quotes
    innerContent = innerContent.replace(/\\'/g, "'").replace(/"/g, '\\"');
  }

  return targetQuote + innerContent + targetQuote;
}

/**
 * Helper method to handle indentation using configured tab width
 */
export function createIndent(level: number, ctx: PrintContext): string {
  const tabWidth = getTabWidth(ctx);
  const useTabs = ctx.options.useTabs === true;

  if (useTabs) {
    return "\t".repeat(level);
  } else {
    return " ".repeat(level * tabWidth);
  }
}

/**
 * Helper method to handle trailing comma formatting
 */
export function formatTrailingComma(
  elements: string[],
  ctx: PrintContext,
  isMultiline: boolean = false,
): string {
  if (elements.length === 0) return "";

  const trailingComma = ctx.options.trailingComma;

  if (
    trailingComma === "all" ||
    (trailingComma === "multiline" && isMultiline)
  ) {
    return elements.join(", ") + ",";
  }

  return elements.join(", ");
}

/**
 * Attach original comments to the formatted result
 */
export function attachOriginalComments(
  result: string,
  originalComments: CSTNode[],
): string {
  if (!originalComments || originalComments.length === 0) {
    return result;
  }

  const lines = result.split("\n");
  const commentMap = new Map<number, string[]>();

  // Group comments by line number
  originalComments.forEach((comment) => {
    const line = ("startLine" in comment && comment.startLine) || 1;
    if (!commentMap.has(line)) {
      commentMap.set(line, []);
    }
    let commentText = "";
    if ("image" in comment && comment.image) {
      commentText = comment.image;
    } else if ("value" in comment && comment.value) {
      commentText = String(comment.value);
    }
    if (commentText) {
      commentMap.get(line)!.push(commentText);
    }
  });

  // Insert comments into lines
  const resultLines: string[] = [];
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (commentMap.has(lineNumber)) {
      const comments = commentMap.get(lineNumber)!;
      comments.forEach((comment) => {
        resultLines.push(comment);
      });
    }
    resultLines.push(line);
  });

  return resultLines.join("\n");
}

/**
 * Format method or class parameters with proper line breaks
 */
export function formatParameterList(
  parameters: CSTNode[],
  ctx: PrintContext,
  visitFn: (param: CSTNode, ctx: PrintContext) => string,
): string {
  if (parameters.length === 0) return "";

  const paramStrings = parameters.map((param) => visitFn(param, ctx));
  const printWidth = getPrintWidth(ctx);
  const joined = paramStrings.join(", ");

  // If the line is too long, break into multiple lines
  if (joined.length > printWidth * 0.7) {
    const indent = createIndent(1, ctx);
    return "\n" + indent + paramStrings.join(",\n" + indent) + "\n";
  }

  return joined;
}
