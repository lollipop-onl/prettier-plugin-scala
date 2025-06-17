# prettier-plugin-scala

<p align="center">
  <em>A <a href="https://prettier.io">Prettier</a> plugin for formatting Scala code, bringing modern tooling to the Scala ecosystem.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/prettier-plugin-scala">
    <img alt="npm version" src="https://img.shields.io/npm/v/prettier-plugin-scala?color=brightgreen&label=npm%20package">
  </a>
  <a href="https://github.com/simochee/prettier-plugin-scala/actions">
    <img alt="CI Status" src="https://github.com/simochee/prettier-plugin-scala/workflows/CI/badge.svg">
  </a>
  <a href="LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
  <a href="https://github.com/simochee/prettier-plugin-scala/releases">
    <img alt="Release Status" src="https://img.shields.io/badge/status-beta-orange">
  </a>
</p>

## ✨ Why prettier-plugin-scala?

Prettier has become the de facto standard for code formatting in the JavaScript ecosystem. This plugin brings the same **zero-configuration**, **opinionated formatting** experience to Scala developers, integrating seamlessly with modern development workflows.

## 🚀 Features

### Language Support
- ✅ **Scala 2 & 3** - Comprehensive support for both language versions
- ✅ **Modern Scala 3** - Enums, extension methods, union/intersection types, opaque types
- ✅ **Functional Programming** - Pattern matching, for comprehensions, lambdas, higher-kinded types
- ✅ **Object-Oriented** - Classes, objects, traits, case classes, inheritance
- ✅ **Type System** - Generics, type lambdas, match types, dependent function types
- ✅ **Meta-programming** - Inline/transparent, quotes and splices (Scala 3)

### Developer Experience
- 🎯 **Zero Configuration** - Works out of the box, no setup required
- ⚡ **Fast** - Formats most files in under 100ms
- 🔧 **Prettier Compatible** - Uses standard Prettier options
- 💾 **Editor Integration** - VS Code, IntelliJ IDEA, Vim, Emacs
- 🤖 **CI/CD Ready** - Perfect for automated formatting
- 💬 **Comment Preservation** - Keeps your documentation intact

## 📋 Requirements

- Node.js 18.0 or higher
- Prettier 3.0 or higher

## 📦 Installation

```bash
# npm
npm install --save-dev prettier prettier-plugin-scala

# yarn
yarn add --dev prettier prettier-plugin-scala

# pnpm
pnpm add -D prettier prettier-plugin-scala
```

> **Note**: This plugin is currently in **beta**. Please report any issues you encounter!

## 🔧 Usage

Once installed, Prettier will automatically use this plugin for `.scala` files. No additional configuration required!

### Configuration

Create a `.prettierrc` file in your project root:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

Or add to your `package.json`:

```json
{
  "prettier": {
    "printWidth": 100,
    "tabWidth": 2
  }
}
```

### Command Line

```bash
# Format a single file
npx prettier --write MyClass.scala

# Format all Scala files in your project
npx prettier --write "**/*.scala"

# Check if files are formatted
npx prettier --check "**/*.scala"

# Format with specific options
npx prettier --write --tab-width 4 "src/**/*.scala"
```

### API Usage

```javascript
import * as prettier from "prettier";

const code = `class Person(name:String,age:Int){def greet()=s"Hello, $name"}`;

const formatted = await prettier.format(code, {
  parser: "scala",
  plugins: ["prettier-plugin-scala"],
  printWidth: 80,
  tabWidth: 2
});

console.log(formatted);
// Output:
// class Person(name: String, age: Int) {
//   def greet() = s"Hello, $name"
// }
```

### Editor Integration

<details>
<summary><strong>Visual Studio Code</strong></summary>

1. Install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension
2. Add to your workspace settings (`.vscode/settings.json`):

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
2. Go to Settings → Languages & Frameworks → JavaScript → Prettier
3. Set "Run for files" to include `*.scala`
4. Enable "On save" option
</details>

<details>
<summary><strong>Vim / Neovim</strong></summary>

Using [vim-prettier](https://github.com/prettier/vim-prettier):

```vim
Plug 'prettier/vim-prettier', { 'do': 'npm install' }

let g:prettier#config#parser = 'scala'
autocmd BufWritePre *.scala Prettier
```
</details>

## ⚙️ Configuration Options

This plugin respects all standard Prettier options:

| Option | Default | Description |
|--------|---------|-------------|
| `printWidth` | `80` | Line length where Prettier will try to wrap |
| `tabWidth` | `2` | Number of spaces per indentation level |
| `useTabs` | `false` | Use tabs for indentation |
| `semi` | `true` | Add semicolons (Scala convention: `false`) |
| `singleQuote` | `false` | Use single quotes for strings |
| `trailingComma` | `"es5"` | Add trailing commas where valid in ES5 |

> **Tip**: For Scala projects, we recommend setting `semi: false` to follow Scala conventions.

## 📸 Examples

### Basic Formatting

**Input:**
```scala
class UserService(database:Database){private val logger=LoggerFactory.getLogger(classOf[UserService])
def findUser(id:String):Option[User]={logger.info(s"Finding user $id")
database.users.find(_.id==id)}}
```

**Output:**
```scala
class UserService(database: Database) {
  private val logger = LoggerFactory.getLogger(classOf[UserService])
  
  def findUser(id: String): Option[User] = {
    logger.info(s"Finding user $id")
    database.users.find(_.id == id)
  }
}
```

### Scala 3 Features

**Input:**
```scala
enum Color{case Red,Green,Blue}
extension(s:String){def toColor:Option[Color]=Color.values.find(_.toString==s)}
type RGB=Int|String
opaque type UserId=String
```

**Output:**
```scala
enum Color {
  case Red, Green, Blue
}

extension (s: String) {
  def toColor: Option[Color] = Color.values.find(_.toString == s)
}

type RGB = Int | String
opaque type UserId = String
```

## ✅ Language Support

<table>
<tr>
<td>

### Core Scala
- ✅ Classes, objects, traits
- ✅ Case classes and objects  
- ✅ Methods and functions
- ✅ Val/var declarations
- ✅ Pattern matching
- ✅ For comprehensions
- ✅ If/else expressions
- ✅ Try/catch/finally
- ✅ While loops

</td>
<td>

### Scala 3
- ✅ Enum definitions
- ✅ Extension methods
- ✅ Union types `A | B`
- ✅ Intersection types `A & B`
- ✅ Opaque type aliases
- ✅ Given/using clauses
- ✅ Export clauses
- ✅ Context functions
- ✅ Match types

</td>
<td>

### Advanced
- ✅ Type lambdas `[X] =>> F[X]`
- ✅ Kind projector `*`
- ✅ Dependent functions
- ✅ Inline/transparent
- ✅ Quotes and splices
- ✅ String interpolation
- ✅ XML literals
- ✅ Scientific notation
- ✅ Infix operators

</td>
</tr>
</table>

## ⚠️ Known Limitations (Beta)

This plugin is currently in **beta**. While it supports most Scala features, some limitations exist:

### Not Yet Supported
- ❌ **PartialFunction literals** - `{ case x => ... }` syntax
- ❌ **sbt DSL operator** - `:=` assignment operator
- ❌ **Complex annotations** - Annotations with implicit parameters
- ❌ **Scientific notation in enums** - `3.303e+23` in enum constructors
- ❌ **Greek letters** - λ, α, β (used in some FP libraries)
- ❌ **Compound assignment** - `+=`, `-=`, `*=`, etc.

### Performance Considerations
- Large files (>10KB) may format slowly
- Complex nested expressions may impact performance

We're actively working on these limitations. Please [report any issues](https://github.com/simochee/prettier-plugin-scala/issues) you encounter!

## ⚡ Performance

| File Size | Format Time |
|-----------|-------------|
| < 1KB | ~10ms |
| 1-10KB | ~50ms |
| 10-50KB | ~200ms |
| > 50KB | < 1s |

Tested on MacBook Pro M1 with Node.js 20.

## 🤝 Contributing

We welcome contributions! This project uses:

- [Chevrotain](https://chevrotain.io/) - Parser building toolkit
- [TypeScript](https://www.typescriptlang.org/) - Type-safe implementation
- [Vitest](https://vitest.dev/) - Fast unit testing
- [Turborepo](https://turbo.build/) - Monorepo management

### Getting Started

```bash
# Clone the repository
git clone https://github.com/simochee/prettier-plugin-scala
cd prettier-plugin-scala

# Install dependencies (requires pnpm)
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run a specific file through the formatter
npx prettier --plugin ./packages/prettier-plugin-scala/lib/index.js test.scala
```

See [CLAUDE.md](./CLAUDE.md) for detailed development documentation.

## 🔗 Related Projects

- [Prettier](https://prettier.io/) - The opinionated code formatter
- [scalafmt](https://scalameta.org/scalafmt/) - Code formatter for Scala (native implementation)
- [metals](https://scalameta.org/metals/) - Scala language server with formatting support

## 📄 License

MIT © [Simochee](https://github.com/simochee)

See [LICENSE](./LICENSE) for details.

## 💬 Support

- **Bug Reports**: [GitHub Issues](https://github.com/simochee/prettier-plugin-scala/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/simochee/prettier-plugin-scala/discussions)
- **Questions**: [GitHub Discussions](https://github.com/simochee/prettier-plugin-scala/discussions)

---

<p align="center">
  Made with ❤️ by the Scala community
</p>