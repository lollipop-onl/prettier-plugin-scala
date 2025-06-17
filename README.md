# prettier-plugin-scala

<p align="center">
  <em>A monorepo for Prettier Scala formatting tools</em>
</p>

<p align="center">
  <a href="https://github.com/simochee/prettier-plugin-scala/actions">
    <img alt="CI Status" src="https://github.com/simochee/prettier-plugin-scala/workflows/CI/badge.svg">
  </a>
  <a href="https://github.com/simochee/prettier-plugin-scala/network/dependencies">
    <img alt="Dependency Graph" src="https://img.shields.io/badge/dependency-graph-blue.svg">
  </a>
  <a href="https://github.com/simochee/prettier-plugin-scala/security">
    <img alt="Security" src="https://img.shields.io/badge/security-advisories-green.svg">
  </a>
  <a href="LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

## 📦 Packages

This monorepo contains:

| Package | Description | Version |
|---------|-------------|---------|
| [@simochee/prettier-plugin-scala](./packages/prettier-plugin-scala) | Prettier plugin for formatting Scala code | [![npm](https://img.shields.io/npm/v/@simochee/prettier-plugin-scala.svg)](https://www.npmjs.com/package/@simochee/prettier-plugin-scala) |
| [@simochee/scala-parser](./packages/scala-parser) | Scala parser built with Chevrotain | [![npm](https://img.shields.io/npm/v/@simochee/scala-parser.svg)](https://www.npmjs.com/package/@simochee/scala-parser) |

## 🚀 Quick Start

### Using the Prettier Plugin

```bash
npm install --save-dev prettier @simochee/prettier-plugin-scala
```

Then format your Scala files:

```bash
npx prettier --write "**/*.scala"
```

See the [plugin documentation](./packages/prettier-plugin-scala) for detailed usage.

### Using the Parser

```bash
npm install @simochee/scala-parser
```

```typescript
import { parse } from '@simochee/scala-parser';

const cst = parse('class Foo { def bar = 42 }');
```

See the [parser documentation](./packages/scala-parser) for API details.

## 🛠️ Development

This project uses:
- [pnpm](https://pnpm.io/) for package management
- [Turborepo](https://turbo.build/) for monorepo tooling
- [Vitest](https://vitest.dev/) for testing
- [TypeScript](https://www.typescriptlang.org/) for type safety

### Setup

```bash
# Clone the repository
git clone https://github.com/simochee/prettier-plugin-scala
cd prettier-plugin-scala

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Project Structure

```
prettier-plugin-scala/
├── packages/
│   ├── prettier-plugin-scala/  # Main Prettier plugin
│   └── scala-parser/          # Chevrotain-based parser
├── test-fixtures/             # Test samples and examples
├── docs/                      # Documentation
└── turbo.json                # Turborepo configuration
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for your changes
4. Ensure all tests pass
5. Submit a pull request

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.

## 📄 License

MIT © [Simochee](https://github.com/simochee)

## 🔗 Links

- [GitHub Repository](https://github.com/simochee/prettier-plugin-scala)
- [Issue Tracker](https://github.com/simochee/prettier-plugin-scala/issues)
- [Discussions](https://github.com/simochee/prettier-plugin-scala/discussions)