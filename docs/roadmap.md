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

## 🚧 Phase 2: 主要機能実装（次期実装）

**目標**: 実用的なScalaコードのフォーマッティング

**優先度 High（実世界での需要が高い）:**
- [ ] ジェネリクス・型パラメータ: `class Container[T]`, `List[Int]`
- [ ] ケースクラス: `case class Person(name: String)`
- [ ] コンストラクタ呼び出し: `new Person("John")`
- [ ] メソッドチェーン: `list.map(x => x * 2).filter(_ > 0)`
- [ ] 文字列補間: `s"Hello $name"`

**優先度 Medium:**
- [ ] パターンマッチング: `x match { case 1 => "one" }`
- [ ] for内包表記: `for { x <- list } yield x * 2`
- [ ] Lambda式: `x => x * 2`, `_ + 1`

**優先度 Low:**
- [ ] implicit/given (Scala 2/3)
- [ ] scalafmt設定互換性
- [ ] コメント処理の改善
- [ ] エディタ統合のテスト

## Phase 3: 完全版（4-6週間）

**目標**: scalafmtとの高い互換性

- [ ] Scala 3固有構文の完全サポート
  - [ ] extension methods
  - [ ] opaque types
  - [ ] union/intersection types
- [ ] 高度なアライメントルール
- [ ] エッジケースの処理
- [ ] パフォーマンス最適化
- [ ] 包括的なドキュメント
