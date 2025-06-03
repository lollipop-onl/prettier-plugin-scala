# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# prettier-plugin-scala 開発ガイドライン

## プロジェクト概要

scalafmt互換のPrettierプラグインを開発するプロジェクトです。Chevrotainパーサージェネレータを使用してScalaの構文解析を行い、Prettierのプラグインアーキテクチャに統合します。

## 開発環境

- Node.js 24（mise経由）
- pnpm 10.11.1
- 実装済み依存関係: Chevrotain、Prettier、TypeScript

## プロジェクト構造（実装済み）

```
prettier-plugin-scala/
├── packages/
│   ├── prettier-plugin-scala/  # メインプラグイン（TypeScript）
│   │   ├── src/
│   │   │   ├── index.ts        # Prettierプラグインエントリポイント
│   │   │   ├── printer.ts      # CST→フォーマット済みコード変換
│   │   │   └── visitor.ts      # CSTビジター実装
│   │   ├── test/               # テストスイート
│   │   └── lib/                # ビルド出力
│   └── scala-parser/           # Chevrotainベースのパーサー
│       ├── src/
│       │   ├── index.ts        # パーサーエントリポイント
│       │   ├── lexer.ts        # 字句解析器
│       │   └── parser.ts       # 構文解析器
│       ├── test/               # パーサーテスト
│       └── lib/                # ビルド出力
├── docs/                       # 技術ドキュメント
└── README.md                   # ユーザー向けドキュメント
```

## 開発ルール

### 基本的なルール

- CLAUDE.md は日本語で記載すること
- コミットメッセージは Conventional Commit のルールに従うこと

### コーディング規約

- TypeScriptを使用（Phase 1で移行完了）
- ESModulesを使用
- Prettierでコードフォーマット（自己ホスティング）
- テストファーストで開発

### コミットメッセージの形式

```
<type>(<scope>): <subject>

<body>

<footer>
```

タイプ:

- feat: 新機能
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: コードの意味に影響しない変更
- refactor: リファクタリング
- test: テストの追加・修正
- chore: ビルドプロセスやツールの変更

### 実装フェーズ

1. **✅ Phase 1: MVP版** - 基本的なScalaコードのフォーマッティング（完了）
   - テスト成功率: 87.5% (7/8)
   - 基本構文（クラス、オブジェクト、メソッド、変数）の完全サポート
2. **✅ Phase 2: 主要機能実装** - 実用的なScalaコードのフォーマッティング（完了）
   - テスト成功率: 76.5% (13/17)
   - ジェネリクス、ケースクラス、パターンマッチング、new演算子の完全サポート
3. **📋 Phase 3: 完全版** - scalafmtとの高い互換性（将来計画）

### テスト方針

- 各構文要素に対してユニットテストを作成
- scalafmtの出力と比較するスナップショットテスト
- 実際のScalaプロジェクトでの統合テスト

### ドキュメント管理

- 技術的な決定事項は docs/ 以下に記録
- APIドキュメントはJSDocで管理
- ユーザー向けドキュメントはREADME.mdに記載

### リリース方針

- セマンティックバージョニングを使用
- CHANGELOGを維持
- npm公開前にalpha/betaリリースを実施

### Phase 1 実装結果（完了）

**実装済み機能:**
- ✅ 基本クラス定義: `class Person(name: String, age: Int)`
- ✅ オブジェクト定義: `object Main { ... }`
- ✅ トレイト定義: `trait Drawable { ... }`
- ✅ メソッド定義: `def add(a: Int, b: Int): Int = a + b`
- ✅ 変数定義: `val x = 42`, `var y: String = "hello"`
- ✅ パッケージ・インポート: `package com.example`, `import scala.collection`
- ✅ アクセス修飾子: `private`, `protected`, `final`
- ✅ ブロック式: `{ val x = 10; x + 20 }`

**テスト結果:**
- 基本機能テスト: 10/10 (100%)
- 実世界パターン: 2/5 (40%)
- 総合評価: 7/8 (87.5%)

### Phase 2 実装結果（完了）

**実装済み機能:**
- ✅ ジェネリクス: `class Box[T]`, `def identity[T]`, `[T <: AnyRef]`
- ✅ ケースクラス: `case class Person(name: String, age: Int)`
- ✅ パターンマッチング: `x match { case 1 => "one"; case _ => "other" }`
- ✅ new演算子: `new Person("Alice", 30)`, `new List[Int]()`

**テスト結果:**
- ジェネリクス: 6/6 (100%)
- ケースクラス: 2/2 (100%)
- new演算子: 3/3 (100%)
- パターンマッチング: 2/2 (100%)
- 総合評価: 13/17 (76.5%)

**制限事項（Phase 3で対応予定）:**
- ラムダ式: `x => x * 2`, `list.map(_ + 1)`
- 中置記法: `1 to 10`, `list :+ element`
- for内包表記: `for (x <- xs; y <- ys) yield (x, y)`
- 文字列補間: `s"Hello $name"`
- implicit/given: Scala 3の新機能

## 参考資料

- [Prettier Plugin API](https://prettier.io/docs/plugins.html)
- [Chevrotain Documentation](https://chevrotain.io/docs/)
- [scalafmt Configuration](https://scalameta.org/scalafmt/docs/configuration.html)
