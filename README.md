# prettier-plugin-scala

A [Prettier](https://prettier.io) plugin for formatting Scala code with comprehensive language support.

[![npm version](https://badge.fury.io/js/prettier-plugin-scala.svg)](https://www.npmjs.com/package/prettier-plugin-scala)
[![Node.js CI](https://github.com/simochee/prettier-plugin-scala/workflows/Node.js%20CI/badge.svg)](https://github.com/simochee/prettier-plugin-scala/actions)

## Features

**🎯 Complete Scala Language Support**
- **Scala 2 & 3** - Full support for modern Scala features including enums, extension methods, union types
- **Object-Oriented** - Classes, objects, traits, case classes, inheritance
- **Functional Programming** - Pattern matching, for comprehensions, lambda expressions
- **Advanced Types** - Generics, type lambdas, dependent function types, opaque types
- **Operators** - Infix notation, logical/bitwise operators, Ask pattern (`?`)

**✨ Seamless Integration**
- **Zero Configuration** - Works out of the box with Prettier
- **Editor Support** - VS Code, IntelliJ, and other Prettier-enabled editors
- **CLI & API** - Command line and programmatic formatting
- **Comment Preservation** - Maintains your code comments
- **CI/CD Ready** - Automated formatting in your pipeline

## Requirements

- **Node.js** 18.0 or higher
- **Prettier** 3.0 or higher

## Installation

```bash
# npm
npm install --save-dev prettier prettier-plugin-scala

# yarn
yarn add --dev prettier prettier-plugin-scala

# pnpm
pnpm add -D prettier prettier-plugin-scala
```

## Usage

The plugin works automatically with Prettier when `.scala` files are detected.

### Configuration

Add the plugin to your Prettier configuration:

**`.prettierrc`**
```json
{
  "plugins": ["prettier-plugin-scala"],
  "printWidth": 80,
  "tabWidth": 2
}
```

**`package.json`**
```json
{
  "prettier": {
    "plugins": ["prettier-plugin-scala"]
  }
}
```

### CLI

```bash
# Format a single file
npx prettier --write MyClass.scala

# Format all Scala files  
npx prettier --write "src/**/*.scala"

# Check formatting
npx prettier --check "src/**/*.scala"
```

### Programmatic API

```javascript
import prettier from "prettier";

const code = `
class Person(name: String, age: Int) {
def getName(): String = name
val isAdult: Boolean = age >= 18
}
`;

const formatted = await prettier.format(code, {
  parser: "scala",
  plugins: ["prettier-plugin-scala"],
});

console.log(formatted);
```

### Editor Integration

**VS Code**
1. Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
2. Add to your `settings.json`:
```json
{
  "[scala]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

**IntelliJ IDEA**
1. Install the Prettier plugin
2. Configure Prettier in Settings → Languages & Frameworks → JavaScript → Prettier
3. Add `*.scala` to file patterns

## Configuration Options

prettier-plugin-scala uses Prettier's standard configuration options:

| Option | Default | Description |
|--------|---------|-------------|
| `printWidth` | 80 | Maximum line length |
| `tabWidth` | 2 | Number of spaces per indentation level |
| `useTabs` | false | Use tabs instead of spaces |
| `semi` | true | Add semicolons where applicable |
| `singleQuote` | false | Use single quotes instead of double quotes |

The plugin automatically detects `.scala` files and applies these formatting rules.

## Examples

**Before Formatting:**
```scala
class UserService(database:Database){
// TODO: Add caching strategy
private val cache=mutable.Map[String,User]()
def findUser(id:String):User={cache.get(id)}
def createUser(name:String,email:String):User={val user=User(name,email)
cache.put(user.id,user)
user}}
```

**After Formatting:**
```scala
class UserService(
  database: Database
) {
  // TODO: Add caching strategy
  private val cache = mutable.Map[String, User]()
  def findUser(id: String): User = {
    cache.get(id)
  }
  def createUser(name: String, email: String): User = {
    val user = User(name, email)
    cache.put(user.id, user)
    user
  }
}
```

## Supported Features

**✅ Core Language**
- Classes, objects, traits, case classes
- Methods, functions, lambdas
- Pattern matching, for comprehensions
- Generics and type bounds

**✅ Modern Scala 3**
- Enums, extension methods
- Union and intersection types
- Opaque types, type definitions
- Given/using instances

**✅ Advanced Features**
- Type lambdas, match types
- Dependent function types
- Context functions
- String interpolation

**✅ Comments & Formatting**
- Line and block comments preserved
- Consistent indentation and spacing
- Configurable line width and tab size

## Known Limitations

While prettier-plugin-scala supports the vast majority of Scala language features, there are some current limitations:

- **Complex import statements** - Some advanced import syntax may not be fully supported
- **Compound assignment operators** (`+=`, `-=`, etc.) - Currently not supported  
- **Large files** (>10KB) - May experience slower formatting performance

For a complete list of supported and planned features, see our [development documentation](./CLAUDE.md).

## Performance

- **Small files** (<1KB): < 10ms
- **Medium files** (1-10KB): < 100ms  
- **Large files** (>10KB): < 1s

## Contributing

We welcome contributions! This plugin is built with:

- **[Chevrotain](https://chevrotain.io/)** - Parser building toolkit
- **TypeScript** - Type-safe implementation
- **Prettier Plugin API** - Formatting integration

### Development Setup

```bash
git clone https://github.com/your-repo/prettier-plugin-scala
cd prettier-plugin-scala
pnpm install
pnpm build
pnpm test
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Related Projects

- **[Prettier](https://prettier.io/)** - Opinionated code formatter
- **[scalafmt](https://scalameta.org/scalafmt/)** - Native Scala code formatter  
- **[Chevrotain](https://chevrotain.io/)** - Parser building toolkit

## Support

- 🐛 **Bug reports**: [GitHub Issues](https://github.com/your-repo/prettier-plugin-scala/issues)
- 💡 **Feature requests**: [GitHub Discussions](https://github.com/your-repo/prettier-plugin-scala/discussions)
- 📖 **Documentation**: [Development Guide](./CLAUDE.md)