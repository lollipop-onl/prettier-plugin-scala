# @simochee/scala-parser

<p align="center">
  <em>A Scala parser built with <a href="https://chevrotain.io">Chevrotain</a> for the Prettier plugin ecosystem</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@simochee/scala-parser">
    <img alt="npm version" src="https://img.shields.io/npm/v/@simochee/scala-parser?color=brightgreen&label=npm%20package">
  </a>
  <a href="https://github.com/simochee/prettier-plugin-scala/actions">
    <img alt="CI Status" src="https://github.com/simochee/prettier-plugin-scala/workflows/CI/badge.svg">
  </a>
  <a href="https://github.com/simochee/prettier-plugin-scala/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

## 📋 Overview

This package provides a comprehensive Scala parser that generates Concrete Syntax Trees (CST) suitable for code formatting tools. It's the parsing engine behind [@simochee/prettier-plugin-scala](https://www.npmjs.com/package/@simochee/prettier-plugin-scala).

## ✨ Features

- 🎯 **Full Scala Support** - Parses both Scala 2 and Scala 3 syntax
- 🚀 **High Performance** - Built with Chevrotain for optimal parsing speed
- 🌳 **CST Generation** - Produces detailed syntax trees with location information
- 🔍 **Error Recovery** - Graceful handling of syntax errors
- 📦 **TypeScript** - Written in TypeScript with full type definitions
- 🧪 **Well Tested** - Comprehensive test suite with real-world examples

## 📦 Installation

```bash
npm install @simochee/scala-parser
```

Or with yarn:

```bash
yarn add @simochee/scala-parser
```

Or with pnpm:

```bash
pnpm add @simochee/scala-parser
```

## 🚀 Usage

### Basic Example

```typescript
import { parse } from '@simochee/scala-parser';

const sourceCode = `
  class Person(name: String, age: Int) {
    def greet(): String = s"Hello, $name"
  }
`;

try {
  const cst = parse(sourceCode);
  console.log('Parse successful!', cst);
} catch (error) {
  console.error('Parse error:', error.message);
}
```

### API

#### `parse(text: string): CSTNode`

Parses Scala source code and returns a Concrete Syntax Tree.

**Parameters:**
- `text` - The Scala source code to parse

**Returns:**
- A CST node representing the parsed code

**Throws:**
- `Error` if the code contains syntax errors

### CST Structure

The parser generates a Concrete Syntax Tree with the following structure:

```typescript
interface CSTNode {
  name: string;                          // Node type (e.g., "classDefinition")
  children: Record<string, CSTNode[]>;   // Child nodes organized by type
  location?: {                           // Source location information
    startOffset: number;
    endOffset: number;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
  };
}
```

### Example CST

```typescript
// Input: class Foo
{
  name: "compilationUnit",
  children: {
    topStatSeq: [{
      name: "topStatSeq",
      children: {
        topStat: [{
          name: "topStat",
          children: {
            classDefinition: [{
              name: "classDefinition",
              children: {
                Class: [{ image: "class", ... }],
                Identifier: [{ image: "Foo", ... }]
              }
            }]
          }
        }]
      }
    }]
  }
}
```

## 🌟 Language Support

### Scala 2 Features
- ✅ Classes, objects, traits
- ✅ Methods and functions
- ✅ Pattern matching
- ✅ For comprehensions
- ✅ Implicit parameters and conversions
- ✅ Type parameters and bounds
- ✅ Annotations
- ✅ XML literals

### Scala 3 Features
- ✅ Enum definitions
- ✅ Extension methods
- ✅ Given/using clauses
- ✅ Union and intersection types
- ✅ Opaque type aliases
- ✅ Export clauses
- ✅ Match types
- ✅ Context functions

## 🔧 Advanced Usage

### Custom Error Handling

```typescript
import { parse, ParserError } from '@simochee/scala-parser';

try {
  const cst = parse(sourceCode);
} catch (error) {
  if (error instanceof ParserError) {
    console.error(`Syntax error at line ${error.line}:${error.column}`);
    console.error(error.message);
  }
}
```

### Working with the Lexer

```typescript
import { ScalaLexer } from '@simochee/scala-parser';

const lexer = new ScalaLexer();
const tokens = lexer.tokenize(sourceCode);

if (tokens.errors.length > 0) {
  console.error('Lexing errors:', tokens.errors);
} else {
  console.log('Tokens:', tokens.tokens);
}
```

## 🤝 Contributing

This parser is part of the [prettier-plugin-scala](https://github.com/simochee/prettier-plugin-scala) monorepo. Contributions are welcome!

### Development

```bash
# Clone the monorepo
git clone https://github.com/simochee/prettier-plugin-scala
cd prettier-plugin-scala

# Install dependencies
pnpm install

# Build the parser
pnpm --filter @simochee/scala-parser build

# Run tests
pnpm --filter @simochee/scala-parser test
```

## 📄 License

MIT © [Simochee](https://github.com/simochee)

## 🔗 Links

- [GitHub Repository](https://github.com/simochee/prettier-plugin-scala)
- [NPM Package](https://www.npmjs.com/package/@simochee/scala-parser)
- [Prettier Plugin](https://www.npmjs.com/package/@simochee/prettier-plugin-scala)
- [Chevrotain](https://chevrotain.io)