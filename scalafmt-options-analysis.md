# scalafmt設定オプション完全一覧と Prettier標準オプション対応分析

## 🎯 分析目的
scalafmt の設定オプションを包括的に一覧化し、Prettier標準オプションとの重複・共通化可能性を分析する。

## 📋 scalafmt設定オプション分類

### 🔴 CORE - 基本設定 (Prettier標準と重複/共通化可能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `maxColumn` | 80 | 最大行幅 | **✅ `printWidth`と完全一致** | **🟢 0.5日** (既存`scalaLineWidth`活用) |
| `indent.main` | 2 | 基本インデント幅 | **✅ `tabWidth`と共通化可能** | **🟢 0.5日** (Prettierオプション直接利用) |
| `indent.callSite` | 2 | メソッド呼び出し引数インデント | **🟡 `tabWidth`ベースで実装可能** | **🟡 2日** (visitor.ts修正・メソッド呼び出し判定) |
| `indent.defnSite` | 4 | メソッド定義パラメータインデント | **🟡 独自オプション必要** | **🟡 2日** (visitor.ts修正・定義サイト判定) |

### 🟡 INDENTATION - インデント制御 (部分的に共通化可能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `indent.significant` | `indent.main` | Scala 3オプショナルブレース用 | **❌ scalafmt独自** | **🔴 5日** (Scala 3構文解析・判定ロジック複雑) |
| `indent.ctrlSite` | 4 | 制御構文インデント | **❌ scalafmt独自** | **🟡 3日** (既存if/while/try対応済み・拡張必要) |
| `indent.withSiteRelativeToExtends` | 3 | with句相対インデント | **❌ scalafmt独自** | **🟡 2日** (extends句パーサー対応済み) |
| `indent.commaSiteRelativeToExtends` | 2 | カンマ相対インデント | **❌ scalafmt独自** | **🟡 2日** (カンマ位置計算ロジック) |
| `indent.extraBeforeOpenParenDefnSite` | 0 | 定義サイト括弧前追加インデント | **❌ scalafmt独自** | **🟡 1日** (括弧前スペース制御) |
| `indent.relativeToLhsLastLine` | [] | LHS最終行相対インデント | **❌ scalafmt独自** | **🔴 7日** (複雑な位置計算・行解析必要) |

### 🟢 ALIGNMENT - 整列制御 (scalafmt独自機能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `align.preset` | "some" | 整列プリセット (none/some/more/most) | **❌ scalafmt独自** | **🔴 10日** (複雑な整列アルゴリズム設計) |
| `align.tokens` | [caseArrow] | 整列対象トークン指定 | **❌ scalafmt独自** | **🔴 8日** (トークン解析・位置計算) |
| `align.openParenCallSite` | false | 呼び出しサイト括弧整列 | **❌ scalafmt独自** | **🔴 5日** (括弧位置解析・整列計算) |
| `align.openParenDefnSite` | false | 定義サイト括弧整列 | **❌ scalafmt独自** | **🔴 5日** (定義サイト判定・整列計算) |
| `align.closeParenSite` | false | 閉じ括弧整列 | **❌ scalafmt独自** | **🔴 3日** (対応する開き括弧との調整) |
| `align.multiline` | false | マルチライン整列 | **❌ scalafmt独自** | **🔴 7日** (複数行にわたる整列制御) |

### 🔵 NEWLINES - 改行制御 (scalafmt独自機能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `newlines.source` | keep | 改行戦略 (keep/fold/unfold) | **❌ scalafmt独自** | **🔴 8日** (Prettierアーキテクチャ根本変更) |
| `newlines.beforeMultiline` | unfold | マルチライン前改行 | **❌ scalafmt独自** | **🟡 4日** (マルチライン判定・改行挿入) |
| `newlines.infix` | many | 中置演算子改行 | **❌ scalafmt独自** | **🟡 3日** (中置演算子パーサー対応済み) |
| `newlines.avoidForSimpleOverflow` | [] | 単純オーバーフロー回避 | **❌ scalafmt独自** | **🔴 6日** (行幅計算・動的改行判定) |
| `newlines.alwaysBeforeElseAfterCurlyIf` | false | if-else改行制御 | **❌ scalafmt独自** | **🟡 2日** (if-else構文対応済み・ルール追加) |
| `newlines.beforeCurlyLambdaParams` | multilineWithCaseOnly | ラムダパラメータ前改行 | **❌ scalafmt独自** | **🟡 3日** (ラムダ構文対応済み・改行制御) |
| `newlines.afterCurlyLambdaParams` | squash | ラムダパラメータ後改行 | **❌ scalafmt独自** | **🟡 2日** (ラムダ構文対応済み・改行制御) |

### 🟣 SPACES - スペース制御 (部分的に共通化可能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `spaces.beforeContextBoundColon` | true | コンテキスト境界コロン前スペース | **❌ scalafmt独自** | **🟡 2日** (ジェネリクス境界対応済み・ルール追加) |
| `spaces.inImportCurlyBraces` | false | インポート波括弧内スペース | **🟡 独自オプション必要** | **🟡 1日** (インポート構文対応済み・スペース制御) |
| `spaces.inInterpolatedStringCurlyBraces` | false | 文字列補間波括弧内スペース | **🟡 独自オプション必要** | **🟡 1日** (文字列補間対応済み・スペース制御) |
| `spaces.inParentheses` | false | 括弧内スペース | **🟡 独自オプション必要** | **🟢 1日** (括弧処理基盤あり・スペース制御追加) |
| `spaces.inSquareBrackets` | false | 角括弧内スペース | **🟡 独自オプション必要** | **🟢 1日** (型パラメータ対応済み・スペース制御) |
| `spaces.aroundInfixTypes` | false | 中置型周辺スペース | **❌ scalafmt独自** | **🟡 2日** (中置演算子対応済み・型判定追加) |

### 🟠 DANGLING PARENTHESES - 括弧配置 (scalafmt独自機能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `danglingParentheses.defnSite` | true | 定義サイト括弧改行強制 | **❌ scalafmt独自** | **🟡 3日** (メソッド定義対応済み・括弧配置制御) |
| `danglingParentheses.callSite` | true | 呼び出しサイト括弧改行強制 | **❌ scalafmt独自** | **🟡 3日** (メソッド呼び出し対応済み・括弧配置制御) |
| `danglingParentheses.ctrlSite` | true | 制御構文括弧改行強制 | **❌ scalafmt独自** | **🟡 2日** (制御構文対応済み・括弧配置制御) |
| `danglingParentheses.tupleSite` | false | タプル括弧改行強制 | **❌ scalafmt独自** | **🟡 2日** (タプル型対応済み・括弧配置制御) |
| `danglingParentheses.exclude` | [] | 除外対象指定 | **❌ scalafmt独自** | **🟡 1日** (設定解析・除外ロジック) |

### 🔧 REWRITE RULES - 書き換えルール (scalafmt独自機能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `rewrite.rules` | [] | 適用する書き換えルール | **❌ scalafmt独自** | **🔴 5日** (書き換えルール基盤設計) |
| `rewrite.redundantBraces.methodBodies` | true | 冗長な波括弧削除 | **❌ scalafmt独自** | **🔴 7日** (AST解析・冗長性判定ロジック) |
| `rewrite.redundantBraces.includeUnitMethods` | true | Unit型メソッド波括弧削除 | **❌ scalafmt独自** | **🔴 5日** (型解析・Unit判定) |
| `rewrite.redundantParens.infixSide` | some | 冗長な括弧削除 | **❌ scalafmt独自** | **🔴 8日** (演算子優先順位・括弧必要性判定) |
| `rewrite.sortModifiers.order` | [] | 修飾子ソート順序 | **❌ scalafmt独自** | **🟡 3日** (修飾子パーサー対応済み・ソート実装) |
| `rewrite.preferCurlyFors.removeTrailingSemicolonsOnly` | false | for内包表記波括弧優先 | **❌ scalafmt独自** | **🟡 4日** (for内包表記対応済み・書き換え実装) |

### 🎨 DOCSTRINGS & COMMENTS - ドキュメント・コメント (scalafmt独自機能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `docstrings.style` | Asterisk | ドキュメント文字列スタイル | **❌ scalafmt独自** | **🟡 3日** (コメント保持基盤あり・ドキュメント判定) |
| `docstrings.oneline` | fold | 一行ドキュメント制御 | **❌ scalafmt独自** | **🟡 2日** (一行判定・折り畳み制御) |
| `docstrings.wrap` | yes | ドキュメント折り返し | **❌ scalafmt独自** | **🟡 3日** (行幅計算・折り返し制御) |
| `comments.wrap` | no | コメント折り返し | **❌ scalafmt独自** | **🟡 2日** (コメント保持機能活用・折り返し制御) |
| `comments.wrapStandaloneSlcAsSlc` | false | 単独行コメント処理 | **❌ scalafmt独自** | **🟡 1日** (コメント種別判定済み・処理分岐) |

### 📦 IMPORTS - インポート制御 (scalafmt独自機能)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `importSelectors` | noBinPack | インポートセレクタ配置 | **❌ scalafmt独自** | **🟡 4日** (インポート構文対応済み・配置制御実装) |
| `binPack.literalArgumentLists` | true | リテラル引数リスト圧縮 | **❌ scalafmt独自** | **🟡 3日** (引数リスト対応済み・圧縮判定) |
| `binPack.literalsIncludeSimpleExpr` | false | 単純式を含むリテラル | **❌ scalafmt独自** | **🟡 2日** (式判定基盤あり・単純式判定) |

### 🏃 RUNNER & DIALECT - 実行・方言設定 (必須設定)

| scalafmt オプション | デフォルト | 説明 | Prettier標準対応 | 実装工数 |
|---|---|---|---|---|
| `version` | - | scalafmtバージョン (必須) | **❌ scalafmt独自** | **🟢 0.5日** (設定読み込み・バージョン確認のみ) |
| `runner.dialect` | - | Scala方言指定 (必須) | **❌ scalafmt独自** | **🟡 3日** (パーサー方言切り替え・機能制御) |
| `runner.dialectOverride` | {} | 方言オーバーライド | **❌ scalafmt独自** | **🟡 2日** (方言設定上書きロジック) |

## 📊 Prettier標準オプション対応分析

### ✅ 直接対応可能 (4項目)
- `maxColumn` → `printWidth`
- `indent.main` → `tabWidth` 
- セミコロン関連 → `semi`
- 引用符関連 → `singleQuote`

### 🟡 部分対応・拡張必要 (8項目)  
- `indent.callSite`, `indent.defnSite` → `tabWidth`ベース独自実装
- `spaces.*` → 独自スペースオプション群
- コメント・ドキュメント → Prettier標準+独自拡張

### ❌ scalafmt独自機能 (50+項目)
- アライメント制御 (`align.*`)
- 改行戦略 (`newlines.*`) 
- 書き換えルール (`rewrite.*`)
- 括弧配置 (`danglingParentheses.*`)
- Scala固有の構文制御

## 🎯 実装優先度提案

### Phase 1: Prettier標準対応強化
1. **`printWidth`** ← `maxColumn` (完全互換)
2. **`tabWidth`** ← `indent.main` (完全互換)  
3. **`semi`** ← セミコロン制御 (新規実装)
4. **`singleQuote`** ← 引用符制御 (新規実装)

### Phase 2: Scala固有必須オプション
5. **`scalaIndentDefnSite`** ← `indent.defnSite`
6. **`scalaIndentCallSite`** ← `indent.callSite`
7. **`scalaSpacesInImportBraces`** ← `spaces.inImportCurlyBraces`
8. **`scalaDialect`** ← `runner.dialect`

### Phase 3: 高度なscalafmt互換
9. **アライメント制御** (`align.*`) 
10. **改行戦略** (`newlines.*`)
11. **書き換えルール** (`rewrite.*`)

## 📈 工数見積もりサマリー

### 🟢 短期実装可能 (1-2日以内: 9項目)
**合計工数: 9.5日**
- 基本設定 (`maxColumn`, `indent.main`) - 1日
- スペース制御基本オプション - 4日  
- 必須設定 (`version`) - 0.5日
- 簡単な括弧・コメント制御 - 4日

### 🟡 中期実装対象 (2-5日: 27項目)  
**合計工数: 76日**
- インデント詳細制御 - 17日
- 改行制御基本機能 - 17日
- 括弧配置制御 - 11日
- ドキュメント・コメント制御 - 11日
- インポート・引数制御 - 9日
- 書き換えルール基本機能 - 7日
- 方言設定 - 5日

### 🔴 長期実装対象 (5日超: 12項目)
**合計工数: 81日**  
- アライメント制御機能 - 38日
- 複雑な改行戦略 - 14日
- 高度な書き換えルール - 20日
- 複雑なインデント制御 - 12日

### 📊 段階別工数見積もり

| 実装段階 | 対象項目数 | 合計工数 | 主要機能 |
|---|---|---|---|
| **Phase 1: 基本互換** | 9項目 | **9.5日** | Prettier標準対応・基本設定 |
| **Phase 2: 実用互換** | 27項目 | **76日** | Scala固有基本機能・日常的使用 |
| **Phase 3: 完全互換** | 12項目 | **81日** | 高度な整列・書き換え機能 |
| **合計** | **48項目** | **166.5日** | **scalafmt完全互換性** |

### 🎯 現実的な実装戦略

**Phase 1 (2週間)**: 基本互換性達成
- ROI: 高 (基本ニーズ満足・Prettier標準活用)
- 工数: 9.5日 (実現可能)

**Phase 2 (3-4ヶ月)**: 実用互換性達成  
- ROI: 中 (90%のユースケース対応)
- 工数: 76日 (大規模だが段階的実装可能)

**Phase 3 (5-6ヶ月)**: 完全互換性達成
- ROI: 低 (ニッチな高度機能)
- 工数: 81日 (専門的・複雑な実装)

## 💡 結論

- **12%** がPrettier標準と直接/部分対応可能
- **88%** がscalafmt独自機能
- **Phase 1+2で実用的互換性達成** (約85日・4ヶ月)
- **完全互換**には約6ヶ月の集中開発が必要
- **現在の実装基盤**により工数を大幅短縮可能