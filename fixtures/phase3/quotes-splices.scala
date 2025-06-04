// Basic quote expression
val quoted = '{ 1 + 2 }

// Basic splice expression
val spliced = ${ x + y }

// Quote with identifier
val expr = '{ println("hello") }

// Splice with variable
val result = ${ myVariable }

// Quote with method call
val methodQuote = '{ list.map(toString) }

// Splice in method parameter
def test(x: Int) = println(${ x })

// Nested quotes and splices
val nested = '{ ${ x } + 1 }

// Quote with complex expression
val complex = '{ 
  val x = 42
  x * x + math.sqrt(x)
}

// Splice with function call
val funcSplice = ${ compute(x, y) }

// Quote in return statement
def makeQuote(x: Int): Expr[Int] = '{ x * 2 }

// Multiple quotes and splices
val multi = '{ 
  val a = ${ expr1 }
  val b = ${ expr2 }
  a + b
}

// Quote with arithmetic operations
val arithmetic = '{ (x + y) * (x - y) }

// Quote with type annotations
val typed: Expr[String] = '{ "hello, " + ${ name } }

// Splice in pattern matching
${ x } match {
  case 0 => '{ "zero" }
  case n => '{ s"number: $n" }
}

// Quote with lambda
val lambdaQuote = '{ (x: Int) => x * x }

// Complex macro example
inline def power(n: Int, x: Expr[Int]): Expr[Int] =
  if n == 0 then '{ 1 }
  else '{ ${ x } * ${ power(n - 1, x) } }