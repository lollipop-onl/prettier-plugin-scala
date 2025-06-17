import { CstNodeVisitor } from "./visitor.js";
import type { ScalaCstNode } from "@simochee/scala-parser";
import type { IToken } from "chevrotain";
import { type Doc, type Printer, type AstPath, type Options } from "prettier";

export function createScalaPrinter(): Printer {
  return {
    print(
      path: AstPath<ScalaCstNode>,
      options: Options,
      print: (path: AstPath) => Doc,
    ): Doc {
      const node = path.getValue();

      const visitor = new CstNodeVisitor();
      const result = visitor.visit(node, {
        path,
        options,
        print,
        indentLevel: 0,
      });

      // 文字列結果をPrettierのDocに変換
      return result;
    },
    printComment(path: AstPath<IToken>): Doc {
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
    canAttachComment(): boolean {
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
    isBlockComment(comment: IToken): boolean {
      return comment.tokenType?.name === "BlockComment";
    },
  };
}
