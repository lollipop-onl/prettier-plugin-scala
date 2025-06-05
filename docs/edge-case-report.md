# prettier-plugin-scala エッジケース調査レポート

## 調査概要

実際のScala OSSプロジェクト（Cats、Play Framework、Akka）を使用してprettier-plugin-scalaをテストし、サポートされていない構文やエッジケースを特定しました。

## 調査対象プロジェクト

1. **typelevel/cats** - 関数型プログラミングライブラリ
2. **playframework/playframework** - Webアプリケーションフレームワーク  
3. **akka/akka** - アクターシステム

## 発見されたエッジケース

### 1. 🚫 複数インポート記法（Import Selectors）

**問題**: `import package.{A, B, C}` 記法がサポートされていません

```scala
// ❌ エラーが発生
import cats.{Applicative, FlatMap, Monad}

// ✅ 回避策：個別インポート
import cats.Applicative
import cats.FlatMap
import cats.Monad
```

**エラー**: `Expecting token of type --> Identifier <-- but found --> '{' <--`

### 2. 🚫 Kind Projector記法（Type Lambda短縮記法）

**問題**: Scala 3のkind projector記法 `[*]` がサポートされていません

```scala
// ❌ Lexing エラーが発生
val mapEmpty: EmptyK[Map[String, *]] = ???

// ✅ 回避策：従来のtype lambda記法
val mapEmpty: EmptyK[({type λ[α] = Map[String, α]})#λ] = ???
```

**エラー**: `Lexing errors: unexpected character: ->?<- at offset: 73`

### 3. 🚫 アノテーション（Annotations）

**問題**: Java/Scalaアノテーション `@AnnotationName` がサポートされていません

```scala
// ❌ パースエラーが発生
class MyComponent @Inject() (lifecycle: String)

// ✅ 回避策：アノテーション削除（機能は失われる）
class MyComponent(lifecycle: String)
```

**エラー**: `Redundant input, expecting EOF but found: @`

### 4. 🚫 Enum定義（Scala 3）

**問題**: Scala 3のenum定義がサポートされていません

```scala
// ❌ パースエラーが発生
enum Color {
  case Red, Green, Blue
}

// ✅ 回避策：sealed trait + case object
sealed trait Color
object Color {
  case object Red extends Color
  case object Green extends Color
  case object Blue extends Color
}
```

**エラー**: `Expecting token of type --> RightBrace <-- but found --> 'case' <--`

### 5. 🚫 Extension Methods（Scala 3）

**問題**: Scala 3のextension methodsがサポートされていません

```scala
// ❌ パースエラーが発生
extension (s: String) {
  def reverse: String = s.reverse
}

// ✅ 回避策：implicit class
implicit class StringExtensions(s: String) {
  def reverse: String = s.reverse
}
```

**エラー**: `Expecting token of type --> RightParen <-- but found --> ':' <--`

## 正常動作確認済み機能

✅ **以下の機能は正常にフォーマットされます**:

- 基本クラス・オブジェクト・トレイト定義
- ケースクラス
- ジェネリクス（型パラメータ）
- パターンマッチング
- For内包表記
- ラムダ式（単純・型注釈付き・マルチライン）
- 中置記法演算子
- 文字列補間 `s"$variable"`
- Given定義（Scala 3基本機能）
- コメント保持

## 影響度評価

### High Priority（高優先度） - 実用上必須

1. **複数インポート記法** - ほぼ全てのScalaプロジェクトで使用
2. **アノテーション** - Spring/DIフレームワーク、テストで必須

### Medium Priority（中優先度） - Scala 3移行で重要

3. **Enum定義** - Scala 3の主要機能
4. **Extension Methods** - Scala 3の主要機能  

### Low Priority（低優先度） - 回避策あり

5. **Kind Projector記法** - より冗長な記法で代替可能

## 推奨改善案

### 段階1: 基本構文サポート拡張

1. **複数インポート記法の実装**
   - レキサーに `{`, `}` 対応追加
   - パーサーにimportSelector規則追加

2. **アノテーション基本サポート**
   - `@` トークン認識追加
   - アノテーション構文のパーサー規則追加

### 段階2: Scala 3サポート強化

3. **Enum定義サポート**
   - `enum` キーワード追加
   - enum本体のパーサー規則追加

4. **Extension Methodsサポート**
   - `extension` キーワード追加
   - extension構文のパーサー規則追加

### 段階3: 高度な機能

5. **Kind Projector記法**
   - type lambda短縮記法の実装
   - `*` トークンの特別処理

## 結論

prettier-plugin-scalaは基本的なScala構文を良くサポートしていますが、**実際のプロダクションコードで頻繁に使用される重要な構文**（複数インポート、アノテーション）のサポートが不足しています。

特に**複数インポート記法**と**アノテーション**の実装は、実用性向上のために最優先で対応すべきエッジケースです。

---

*調査日: 2025/6/4*  
*対象バージョン: prettier-plugin-scala v0.1.0*  
*テスト環境: Cats 2.x, Play Framework 3.x, Akka 2.6.x*