import type {
  CstNode,
  IToken,
  ILexingError,
  IRecognitionException,
} from "chevrotain";

export interface SourceLocation {
  startOffset: number;
  endOffset: number;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
}

export interface ScalaCstNode extends CstNode {
  name: string;
  children: Record<string, (ScalaCstNode | IToken)[]>;
  location?: SourceLocation;
}

export interface ParseResult {
  cst: ScalaCstNode;
  errors: IRecognitionException[];
  comments: IToken[];
}

export interface LexResult {
  tokens: IToken[];
  errors: ILexingError[];
  groups: {
    comments?: IToken[];
  };
}

export interface TokenBounds {
  start: number;
  end: number;
}

export interface LineColumn {
  line: number;
  column: number;
}

// Chevrotain パーサーメソッドの戻り値型
export interface ParserMethodResult extends CstNode {
  name: string;
  children: Record<string, (CstNode | IToken)[]>;
}

// パーサールールの型定義
export type ParserRule<T = ParserMethodResult> = () => T;
