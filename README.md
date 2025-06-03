# prettier-plugin-scala

A [Prettier](https://prettier.io) plugin for formatting Scala code with modern language support.

[![npm version](https://badge.fury.io/js/prettier-plugin-scala.svg)](https://www.npmjs.com/package/prettier-plugin-scala)
[![Node.js CI](https://github.com/simochee/prettier-plugin-scala/workflows/Node.js%20CI/badge.svg)](https://github.com/simochee/prettier-plugin-scala/actions)

## Features

🎯 **Comprehensive Scala Support** - Format modern Scala code with confidence:

- **Object-Oriented Programming** - Classes, objects, traits, case classes, inheritance
- **Functional Programming** - Pattern matching, for comprehensions, lambda expressions  
- **Modern Language Features** - Generics, string interpolation, given definitions (Scala 3)
- **Operators & Expressions** - Logical, bitwise, and infix operators
- **Project Structure** - Package declarations, imports, top-level definitions
- **Comment Preservation** - Maintains line and inline comments during formatting

✨ **Prettier Integration** - Seamless integration with your development workflow:

- **Editor Support** - Works with VS Code, IntelliJ, and other Prettier-enabled editors
- **CLI & API** - Format files via command line or programmatically  
- **Configuration** - Customize formatting with standard Prettier options
- **CI/CD Ready** - Integrate automated formatting checks into your pipeline

## Installation

```bash
npm install --save-dev prettier prettier-plugin-scala
```

Or with yarn:

```bash
yarn add --dev prettier prettier-plugin-scala
```

## Usage

### CLI

```bash
# Format a single file
npx prettier --write MyClass.scala

# Format all Scala files
npx prettier --write "src/**/*.scala"
```

### API

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

#### VS Code

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

## Configuration

prettier-plugin-scala supports Prettier's standard configuration options. Add the plugin to your Prettier configuration:

### .prettierrc

```json
{
  "plugins": ["prettier-plugin-scala"],
  "printWidth": 80,
  "tabWidth": 2
}
```

### Editor Configuration

The plugin automatically detects `.scala` files and applies formatting using Prettier's standard options like `printWidth`, `tabWidth`, `useTabs`, etc.

## Examples

### Input

```scala
class UserService(database:Database){
// TODO: Add caching strategy
private val cache=mutable.Map[String,User]()
def findUser(id:String):User={cache.get(id)}
def createUser(name:String,email:String):User={val user=User(name,email)
cache.put(user.id,user)
user}}
```

### Output

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


## Supported Scala Features

✅ **Classes and Objects**
```scala
class Person(name: String, age: Int)
object UserService { def create(): User = ??? }
trait Drawable { def draw(): Unit }
case class User(name: String, email: String)
```

✅ **Methods and Functions**
```scala
def calculate(x: Int, y: Int): Int = x + y
val double = (x: Int) => x * 2
list.map(_.toString).filter(_.nonEmpty)
```

✅ **Pattern Matching**
```scala
result match {
  case Success(value) => value
  case Failure(error) => throw error
}
```

✅ **For Comprehensions**
```scala
for {
  user <- users
  if user.isActive
  email <- user.email
} yield email
```

✅ **Generics and Type Bounds**
```scala
class Container[T](value: T)
def process[T <: AnyRef](items: List[T]): List[T]
```

✅ **Modern Scala 3**
```scala
given stringValue: String = "default"
enum Color { case Red, Green, Blue }
```

✅ **Comment Preservation**
```scala
// This comment is preserved
class Person /* inline comment */ (
  name: String
)
```

## Limitations

- **Compound assignment operators** (`+=`, `-=`, etc.) - Use regular assignment instead
- **Control flow statements** (`if`/`else`, `while`, `try`/`catch`) - Not yet supported
- **Large files** (>10KB) may have performance issues

## Requirements

- **Node.js**: >= 18.0.0  
- **Prettier**: >= 3.0.0

## Contributing

We welcome contributions! This plugin uses:

- **[Chevrotain](https://chevrotain.io/)** for Scala parsing
- **TypeScript** for type-safe implementation  
- **Prettier Plugin API** for formatting integration

See our [contribution guidelines](./CONTRIBUTING.md) for more details.

## License

MIT

## Related Projects

- [Prettier](https://prettier.io/) - Opinionated code formatter
- [scalafmt](https://scalameta.org/scalafmt/) - Code formatter for Scala
- [Chevrotain](https://chevrotain.io/) - Parser building toolkit for JavaScript