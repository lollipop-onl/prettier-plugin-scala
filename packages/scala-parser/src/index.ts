import { ScalaLexer } from "./lexer.js";
import { parserInstance } from "./parser.js";
import { ModularScalaParser } from "./parser/modular-parser.js";

export { ScalaLexer, allTokens } from "./lexer.js";
export { ScalaParser, parserInstance } from "./parser.js";
export { ModularScalaParser };

export interface ParseResult {
  cst: any;
  errors: any[];
  comments: any[];
}

// CSTノードに位置情報を自動設定するヘルパー関数
function addLocationToCST(cst: any, tokens: any[], text: string): any {
  if (!cst || !tokens) return cst;

  // テキストから行の開始位置を計算
  const lineStarts = [0]; // 最初の行は0から始まる
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      lineStarts.push(i + 1);
    }
  }

  // オフセットから行番号と列番号を取得
  function getLineAndColumn(offset: number): { line: number; column: number } {
    let line = 1;
    for (let i = 0; i < lineStarts.length - 1; i++) {
      if (offset >= lineStarts[i] && offset < lineStarts[i + 1]) {
        line = i + 1;
        break;
      }
    }
    if (offset >= lineStarts[lineStarts.length - 1]) {
      line = lineStarts.length;
    }

    const column = offset - lineStarts[line - 1] + 1;
    return { line, column };
  }

  // トークンから最小・最大位置を計算
  function findTokenBounds(node: any): { start: number; end: number } | null {
    if (!node) return null;

    let minStart = Infinity;
    let maxEnd = -1;

    function findTokensInNode(n: any): void {
      if (!n) return;

      // トークンの場合
      if (n.startOffset !== undefined && n.endOffset !== undefined) {
        minStart = Math.min(minStart, n.startOffset);
        maxEnd = Math.max(maxEnd, n.endOffset);
        return;
      }

      // CSTノードの場合
      if (n.children) {
        for (const children of Object.values(n.children)) {
          if (Array.isArray(children)) {
            children.forEach(findTokensInNode);
          } else {
            findTokensInNode(children);
          }
        }
      }
    }

    findTokensInNode(node);

    if (minStart === Infinity || maxEnd === -1) {
      return null;
    }

    return { start: minStart, end: maxEnd };
  }

  // 再帰的にCSTノードに位置情報を設定
  function setCSTLocation(node: any): any {
    if (!node) return node;

    // トークンの場合はそのまま返す
    if (node.startOffset !== undefined) {
      return node;
    }

    // CSTノードの場合
    if (node.children) {
      // 子ノードを先に処理
      const processedChildren: any = {};
      for (const [key, children] of Object.entries(node.children)) {
        if (Array.isArray(children)) {
          processedChildren[key] = children.map(setCSTLocation);
        } else {
          processedChildren[key] = setCSTLocation(children);
        }
      }

      // このノードの位置を計算
      const bounds = findTokenBounds({ children: processedChildren });

      if (bounds) {
        const startLoc = getLineAndColumn(bounds.start);
        const endLoc = getLineAndColumn(bounds.end);

        return {
          ...node,
          children: processedChildren,
          location: {
            startOffset: bounds.start,
            endOffset: bounds.end,
            startLine: startLoc.line,
            endLine: endLoc.line,
            startColumn: startLoc.column,
            endColumn: endLoc.column,
          },
        };
      } else {
        return {
          ...node,
          children: processedChildren,
        };
      }
    }

    return node;
  }

  return setCSTLocation(cst);
}

export function parse(text: string): ParseResult {
  // Tokenize
  const lexResult = ScalaLexer.tokenize(text);

  if (lexResult.errors.length > 0) {
    throw new Error(
      `Lexing errors: ${lexResult.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Parse
  parserInstance.input = lexResult.tokens;
  const cst = parserInstance.compilationUnit();

  if (parserInstance.errors.length > 0) {
    throw new Error(
      `Parsing errors: ${parserInstance.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // CSTに位置情報を追加
  const cstWithLocation = addLocationToCST(cst, lexResult.tokens, text);

  return {
    cst: cstWithLocation,
    errors: [],
    comments: lexResult.groups.comments || [],
  };
}

// Parse function using the modular parser
export function parseModular(text: string): ParseResult {
  // Tokenize
  const lexResult = ScalaLexer.tokenize(text);

  if (lexResult.errors.length > 0) {
    throw new Error(
      `Lexing errors: ${lexResult.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Create new modular parser instance
  const modularParser = new ModularScalaParser();

  // Parse
  modularParser.input = lexResult.tokens;
  const cst = modularParser.compilationUnit();

  if (modularParser.errors.length > 0) {
    throw new Error(
      `Parsing errors: ${modularParser.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // CSTに位置情報を追加
  const cstWithLocation = addLocationToCST(cst, lexResult.tokens, text);

  return {
    cst: cstWithLocation,
    errors: [],
    comments: lexResult.groups.comments || [],
  };
}
