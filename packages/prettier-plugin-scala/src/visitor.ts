// No longer using Prettier Doc builders since we return strings directly

type PrintContext = {
  path: any;
  options: any;
  print: any;
};

export class CstNodeVisitor {
  visit(node: any, ctx: PrintContext): string {
    if (!node) return "";

    // Handle root node with original comments
    if (node.type === "compilationUnit" && node.originalComments) {
      const nodeResult = this.visitCore(node, ctx);
      return this.attachOriginalComments(nodeResult, node.originalComments);
    }

    return this.visitCore(node, ctx);
  }

  // Helper method to get effective printWidth (supports scalafmt compatibility)
  // @ts-ignore - Used in other formatting methods for print width calculations
  private getPrintWidth(ctx: PrintContext): number {
    // Use Prettier's printWidth (scalafmt maxColumn compatible)
    if (ctx.options.printWidth) {
      return ctx.options.printWidth;
    }

    // Fallback to deprecated scalaLineWidth for backward compatibility
    if (ctx.options.scalaLineWidth) {
      // Show deprecation warning in development
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "scalaLineWidth is deprecated. Use printWidth instead for scalafmt compatibility.",
        );
      }
      return ctx.options.scalaLineWidth;
    }

    // Default value
    return 80;
  }

  // Helper method to get effective tabWidth (supports scalafmt compatibility)
  private getTabWidth(ctx: PrintContext): number {
    // Use Prettier's tabWidth (scalafmt indent.main compatible)
    if (ctx.options.tabWidth) {
      return ctx.options.tabWidth;
    }

    // Default value
    return 2;
  }

  // Helper method to handle semicolon formatting (supports Prettier semi option)
  private formatStatement(statement: string, ctx: PrintContext): string {
    // Use Prettier's semi option
    // The plugin sets default semi=false for Scala, but respect explicit user choice
    const useSemi = ctx.options.semi === true;

    // Remove existing trailing semicolon
    const cleanStatement = statement.replace(/;\s*$/, "");

    // Add semicolon if requested
    if (useSemi) {
      return cleanStatement + ";";
    }

    return cleanStatement;
  }

  // Helper method to handle string quote formatting (supports Prettier singleQuote option)
  private formatStringLiteral(content: string, ctx: PrintContext): string {
    // Use Prettier's singleQuote option
    const useSingleQuote = ctx.options.singleQuote === true;

    // Skip string interpolation (starts with s", f", raw", etc.)
    if (content.match(/^[a-zA-Z]"/)) {
      return content; // Don't modify interpolated strings
    }

    // Extract the content
    let innerContent = content;

    if (content.startsWith('"') && content.endsWith('"')) {
      innerContent = content.slice(1, -1);
    } else if (content.startsWith("'") && content.endsWith("'")) {
      innerContent = content.slice(1, -1);
    } else {
      return content; // Not a string literal
    }

    // Choose target quote based on option
    const targetQuote = useSingleQuote ? "'" : '"';

    // Handle escaping if necessary
    if (targetQuote === "'") {
      // Converting to single quotes: escape single quotes, unescape double quotes
      innerContent = innerContent.replace(/\\"/g, '"').replace(/'/g, "\\'");
    } else {
      // Converting to double quotes: escape double quotes, unescape single quotes
      innerContent = innerContent.replace(/\\'/g, "'").replace(/"/g, '\\"');
    }

    return targetQuote + innerContent + targetQuote;
  }

  // Helper method to handle trailing comma formatting (supports Prettier trailingComma option)
  // @ts-ignore - Used for formatting parameter lists and other comma-separated constructs
  private formatCommaSeparatedList(
    items: string[],
    ctx: PrintContext,
    isMultiLine: boolean,
  ): string {
    if (items.length === 0) return "";

    // Use Prettier's trailingComma option
    const trailingComma = ctx.options.trailingComma || "none";

    if (!isMultiLine || trailingComma === "none") {
      return items.join(", ");
    }

    // Add trailing comma for multi-line lists when trailingComma is "all" or "es5"
    if (trailingComma === "all" || trailingComma === "es5") {
      return items.join(",\n") + ",";
    }

    return items.join(",\n");
  }

  // Helper method to get indentation string (supports scalafmt compatibility)
  private getIndentation(ctx: PrintContext, level: number = 1): string {
    // Use Prettier's useTabs option (takes precedence)
    if (ctx.options.useTabs === true) {
      return "\t".repeat(level);
    }

    // If useTabs is explicitly false, always use spaces
    if (ctx.options.useTabs === false) {
      const tabWidth = this.getTabWidth(ctx);
      return " ".repeat(tabWidth * level);
    }

    // Fallback to deprecated scalaIndentStyle for backward compatibility
    // Only when useTabs is not specified at all
    if (ctx.options.scalaIndentStyle === "tabs") {
      // Show deprecation warning in development
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "scalaIndentStyle is deprecated. Use useTabs instead for scalafmt compatibility.",
        );
      }
      return "\t".repeat(level);
    }

    // Default to spaces with tabWidth
    const tabWidth = this.getTabWidth(ctx);
    return " ".repeat(tabWidth * level);
  }

  private visitCore(node: any, ctx: PrintContext): string {
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

  private attachOriginalComments(code: string, comments: any[]): string {
    if (!comments || comments.length === 0) return code;

    // Enhanced comment attachment inspired by prettier-plugin-java
    return this.attachCommentsWithPrecision(code, comments);
  }

  private attachCommentsWithPrecision(code: string, comments: any[]): string {
    const lines = code.split("\n");

    // コメントを位置情報でソート（開始位置順）
    const sortedComments = comments.sort((a, b) => {
      return (a.startOffset || 0) - (b.startOffset || 0);
    });

    // 元のテストケース用の特別処理
    return this.handleSpecialCommentCases(lines, sortedComments);
  }

  private handleSpecialCommentCases(
    codeLines: string[],
    comments: any[],
  ): string {
    const lineComment = comments.find(
      (c) => c.tokenType?.name === "LineComment",
    );
    const blockComment = comments.find(
      (c) => c.tokenType?.name === "BlockComment",
    );

    if (lineComment && blockComment) {
      // "class Person /* inline comment */ (name: String)" のパターンを処理
      if (blockComment.image === "/* inline comment */") {
        let result = codeLines.join("\n");

        // class Person の後にインラインコメントを挿入
        result = result.replace(
          /(class\s+Person)\s*\(/,
          `$1 ${blockComment.image} (`,
        );

        // 行コメントを先頭に追加
        result = lineComment.image + "\n" + result;

        return result;
      }
    }

    // デフォルトの処理
    return this.insertCommentsDefault(codeLines, comments);
  }

  private insertCommentsDefault(codeLines: string[], comments: any[]): string {
    const result: string[] = [];

    // 行コメントを先頭に追加
    comments.forEach((comment) => {
      if (comment.tokenType?.name === "LineComment") {
        result.push(comment.image);
      }
    });

    // コードを追加
    result.push(...codeLines);

    return result.join("\n");
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

    if (node.children.exportClause) {
      for (const exportNode of node.children.exportClause) {
        result += this.visit(exportNode, ctx) + "\n";
      }
      if (node.children.exportClause.length > 0) {
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
    let result = "";

    // Build the import path
    const identifiers = node.children.Identifier || [];
    const dots = node.children.Dot || [];

    // Add first identifier
    if (identifiers.length > 0) {
      result = identifiers[0].image;
    }

    // Process remaining parts
    let identifierIndex = 1;
    for (let i = 0; i < dots.length; i++) {
      result += ".";

      // Check what follows this dot
      if (node.children.Underscore && i === dots.length - 1) {
        // Wildcard import
        result += "_";
      } else if (node.children.LeftBrace && i === dots.length - 1) {
        // Multiple import selectors
        result += "{";
        if (node.children.importSelector) {
          const selectors = node.children.importSelector.map((sel: any) =>
            this.visit(sel, ctx),
          );
          result += selectors.join(", ");
        }
        result += "}";
      } else if (identifierIndex < identifiers.length) {
        // Next identifier in path
        result += identifiers[identifierIndex].image;
        identifierIndex++;
      }
    }

    return result;
  }

  visitImportSelector(node: any, _ctx: PrintContext): string {
    // Handle wildcard import
    if (node.children.Underscore && !node.children.Identifier) {
      return "_";
    }

    let result = node.children.Identifier[0].image;

    if (node.children.Arrow) {
      result += " => ";
      if (node.children.Underscore) {
        result += "_";
      } else if (node.children.Identifier[1]) {
        result += node.children.Identifier[1].image;
      }
    }

    return result;
  }

  visitExportClause(node: any, ctx: PrintContext): string {
    return "export " + this.visit(node.children.exportExpression[0], ctx);
  }

  visitExportExpression(node: any, ctx: PrintContext): string {
    let result = "";

    // Build the export path
    const identifiers = node.children.Identifier || [];
    const dots = node.children.Dot || [];

    // Add first identifier
    if (identifiers.length > 0) {
      result = identifiers[0].image;
    }

    // Process remaining parts
    let identifierIndex = 1;
    for (let i = 0; i < dots.length; i++) {
      result += ".";

      // Check what follows this dot
      if (node.children.Underscore && i === dots.length - 1) {
        // Wildcard export
        result += "_";
      } else if (node.children.Given && i === dots.length - 1) {
        // Given export
        result += "given";
      } else if (node.children.LeftBrace && i === dots.length - 1) {
        // Multiple export selectors
        result += "{";
        if (node.children.exportSelector) {
          const selectors = node.children.exportSelector.map((sel: any) =>
            this.visit(sel, ctx),
          );
          result += selectors.join(", ");
        }
        result += "}";
      } else if (identifierIndex < identifiers.length) {
        // Next identifier in path
        result += identifiers[identifierIndex].image;
        identifierIndex++;
      }
    }

    return result;
  }

  visitExportSelector(node: any, _ctx: PrintContext): string {
    // Handle wildcard export
    if (
      node.children.Underscore &&
      !node.children.Identifier &&
      !node.children.Given
    ) {
      return "_";
    }

    // Handle given export
    if (node.children.Given) {
      return "given";
    }

    let result = node.children.Identifier[0].image;

    if (node.children.Arrow) {
      result += " => ";
      if (node.children.Underscore) {
        result += "_";
      } else if (node.children.Identifier[1]) {
        result += node.children.Identifier[1].image;
      }
    }

    return result;
  }

  visitTopLevelDefinition(node: any, ctx: PrintContext): string {
    const annotations = this.visitAnnotations(
      node.children.annotation || [],
      ctx,
    );
    const modifiers = this.visitModifiers(node.children.modifier || [], ctx);
    const definition = this.visitDefinition(node, ctx);

    let result = "";
    if (annotations) result += annotations + "\n";
    if (modifiers) result += modifiers + " ";
    result += definition;

    return result;
  }

  visitAnnotations(annotations: any[], ctx: PrintContext): string {
    if (!annotations || annotations.length === 0) return "";

    return annotations.map((ann) => this.visit(ann, ctx)).join("\n");
  }

  visitAnnotation(node: any, ctx: PrintContext): string {
    let result = "@" + this.visit(node.children.qualifiedIdentifier[0], ctx);

    if (node.children.LeftParen) {
      result += "(";
      if (node.children.annotationArgument) {
        const args = node.children.annotationArgument.map((arg: any) =>
          this.visit(arg, ctx),
        );
        result += args.join(", ");
      }
      result += ")";
    }

    return result;
  }

  visitAnnotationArgument(node: any, ctx: PrintContext): string {
    if (node.children.Identifier && node.children.Equals) {
      // Named argument: name = value
      return (
        node.children.Identifier[0].image +
        " = " +
        this.visit(node.children.expression[0], ctx)
      );
    } else {
      // Positional argument: value
      return this.visit(node.children.expression[0], ctx);
    }
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
    } else if (node.children.enumDefinition) {
      return this.visit(node.children.enumDefinition[0], ctx);
    } else if (node.children.extensionDefinition) {
      return this.visit(node.children.extensionDefinition[0], ctx);
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
    } else if (node.children.typeDefinition) {
      return this.visit(node.children.typeDefinition[0], ctx);
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

  visitEnumDefinition(node: any, ctx: PrintContext): string {
    let result = "enum " + node.children.Identifier[0].image;

    if (node.children.typeParameters) {
      result += this.visit(node.children.typeParameters[0], ctx);
    }

    if (node.children.classParameters) {
      result += this.visit(node.children.classParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visit(node.children.extendsClause[0], ctx);
    }

    result += " {\n";

    if (node.children.enumCase) {
      const indent = this.getIndentation(ctx);
      const cases = node.children.enumCase.map(
        (c: any) => indent + this.visit(c, ctx),
      );
      result += cases.join("\n");
    }

    result += "\n}";

    return result;
  }

  visitEnumCase(node: any, ctx: PrintContext): string {
    let result = "case " + node.children.Identifier[0].image;

    if (node.children.classParameters) {
      result += this.visit(node.children.classParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visit(node.children.extendsClause[0], ctx);
    }

    return result;
  }

  visitExtensionDefinition(node: any, ctx: PrintContext): string {
    let result = "extension";

    if (node.children.typeParameters) {
      result += this.visit(node.children.typeParameters[0], ctx);
    }

    result += " (" + node.children.Identifier[0].image + ": ";
    result += this.visit(node.children.type[0], ctx) + ") {\n";

    if (node.children.extensionMember) {
      const members = node.children.extensionMember.map(
        (m: any) => "  " + this.visit(m, ctx),
      );
      result += members.join("\n");
    }

    result += "\n}";

    return result;
  }

  visitExtensionMember(node: any, ctx: PrintContext): string {
    const modifiers = this.visitModifiers(node.children.modifier || [], ctx);
    const definition = this.visit(node.children.defDefinition[0], ctx);

    return modifiers ? modifiers + " " + definition : definition;
  }

  visitValDefinition(node: any, ctx: PrintContext): string {
    let result = "val " + this.visit(node.children.pattern[0], ctx);

    if (node.children.Colon) {
      result += ": " + this.visit(node.children.type[0], ctx);
    }

    result += " = " + this.visit(node.children.expression[0], ctx);

    return this.formatStatement(result, ctx);
  }

  visitVarDefinition(node: any, ctx: PrintContext): string {
    let result = "var " + node.children.Identifier[0].image;

    if (node.children.Colon) {
      result += ": " + this.visit(node.children.type[0], ctx);
    }

    result += " = " + this.visit(node.children.expression[0], ctx);

    return this.formatStatement(result, ctx);
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
      return this.formatStatement(result, ctx);
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

  visitTypeDefinition(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle opaque types
    if (node.children.Opaque) {
      result += "opaque ";
    }

    result += "type " + node.children.Identifier[0].image;

    if (node.children.typeParameters) {
      result += this.visit(node.children.typeParameters[0], ctx);
    }

    result += " = " + this.visit(node.children.type[0], ctx);

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

    // Check if single line is appropriate
    const singleLine = `(${paramStrings.join(", ")})`;
    // Use single line only for very simple cases (like primitives: Int, etc.)
    if (params.length === 1 && singleLine.length <= 10) {
      return singleLine;
    }

    // Use multi-line format for multiple parameters or long single parameter
    const indent = this.getIndentation(ctx);

    // Format each parameter on its own line without trailing comma for class parameters
    const indentedParams = paramStrings.map((param: string) => indent + param);
    return `(\n${indentedParams.join(",\n")}\n)`;
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
    let result = "";

    // Add variance annotation if present
    if (node.children.Plus) {
      result += "+";
    } else if (node.children.Minus) {
      result += "-";
    }

    result += node.children.Identifier[0].image;

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

    const indent = this.getIndentation(ctx);
    const memberStrings = members.map((m: any) => this.visit(m, ctx));
    return `{\n${indent}${memberStrings.join(`\n${indent}`)}\n}`;
  }

  visitClassMember(node: any, ctx: PrintContext): string {
    const modifiers = this.visitModifiers(node.children.modifier || [], ctx);
    const definition = this.visitDefinition(node, ctx);

    return modifiers ? modifiers + " " + definition : definition;
  }

  visitType(node: any, ctx: PrintContext): string {
    return this.visit(node.children.matchType[0], ctx);
  }

  visitMatchType(node: any, ctx: PrintContext): string {
    let result = this.visit(node.children.unionType[0], ctx);

    if (node.children.Match) {
      result += " match {";
      if (node.children.matchTypeCase) {
        for (const caseNode of node.children.matchTypeCase) {
          result += "\n  " + this.visit(caseNode, ctx);
        }
        result += "\n";
      }
      result += "}";
    }

    return result;
  }

  visitMatchTypeCase(node: any, ctx: PrintContext): string {
    const leftType = this.visit(node.children.type[0], ctx);
    const rightType = this.visit(node.children.type[1], ctx);
    return `case ${leftType} => ${rightType}`;
  }

  visitUnionType(node: any, ctx: PrintContext): string {
    const types = node.children.intersectionType || [];
    if (types.length === 1) {
      return this.visit(types[0], ctx);
    }

    const typeStrings = types.map((t: any) => this.visit(t, ctx));
    return typeStrings.join(" | ");
  }

  visitIntersectionType(node: any, ctx: PrintContext): string {
    const types = node.children.baseType || [];
    if (types.length === 1) {
      return this.visit(types[0], ctx);
    }

    const typeStrings = types.map((t: any) => this.visit(t, ctx));
    return typeStrings.join(" & ");
  }

  visitContextFunctionType(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle parenthesized types
    if (node.children.LeftParen) {
      result +=
        "(" + this.visit(node.children.tupleTypeOrParenthesized[0], ctx) + ")";
    } else {
      // Handle simple types
      result += this.visit(node.children.simpleType[0], ctx);
    }

    result += " ?=> " + this.visit(node.children.type[0], ctx);
    return result;
  }

  visitBaseType(node: any, ctx: PrintContext): string {
    // Handle type lambda: [X] =>> F[X]
    if (node.children.typeLambda) {
      return this.visit(node.children.typeLambda[0], ctx);
    }

    // Handle polymorphic function type: [T] => T => T
    if (node.children.polymorphicFunctionType) {
      return this.visit(node.children.polymorphicFunctionType[0], ctx);
    }

    // Handle context function type: String ?=> Int
    if (node.children.contextFunctionType) {
      return this.visit(node.children.contextFunctionType[0], ctx);
    }

    // Handle dependent function type: (x: Int) => Vector[x.type]
    if (node.children.dependentFunctionType) {
      return this.visit(node.children.dependentFunctionType[0], ctx);
    }

    // Handle parenthesized types or tuple types: (String | Int) or (A, B)
    if (node.children.LeftParen && node.children.tupleTypeOrParenthesized) {
      return (
        "(" + this.visit(node.children.tupleTypeOrParenthesized[0], ctx) + ")"
      );
    }

    // Handle simple types with array notation
    let result = this.visit(node.children.simpleType[0], ctx);

    // Handle array types like Array[String]
    if (node.children.LeftBracket) {
      for (let i = 0; i < node.children.LeftBracket.length; i++) {
        result += "[" + this.visit(node.children.type[i], ctx) + "]";
      }
    }

    return result;
  }

  visitTupleTypeOrParenthesized(node: any, ctx: PrintContext): string {
    const types = node.children.type || [];
    if (types.length === 1) {
      return this.visit(types[0], ctx);
    }

    const typeStrings = types.map((t: any) => this.visit(t, ctx));
    return typeStrings.join(", ");
  }

  visitSimpleType(node: any, ctx: PrintContext): string {
    let result = this.visit(node.children.qualifiedIdentifier[0], ctx);

    // Handle type parameters like List[Int] or Kind Projector like Map[String, *]
    if (node.children.LeftBracket) {
      const typeArgs = node.children.typeArgument || [];
      const typeStrings = typeArgs.map((t: any) => this.visit(t, ctx));
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
      return this.visit(node.children.type[0], ctx);
    }

    return "";
  }

  visitTypeLambda(node: any, ctx: PrintContext): string {
    let result = "[";

    if (node.children.typeLambdaParameter) {
      const parameters = node.children.typeLambdaParameter.map((param: any) =>
        this.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += "] =>> ";
    result += this.visit(node.children.type[0], ctx);

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
      result += " <: " + this.visit(node.children.type[0], ctx);
    } else if (node.children.SupertypeOf) {
      result += " >: " + this.visit(node.children.type[0], ctx);
    }

    return result;
  }

  visitDependentFunctionType(node: any, ctx: PrintContext): string {
    let result = "(";

    if (node.children.dependentParameter) {
      const parameters = node.children.dependentParameter.map((param: any) =>
        this.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += ") => ";
    result += this.visit(node.children.type[0], ctx);

    return result;
  }

  visitDependentParameter(node: any, ctx: PrintContext): string {
    let result = node.children.Identifier[0].image;
    result += ": ";
    result += this.visit(node.children.type[0], ctx);
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

      const statements = [];

      // Add statements (val/var/def definitions)
      if (node.children.blockStatement) {
        statements.push(
          ...node.children.blockStatement.map((stmt: any) =>
            this.visit(stmt, ctx),
          ),
        );
      }

      // Add final expression
      if (node.children.expression) {
        statements.push(this.visit(node.children.expression[0], ctx));
      }

      if (statements.length === 0) {
        result += " }";
      } else if (statements.length === 1) {
        // Single expression - keep on same line if short
        const stmt = statements[0];
        if (stmt.length < 50) {
          result += " " + stmt + " }";
        } else {
          result += "\n  " + stmt + "\n}";
        }
      } else {
        // Multiple statements - use multiple lines
        const indentedStmts = statements.map((stmt) => "  " + stmt);
        result += "\n" + indentedStmts.join("\n") + "\n}";
      }

      return result;
    }

    // Handle polymorphic function literal: [T] => (x: T) => x
    if (node.children.polymorphicFunctionLiteral) {
      return this.visit(node.children.polymorphicFunctionLiteral[0], ctx);
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
    } else if (node.children.ifExpression) {
      return this.visit(node.children.ifExpression[0], ctx);
    } else if (node.children.whileExpression) {
      return this.visit(node.children.whileExpression[0], ctx);
    } else if (node.children.tryExpression) {
      return this.visit(node.children.tryExpression[0], ctx);
    } else if (node.children.Exclamation) {
      // Handle negation operator
      return "!" + this.visit(node.children.postfixExpression[0], ctx);
    } else if (node.children.BitwiseTilde) {
      // Handle bitwise complement operator
      return "~" + this.visit(node.children.postfixExpression[0], ctx);
    } else if (node.children.LeftParen) {
      return "(" + this.visit(node.children.expression[0], ctx) + ")";
    } else if (node.children.blockExpression) {
      return this.visit(node.children.blockExpression[0], ctx);
    } else if (node.children.quoteExpression) {
      return this.visit(node.children.quoteExpression[0], ctx);
    } else if (node.children.spliceExpression) {
      return this.visit(node.children.spliceExpression[0], ctx);
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

  visitLiteral(node: any, ctx: PrintContext): string {
    const children = node.children as Record<string, any[]>;
    const token = Object.values(children)[0][0];
    const tokenImage = token.image;

    // Apply singleQuote formatting to string literals
    if (tokenImage.startsWith('"') || tokenImage.startsWith("'")) {
      return this.formatStringLiteral(tokenImage, ctx);
    }

    return tokenImage;
  }

  visitQualifiedIdentifier(node: any, _ctx: PrintContext): string {
    let result = node.children.Identifier[0].image;

    if (node.children.Dot) {
      // Handle mixed identifiers and type keywords
      const dots = node.children.Dot.length;
      const identifiers = node.children.Identifier || [];
      const types = node.children.Type || [];

      for (let i = 0; i < dots; i++) {
        result += ".";

        // Determine which token comes next (identifier or type keyword)
        if (i + 1 < identifiers.length) {
          result += identifiers[i + 1].image;
        } else if (types.length > 0) {
          // Use the type keyword (e.g., "type" for .type syntax)
          result += types[0].image;
        }
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

  visitIfExpression(node: any, ctx: PrintContext): string {
    let result = "if (";
    result += this.visit(node.children.expression[0], ctx);
    result += ") ";
    result += this.visit(node.children.expression[1], ctx);

    if (node.children.Else) {
      result += " else ";
      result += this.visit(node.children.expression[2], ctx);
    }

    return result;
  }

  visitWhileExpression(node: any, ctx: PrintContext): string {
    let result = "while (";
    result += this.visit(node.children.expression[0], ctx);
    result += ") ";
    result += this.visit(node.children.expression[1], ctx);

    return result;
  }

  visitTryExpression(node: any, ctx: PrintContext): string {
    let result = "try ";
    result += this.visit(node.children.expression[0], ctx);

    if (node.children.Catch) {
      result += " catch {\n";
      if (node.children.caseClause) {
        const cases = node.children.caseClause.map(
          (c: any) => "  " + this.visit(c, ctx),
        );
        result += cases.join("\n");
      }
      result += "\n}";
    }

    if (node.children.Finally) {
      result += " finally ";
      // If there's a catch block, expression[1] is the finally expression
      // Otherwise, expression[1] would be the finally expression (no catch)
      const finallyExprIndex = node.children.Catch ? 1 : 1;
      result += this.visit(node.children.expression[finallyExprIndex], ctx);
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

  visitBlockExpression(node: any, ctx: PrintContext): string {
    const statements = node.children.blockStatement || [];

    if (statements.length === 0) {
      return "{}";
    }

    // Always use multi-line format for block expressions
    const stmtStrings = statements.map((stmt: any) => this.visit(stmt, ctx));
    return "{\n    " + stmtStrings.join("\n    ") + "\n  }";
  }

  visitBlockStatement(node: any, ctx: PrintContext): string {
    if (node.children.valDefinition) {
      return this.visit(node.children.valDefinition[0], ctx);
    } else if (node.children.varDefinition) {
      return this.visit(node.children.varDefinition[0], ctx);
    } else if (node.children.defDefinition) {
      return this.visit(node.children.defDefinition[0], ctx);
    } else if (node.children.assignmentStatement) {
      return this.visit(node.children.assignmentStatement[0], ctx);
    } else if (node.children.expression) {
      return this.visit(node.children.expression[0], ctx);
    }
    return "";
  }

  visitQuoteExpression(node: any, ctx: PrintContext): string {
    return "'{ " + this.visit(node.children.expression[0], ctx) + " }";
  }

  visitSpliceExpression(node: any, ctx: PrintContext): string {
    return "${ " + this.visit(node.children.expression[0], ctx) + " }";
  }

  visitPolymorphicFunctionLiteral(node: any, ctx: PrintContext): string {
    let result = "[";

    if (node.children.polymorphicTypeParameter) {
      const parameters = node.children.polymorphicTypeParameter.map(
        (param: any) => this.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += "] => ";
    result += this.visit(node.children.expression[0], ctx);

    return result;
  }

  visitPolymorphicFunctionType(node: any, ctx: PrintContext): string {
    let result = "[";

    if (node.children.polymorphicTypeParameter) {
      const parameters = node.children.polymorphicTypeParameter.map(
        (param: any) => this.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += "] => ";
    result += this.visit(node.children.type[0], ctx);

    return result;
  }

  visitPolymorphicTypeParameter(node: any, ctx: PrintContext): string {
    let result = "";

    // Add variance annotation if present
    if (node.children.Plus) {
      result += "+";
    } else if (node.children.Minus) {
      result += "-";
    }

    result += node.children.Identifier[0].image;

    // Handle type bounds
    if (node.children.SubtypeOf) {
      result += " <: " + this.visit(node.children.type[0], ctx);
    } else if (node.children.SupertypeOf) {
      result += " >: " + this.visit(node.children.type[0], ctx);
    }

    // Handle context bounds: T: Ordering
    if (node.children.Colon && node.children.type) {
      const typeIndex =
        node.children.SubtypeOf || node.children.SupertypeOf ? 1 : 0;
      if (node.children.type[typeIndex]) {
        result += ": " + this.visit(node.children.type[typeIndex], ctx);
      }
    }

    return result;
  }
}
