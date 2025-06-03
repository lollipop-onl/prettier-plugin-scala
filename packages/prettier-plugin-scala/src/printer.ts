import { CstNodeVisitor } from "./visitor.js";
import { type Doc, type Printer, type AstPath } from "prettier";

// Remove unused destructuring

export function createScalaPrinter(): Printer {
  return {
    print(path: AstPath, _options: any, print: any): Doc {
      const node = path.getValue();
      const visitor = new CstNodeVisitor();
      return visitor.visit(node, { path, options: _options, print });
    },
    printComment(path: AstPath, _options: any): Doc {
      const comment = path.getValue();
      if (!comment) return "";

      // Handle different comment structures
      if (typeof comment.value === "string") {
        return comment.value;
      }
      if (typeof comment.image === "string") {
        return comment.image;
      }
      if (
        comment.tokenType?.name === "LineComment" ||
        comment.tokenType?.name === "BlockComment"
      ) {
        return comment.image || "";
      }

      return "";
    },
    canAttachComment(_node: any): boolean {
      return false;
    },
    willPrintOwnComments(): boolean {
      return false;
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
