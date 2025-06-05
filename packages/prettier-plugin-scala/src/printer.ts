import { CstNodeVisitor } from "./visitor.js";
import { type Doc, type Printer, type AstPath } from "prettier";

export function createScalaPrinter(): Printer {
  return {
    print(path: AstPath, _options: any, print: any): Doc {
      const node = path.getValue();
      console.log(
        "Printer called with node:",
        node.name || node.image || "unknown",
      );

      const visitor = new CstNodeVisitor();
      const result = visitor.visit(node, { path, options: _options, print });

      console.log("Visitor result:", JSON.stringify(result));

      // 文字列結果をPrettierのDocに変換
      return result;
    },
    printComment(path: AstPath, _options: any): Doc {
      const comment = path.getValue();
      if (!comment) return "";

      // Prettier標準のvalueプロパティを使用
      if (typeof comment.value === "string") {
        return comment.value;
      }

      // fallback: Chevrotainのimageプロパティ
      if (typeof comment.image === "string") {
        return comment.image;
      }

      // デバッグ: コメント構造を確認
      console.log("Unexpected comment structure in printComment:", comment);
      return "";
    },
    canAttachComment(_node: any): boolean {
      // コメント機能を一時的に無効化
      return false;
    },
    willPrintOwnComments(): boolean {
      return false; // Prettier標準のコメント処理を使用しない
    },
    insertPragma(text: string): string {
      return text;
    },
    hasPrettierIgnore(): boolean {
      return false;
    },
    isBlockComment(comment: any): boolean {
      return comment.tokenType?.name === "BlockComment";
    },
  };
}
