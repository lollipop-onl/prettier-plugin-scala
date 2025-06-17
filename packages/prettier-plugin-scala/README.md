# @simochee/prettier-plugin-scala

<p align="center">
  <em>A <a href="https://prettier.io">Prettier</a> plugin for formatting Scala code</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@simochee/prettier-plugin-scala">
    <img alt="npm version" src="https://img.shields.io/npm/v/@simochee/prettier-plugin-scala?color=brightgreen&label=npm%20package">
  </a>
  <a href="https://github.com/simochee/prettier-plugin-scala/actions">
    <img alt="CI Status" src="https://github.com/simochee/prettier-plugin-scala/workflows/CI/badge.svg">
  </a>
  <a href="https://github.com/simochee/prettier-plugin-scala/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

## ✨ Features

- 🎯 **Zero Configuration** - Works out of the box with Prettier
- ⚡ **Fast** - Formats most files in under 100ms
- 📐 **Consistent** - Opinionated formatting for consistent codebases
- 🔧 **Configurable** - Respects your Prettier configuration
- 💬 **Comment Preservation** - Keeps your comments intact
- 🆕 **Scala 3 Support** - Full support for modern Scala features

## 📦 Installation

```bash
npm install --save-dev prettier @simochee/prettier-plugin-scala
```

Or with yarn:

```bash
yarn add --dev prettier @simochee/prettier-plugin-scala
```

Or with pnpm:

```bash
pnpm add -D prettier @simochee/prettier-plugin-scala
```

## 🚀 Usage

Once installed, Prettier will automatically use this plugin for `.scala` files.

```bash
# Format a single file
npx prettier --write MyClass.scala

# Format all Scala files
npx prettier --write "**/*.scala"

# Check formatting
npx prettier --check "**/*.scala"
```

### Configuration

Create a `.prettierrc` file in your project root:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false
}
```

> **Note**: We recommend `semi: false` for Scala projects to follow language conventions.

### Editor Integration

<details>
<summary><strong>VS Code</strong></summary>

1. Install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension
2. Add to your settings:

```json
{
  "[scala]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```
</details>

<details>
<summary><strong>IntelliJ IDEA</strong></summary>

1. Install the [Prettier](https://plugins.jetbrains.com/plugin/10456-prettier) plugin
2. Configure it to format `*.scala` files
</details>

## ⚙️ Options

All standard Prettier options are supported:

| Option | Default | Description |
|--------|---------|-------------|
| `printWidth` | `80` | Line length limit |
| `tabWidth` | `2` | Spaces per indentation |
| `useTabs` | `false` | Use tabs for indentation |
| `semi` | `true` | Add semicolons (use `false` for Scala) |
| `singleQuote` | `false` | Use single quotes |
| `trailingComma` | `"es5"` | Add trailing commas |

## 📸 Examples

**Input:**
```scala
class Person(name:String,age:Int){def greet()=s"Hello, $name"}
```

**Output:**
```scala
class Person(name: String, age: Int) {
  def greet() = s"Hello, $name"
}
```

<details>
<summary>More examples</summary>

**Pattern Matching:**
```scala
// Input
x match{case Some(value)=>println(value)case None=>println("empty")}

// Output
x match {
  case Some(value) => println(value)
  case None => println("empty")
}
```

**For Comprehension:**
```scala
// Input
for{x<-List(1,2,3)y<-List(4,5,6)if x+y>5}yield x*y

// Output
for {
  x <- List(1, 2, 3)
  y <- List(4, 5, 6)
  if x + y > 5
} yield x * y
```
</details>

## 🌟 Language Support

### ✅ Supported Features

- Classes, objects, traits, case classes
- Methods, functions, lambdas
- Pattern matching, for comprehensions
- String interpolation, XML literals
- Generics, type bounds, variance
- Implicits, givens (Scala 3)
- Enums, extension methods (Scala 3)
- Union types, intersection types (Scala 3)
- Opaque types, match types (Scala 3)
- And much more!

### ⚠️ Known Limitations

- PartialFunction literals `{ case ... }`
- sbt DSL operator `:=`
- Complex annotation syntax
- Compound assignment operators (`+=`, `-=`)

## 🐛 Troubleshooting

If you encounter issues:

1. Ensure you have the latest version installed
2. Check if your code compiles with `scalac`
3. Try formatting with `--debug-check` flag
4. Report issues at [GitHub Issues](https://github.com/simochee/prettier-plugin-scala/issues)

## 📄 License

MIT © [Simochee](https://github.com/simochee)

## 🔗 Links

- [GitHub Repository](https://github.com/simochee/prettier-plugin-scala)
- [NPM Package](https://www.npmjs.com/package/@simochee/prettier-plugin-scala)
- [Issue Tracker](https://github.com/simochee/prettier-plugin-scala/issues)
- [Prettier](https://prettier.io)