# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# prettier-plugin-scala 開発ガイドライン

## プロジェクト概要
scalafmt互換のPrettierプラグインを開発するプロジェクトです。Chevrotainパーサージェネレータを使用してScalaの構文解析を行い、Prettierのプラグインアーキテクチャに統合します。

## 開発環境
- Node.js 24（mise経由）
- pnpm 10.11.1
- 将来的な依存関係: Chevrotain、Prettier

## プロジェクト構造（計画）
```
prettier-plugin-scala/
├── src/
│   ├── index.js            # Prettierプラグインエントリポイント
│   ├── parser/             # Chevrotainベースのパーサー
│   ├── printer/            # AST→フォーマット済みコード変換
│   └── options.js          # scalafmt互換設定オプション
├── tests/                  # テストスイート
├── docs/                   # ドキュメント
└── packages/               # 将来的なmonorepo構成用
```

## 開発ルール

### 基本的なルール
- CLAUDE.md は日本語で記載すること
- コミットメッセージは Conventional Commit のルールに従うこと

### コーディング規約
- JavaScriptを使用（TypeScriptへの移行は将来検討）
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
1. **Phase 1: MVP版** - 基本的なScalaコードのフォーマッティング
2. **Phase 2: 主要機能実装** - 実用的なScalaコードのフォーマッティング
3. **Phase 3: 完全版** - scalafmtとの高い互換性

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

## 参考資料
- [Prettier Plugin API](https://prettier.io/docs/plugins.html)
- [Chevrotain Documentation](https://chevrotain.io/docs/)
- [scalafmt Configuration](https://scalameta.org/scalafmt/docs/configuration.html)