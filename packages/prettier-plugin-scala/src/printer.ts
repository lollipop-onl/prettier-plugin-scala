import { CstNodeVisitor } from "./visitor.js";
import { type Doc, type Printer, type AstPath } from "prettier";

export function createScalaPrinter(): Printer {
  return {
    print(path: AstPath, _options: any, print: any): Doc {
      const node = path.getValue();
      const visitor = new CstNodeVisitor();
      return visitor.visit(node, { path, options: _options, print });
    },
    printComment(path: AstPath, _options: any): Doc {
      const comment = path.getValue();
      if (comment.tokenType.name === "LineComment") {
        return comment.image;
      } else if (comment.tokenType.name === "BlockComment") {
        return comment.image;
      }
      return "";
    },
    canAttachComment(_node: any): boolean {
      // For now, we can attach comments to any node
      return true;
    },
    hasPrettierIgnore(): boolean {
      return false;
    },
    isBlockComment(comment: any): boolean {
      return comment.tokenType?.name === "BlockComment";
    },
  };
}
