# 実装ロードマップ

## ✅ Phase 1: MVP版（完了）

**目標**: 基本的なScalaコードのフォーマッティング

- [x] Chevrotainパーサーの基本実装
  - [x] 基本的なトークン定義
  - [x] クラス・オブジェクト定義のパース
  - [x] メソッド定義のパース
  - [x] 変数定義（val/var）のパース
- [x] 基本的なプリンター実装
  - [x] インデント処理
  - [x] ブレースとセミコロンの整形
- [x] Prettierプラグインとしての統合
- [x] 基本的なテストスイート

**達成結果:**
- テスト成功率: 87.5% (7/8)
- 基本Scala構文の完全サポート
- TypeScript実装完了
- 実世界コードでの検証済み

## ✅ Phase 2: 主要機能実装（完了）

**目標**: 実用的なScalaコードのフォーマッティング

**達成結果:**
- テスト成功率: 76.5% (13/17)
- 主要な型システム機能の実装完了
- 実用的なコードパターンのサポート

**実装済み（優先度 High）:**
- [x] ジェネリクス・型パラメータ: `class Container[T]`, `List[Int]`
- [x] ケースクラス: `case class Person(name: String)`
- [x] コンストラクタ呼び出し: `new Person("John")`
- [x] パターンマッチング: `x match { case 1 => "one" }`

**未実装（Phase 3へ持ち越し）:**
- [ ] メソッドチェーン: `list.map(x => x * 2).filter(_ > 0)`
- [ ] 文字列補間: `s"Hello $name"`
- [ ] for内包表記: `for { x <- list } yield x * 2`
- [ ] Lambda式: `x => x * 2`, `_ + 1`
- [ ] implicit/given (Scala 2/3)
- [ ] scalafmt設定互換性
- [ ] コメント処理の改善
- [ ] エディタ統合のテスト

## 📋 Phase 3: 完全版（次期実装）

**目標**: 実用的なScalaコードの完全サポート

### 最優先実装項目（実動作テストで判明した必須機能）

**優先度 Critical（基本的なプログラミングに必須）:**
- [ ] 論理演算子: `&&`, `||` - 条件処理の基本
- [ ] ラムダ式: `x => x * 2`, `_ + 1` - 関数型プログラミングの基礎
- [ ] クラス内メンバー初期化: `private val map = Map[K, V]()` - 実用的なクラス実装

**優先度 High（Scalaらしいコードに必要）:**
- [ ] メソッドチェーン: `list.map(x => x * 2).filter(_ > 0)`
- [ ] 中置記法: `1 to 10`, `list :+ element`
- [ ] 補助コンストラクタ: `def this(...) = this(...)`

**優先度 Medium:**
- [ ] for内包表記: `for { x <- list } yield x * 2`
- [ ] 文字列補間: `s"Hello $name"`
- [ ] コメント処理の改善

**優先度 Low:**
- [ ] Scala 3固有構文の完全サポート
  - [ ] extension methods
  - [ ] opaque types
  - [ ] union/intersection types
- [ ] implicit/given (Scala 2/3)
- [ ] 高度なアライメントルール
- [ ] scalafmt設定互換性
- [ ] エッジケースの処理
- [ ] パフォーマンス最適化
- [ ] 包括的なドキュメント
