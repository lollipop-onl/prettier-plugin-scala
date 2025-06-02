import { CstNodeVisitor } from "./visitor.js";
import { type Doc, type Printer, type AstPath } from "prettier";

export function createScalaPrinter(): Printer {
  return {
    print(path: AstPath, _options: any, print: any): string {
      const node = path.getValue();
      const visitor = new CstNodeVisitor();
      return visitor.visit(node, { path, options: _options, print });
    },
    printComment(path: AstPath, _options: any): Doc {
      const comment = path.getValue();
      if (comment && typeof comment === "object") {
        if (comment.tokenType && comment.tokenType.name === "LineComment") {
          return comment.image || "";
        } else if (
          comment.tokenType &&
          comment.tokenType.name === "BlockComment"
        ) {
          return comment.image || "";
        }
        // Handle cases where comment is a simple string or has different structure
        if (typeof comment.image === "string") {
          return comment.image;
        }
        if (typeof comment === "string") {
          return comment;
        }
      }
      return "";
    },
    canAttachComment(_node: any): boolean {
      // Disable comment attachment for now to avoid errors
      return false;
    },
    hasPrettierIgnore(): boolean {
      return false;
    },
    isBlockComment(comment: any): boolean {
      return comment.tokenType?.name === "BlockComment";
    },
  };
}
