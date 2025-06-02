import { type Doc } from "prettier";

const { hardline, line, softline, group, indent, join } = (
  await import("prettier")
).doc.builders;

// concat is not in doc.builders, define it separately
function concat(docs: Doc[]): Doc {
  // Filter out empty strings and return as array for Prettier
  const filtered = docs.filter((d) => d !== "");
  if (filtered.length === 0) return "";
  if (filtered.length === 1) return filtered[0];
  return filtered;
}

type PrintContext = {
  path: any;
  options: any;
  print: any;
};

export class CstNodeVisitor {
  visit(node: any, ctx: PrintContext): Doc {
    if (!node) return "";

    // Handle token nodes
    if (node.image !== undefined) {
      return node.image;
    }

    // Handle CST nodes by rule name
    if (node.name) {
      const methodName = `visit${node.name}`;
      if (typeof (this as any)[methodName] === "function") {
        return (this as any)[methodName](node, ctx);
      }
    }

    // Default handling - visit children
    return this.visitChildren(node, ctx);
  }

  visitChildren(node: any, ctx: PrintContext): Doc {
    const docs: Doc[] = [];

    for (const key in node.children) {
      const children = node.children[key];
      if (Array.isArray(children)) {
        for (const child of children) {
          const doc = this.visit(child, ctx);
          if (doc) docs.push(doc);
        }
      }
    }

    return concat(docs);
  }

  visitCompilationUnit(node: any, ctx: PrintContext): Doc {
    const docs: Doc[] = [];

    if (node.children.packageClause) {
      docs.push(this.visit(node.children.packageClause[0], ctx));
      docs.push(hardline);
      docs.push(hardline);
    }

    if (node.children.importClause) {
      for (const importNode of node.children.importClause) {
        docs.push(this.visit(importNode, ctx));
        docs.push(hardline);
      }
      if (node.children.importClause.length > 0) {
        docs.push(hardline);
      }
    }

    if (node.children.topLevelDefinition) {
      const defs = node.children.topLevelDefinition.map((def: any) =>
        this.visit(def, ctx),
      );
      docs.push(join(concat([hardline, hardline]), defs));
    }

    return concat([...docs, hardline]);
  }

  visitPackageClause(node: any, ctx: PrintContext): Doc {
    return concat([
      "package ",
      this.visit(node.children.qualifiedIdentifier[0], ctx),
    ]);
  }

  visitImportClause(node: any, ctx: PrintContext): Doc {
    return concat([
      "import ",
      this.visit(node.children.importExpression[0], ctx),
    ]);
  }

  visitImportExpression(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = [
      this.visit(node.children.qualifiedIdentifier[0], ctx),
    ];

    if (node.children.Dot) {
      parts.push(".");
      if (node.children.Underscore) {
        parts.push("_");
      } else if (node.children.LeftBrace) {
        // TODO: Handle import selectors
        parts.push("{...}");
      }
    }

    return concat(parts);
  }

  visitTopLevelDefinition(node: any, ctx: PrintContext): Doc {
    const modifiers = this.visitModifiers(node.children.modifier || [], ctx);
    const definition = this.visitDefinition(node, ctx);

    return modifiers ? concat([modifiers, " ", definition]) : definition;
  }

  visitModifiers(modifiers: any[], ctx: PrintContext): Doc {
    if (!modifiers || modifiers.length === 0) return "";

    return join(
      " ",
      modifiers.map((mod) => this.visit(mod, ctx)),
    );
  }

  visitDefinition(node: any, ctx: PrintContext): Doc {
    if (node.children.classDefinition) {
      return this.visit(node.children.classDefinition[0], ctx);
    } else if (node.children.objectDefinition) {
      return this.visit(node.children.objectDefinition[0], ctx);
    } else if (node.children.traitDefinition) {
      return this.visit(node.children.traitDefinition[0], ctx);
    } else if (node.children.valDefinition) {
      return this.visit(node.children.valDefinition[0], ctx);
    } else if (node.children.varDefinition) {
      return this.visit(node.children.varDefinition[0], ctx);
    } else if (node.children.defDefinition) {
      return this.visit(node.children.defDefinition[0], ctx);
    }

    return "";
  }

  visitClassDefinition(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = ["class ", node.children.Identifier[0].image];

    if (node.children.typeParameters) {
      parts.push(this.visit(node.children.typeParameters[0], ctx));
    }

    if (node.children.classParameters) {
      parts.push(this.visit(node.children.classParameters[0], ctx));
    }

    if (node.children.extendsClause) {
      parts.push(" ", this.visit(node.children.extendsClause[0], ctx));
    }

    if (node.children.classBody) {
      parts.push(" ", this.visit(node.children.classBody[0], ctx));
    }

    return concat(parts);
  }

  visitObjectDefinition(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = ["object ", node.children.Identifier[0].image];

    if (node.children.extendsClause) {
      parts.push(" ", this.visit(node.children.extendsClause[0], ctx));
    }

    if (node.children.classBody) {
      parts.push(" ", this.visit(node.children.classBody[0], ctx));
    }

    return concat(parts);
  }

  visitTraitDefinition(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = ["trait ", node.children.Identifier[0].image];

    if (node.children.typeParameters) {
      parts.push(this.visit(node.children.typeParameters[0], ctx));
    }

    if (node.children.extendsClause) {
      parts.push(" ", this.visit(node.children.extendsClause[0], ctx));
    }

    if (node.children.classBody) {
      parts.push(" ", this.visit(node.children.classBody[0], ctx));
    }

    return concat(parts);
  }

  visitValDefinition(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = ["val ", this.visit(node.children.pattern[0], ctx)];

    if (node.children.Colon) {
      parts.push(": ", this.visit(node.children.type[0], ctx));
    }

    parts.push(" = ", this.visit(node.children.expression[0], ctx));

    return concat(parts);
  }

  visitVarDefinition(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = ["var ", node.children.Identifier[0].image];

    if (node.children.Colon) {
      parts.push(": ", this.visit(node.children.type[0], ctx));
    }

    parts.push(" = ", this.visit(node.children.expression[0], ctx));

    return concat(parts);
  }

  visitDefDefinition(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = ["def ", node.children.Identifier[0].image];

    if (node.children.typeParameters) {
      parts.push(this.visit(node.children.typeParameters[0], ctx));
    }

    if (node.children.parameterLists) {
      parts.push(this.visit(node.children.parameterLists[0], ctx));
    }

    if (node.children.Colon) {
      parts.push(": ", this.visit(node.children.type[0], ctx));
    }

    if (node.children.Equals) {
      parts.push(" = ", this.visit(node.children.expression[0], ctx));
    }

    return concat(parts);
  }

  visitClassParameters(node: any, ctx: PrintContext): Doc {
    const params = node.children.classParameter || [];
    return group(
      concat([
        "(",
        indent(
          concat([
            softline,
            join(
              concat([",", line]),
              params.map((p: any) => this.visit(p, ctx)),
            ),
          ]),
        ),
        softline,
        ")",
      ]),
    );
  }

  visitClassParameter(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = [];

    if (node.children.modifier) {
      parts.push(this.visitModifiers(node.children.modifier, ctx), " ");
    }

    if (node.children.Val) {
      parts.push("val ");
    } else if (node.children.Var) {
      parts.push("var ");
    }

    parts.push(
      node.children.Identifier[0].image,
      ": ",
      this.visit(node.children.type[0], ctx),
    );

    if (node.children.Equals) {
      parts.push(" = ", this.visit(node.children.expression[0], ctx));
    }

    return concat(parts);
  }

  visitParameterLists(node: any, ctx: PrintContext): Doc {
    return concat(
      node.children.parameterList.map((list: any) => this.visit(list, ctx)),
    );
  }

  visitParameterList(node: any, ctx: PrintContext): Doc {
    const params = node.children.parameter || [];
    return group(
      concat([
        "(",
        indent(
          concat([
            softline,
            join(
              concat([",", line]),
              params.map((p: any) => this.visit(p, ctx)),
            ),
          ]),
        ),
        softline,
        ")",
      ]),
    );
  }

  visitParameter(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = [
      node.children.Identifier[0].image,
      ": ",
      this.visit(node.children.type[0], ctx),
    ];

    if (node.children.Equals) {
      parts.push(" = ", this.visit(node.children.expression[0], ctx));
    }

    return concat(parts);
  }

  visitTypeParameters(node: any, ctx: PrintContext): Doc {
    const params = node.children.typeParameter || [];
    return concat([
      "[",
      join(
        ", ",
        params.map((p: any) => this.visit(p, ctx)),
      ),
      "]",
    ]);
  }

  visitTypeParameter(node: any, _ctx: PrintContext): Doc {
    return node.children.Identifier[0].image;
  }

  visitExtendsClause(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = ["extends ", this.visit(node.children.type[0], ctx)];

    if (node.children.With) {
      const withTypes = node.children.type.slice(1);
      for (let i = 0; i < withTypes.length; i++) {
        parts.push(" with ", this.visit(withTypes[i], ctx));
      }
    }

    return concat(parts);
  }

  visitClassBody(node: any, ctx: PrintContext): Doc {
    const members = node.children.classMember || [];

    if (members.length === 0) {
      return "{}";
    }

    return group(
      concat([
        "{",
        indent(
          concat([
            hardline,
            join(
              hardline,
              members.map((m: any) => this.visit(m, ctx)),
            ),
          ]),
        ),
        hardline,
        "}",
      ]),
    );
  }

  visitClassMember(node: any, ctx: PrintContext): Doc {
    const modifiers = this.visitModifiers(node.children.modifier || [], ctx);
    const definition = this.visitDefinition(node, ctx);

    return modifiers ? concat([modifiers, " ", definition]) : definition;
  }

  visitType(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = [this.visit(node.children.simpleType[0], ctx)];

    // Handle array types like Array[String]
    if (node.children.LeftBracket) {
      for (let i = 0; i < node.children.LeftBracket.length; i++) {
        parts.push("[", this.visit(node.children.type[i], ctx), "]");
      }
    }

    return concat(parts);
  }

  visitSimpleType(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = [
      this.visit(node.children.qualifiedIdentifier[0], ctx),
    ];

    // Handle type parameters like List[Int]
    if (node.children.LeftBracket) {
      const types = node.children.type || [];
      parts.push(
        "[",
        join(
          ", ",
          types.map((t: any) => this.visit(t, ctx)),
        ),
        "]",
      );
    }

    return concat(parts);
  }

  visitPattern(node: any, ctx: PrintContext): Doc {
    if (node.children.Identifier) {
      return node.children.Identifier[0].image;
    } else if (node.children.Underscore) {
      return "_";
    } else if (node.children.literal) {
      return this.visit(node.children.literal[0], ctx);
    }

    return "";
  }

  visitExpression(node: any, ctx: PrintContext): Doc {
    const parts: Doc[] = [this.visit(node.children.primaryExpression[0], ctx)];

    if (node.children.infixOperator) {
      for (let i = 0; i < node.children.infixOperator.length; i++) {
        parts.push(
          " ",
          this.visit(node.children.infixOperator[i], ctx),
          " ",
          this.visit(node.children.primaryExpression[i + 1], ctx),
        );
      }
    }

    return concat(parts);
  }

  visitPrimaryExpression(node: any, ctx: PrintContext): Doc {
    if (node.children.literal) {
      return this.visit(node.children.literal[0], ctx);
    } else if (node.children.Identifier) {
      return node.children.Identifier[0].image;
    } else if (node.children.This) {
      return "this";
    } else if (node.children.LeftParen) {
      return concat(["(", this.visit(node.children.expression[0], ctx), ")"]);
    } else if (node.children.blockExpression) {
      return this.visit(node.children.blockExpression[0], ctx);
    }

    return "";
  }

  visitBlockExpression(node: any, ctx: PrintContext): Doc {
    const statements = node.children.blockStatement || [];
    const finalExpr = node.children.expression?.[0];

    const docs: Doc[] = statements.map((s: any) => this.visit(s, ctx));
    if (finalExpr) {
      docs.push(this.visit(finalExpr, ctx));
    }

    if (docs.length === 0) {
      return "{}";
    }

    return group(
      concat([
        "{",
        indent(concat([hardline, join(hardline, docs)])),
        hardline,
        "}",
      ]),
    );
  }

  visitBlockStatement(node: any, ctx: PrintContext): Doc {
    if (node.children.valDefinition) {
      return this.visit(node.children.valDefinition[0], ctx);
    } else if (node.children.varDefinition) {
      return this.visit(node.children.varDefinition[0], ctx);
    } else if (node.children.defDefinition) {
      return this.visit(node.children.defDefinition[0], ctx);
    } else if (node.children.expression) {
      return this.visit(node.children.expression[0], ctx);
    }

    return "";
  }

  visitInfixOperator(node: any, _ctx: PrintContext): Doc {
    const children = node.children as Record<string, any[]>;
    const token = Object.values(children)[0][0];
    return token.image;
  }

  visitLiteral(node: any, _ctx: PrintContext): Doc {
    const children = node.children as Record<string, any[]>;
    const token = Object.values(children)[0][0];
    return token.image;
  }

  visitQualifiedIdentifier(node: any, _ctx: PrintContext): Doc {
    const parts: Doc[] = [node.children.Identifier[0].image];

    if (node.children.Dot) {
      for (let i = 1; i < node.children.Identifier.length; i++) {
        parts.push(".", node.children.Identifier[i].image);
      }
    }

    return concat(parts);
  }
}
