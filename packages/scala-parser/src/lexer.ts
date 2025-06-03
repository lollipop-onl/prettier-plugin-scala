import { createToken, Lexer } from "chevrotain";

// Keywords
export const Val = createToken({ name: "Val", pattern: /val\b/ });
export const Var = createToken({ name: "Var", pattern: /var\b/ });
export const Def = createToken({ name: "Def", pattern: /def\b/ });
export const Class = createToken({ name: "Class", pattern: /class\b/ });
export const Object = createToken({ name: "Object", pattern: /object\b/ });
export const Trait = createToken({ name: "Trait", pattern: /trait\b/ });
export const Extends = createToken({ name: "Extends", pattern: /extends\b/ });
export const With = createToken({ name: "With", pattern: /with\b/ });
export const If = createToken({ name: "If", pattern: /if\b/ });
export const Else = createToken({ name: "Else", pattern: /else\b/ });
export const While = createToken({ name: "While", pattern: /while\b/ });
export const For = createToken({ name: "For", pattern: /for\b/ });
export const Yield = createToken({ name: "Yield", pattern: /yield\b/ });
export const Return = createToken({ name: "Return", pattern: /return\b/ });
export const New = createToken({ name: "New", pattern: /new\b/ });
export const This = createToken({ name: "This", pattern: /this\b/ });
export const Super = createToken({ name: "Super", pattern: /super\b/ });
export const Package = createToken({ name: "Package", pattern: /package\b/ });
export const Import = createToken({ name: "Import", pattern: /import\b/ });
export const Case = createToken({ name: "Case", pattern: /case\b/ });
export const Match = createToken({ name: "Match", pattern: /match\b/ });
export const Try = createToken({ name: "Try", pattern: /try\b/ });
export const Catch = createToken({ name: "Catch", pattern: /catch\b/ });
export const Finally = createToken({ name: "Finally", pattern: /finally\b/ });
export const Throw = createToken({ name: "Throw", pattern: /throw\b/ });
export const Null = createToken({ name: "Null", pattern: /null\b/ });
export const True = createToken({ name: "True", pattern: /true\b/ });
export const False = createToken({ name: "False", pattern: /false\b/ });
export const Type = createToken({ name: "Type", pattern: /type\b/ });
export const Private = createToken({ name: "Private", pattern: /private\b/ });
export const Protected = createToken({
  name: "Protected",
  pattern: /protected\b/,
});
export const Public = createToken({ name: "Public", pattern: /public\b/ });
export const Abstract = createToken({
  name: "Abstract",
  pattern: /abstract\b/,
});
export const Final = createToken({ name: "Final", pattern: /final\b/ });
export const Sealed = createToken({ name: "Sealed", pattern: /sealed\b/ });
export const Implicit = createToken({
  name: "Implicit",
  pattern: /implicit\b/,
});
export const Lazy = createToken({ name: "Lazy", pattern: /lazy\b/ });
export const Override = createToken({
  name: "Override",
  pattern: /override\b/,
});
export const Given = createToken({ name: "Given", pattern: /given\b/ });
export const Using = createToken({ name: "Using", pattern: /using\b/ });
export const To = createToken({ name: "To", pattern: /to\b/ });

// Identifiers (must come after keywords)
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

// Literals
export const IntegerLiteral = createToken({
  name: "IntegerLiteral",
  pattern: /-?\d+[lL]?/,
});

export const FloatingPointLiteral = createToken({
  name: "FloatingPointLiteral",
  pattern: /-?\d+\.\d+([eE][+-]?\d+)?[fFdD]?/,
});

export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"""[\s\S]*?"""|"([^"\\]|\\.)*"/,
});

export const InterpolatedStringLiteral = createToken({
  name: "InterpolatedStringLiteral",
  pattern:
    /[a-zA-Z_][a-zA-Z0-9_]*"""[\s\S]*?"""|[a-zA-Z_][a-zA-Z0-9_]*"([^"\\]|\\.|\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{[^}]*\})*"/,
});

export const CharLiteral = createToken({
  name: "CharLiteral",
  pattern: /'([^'\\]|\\.)'/,
});

// Operators
export const Equals = createToken({ name: "Equals", pattern: /=/ });
export const Plus = createToken({ name: "Plus", pattern: /\+/ });
export const Minus = createToken({ name: "Minus", pattern: /-/ });
export const Star = createToken({ name: "Star", pattern: /\*/ });
export const Slash = createToken({ name: "Slash", pattern: /\// });
export const Percent = createToken({ name: "Percent", pattern: /%/ });
export const LessThan = createToken({ name: "LessThan", pattern: /</ });
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
export const LessThanEquals = createToken({
  name: "LessThanEquals",
  pattern: /<=/,
});
export const GreaterThanEquals = createToken({
  name: "GreaterThanEquals",
  pattern: />=/,
});
export const EqualsEquals = createToken({
  name: "EqualsEquals",
  pattern: /==/,
});
export const NotEquals = createToken({ name: "NotEquals", pattern: /!=/ });
export const LogicalAnd = createToken({ name: "LogicalAnd", pattern: /&&/ });
export const LogicalOr = createToken({ name: "LogicalOr", pattern: /\|\|/ });
export const Arrow = createToken({ name: "Arrow", pattern: /=>/ });
export const LeftArrow = createToken({ name: "LeftArrow", pattern: /<-/ });
export const SubtypeOf = createToken({ name: "SubtypeOf", pattern: /<:/ });
export const SupertypeOf = createToken({ name: "SupertypeOf", pattern: />:/ });
export const AppendOp = createToken({ name: "AppendOp", pattern: /:\+/ });
export const PrependOp = createToken({ name: "PrependOp", pattern: /::/ });
export const ConcatOp = createToken({ name: "ConcatOp", pattern: /\+\+/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Dot = createToken({ name: "Dot", pattern: /\./ });
export const Underscore = createToken({ name: "Underscore", pattern: /_/ });
export const At = createToken({ name: "At", pattern: /@/ });

// Delimiters
export const LeftParen = createToken({ name: "LeftParen", pattern: /\(/ });
export const RightParen = createToken({ name: "RightParen", pattern: /\)/ });
export const LeftBracket = createToken({ name: "LeftBracket", pattern: /\[/ });
export const RightBracket = createToken({
  name: "RightBracket",
  pattern: /\]/,
});
export const LeftBrace = createToken({ name: "LeftBrace", pattern: /\{/ });
export const RightBrace = createToken({ name: "RightBrace", pattern: /\}/ });

// Whitespace and Comments
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const LineComment = createToken({
  name: "LineComment",
  pattern: /\/\/[^\n\r]*/,
  group: "comments",
});

export const BlockComment = createToken({
  name: "BlockComment",
  pattern: /\/\*([^*]|\*(?!\/))*\*\//,
  group: "comments",
});

// All tokens in order
export const allTokens = [
  // Comments (must come before operators)
  LineComment,
  BlockComment,

  // Whitespace
  WhiteSpace,

  // Keywords (must come before Identifier)
  Val,
  Var,
  Def,
  Class,
  Object,
  Trait,
  Extends,
  With,
  If,
  Else,
  While,
  For,
  Yield,
  Return,
  New,
  This,
  Super,
  Package,
  Import,
  Case,
  Match,
  Try,
  Catch,
  Finally,
  Throw,
  Null,
  True,
  False,
  Type,
  Private,
  Protected,
  Public,
  Abstract,
  Final,
  Sealed,
  Implicit,
  Lazy,
  Override,
  Given,
  Using,
  To,

  // Literals
  FloatingPointLiteral, // Must come before IntegerLiteral
  IntegerLiteral,
  InterpolatedStringLiteral, // Must come before StringLiteral
  StringLiteral,
  CharLiteral,

  // Multi-character operators (must come before single-character)
  Arrow,
  LeftArrow,
  SubtypeOf,
  SupertypeOf,
  LessThanEquals,
  GreaterThanEquals,
  EqualsEquals,
  NotEquals,
  LogicalAnd,
  LogicalOr,
  AppendOp,
  PrependOp,
  ConcatOp,

  // Single-character operators
  Equals,
  Plus,
  Minus,
  Star,
  Slash,
  Percent,
  LessThan,
  GreaterThan,
  Colon,
  Semicolon,
  Comma,
  Dot,
  Underscore,
  At,

  // Delimiters
  LeftParen,
  RightParen,
  LeftBracket,
  RightBracket,
  LeftBrace,
  RightBrace,

  // Identifier (must come last)
  Identifier,
];

// Create the lexer
export const ScalaLexer = new Lexer(allTokens);
