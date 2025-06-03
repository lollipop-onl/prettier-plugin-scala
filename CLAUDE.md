# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# prettier-plugin-scala 開発ガイドライン

## プロジェクト概要

scalafmt互換のPrettierプラグインを開発するプロジェクトです。Chevrotainパーサージェネレータを使用してScalaの構文解析を行い、Prettierのプラグインアーキテクチャに統合します。

**現在の実装状況:**
- ✅ Phase 1: 基本構文のフォーマッティング（87.5%成功率）
- ✅ Phase 2: 主要機能の完全実装（100%成功率）
- ✅ Phase 3: 完全版への大幅拡張（96%成功率）
- 総合テスト成功: 23/24（軽微なラムダ式解析エラーを除く）
- 完全実装済み: 論理演算子、クラス内メンバー初期化、文字列補間、補助コンストラクタ、高度な中置記法、given定義

## 開発環境

- Node.js 24（mise経由）
- pnpm 10.11.1
- Turborepo（モノレポタスク管理）
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
   - テスト成功率: 100% (17/17)
   - ジェネリクス、ケースクラス、パターンマッチング、new演算子の完全サポート
   - Phase 3機能の先行実装: For内包表記、ラムダ式、中置記法
3. **✅ Phase 3: 完全版** - scalafmtとの高い互換性（完了）
   - テスト成功率: 96% (23/24)
   - 論理演算子（&&、||）の完全サポート
   - クラス内メンバー初期化（apply式）の完全サポート
   - 文字列補間（s"$var"、f"$var"、${expr}）の完全サポート
   - 補助コンストラクタ（def this(...)）の完全サポート
   - 高度な中置記法（:+、::、++）の完全サポート
   - Scala 3のgiven定義の基本サポート

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
- ✅ ジェネリクス: `class Box[T]`, `def identity[T]`, `[T <: AnyRef]`, `[T >: Nothing]`
- ✅ ケースクラス: `case class Person(name: String, age: Int)`
- ✅ パターンマッチング: `x match { case 1 => "one"; case _ => "other" }`
- ✅ new演算子: `new Person("Alice", 30)`, `new List[Int]()`

**Phase 3より先行実装済み:**
- ✅ For内包表記: `for (i <- 1 to 10) yield i * 2`, `for (i <- xs if i > 0) yield i`
- ✅ ラムダ式とメソッド呼び出し: `list.map(x => x * 2)`
- ✅ 中置記法（to演算子）: `1 to 10`

**テスト結果:**
- ジェネリクス: 6/6 (100%)
- ケースクラス: 2/2 (100%)
- new演算子: 3/3 (100%)
- パターンマッチング: 2/2 (100%)
- For内包表記: 3/3 (100%)
- メソッド呼び出し: 1/1 (100%)
- **総合評価: 17/17 (100%)**

**制限事項（Phase 3で対応予定）:**
- 論理演算子: `&&`, `||` - 条件処理に必須
- クラス内メンバー初期化: `private val cache = mutable.Map[String, User]()`
- 文字列補間: `s"Hello $name"`
- 補助コンストラクタ: `def this(...) = this(...)`
- implicit/given: Scala 3の新機能
- 高度な中置記法: `list :+ element`, `elem :: list`

### 実動作テスト結果（2025/6/3 - 更新）

**動作確認済み:**
- トップレベルのval/var定義
- 基本的なクラス/ケースクラス/トレイト/オブジェクト定義
- メソッド定義（クラス内）
- ジェネリクス定義（上限・下限境界含む）
- パターンマッチング（ガード付き含む）
- パッケージ/インポート文
- ✅ **For内包表記**: `for (i <- 1 to 10) yield i * 2`
- ✅ **ラムダ式**: `list.map(x => x * 2)`
- ✅ **中置記法（to）**: `1 to 10`

**エラーが発生する機能:**
- 論理演算子を含む条件式: `if (x && y)`
- クラス内でのコレクション初期化: `private val map = Map[K, V]()`
- 補助コンストラクタ: `def this(...)`

## 開発コマンド

```bash
# ビルド（全パッケージ）
pnpm build

# テスト実行（全パッケージ）
pnpm test

# クリーンアップ
pnpm clean

# 実際のScalaファイルでテスト
npx prettier --plugin ./packages/prettier-plugin-scala/lib/index.js <file.scala>
```

## 参考資料

- [Prettier Plugin API](https://prettier.io/docs/plugins.html)
- [Chevrotain Documentation](https://chevrotain.io/docs/)
- [scalafmt Configuration](https://scalameta.org/scalafmt/docs/configuration.html)
