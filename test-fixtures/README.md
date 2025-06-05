# Test Fixtures

このディレクトリには、prettier-plugin-scalaの開発・テスト・検証用のScalaコードサンプルが含まれています。

## ディレクトリ構造

### 📁 examples/
実世界のフレームワーク・ライブラリ使用例とScala機能デモンストレーション

#### frameworks/
- `akka-sample.scala` - Akka Actorシステムの使用例
- `cats-sample.scala` - Cats関数型プログラミングライブラリ
- `play-framework-sample.scala` - Play Frameworkウェブアプリケーション
- `zio-sample.scala` - ZIOエフェクトシステム

#### features/
- `scala3-advanced.scala` - Scala 3の高度な機能デモ
- `simple-ask.scala` - Ask Patternの基本使用例

### 📁 integration/
統合テスト・実プロダクション検証用のサンプル

- `line-spacing-example.scala` - フォーマット品質検証
- `oss-validation-features.scala` - OSSプロジェクト検証用機能
- `real-world-simple.scala` - 実世界シナリオのシンプル版

### 📁 unit/
単体テスト用の言語機能別サンプル

#### basic/ (10ファイル)
基本的なScala構文とPhase 1機能
- 基本クラス・オブジェクト・トレイト定義
- if/else、while、try/catch制御構文
- インポート・アノテーション・暗黙的定義

#### scala3/ (6ファイル)
Scala 3の新機能とPhase 2機能
- enum定義・export句
- union/intersection types・opaque types
- ギリシャ文字サポート

#### advanced/ (14ファイル)
高度な言語機能とPhase 3機能
- match types・type lambdas・dependent function types
- inline/transparent・quotes/splices・context functions
- Kind Projector・文字列補間・Apply式

## 使用方法

### フォーマットテスト
```bash
# 特定ファイルのフォーマット
npx prettier --plugin ./packages/prettier-plugin-scala/lib/index.js test-fixtures/unit/basic/basic-syntax-simple.scala

# ディレクトリ全体のフォーマット検証
npx prettier --plugin ./packages/prettier-plugin-scala/lib/index.js test-fixtures/**/*.scala --check
```

### 機能別テスト
```bash
# 基本構文テスト
npx prettier --plugin ./packages/prettier-plugin-scala/lib/index.js test-fixtures/unit/basic/*.scala

# Scala 3機能テスト
npx prettier --plugin ./packages/prettier-plugin-scala/lib/index.js test-fixtures/unit/scala3/*.scala

# フレームワーク検証
npx prettier --plugin ./packages/prettier-plugin-scala/lib/index.js test-fixtures/examples/frameworks/*.scala
```

## ファイル統合履歴

- `negation-simple.scala` → `negation-operator.scala` (重複内容統合)
- `simple-union-types.scala` + `advanced-union-types.scala` → `union-intersection-types.scala` (包括的内容に統合)
- `quotes-splices-simple.scala` → `quotes-splices.scala` (包括的内容に統合)

**総ファイル数**: 39ファイル (43ファイルから4ファイル削減)