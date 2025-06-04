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