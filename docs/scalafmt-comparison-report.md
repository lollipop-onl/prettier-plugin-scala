# Scalafmt vs prettier-plugin-scala 比較分析レポート

## 概要

本レポートでは、scalafmt（標準的なScalaフォーマッター）と現在のprettier-plugin-scalaの実装を詳細に比較し、不足している機能と今後の実装優先度を分析します。

## 現在の実装状況サマリー

### ✅ 完全実装済み（scalafmt互換）

**基本言語構文**
- クラス、オブジェクト、トレイト定義
- メソッド定義と補助コンストラクタ
- 変数定義（val/var）
- パッケージとインポート文
- アクセス修飾子（private、protected、final）

**型システム**
- ジェネリクス（型パラメータ）
- 型境界（T <: AnyRef、T >: Nothing）
- 複数型パラメータ
- ケースクラス

**制御構造**
- パターンマッチング（ガード付き）
- For内包表記
- ラムダ式（x => x * 2）
- メソッドチェーン

**Scala特有機能**
- 文字列補間（s"$var"、f"$var%.2f"）
- 論理演算子（&&、||）
- 中置記法（to、:+、::、++）
- Given定義（Scala 3）

## 不足している重要機能

### 🔴 Critical Level（基本フォーマッティングに必須）

#### 1. インデント制御システム
**scalafmt機能:**
```conf
indent.main = 2
indent.defnSite = 4
indent.callSite = 2
indent.ctorSite = 4
```

**現状:** 固定インデント（2スペース）のみ
**影響:** チーム固有の設定に対応不可

#### 2. 行長制御とラップ戦略
**scalafmt機能:**
```conf
maxColumn = 120
newlines.source = keep/fold/unfold
```

**現状:** 行長制御なし、自動改行なし
**影響:** 長い行の適切な折り返しができない

#### 3. アライメント設定
**scalafmt機能:**
```conf
align.preset = more/most/some/none
align.tokens = [
  { code = "=>", owner = "Case" },
  { code = "=", owner = ".*" }
]
```

**現状:** 基本的なスペース挿入のみ
**影響:** コードの視覚的整列が困難

### 🟡 High Level（実用性に重要）

#### 4. 設定ファイルサポート
**scalafmt機能:**
- .scalafmt.conf（HOCON形式）
- 複数プリセット
- プロジェクト固有設定

**現状:** 設定システムなし
**影響:** チーム開発での標準化困難

#### 5. コメント処理
**scalafmt機能:**
- コメント位置保持
- コメントアライメント
- ドキュメントコメント特別処理

**現状:** コメント完全無視
**影響:** 実用的なコードで使用不可

#### 6. Scala 3高度機能
**scalafmt機能:**
```scala
// Extension methods
extension (x: String)
  def double: String = x + x

// Union/Intersection types  
def process(x: String | Int): String = ???

// Opaque types
opaque type UserId = String
```

**現状:** 未対応
**影響:** 現代的なScala 3コードベース対応不可

### 🟠 Medium Level（品質向上）

#### 7. 高度なパターンマッチング
**scalafmt機能:**
```scala
// 複雑なパターン
x match
  case Some(User(name, _)) if name.nonEmpty => 
    process(name)
  case _ => 
    default()
```

**現状:** 基本的なパターンのみ
**影響:** 複雑なパターンの整形品質低下

#### 8. Import文整理
**scalafmt機能:**
```conf
rewrite.imports.sort = ascii
rewrite.imports.groups = [
  ["java\\.", "javax\\."],
  ["scala\\."],
  ["[^.]"]
]
```

**現状:** Import文は単純出力のみ
**影響:** 大規模プロジェクトでの整理困難

#### 9. Implicit/Using特別処理
**scalafmt機能:**
```conf
newlines.implicitParamListModifierPrefer = before
newlines.usingParamListModifierPrefer = before
```

**現状:** 基本的なusing/given対応のみ
**影響:** Scala 3コードの慣用的フォーマット困難

### 🟢 Low Level（将来的拡張）

#### 10. 高度な設定オプション
- Trailing comma制御
- Dangling parentheses
- Binary operator改行制御
- Literal formatting

#### 11. エラーハンドリング
- 部分的フォーマット
- 構文エラー時の graceful degradation
- 詳細エラーレポート

#### 12. パフォーマンス最適化
- 大ファイル処理
- インクリメンタルフォーマッティング
- キャッシュ機能

## 実装優先度マトリクス

### Phase 4（短期）- 基本フォーマッター完成
1. **設定システム** - .prettierrc.scalaサポート
2. **基本インデント制御** - カスタマイズ可能なインデント
3. **行長制御** - maxColumn設定と自動改行
4. **コメント保持** - 最低限のコメント処理

### Phase 5（中期）- プロダクション品質
1. **アライメントシステム** - 設定可能なトークンアライメント
2. **Scala 3完全対応** - extension、union types、opaque types
3. **Import整理** - 自動ソートとグループ化
4. **エラーハンドリング強化**

### Phase 6（長期）- 高度機能
1. **Rewrite Rules** - 自動コード変換
2. **IDE統合** - 範囲フォーマット、即座プレビュー
3. **パフォーマンス最適化**
4. **scalafmt完全互換**

## 技術的実装課題

### 1. 設定システム設計
```typescript
// 必要な設定インターフェース
interface ScalaFormatterOptions {
  indent: {
    main: number;
    defnSite: number;
    callSite: number;
  };
  maxColumn: number;
  align: {
    preset: 'none' | 'some' | 'more' | 'most';
    tokens: AlignToken[];
  };
  newlines: {
    source: 'keep' | 'fold' | 'unfold';
  };
}
```

### 2. Chevrotainパーサー拡張
- コメントトークン処理追加
- エラー耐性パース
- 位置情報詳細化

### 3. フォーマッター出力エンジン
- Doc builder導入検討
- 条件付きレイアウト
- 設定ベース出力制御

## 結論

現在のprettier-plugin-scalaは**Scalaの基本構文を83%カバー**しており、簡単なプロジェクトでは実用可能です。しかし、**プロダクション環境**で使用するには以下が必須：

**immediate needs（即座対応必要）:**
1. 設定システム（.prettierrc互換）
2. コメント処理
3. 基本的なインデント制御
4. 行長制御

**Production readiness（プロダクション準備）:**
- 上記4点実装により「実用的なフォーマッター」レベル到達
- scalafmtの約70%機能相当
- 中小規模プロジェクトで採用可能

**競合優位性確保:**
- Prettierエコシステム統合
- JavaScript/TypeScriptとの統一ワークフロー
- モダンなJavaScript toolchain活用

現状では「概念実証成功」段階であり、Phase 4の実装により「実用的ツール」への移行が重要な次のステップです。