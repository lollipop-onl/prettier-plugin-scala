# scalafmt互換Prettierプラグイン実現可能性調査レポート

## 概要

本レポートは、[scalafmt](https://scalameta.org/scalafmt/)と互換性のある[Prettier](https://prettier.io/)プラグインの実現可能性について調査した結果をまとめたものです。

### 背景

- **scalafmt**: Scalaコミュニティで広く使用されているコードフォーマッター
- **Prettier**: JavaScript/TypeScriptを中心に多言語対応している統一的なコードフォーマッター
- **目的**: Prettierエコシステムでscalafmtと同等のScalaフォーマッティングを実現

## 調査結果サマリー

**結論: Chevrotainパーサージェネレータを使用した実装により実現可能**

### 主な調査項目

1. ✅ Prettierのプラグインアーキテクチャ
2. ✅ scalafmtの仕様と設定オプション
3. ✅ 既存Prettierプラグインの実装例（prettier-java等）
4. ✅ 技術的な実現可能性の評価

## 技術選定

### パーサー技術の比較

| アプローチ | 評価 | 理由 |
|-----------|------|------|
| scalametaのJS/TS移植 | ❌ | 実装コストが膨大、メンテナンス困難 |
| WebAssembly変換 | ⚠️ | ファイルサイズ大、デバッグ困難 |
| **Chevrotain** | ✅ | **軽量・高速・実績あり（推奨）** |

### Chevrotainを選択した理由

1. **実績**: prettier-javaで成功している実装パターン
2. **パフォーマンス**: ブラウザ環境でも高速動作
3. **開発効率**: JavaScriptネイティブで開発・デバッグが容易
4. **段階的実装**: 必要な機能から順次追加可能

## アーキテクチャ設計

### プロジェクト構造

```
prettier-plugin-scala/
├── docs/                    # ドキュメント
│   └── feasibility-report.md  # 本レポート
├── src/
│   ├── index.js            # Prettierプラグインエントリポイント
│   ├── parser/             # Chevrotainベースのパーサー
│   │   ├── lexer.js        # 字句解析器
│   │   ├── parser.js       # 構文解析器
│   │   ├── tokens.js       # トークン定義
│   │   └── productions/    # 文法規則
│   │       ├── expressions.js
│   │       ├── definitions.js
│   │       └── patterns.js
│   ├── printer/            # AST→フォーマット済みコード変換
│   │   ├── index.js        # メインプリンター
│   │   ├── expressions.js  # 式の整形ロジック
│   │   ├── definitions.js  # 定義の整形ロジック
│   │   ├── patterns.js     # パターンマッチの整形
│   │   └── utils.js        # 共通ユーティリティ
│   └── options.js          # scalafmt互換設定オプション
├── tests/                  # テストスイート
└── package.json
```

### 主要コンポーネント

#### 1. パーサー（Chevrotain）

```javascript
// トークン定義の例
const createToken = chevrotain.createToken;

// キーワード
const Class = createToken({ name: "Class", pattern: /class/ });
const Object = createToken({ name: "Object", pattern: /object/ });
const Def = createToken({ name: "Def", pattern: /def/ });
const Val = createToken({ name: "Val", pattern: /val/ });
const Var = createToken({ name: "Var", pattern: /var/ });

// 構文解析の例
class ScalaParser extends CstParser {
  constructor() {
    super(allTokens);
    
    this.classDefinition = this.RULE("classDefinition", () => {
      this.CONSUME(Class);
      this.CONSUME(Identifier);
      // ... パラメータ、継承、本体
    });
  }
}
```

#### 2. プリンター

```javascript
// Prettier Doc APIを使用した整形
const { join, line, group, indent } = prettier.doc.builders;

function printClassDef(path, options, print) {
  const node = path.getValue();
  return group([
    "class ",
    node.name,
    printTypeParams(path, options, print),
    printClassParams(path, options, print),
    " {",
    indent([line, printClassBody(path, options, print)]),
    line,
    "}"
  ]);
}
```

#### 3. scalafmt互換オプション

```javascript
export const options = {
  // 基本設定
  maxColumn: {
    type: "int",
    category: "Scala",
    default: 80,
    description: "scalafmtのmaxColumnに相当"
  },
  
  // インデント設定
  indentMain: {
    type: "int",
    category: "Scala",
    default: 2,
    description: "メインコードのインデント幅"
  },
  
  // アライメント設定
  alignPreset: {
    type: "choice",
    category: "Scala",
    default: "some",
    choices: ["none", "some", "more", "most"],
    description: "scalafmtのalign.presetに相当"
  },
  
  // その他のscalafmt互換オプション...
};
```

## 実装ロードマップ

### Phase 1: MVP版（2-3週間）

**目標**: 基本的なScalaコードのフォーマッティング

- [ ] Chevrotainパーサーの基本実装
  - [ ] 基本的なトークン定義
  - [ ] クラス・オブジェクト定義のパース
  - [ ] メソッド定義のパース
  - [ ] 変数定義（val/var）のパース
- [ ] 基本的なプリンター実装
  - [ ] インデント処理
  - [ ] ブレースとセミコロンの整形
- [ ] Prettierプラグインとしての統合
- [ ] 基本的なテストスイート

### Phase 2: 主要機能実装（3-4週間）

**目標**: 実用的なScalaコードのフォーマッティング

- [ ] 高度な構文サポート
  - [ ] パターンマッチング
  - [ ] for内包表記
  - [ ] implicit/given (Scala 2/3)
  - [ ] 型パラメータと型境界
- [ ] scalafmt設定互換性
  - [ ] .scalafmt.conf読み込み
  - [ ] 主要オプションのマッピング
- [ ] コメント処理の改善
- [ ] エディタ統合のテスト

### Phase 3: 完全版（4-6週間）

**目標**: scalafmtとの高い互換性

- [ ] Scala 3固有構文の完全サポート
  - [ ] extension methods
  - [ ] opaque types
  - [ ] union/intersection types
- [ ] 高度なアライメントルール
- [ ] エッジケースの処理
- [ ] パフォーマンス最適化
- [ ] 包括的なドキュメント

## 技術的な課題と対策

### 1. Scala文法の複雑さ

**課題**: Scalaは文法が複雑で、多様な書き方が可能

**対策**: 
- 段階的な実装アプローチ
- prettier-javaの実装パターンを参考
- 実際のScalaプロジェクトでのテスト

### 2. scalafmtとの互換性

**課題**: 完全な互換性の実現は困難

**対策**:
- 主要な設定オプションに焦点を当てる
- コミュニティからのフィードバックを重視
- 差異についてはドキュメントで明確化

### 3. パフォーマンス

**課題**: 大規模なScalaファイルでの処理速度

**対策**:
- Chevrotainの最適化機能を活用
- 必要に応じてWebWorkerの使用
- インクリメンタルなフォーマッティング

## 成功の指標

1. **機能性**: 一般的なScalaコードを正しくフォーマット
2. **互換性**: scalafmtの主要設定との互換性80%以上
3. **パフォーマンス**: 1000行のファイルを1秒以内に処理
4. **採用率**: 公開後6ヶ月で1000+ npmダウンロード

## 参考資料

### Prettierプラグイン開発

- [Prettier Plugin API Documentation](https://prettier.io/docs/plugins.html)
- [prettier-java実装](https://github.com/jhipster/prettier-java)
- [How to write a plugin for Prettier](https://dev.to/fvictorio/how-to-write-a-plugin-for-prettier-6gi)

### Scala/scalafmt

- [scalafmt Configuration](https://scalameta.org/scalafmt/docs/configuration.html)
- [Scala Language Specification](https://www.scala-lang.org/files/archive/spec/2.13/)
- [scalameta AST](https://scalameta.org/docs/trees/guide.html)

### Chevrotain

- [Chevrotain Documentation](https://chevrotain.io/docs/)
- [Chevrotain Examples](https://github.com/Chevrotain/chevrotain/tree/master/examples)

## まとめ

Chevrotainを使用したscalafmt互換のPrettierプラグインは技術的に実現可能です。prettier-javaの成功事例を参考に、段階的な実装アプローチを取ることで、実用的なプラグインを開発できると考えられます。

初期のMVP版は2-3週間で実装可能であり、その後のフィードバックを基に機能を拡充していくことで、Scalaコミュニティに価値のあるツールを提供できるでしょう。