/**
 * Declaration visitor methods for class, object, trait, method, and other definitions
 */
import {
  formatStatement,
  getPrintWidth,
  getTabWidth,
  getChildren,
  getChildNodes,
  getFirstChild,
} from "./utils.js";
import type { PrintContext, CSTNode } from "./utils.js";

export interface DeclarationVisitor {
  visit(node: CSTNode, ctx: PrintContext): string;
  visitModifiers(modifiers: CSTNode[], ctx: PrintContext): string;
  getIndentation(ctx: PrintContext): string;
}

export class DeclarationVisitorMethods {
  private visitor: DeclarationVisitor;

  constructor(visitor: DeclarationVisitor) {
    this.visitor = visitor;
  }

  visitClassDefinition(node: CSTNode, ctx: PrintContext): string {
    let result = "";

    // Add class keyword (don't duplicate if already handled by modifiers)
    const classToken = getFirstChild(node, "Class");
    if (classToken) {
      result += classToken.image + " ";
    }

    // Add class name
    const identifierToken = getFirstChild(node, "Identifier");
    if (identifierToken) {
      result += identifierToken.image;
    }

    const typeParameters = getFirstChild(node, "typeParameters");
    if (typeParameters) {
      result += this.visitor.visit(typeParameters, ctx);
    }

    // Add constructor annotations
    const annotations = getChildNodes(node, "annotation");
    if (annotations.length > 0) {
      result +=
        " " +
        annotations
          .map((ann: CSTNode) => this.visitor.visit(ann, ctx))
          .join(" ");
    }

    const classParameters = getFirstChild(node, "classParameters");
    if (classParameters) {
      result += this.visitor.visit(classParameters, ctx);
    }

    const extendsClause = getFirstChild(node, "extendsClause");
    if (extendsClause) {
      result += " " + this.visitor.visit(extendsClause, ctx);
    }

    const classBody = getFirstChild(node, "classBody");
    if (classBody) {
      result += " " + this.visitor.visit(classBody, ctx);
    }

    return result;
  }

  visitObjectDefinition(node: CSTNode, ctx: PrintContext): string {
    const identifierToken = getFirstChild(node, "Identifier");
    let result = "object " + (identifierToken?.image || "");

    if (node.children.extendsClause) {
      result += " " + this.visitor.visit(node.children.extendsClause[0], ctx);
    }

    if (node.children.classBody) {
      result += " " + this.visitor.visit(node.children.classBody[0], ctx);
    }

    return result;
  }

  visitTraitDefinition(node: any, ctx: PrintContext): string {
    let result = "trait " + node.children.Identifier[0].image;

    if (node.children.typeParameters) {
      result += this.visitor.visit(node.children.typeParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visitor.visit(node.children.extendsClause[0], ctx);
    }

    if (node.children.classBody) {
      result += " " + this.visitor.visit(node.children.classBody[0], ctx);
    }

    return result;
  }

  visitEnumDefinition(node: any, ctx: PrintContext): string {
    let result = "enum " + node.children.Identifier[0].image;

    if (node.children.typeParameters) {
      result += this.visitor.visit(node.children.typeParameters[0], ctx);
    }

    if (node.children.classParameters) {
      result += this.visitor.visit(node.children.classParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visitor.visit(node.children.extendsClause[0], ctx);
    }

    result += " {\n";

    if (node.children.enumCase) {
      const indent = this.visitor.getIndentation(ctx);
      const cases = node.children.enumCase.map(
        (c: any) => indent + this.visitor.visit(c, ctx),
      );
      result += cases.join("\n");
    }

    result += "\n}";

    return result;
  }

  visitEnumCase(node: any, ctx: PrintContext): string {
    let result = "case " + node.children.Identifier[0].image;

    if (node.children.classParameters) {
      result += this.visitor.visit(node.children.classParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visitor.visit(node.children.extendsClause[0], ctx);
    }

    return result;
  }

  visitExtensionDefinition(node: any, ctx: PrintContext): string {
    let result = "extension";

    if (node.children.typeParameters) {
      result += this.visitor.visit(node.children.typeParameters[0], ctx);
    }

    result += " (" + node.children.Identifier[0].image + ": ";
    result += this.visitor.visit(node.children.type[0], ctx) + ") {\n";

    if (node.children.extensionMember) {
      const members = node.children.extensionMember.map(
        (m: any) => "  " + this.visitor.visit(m, ctx),
      );
      result += members.join("\n");
    }

    result += "\n}";

    return result;
  }

  visitExtensionMember(node: any, ctx: PrintContext): string {
    const modifiers = this.visitor.visitModifiers(
      node.children.modifier || [],
      ctx,
    );
    const definition = this.visitor.visit(node.children.defDefinition[0], ctx);

    return modifiers ? modifiers + " " + definition : definition;
  }

  visitValDefinition(node: any, ctx: PrintContext): string {
    let result = "val " + this.visitor.visit(node.children.pattern[0], ctx);

    if (node.children.Colon) {
      result += ": " + this.visitor.visit(node.children.type[0], ctx);
    }

    result += " = " + this.visitor.visit(node.children.expression[0], ctx);

    return formatStatement(result, ctx);
  }

  visitVarDefinition(node: any, ctx: PrintContext): string {
    let result = "var " + node.children.Identifier[0].image;

    if (node.children.Colon) {
      result += ": " + this.visitor.visit(node.children.type[0], ctx);
    }

    result += " = " + this.visitor.visit(node.children.expression[0], ctx);

    return formatStatement(result, ctx);
  }

  visitDefDefinition(node: any, ctx: PrintContext): string {
    let result = "def ";
    if (node.children.Identifier) {
      result += node.children.Identifier[0].image;
    } else if (node.children.This) {
      result += "this";
    }

    if (node.children.typeParameters) {
      result += this.visitor.visit(node.children.typeParameters[0], ctx);
    }

    if (node.children.parameterLists) {
      result += this.visitor.visit(node.children.parameterLists[0], ctx);
    }

    if (node.children.Colon) {
      result += ": " + this.visitor.visit(node.children.type[0], ctx);
    }

    if (node.children.Equals) {
      result += " = " + this.visitor.visit(node.children.expression[0], ctx);
      return formatStatement(result, ctx);
    }

    return result;
  }

  visitGivenDefinition(node: any, ctx: PrintContext): string {
    let result = "given";

    if (node.children.Identifier) {
      // Named given with potential parameters: given name[T](using ord: Type): Type
      result += " " + node.children.Identifier[0].image;

      if (node.children.typeParameters) {
        result += this.visitor.visit(node.children.typeParameters[0], ctx);
      }

      if (node.children.parameterLists) {
        result += this.visitor.visit(node.children.parameterLists[0], ctx);
      }

      result += ": " + this.visitor.visit(node.children.type[0], ctx);
    } else {
      // Anonymous given: given Type = expression
      result += " " + this.visitor.visit(node.children.type[0], ctx);
    }

    if (node.children.Equals) {
      result += " = " + this.visitor.visit(node.children.expression[0], ctx);
    }

    return result;
  }

  visitTypeDefinition(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle opaque types
    if (node.children.Opaque) {
      result += "opaque ";
    }

    result += "type " + node.children.Identifier[0].image;

    if (node.children.typeParameters) {
      result += this.visitor.visit(node.children.typeParameters[0], ctx);
    }

    result += " = " + this.visitor.visit(node.children.type[0], ctx);

    return result;
  }

  visitAuxiliaryConstructor(node: any, ctx: PrintContext): string {
    let result = "def this";

    if (node.children.parameterList) {
      const params = node.children.parameterList.map((list: any) =>
        this.visitor.visit(list, ctx),
      );
      result += params.join("");
    }

    result += " = " + this.visitor.visit(node.children.expression[0], ctx);

    return result;
  }

  visitClassParameters(node: any, ctx: PrintContext): string {
    const params = node.children.classParameter || [];
    if (params.length === 0) {
      return "()";
    }

    const paramStrings = params.map((p: any) => this.visitor.visit(p, ctx));
    const printWidth = getPrintWidth(ctx);

    // Check if single line is appropriate
    const singleLine = `(${paramStrings.join(", ")})`;
    // Use single line if it fits within printWidth and is reasonably short
    if (
      params.length === 1 &&
      singleLine.length <= Math.min(printWidth * 0.6, 40)
    ) {
      return singleLine;
    }

    // Use multi-line format for multiple parameters or long single parameter
    const indent = this.visitor.getIndentation(ctx);

    // Format each parameter on its own line without trailing comma for class parameters
    const indentedParams = paramStrings.map((param: string) => indent + param);
    return `(\n${indentedParams.join(",\n")}\n)`;
  }

  visitClassParameter(node: any, ctx: PrintContext): string {
    let result = "";

    if (node.children.modifier) {
      const modifiers = this.visitor.visitModifiers(
        node.children.modifier,
        ctx,
      );
      result += modifiers + " ";
    }

    if (node.children.Val) {
      result += "val ";
    } else if (node.children.Var) {
      result += "var ";
    }

    result += node.children.Identifier[0].image;
    result += ": ";
    result += this.visitor.visit(node.children.type[0], ctx);

    if (node.children.Equals) {
      result += " = " + this.visitor.visit(node.children.expression[0], ctx);
    }

    return result;
  }

  visitParameterLists(node: any, ctx: PrintContext): string {
    return node.children.parameterList
      .map((list: any) => this.visitor.visit(list, ctx))
      .join("");
  }

  visitParameterList(node: any, ctx: PrintContext): string {
    const params = node.children.parameter || [];
    if (params.length === 0) {
      return "()";
    }

    const paramStrings = params.map((p: any) => this.visitor.visit(p, ctx));
    return "(" + paramStrings.join(", ") + ")";
  }

  visitParameter(node: any, ctx: PrintContext): string {
    let result = "";

    if (node.children.Using) {
      result += "using ";
    } else if (node.children.Implicit) {
      result += "implicit ";
    }

    result += node.children.Identifier[0].image;
    result += ": ";
    result += this.visitor.visit(node.children.type[0], ctx);

    if (node.children.Equals) {
      result += " = " + this.visitor.visit(node.children.expression[0], ctx);
    }

    return result;
  }

  visitTypeParameters(node: any, ctx: PrintContext): string {
    const params = node.children.typeParameter || [];
    if (params.length === 0) {
      return "";
    }

    const paramStrings = params.map((p: any) => this.visitor.visit(p, ctx));
    return "[" + paramStrings.join(", ") + "]";
  }

  visitTypeParameter(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle variance annotations
    if (node.children.Plus) {
      result += "+";
    } else if (node.children.Minus) {
      result += "-";
    }

    result += node.children.Identifier[0].image;

    // Add bounds
    if (node.children.SubtypeOf) {
      result += " <: " + this.visitor.visit(node.children.type[0], ctx);
    }
    if (node.children.SupertypeOf) {
      result += " >: " + this.visitor.visit(node.children.type[0], ctx);
    }

    return result;
  }

  visitExtendsClause(node: any, ctx: PrintContext): string {
    let result = "extends " + this.visitor.visit(node.children.type[0], ctx);

    if (node.children.With) {
      const withTypes = node.children.type
        .slice(1)
        .map((t: any) => this.visitor.visit(t, ctx));
      result += " with " + withTypes.join(" with ");
    }

    return result;
  }

  visitClassBody(node: any, ctx: PrintContext): string {
    if (!node.children.classMember) {
      return "{}";
    }

    const members = node.children.classMember.map((m: any) =>
      this.visitor.visit(m, ctx),
    );

    return "{\n" + members.map((m: string) => "  " + m).join("\n") + "\n}";
  }

  visitClassMember(node: any, ctx: PrintContext): string {
    if (node.children.definition) {
      return this.visitor.visit(node.children.definition[0], ctx);
    }

    return "";
  }
}
