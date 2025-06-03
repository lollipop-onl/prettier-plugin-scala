# prettier-java 実装参考資料

## 概要

prettier-javaプロジェクトの実装構造から得られた知見を整理した参考資料です。
prettier-plugin-scalaの設計・実装時に参考にした技術的アプローチを記録しています。

**注意**: この資料は開発初期の参考情報であり、現在のプロジェクト状況とは直接関係ありません。

## 1. 基本的なディレクトリ構造

prettier-javaはmonorepo構成を採用しており、Lernaを使用して管理されています。

```
prettier-java/
├── .github/             # GitHub Actions設定
├── .husky/              # Git フック設定
├── benchmark/           # パフォーマンスベンチマーク
├── docs/                # ドキュメント
├── logo/                # ロゴアセット
├── packages/            # メインパッケージ
│   ├── java-parser/     # Chevrotainベースのパーサー
│   └── prettier-plugin-java/  # Prettierプラグイン本体
├── scripts/             # ビルド・ユーティリティスクリプト
├── website/             # プロジェクトウェブサイト
├── lerna.json           # Lerna設定
└── package.json         # ルートパッケージ設定
```

### パッケージ構成

- **java-parser**: Chevrotainを使用したJavaパーサー実装
- **prettier-plugin-java**: Prettierプラグインのメイン実装

## 2. パッケージ構成（package.json）

### prettier-plugin-java/package.json

```json
{
  "name": "prettier-plugin-java",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./index.d.ts",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "dependencies": {
    "java-parser": "2.3.3",
    "lodash": "4.17.21"
  },
  "peerDependencies": {
    "prettier": "^3.0.0"
  },
  "devDependencies": {
    "@types/lodash": "^4.17.10",
    "@types/node": "^22.10.2",
    "ts-node": "10.9.2",
    "typescript": "5.7.2"
  }
}
```

### 主要なポイント

- ESModuleとして実装（`"type": "module"`）
- TypeScriptで開発され、JavaScriptにコンパイル
- java-parserへの依存（同じリポジトリ内のパッケージ）
- Prettier 3.x系に対応

## 3. エントリーポイントの構成

### src/index.js の構造

```javascript
export const languages = [
  {
    name: "Java",
    parsers: ["java"],
    extensions: [".java"],
    // その他の言語設定
  }
];

export const parsers = {
  java: {
    parse,              // パース関数
    astFormat: "java",  // AST形式の識別子
    locStart,           // ノードの開始位置
    locEnd,             // ノードの終了位置
    hasPragma           // プラグマ検出
  }
};

export const printers = {
  java: {
    print,              // プリント関数
    printComment,       // コメント処理
    canAttachComment,   // コメント付加判定
    massageAstNode: clean  // ASTノードのクリーンアップ
  }
};

export { options } from "./options.js";
```

### 必須エクスポート

Prettierプラグインとして必要な4つのエクスポート：
1. `languages`: サポートする言語の定義
2. `parsers`: パーサーの設定
3. `printers`: プリンターの設定
4. `options`: フォーマットオプション

## 4. パーサーとプリンターの実装方法

### パーサー実装

- **java-parser**パッケージで実装
- Chevrotainを使用してCST（Concrete Syntax Tree）を生成
- ASTではなくCSTを使用する理由：より詳細な構文情報を保持

### プリンター実装

- Visitor パターンを使用してCSTを走査
- 各ノードタイプに対してフォーマット処理を適用
- Prettier APIを活用（`doc.builders`など）

### 主要コンポーネント

1. **parse関数**: ソースコードをCSTに変換
2. **print関数**: CSTをフォーマット済みコードに変換
3. **Visitor**: CSTを走査するための基底クラス

## 5. テストの構成

### テストディレクトリ構造

```
test/
├── repository-test/    # 実際のJavaリポジトリを使用したE2Eテスト
├── unit-test/          # ユニットテスト
└── test-utils.ts       # テストユーティリティ
```

### テストの種類

1. **ユニットテスト**: 個別の構文要素のテスト
2. **E2Eテスト**: 実際のJavaプロジェクトでのテスト
3. **スナップショットテスト**: フォーマット結果の確認

### テストスクリプト

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:e2e:core",
    "test:unit": "node --test test/unit-test/**/*.spec.mjs",
    "test:e2e-core": "node scripts/clone-samples && npm run test:e2e:core",
    "test:e2e-jhipster1": "node --test test/repository-test/jhipster-1.spec.mjs"
  }
}
```

## 6. 重要な実装詳細

### オプション定義

```javascript
export const options = {
  entrypoint: {
    type: "choice",
    category: "Global",
    default: "compilationUnit",
    choices: [
      "compilationUnit",
      "classBodyDeclaration",
      "statement",
      // 多数の選択肢
    ],
    description: "Prettify from the entrypoint"
  },
  trailingComma: {
    type: "choice",
    category: "Java",
    default: "all",
    choices: ["all", "es5", "none"],
    description: "Print trailing commas wherever possible"
  }
};
```

### 特徴的な機能

1. **エントリーポイントオプション**: コードスニペットのフォーマットが可能
2. **完全なJavaScript実装**: 追加のランタイム依存なし
3. **インポートソート**: Google Java Style Guideに準拠

## 7. prettier-plugin-scalaへの適用

### 採用すべきアーキテクチャ

1. **monorepo構成**: scala-parserとprettier-plugin-scalaの分離
2. **ESModule**: モダンなJavaScript環境での実装
3. **TypeScript**: 型安全性とメンテナビリティ
4. **Chevrotain**: パーサー実装の基盤

### 実装ステップ

1. **パーサーパッケージ**: ChevrotainでScala文法を実装
2. **プラグインパッケージ**: Prettier APIとの統合
3. **Visitor実装**: CST走査とフォーマット処理
4. **テスト環境**: ユニットテストとE2Eテストの構築

### 考慮事項

- scalafmtとの互換性を意識したオプション設計
- Scalaの複雑な文法（implicit、マクロなど）への対応
- パフォーマンスの最適化（大規模なScalaプロジェクトでの使用）

## まとめ

prettier-javaは、Chevrotainを使用した完全なJavaScript実装のPrettierプラグインです。この設計は、prettier-plugin-scalaの実装においても有効なアプローチとなります。特に、monorepo構成とパーサー/プラグインの分離は、メンテナビリティと拡張性の観点から重要です。