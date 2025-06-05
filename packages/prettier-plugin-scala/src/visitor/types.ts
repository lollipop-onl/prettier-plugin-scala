/**
 * Type-related visitor methods for handling type expressions, type parameters, and type systems
 */
import type { PrintContext, CSTNode } from "./utils.js";

export interface TypeVisitor {
  visit(node: CSTNode, ctx: PrintContext): string;
}

export class TypeVisitorMethods {
  private visitor: TypeVisitor;

  constructor(visitor: TypeVisitor) {
    this.visitor = visitor;
  }

  visitType(node: any, ctx: PrintContext): string {
    return this.visitor.visit(node.children.matchType[0], ctx);
  }

  visitMatchType(node: any, ctx: PrintContext): string {
    let result = this.visitor.visit(node.children.unionType[0], ctx);

    if (node.children.Match) {
      result += " match {";
      if (node.children.matchTypeCase) {
        for (const caseNode of node.children.matchTypeCase) {
          result += "\n  " + this.visitor.visit(caseNode, ctx);
        }
        result += "\n";
      }
      result += "}";
    }

    return result;
  }

  visitMatchTypeCase(node: any, ctx: PrintContext): string {
    const leftType = this.visitor.visit(node.children.type[0], ctx);
    const rightType = this.visitor.visit(node.children.type[1], ctx);
    return `case ${leftType} => ${rightType}`;
  }

  visitUnionType(node: any, ctx: PrintContext): string {
    const types = node.children.intersectionType || [];
    if (types.length === 1) {
      return this.visitor.visit(types[0], ctx);
    }

    const typeStrings = types.map((t: any) => this.visitor.visit(t, ctx));
    return typeStrings.join(" | ");
  }

  visitIntersectionType(node: any, ctx: PrintContext): string {
    const types = node.children.baseType || [];
    if (types.length === 1) {
      return this.visitor.visit(types[0], ctx);
    }

    const typeStrings = types.map((t: any) => this.visitor.visit(t, ctx));
    return typeStrings.join(" & ");
  }

  visitContextFunctionType(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle parenthesized types
    if (node.children.LeftParen) {
      result +=
        "(" +
        this.visitor.visit(node.children.tupleTypeOrParenthesized[0], ctx) +
        ")";
    } else {
      // Handle simple types
      result += this.visitor.visit(node.children.simpleType[0], ctx);
    }

    result += " ?=> " + this.visitor.visit(node.children.type[0], ctx);
    return result;
  }

  visitBaseType(node: any, ctx: PrintContext): string {
    // Handle type lambda: [X] =>> F[X]
    if (node.children.typeLambda) {
      return this.visitor.visit(node.children.typeLambda[0], ctx);
    }

    // Handle polymorphic function type: [T] => T => T
    if (node.children.polymorphicFunctionType) {
      return this.visitor.visit(node.children.polymorphicFunctionType[0], ctx);
    }

    // Handle context function type: String ?=> Int
    if (node.children.contextFunctionType) {
      return this.visitor.visit(node.children.contextFunctionType[0], ctx);
    }

    // Handle dependent function type: (x: Int) => Vector[x.type]
    if (node.children.dependentFunctionType) {
      return this.visitor.visit(node.children.dependentFunctionType[0], ctx);
    }

    // Handle parenthesized types or tuple types: (String | Int) or (A, B)
    if (node.children.LeftParen && node.children.tupleTypeOrParenthesized) {
      return (
        "(" +
        this.visitor.visit(node.children.tupleTypeOrParenthesized[0], ctx) +
        ")"
      );
    }

    // Handle simple types with array notation
    let result = this.visitor.visit(node.children.simpleType[0], ctx);

    // Handle array types like Array[String]
    if (node.children.LeftBracket) {
      for (let i = 0; i < node.children.LeftBracket.length; i++) {
        result += "[" + this.visitor.visit(node.children.type[i], ctx) + "]";
      }
    }

    return result;
  }

  visitTupleTypeOrParenthesized(node: any, ctx: PrintContext): string {
    const types = node.children.type || [];
    if (types.length === 1) {
      return this.visitor.visit(types[0], ctx);
    }

    const typeStrings = types.map((t: any) => this.visitor.visit(t, ctx));
    return typeStrings.join(", ");
  }

  visitSimpleType(node: any, ctx: PrintContext): string {
    let result = this.visitor.visit(node.children.qualifiedIdentifier[0], ctx);

    // Handle type parameters like List[Int] or Kind Projector like Map[String, *]
    if (node.children.LeftBracket) {
      const typeArgs = node.children.typeArgument || [];
      const typeStrings = typeArgs.map((t: any) => this.visitor.visit(t, ctx));
      result += "[" + typeStrings.join(", ") + "]";
    }

    return result;
  }

  visitTypeArgument(node: any, ctx: PrintContext): string {
    // Handle Kind Projector notation: *
    if (node.children.Star) {
      return "*";
    }

    // Handle regular type
    if (node.children.type) {
      return this.visitor.visit(node.children.type[0], ctx);
    }

    return "";
  }

  visitTypeLambda(node: any, ctx: PrintContext): string {
    let result = "[";

    if (node.children.typeLambdaParameter) {
      const parameters = node.children.typeLambdaParameter.map((param: any) =>
        this.visitor.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += "] =>> ";
    result += this.visitor.visit(node.children.type[0], ctx);

    return result;
  }

  visitTypeLambdaParameter(node: any, ctx: PrintContext): string {
    let result = "";

    // Add variance annotation if present
    if (node.children.Plus) {
      result += "+";
    } else if (node.children.Minus) {
      result += "-";
    }

    result += node.children.Identifier[0].image;

    if (node.children.SubtypeOf) {
      result += " <: " + this.visitor.visit(node.children.type[0], ctx);
    } else if (node.children.SupertypeOf) {
      result += " >: " + this.visitor.visit(node.children.type[0], ctx);
    }

    return result;
  }

  visitDependentFunctionType(node: any, ctx: PrintContext): string {
    let result = "(";

    if (node.children.dependentParameter) {
      const parameters = node.children.dependentParameter.map((param: any) =>
        this.visitor.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += ") => ";
    result += this.visitor.visit(node.children.type[0], ctx);

    return result;
  }

  visitDependentParameter(node: any, ctx: PrintContext): string {
    let result = node.children.Identifier[0].image;
    result += ": " + this.visitor.visit(node.children.type[0], ctx);
    return result;
  }

  visitPolymorphicFunctionType(node: any, ctx: PrintContext): string {
    let result = "[";

    if (node.children.polymorphicTypeParameter) {
      const parameters = node.children.polymorphicTypeParameter.map(
        (param: any) => this.visitor.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += "] => ";
    result += this.visitor.visit(node.children.type[0], ctx);

    return result;
  }

  visitPolymorphicTypeParameter(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle variance annotation
    if (node.children.Plus) {
      result += "+";
    } else if (node.children.Minus) {
      result += "-";
    }

    result += node.children.Identifier[0].image;

    // Handle type bounds
    if (node.children.SubtypeOf) {
      result += " <: " + this.visitor.visit(node.children.type[0], ctx);
    }
    if (node.children.SupertypeOf) {
      result += " >: " + this.visitor.visit(node.children.type[0], ctx);
    }

    return result;
  }
}
