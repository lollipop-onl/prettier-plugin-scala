// No longer using Prettier Doc builders since we return strings directly

type PrintContext = {
  path: any;
  options: any;
  print: any;
};

export class CstNodeVisitor {
  visit(node: any, ctx: PrintContext): string {
    if (!node) return "";

    // Handle token nodes
    if (node.image !== undefined) {
      return node.image;
    }

    // Handle CST nodes by rule name
    if (node.name) {
      // Capitalize the first letter of the rule name
      const ruleName = node.name.charAt(0).toUpperCase() + node.name.slice(1);
      const methodName = `visit${ruleName}`;
      if (typeof (this as any)[methodName] === "function") {
        return (this as any)[methodName](node, ctx);
      }
    }

    // If no specific visitor method exists, try default handling by type
    if (node.children) {
      return this.visitChildren(node, ctx);
    }

    return "";
  }

  visitChildren(node: any, ctx: PrintContext): string {
    const parts: string[] = [];

    if (!node.children) return "";

    for (const key in node.children) {
      const children = node.children[key];
      if (Array.isArray(children)) {
        for (const child of children) {
          const part = this.visit(child, ctx);
          if (part !== "") parts.push(part);
        }
      }
    }

    return parts.join("");
  }

  visitCompilationUnit(node: any, ctx: PrintContext): string {
    let result = "";

    if (node.children.packageClause) {
      result += this.visit(node.children.packageClause[0], ctx) + "\n\n";
    }

    if (node.children.importClause) {
      for (const importNode of node.children.importClause) {
        result += this.visit(importNode, ctx) + "\n";
      }
      if (node.children.importClause.length > 0) {
        result += "\n";
      }
    }

    if (node.children.topLevelDefinition) {
      const defs = node.children.topLevelDefinition.map((def: any) =>
        this.visit(def, ctx),
      );
      result += defs.join("\n");
    }

    if (node.children.expression) {
      const exprs = node.children.expression.map((expr: any) =>
        this.visit(expr, ctx),
      );
      if (result) result += "\n";
      result += exprs.join("\n");
    }

    return result + "\n";
  }

  visitPackageClause(node: any, ctx: PrintContext): string {
    return "package " + this.visit(node.children.qualifiedIdentifier[0], ctx);
  }

  visitImportClause(node: any, ctx: PrintContext): string {
    return "import " + this.visit(node.children.importExpression[0], ctx);
  }

  visitImportExpression(node: any, ctx: PrintContext): string {
    let result = this.visit(node.children.qualifiedIdentifier[0], ctx);

    if (node.children.Dot) {
      result += ".";
      if (node.children.Underscore) {
        result += "_";
      } else if (node.children.LeftBrace) {
        // TODO: Handle import selectors
        result += "{...}";
      }
    }

    return result;
  }

  visitTopLevelDefinition(node: any, ctx: PrintContext): string {
    const modifiers = this.visitModifiers(node.children.modifier || [], ctx);
    const definition = this.visitDefinition(node, ctx);

    return modifiers ? modifiers + " " + definition : definition;
  }

  visitModifiers(modifiers: any[], ctx: PrintContext): string {
    if (!modifiers || modifiers.length === 0) return "";

    return modifiers.map((mod) => this.visit(mod, ctx)).join(" ");
  }

  visitDefinition(node: any, ctx: PrintContext): string {
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
    } else if (node.children.auxiliaryConstructor) {
      return this.visit(node.children.auxiliaryConstructor[0], ctx);
    } else if (node.children.givenDefinition) {
      return this.visit(node.children.givenDefinition[0], ctx);
    }

    return "";
  }

  visitClassDefinition(node: any, ctx: PrintContext): string {
    let result = "";

    // Add class keyword
    if (node.children.Class) {
      result += node.children.Class[0].image + " ";
    }

    // Add class name
    if (node.children.Identifier) {
      result += node.children.Identifier[0].image;
    }

    if (node.children.typeParameters) {
      result += this.visit(node.children.typeParameters[0], ctx);
    }

    if (node.children.classParameters) {
      result += this.visit(node.children.classParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visit(node.children.extendsClause[0], ctx);
    }

    if (node.children.classBody) {
      result += " " + this.visit(node.children.classBody[0], ctx);
    }

    return result;
  }

  visitObjectDefinition(node: any, ctx: PrintContext): string {
    let result = "object " + node.children.Identifier[0].image;

    if (node.children.extendsClause) {
      result += " " + this.visit(node.children.extendsClause[0], ctx);
    }

    if (node.children.classBody) {
      result += " " + this.visit(node.children.classBody[0], ctx);
    }

    return result;
  }

  visitTraitDefinition(node: any, ctx: PrintContext): string {
    let result = "trait " + node.children.Identifier[0].image;

    if (node.children.typeParameters) {
      result += this.visit(node.children.typeParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visit(node.children.extendsClause[0], ctx);
    }

    if (node.children.classBody) {
      result += " " + this.visit(node.children.classBody[0], ctx);
    }

    return result;
  }

  visitValDefinition(node: any, ctx: PrintContext): string {
    let result = "val " + this.visit(node.children.pattern[0], ctx);

    if (node.children.Colon) {
      result += ": " + this.visit(node.children.type[0], ctx);
    }

    result += " = " + this.visit(node.children.expression[0], ctx);

    return result;
  }

  visitVarDefinition(node: any, ctx: PrintContext): string {
    let result = "var " + node.children.Identifier[0].image;

    if (node.children.Colon) {
      result += ": " + this.visit(node.children.type[0], ctx);
    }

    result += " = " + this.visit(node.children.expression[0], ctx);

    return result;
  }

  visitDefDefinition(node: any, ctx: PrintContext): string {
    let result = "def ";
    if (node.children.Identifier) {
      result += node.children.Identifier[0].image;
    } else if (node.children.This) {
      result += "this";
    }

    if (node.children.typeParameters) {
      result += this.visit(node.children.typeParameters[0], ctx);
    }

    if (node.children.parameterLists) {
      result += this.visit(node.children.parameterLists[0], ctx);
    }

    if (node.children.Colon) {
      result += ": " + this.visit(node.children.type[0], ctx);
    }

    if (node.children.Equals) {
      result += " = " + this.visit(node.children.expression[0], ctx);
    }

    return result;
  }

  visitGivenDefinition(node: any, ctx: PrintContext): string {
    let result = "given";

    if (node.children.Identifier) {
      // Named given with potential parameters: given name[T](using ord: Type): Type
      result += " " + node.children.Identifier[0].image;

      if (node.children.typeParameters) {
        result += this.visit(node.children.typeParameters[0], ctx);
      }

      if (node.children.parameterLists) {
        result += this.visit(node.children.parameterLists[0], ctx);
      }

      result += ": " + this.visit(node.children.type[0], ctx);
    } else {
      // Anonymous given: given Type = expression
      result += " " + this.visit(node.children.type[0], ctx);
    }

    if (node.children.Equals) {
      result += " = " + this.visit(node.children.expression[0], ctx);
    }

    return result;
  }

  visitAuxiliaryConstructor(node: any, ctx: PrintContext): string {
    let result = "def this";

    if (node.children.parameterList) {
      const params = node.children.parameterList.map((list: any) =>
        this.visit(list, ctx),
      );
      result += params.join("");
    }

    result += " = " + this.visit(node.children.expression[0], ctx);

    return result;
  }

  visitClassParameters(node: any, ctx: PrintContext): string {
    const params = node.children.classParameter || [];
    if (params.length === 0) {
      return "()";
    }

    const paramStrings = params.map((p: any) => this.visit(p, ctx));

    // Always use multi-line format for class parameters to match expected output
    return `(\n  ${paramStrings.join(",\n  ")}\n)`;
  }

  visitClassParameter(node: any, ctx: PrintContext): string {
    let result = "";

    if (node.children.modifier) {
      const modifiers = this.visitModifiers(node.children.modifier, ctx);
      result += modifiers + " ";
    }

    if (node.children.Val) {
      result += "val ";
    } else if (node.children.Var) {
      result += "var ";
    }

    result += node.children.Identifier[0].image;
    result += ": ";
    result += this.visit(node.children.type[0], ctx);

    if (node.children.Equals) {
      result += " = " + this.visit(node.children.expression[0], ctx);
    }

    return result;
  }

  visitParameterLists(node: any, ctx: PrintContext): string {
    return node.children.parameterList
      .map((list: any) => this.visit(list, ctx))
      .join("");
  }

  visitParameterList(node: any, ctx: PrintContext): string {
    const params = node.children.parameter || [];
    if (params.length === 0) {
      return "()";
    }

    const paramStrings = params.map((p: any) => this.visit(p, ctx));
    return "(" + paramStrings.join(", ") + ")";
  }

  visitParameter(node: any, ctx: PrintContext): string {
    let result = "";

    if (node.children.Using) {
      result += "using ";
    }

    result += node.children.Identifier[0].image;
    result += ": ";
    result += this.visit(node.children.type[0], ctx);

    if (node.children.Equals) {
      result += " = " + this.visit(node.children.expression[0], ctx);
    }

    return result;
  }

  visitTypeParameters(node: any, ctx: PrintContext): string {
    const params = node.children.typeParameter || [];
    const paramStrings = params.map((p: any) => this.visit(p, ctx));
    return "[" + paramStrings.join(", ") + "]";
  }

  visitTypeParameter(node: any, ctx: PrintContext): string {
    let result = node.children.Identifier[0].image;

    if (node.children.SubtypeOf) {
      result += " <: " + this.visit(node.children.type[0], ctx);
    } else if (node.children.SupertypeOf) {
      result += " >: " + this.visit(node.children.type[0], ctx);
    }

    return result;
  }

  visitExtendsClause(node: any, ctx: PrintContext): string {
    let result = "extends " + this.visit(node.children.type[0], ctx);

    if (node.children.With) {
      const withTypes = node.children.type.slice(1);
      for (let i = 0; i < withTypes.length; i++) {
        result += " with " + this.visit(withTypes[i], ctx);
      }
    }

    return result;
  }

  visitClassBody(node: any, ctx: PrintContext): string {
    const members = node.children.classMember || [];

    if (members.length === 0) {
      return "{}";
    }

    const memberStrings = members.map((m: any) => this.visit(m, ctx));
    return `{\n  ${memberStrings.join("\n  ")}\n}`;
  }

  visitClassMember(node: any, ctx: PrintContext): string {
    const modifiers = this.visitModifiers(node.children.modifier || [], ctx);
    const definition = this.visitDefinition(node, ctx);

    return modifiers ? modifiers + " " + definition : definition;
  }

  visitType(node: any, ctx: PrintContext): string {
    let result = this.visit(node.children.simpleType[0], ctx);

    // Handle array types like Array[String]
    if (node.children.LeftBracket) {
      for (let i = 0; i < node.children.LeftBracket.length; i++) {
        result += "[" + this.visit(node.children.type[i], ctx) + "]";
      }
    }

    return result;
  }

  visitSimpleType(node: any, ctx: PrintContext): string {
    let result = this.visit(node.children.qualifiedIdentifier[0], ctx);

    // Handle type parameters like List[Int]
    if (node.children.LeftBracket) {
      const types = node.children.type || [];
      const typeStrings = types.map((t: any) => this.visit(t, ctx));
      result += "[" + typeStrings.join(", ") + "]";
    }

    return result;
  }

  visitPattern(node: any, ctx: PrintContext): string {
    if (node.children.Identifier) {
      return node.children.Identifier[0].image;
    } else if (node.children.Underscore) {
      return "_";
    } else if (node.children.literal) {
      return this.visit(node.children.literal[0], ctx);
    }

    return "";
  }

  visitExpression(node: any, ctx: PrintContext): string {
    // Handle lambda expressions with parameter list: (x: Int, y: Int) => x + y
    if (node.children.parameterList && node.children.Arrow) {
      return (
        this.visit(node.children.parameterList[0], ctx) +
        " => " +
        this.visit(node.children.expression[0], ctx)
      );
    }

    // Handle block lambda expressions: { x => ... }
    if (
      node.children.LeftBrace &&
      node.children.Identifier &&
      node.children.Arrow
    ) {
      let result = "{ " + node.children.Identifier[0].image + " =>";

      if (node.children.blockStatement) {
        const statements = node.children.blockStatement.map(
          (s: any) => "  " + this.visit(s, ctx),
        );
        result += "\n" + statements.join("\n");
      }

      if (node.children.expression) {
        result += "\n  " + this.visit(node.children.expression[0], ctx);
      }

      result += "\n}";
      return result;
    }

    // Handle simple lambda expressions: x => x * 2
    if (node.children.Identifier && node.children.Arrow) {
      return (
        node.children.Identifier[0].image +
        " => " +
        this.visit(node.children.expression[0], ctx)
      );
    }

    // Handle assignmentOrInfixExpression
    if (node.children.assignmentOrInfixExpression) {
      return this.visit(node.children.assignmentOrInfixExpression[0], ctx);
    }

    // Handle regular expressions (fallback for older structure)
    if (node.children.postfixExpression) {
      let result = this.visit(node.children.postfixExpression[0], ctx);

      if (node.children.infixOperator) {
        for (let i = 0; i < node.children.infixOperator.length; i++) {
          result +=
            " " +
            this.visit(node.children.infixOperator[i], ctx) +
            " " +
            this.visit(node.children.postfixExpression[i + 1], ctx);
        }
      }

      return result;
    }

    return this.visitChildren(node, ctx);
  }

  visitPostfixExpression(node: any, ctx: PrintContext): string {
    let result = this.visit(node.children.primaryExpression[0], ctx);

    // Debug: log the node structure for troubleshooting
    // console.log("PostfixExpression node:", JSON.stringify(node.children, null, 2));

    // Handle type parameters first (they come immediately after the identifier)
    if (node.children.LeftBracket) {
      result += "[";
      if (node.children.type) {
        const types = node.children.type.map((t: any) => this.visit(t, ctx));
        result += types.join(", ");
      }
      result += "]";

      // Only add arguments if there are parentheses after type parameters
      if (node.children.LeftParen) {
        result += "(";
        if (node.children.expression) {
          const args = node.children.expression.map((e: any) =>
            this.visit(e, ctx),
          );
          result += args.join(", ");
        }
        result += ")";
      }
    }
    // Handle method calls and field access (when no type parameters)
    else if (node.children.Dot || node.children.LeftParen) {
      // We need to process function calls in the correct order
      // The parser accumulates tokens, so we need to split them properly

      const leftParens = node.children.LeftParen || [];
      const expressions = node.children.expression || [];
      const dots = node.children.Dot || [];
      const identifiers = node.children.Identifier || [];

      // Case 1: Just function call on primary expression (no dots)
      if (leftParens.length > 0 && dots.length === 0) {
        result += "(";
        if (expressions.length > 0) {
          const args = expressions.map((e: any) => this.visit(e, ctx));
          result += args.join(", ");
        }
        result += ")";
      }
      // Case 2: Method chaining with dots
      else if (dots.length > 0) {
        // First, handle any immediate function call on the primary expression
        if (leftParens.length > dots.length) {
          // There's a function call before the dots
          // Count commas to determine how many expressions belong to the first call
          let firstCallArgCount = 0;
          if (leftParens.length > 1) {
            // Count commas between first and second parentheses positions
            // This is complex, so let's use a simpler heuristic:
            // If we have more expressions than method calls, the extras go to the first call
            const methodCallCount = dots.length;
            const totalExpressions = expressions.length;
            firstCallArgCount = totalExpressions - methodCallCount;
          } else {
            firstCallArgCount = expressions.length;
          }

          result += "(";
          if (firstCallArgCount > 0) {
            const firstCallArgs = expressions
              .slice(0, firstCallArgCount)
              .map((e: any) => this.visit(e, ctx));
            result += firstCallArgs.join(", ");
          }
          result += ")";
        }

        // Then handle dot notation and method calls
        for (let i = 0; i < dots.length; i++) {
          result += "." + identifiers[i].image;

          // For now, only the last method in the chain gets parentheses
          // This is a simplification - a full implementation would need to track
          // which specific methods have arguments
          if (i === dots.length - 1 && leftParens.length > 0) {
            result += "(";
            // Calculate which expressions belong to this method call
            const firstCallArgCount =
              leftParens.length > dots.length ? expressions.length - 1 : 0; // If there are more parens than dots, first call gets some args
            const methodArgs = expressions.slice(firstCallArgCount);
            if (methodArgs.length > 0) {
              const args = methodArgs.map((e: any) => this.visit(e, ctx));
              result += args.join(", ");
            }
            result += ")";
          }
        }
      }
    }

    // Handle match expressions
    if (node.children.Match) {
      result += " match {\n";
      if (node.children.caseClause) {
        const cases = node.children.caseClause.map(
          (c: any) => "  " + this.visit(c, ctx),
        );
        result += cases.join("\n");
      }
      result += "\n}";
    }

    return result;
  }

  visitPrimaryExpression(node: any, ctx: PrintContext): string {
    if (node.children.literal) {
      return this.visit(node.children.literal[0], ctx);
    } else if (node.children.Identifier) {
      return node.children.Identifier[0].image;
    } else if (node.children.This) {
      return "this";
    } else if (node.children.newExpression) {
      return this.visit(node.children.newExpression[0], ctx);
    } else if (node.children.forExpression) {
      return this.visit(node.children.forExpression[0], ctx);
    } else if (node.children.Exclamation) {
      // Handle negation operator
      return "!" + this.visit(node.children.postfixExpression[0], ctx);
    } else if (node.children.LeftParen) {
      return "(" + this.visit(node.children.expression[0], ctx) + ")";
    } else if (node.children.blockExpression) {
      return this.visit(node.children.blockExpression[0], ctx);
    }

    return "";
  }

  visitBlockExpression(node: any, ctx: PrintContext): string {
    const statements = node.children.blockStatement || [];
    const finalExpr = node.children.expression?.[0];

    let parts: string[] = statements.map((s: any) => this.visit(s, ctx));
    if (finalExpr) {
      parts.push(this.visit(finalExpr, ctx));
    }

    if (parts.length === 0) {
      return "{}";
    }

    // Try to merge adjacent function calls (identifier followed by parenthesized expression)
    const mergedParts: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const current = parts[i];
      const next = parts[i + 1];

      // Check if current is an identifier and next starts with "("
      if (
        next &&
        /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(current.trim()) &&
        next.trim().startsWith("(")
      ) {
        mergedParts.push(current + next);
        i++; // Skip the next part as it's been merged
      } else {
        mergedParts.push(current);
      }
    }

    return "{\n    " + mergedParts.join("\n    ") + "\n  }";
  }

  visitBlockStatement(node: any, ctx: PrintContext): string {
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

  visitAssignmentStatement(node: any, ctx: PrintContext): string {
    let result = node.children.Identifier[0].image;

    const operator =
      node.children.Equals?.[0] ||
      node.children.PlusEquals?.[0] ||
      node.children.MinusEquals?.[0] ||
      node.children.StarEquals?.[0] ||
      node.children.SlashEquals?.[0] ||
      node.children.PercentEquals?.[0];

    result += " " + operator.image + " ";
    result += this.visit(node.children.expression[0], ctx);

    return result;
  }

  visitAssignmentOrInfixExpression(node: any, ctx: PrintContext): string {
    let result = this.visit(node.children.postfixExpression[0], ctx);

    // Handle compound assignment operators
    if (
      node.children.PlusEquals ||
      node.children.MinusEquals ||
      node.children.StarEquals ||
      node.children.SlashEquals ||
      node.children.PercentEquals
    ) {
      const operator =
        node.children.PlusEquals?.[0] ||
        node.children.MinusEquals?.[0] ||
        node.children.StarEquals?.[0] ||
        node.children.SlashEquals?.[0] ||
        node.children.PercentEquals?.[0];
      result += " " + operator.image + " ";
      result += this.visit(node.children.expression[0], ctx);
    }

    // Handle infix operators
    if (node.children.infixOperator) {
      for (let i = 0; i < node.children.infixOperator.length; i++) {
        result +=
          " " +
          this.visit(node.children.infixOperator[i], ctx) +
          " " +
          this.visit(node.children.postfixExpression[i + 1], ctx);
      }
    }

    return result;
  }

  visitInfixOperator(node: any, _ctx: PrintContext): string {
    const children = node.children as Record<string, any[]>;
    const token = Object.values(children)[0][0];
    return token.image;
  }

  visitLiteral(node: any, _ctx: PrintContext): string {
    const children = node.children as Record<string, any[]>;
    const token = Object.values(children)[0][0];
    return token.image;
  }

  visitQualifiedIdentifier(node: any, _ctx: PrintContext): string {
    let result = node.children.Identifier[0].image;

    if (node.children.Dot) {
      for (let i = 1; i < node.children.Identifier.length; i++) {
        result += "." + node.children.Identifier[i].image;
      }
    }

    return result;
  }

  visitNewExpression(node: any, ctx: PrintContext): string {
    let result = "new " + this.visit(node.children.type[0], ctx);

    if (node.children.LeftParen) {
      result += "(";
      if (node.children.expression) {
        const args = node.children.expression.map((e: any) =>
          this.visit(e, ctx),
        );
        result += args.join(", ");
      }
      result += ")";
    }

    return result;
  }

  visitForExpression(node: any, ctx: PrintContext): string {
    let result = "for ";

    if (node.children.LeftParen) {
      result += "(";
      if (node.children.generator) {
        const gens = node.children.generator.map((g: any) =>
          this.visit(g, ctx),
        );
        result += gens.join("; ");
      }
      result += ")";
    } else if (node.children.LeftBrace) {
      result += "{\n";
      if (node.children.generator) {
        const gens = node.children.generator.map(
          (g: any) => "  " + this.visit(g, ctx),
        );
        result += gens.join("\n");
      }
      result += "\n}";
    }

    if (node.children.Yield) {
      result += " yield ";
    } else {
      result += " ";
    }

    result += this.visit(node.children.expression[0], ctx);

    return result;
  }

  visitGenerator(node: any, ctx: PrintContext): string {
    let result = this.visit(node.children.pattern[0], ctx);
    result += " <- " + this.visit(node.children.expression[0], ctx);

    if (node.children.If) {
      for (let i = 0; i < node.children.If.length; i++) {
        result += " if " + this.visit(node.children.expression[i + 1], ctx);
      }
    }

    return result;
  }

  visitCaseClause(node: any, ctx: PrintContext): string {
    let result = "case " + this.visit(node.children.pattern[0], ctx);

    if (node.children.If) {
      result += " if " + this.visit(node.children.expression[0], ctx);
      result += " => " + this.visit(node.children.expression[1], ctx);
    } else {
      result += " => " + this.visit(node.children.expression[0], ctx);
    }

    return result;
  }
}
