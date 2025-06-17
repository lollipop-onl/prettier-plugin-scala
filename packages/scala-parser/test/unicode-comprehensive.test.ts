import { allTokens } from "../src/lexer.js";
import { parserInstance } from "../src/parser.js";
import {
  normalizeUnicode,
  isValidIdentifier,
  processUnicodeEscapes,
  MATHEMATICAL_SYMBOLS,
} from "../src/unicode-utils";
import { createToken, Lexer } from "chevrotain";
import { describe, it, expect } from "vitest";

const lexerInstance = new Lexer(allTokens);

describe("Comprehensive Unicode Identifier Support", () => {
  it("should support Greek letters", () => {
    const inputText = `val α = 42
val β = "beta"
val Γ = "gamma"
val Δ = "delta"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support Japanese characters (hiragana, katakana, kanji)", () => {
    const inputText = `val あいうえお = "hiragana"
val アイウエオ = "katakana"
val 変数名 = "kanji"
val 数値 = 42`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support Chinese characters", () => {
    const inputText = `val 变量 = "simplified chinese"
val 變量 = "traditional chinese"
val 中文标识符 = "chinese identifier"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support Cyrillic (Russian) characters", () => {
    const inputText = `val переменная = "russian"
val ПЕРЕМЕННАЯ = "russian uppercase"
val российский_идентификатор = "russian identifier"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support Arabic characters", () => {
    const inputText = `val متغير = "arabic"
val المتغير_العربي = "arabic identifier"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support Hebrew characters", () => {
    const inputText = `val משתנה = "hebrew"
val המשתנה_העברי = "hebrew identifier"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support accented Latin characters", () => {
    const inputText = `val café = "with accent"
val naïve = "with diaeresis" 
val résumé = "with acute"
val piñata = "with tilde"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support mathematical symbols", () => {
    const inputText = `val ∑ = "summation"
val ∏ = "product"
val ∂ = "partial derivative"
val ∇ = "nabla"
val ∞ = "infinity"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support emoji identifiers", () => {
    const inputText = `val 🚀 = "rocket"
val 📝 = "memo"
val 🌟 = "star"
val 💻 = "computer"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support mixed Unicode identifiers", () => {
    const inputText = `val mixed_変数_α_🌟 = "mixed identifiers"
val café_中文_русский = "multilingual"
val test_数値_∑_emoji🎯 = "comprehensive test"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support special characters in identifiers", () => {
    const inputText = `val _private = "underscore prefix"
val test_ = "underscore suffix"
val camelCase = "standard identifier"
val MixedCase123 = "mixed case with numbers"`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should handle Unicode in function parameters and class definitions", () => {
    const inputText = `def 計算(数値α: Int, 数値β: Int): Int = 数値α + 数値β

class 容器[型パラメータ](値: 型パラメータ) {
  def 取得: 型パラメータ = 値
}

case class 点(χ座標: Double, ψ座標: Double)`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });
});

describe("Unicode Property Classes Enhancement", () => {
  it("should handle Unicode escapes in string literals", () => {
    const inputText = `val greeting = "Hello \\u03B1\\u03B2\\u03B3"  // α β γ
val symbol = "\\u2200 x \\u2203 y"  // ∀ x ∃ y
val arrow = "f: A \\u2192 B"  // f: A → B`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should handle Unicode escapes in char literals", () => {
    const inputText = `val alpha = '\\u03B1'  // α
val lambda = '\\u03BB'  // λ
val pi = '\\u03C0'  // π`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should support advanced mathematical symbols", () => {
    const inputText = `val ∫integral = 42
val Δdelta = 0.01
val ∑sum = 100
val ∀forall = true
val ∃exists = false`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });

  it("should handle functional programming with Greek letters", () => {
    const inputText = `val α = 1
val β = 2
val μ = 3
val λ = 4
val π = 3.14159`;

    const lexingResult = lexerInstance.tokenize(inputText);
    expect(lexingResult.errors).toHaveLength(0);

    parserInstance.input = lexingResult.tokens;
    const cst = parserInstance.compilationUnit();
    expect(parserInstance.errors).toHaveLength(0);
  });
});

describe("Unicode Utility Functions", () => {
  it("should normalize Unicode strings correctly", () => {
    // Test with composed vs decomposed characters
    const composed = "café"; // é as single character
    const decomposed = "café"; // e + combining acute accent

    const normalizedComposed = normalizeUnicode(composed);
    const normalizedDecomposed = normalizeUnicode(decomposed);

    expect(normalizedComposed).toBe(normalizedDecomposed);
  });

  it("should validate Unicode identifiers", () => {
    expect(isValidIdentifier("λ")).toBe(true);
    expect(isValidIdentifier("α123")).toBe(true);
    expect(isValidIdentifier("∀universal")).toBe(true);
    expect(isValidIdentifier("変数")).toBe(true);
    expect(isValidIdentifier("_underscore")).toBe(true);
    expect(isValidIdentifier("$dollar")).toBe(true);

    // Invalid identifiers
    expect(isValidIdentifier("123invalid")).toBe(false);
    expect(isValidIdentifier("")).toBe(false);
    expect(isValidIdentifier("@invalid")).toBe(false);
  });

  it("should process Unicode escapes", () => {
    const input = "Hello \\u03B1\\u03B2\\u03B3";
    const processed = processUnicodeEscapes(input);
    expect(processed).toBe("Hello αβγ");

    const mathematicalInput = "\\u2200 x \\u2203 y";
    const mathematicalProcessed = processUnicodeEscapes(mathematicalInput);
    expect(mathematicalProcessed).toBe("∀ x ∃ y");
  });

  it("should provide mathematical symbol constants", () => {
    expect(MATHEMATICAL_SYMBOLS.ALPHA).toBe("α");
    expect(MATHEMATICAL_SYMBOLS.BETA).toBe("β");
    expect(MATHEMATICAL_SYMBOLS.GAMMA).toBe("γ");
    expect(MATHEMATICAL_SYMBOLS.LAMBDA).toBe("λ");
    expect(MATHEMATICAL_SYMBOLS.PI).toBe("π");
    expect(MATHEMATICAL_SYMBOLS.FORALL).toBe("∀");
    expect(MATHEMATICAL_SYMBOLS.EXISTS).toBe("∃");
  });
});
