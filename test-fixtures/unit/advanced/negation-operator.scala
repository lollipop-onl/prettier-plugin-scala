// Comprehensive negation operator tests
// Basic negation
val notTrue = !true
val notFalse = !false
val notEmpty = !list.isEmpty
val notNull = value != null && !value.isBlank

// Simple cases (merged from negation-simple.scala)
val a = !true
val b = !false
val c = !isEmpty
val d = !(x > 5)
val e = !x.isEmpty
val f = x != null && !x.isBlank

// Complex negation
val complexNegation = !(a > 5 && b < 10)
val doubleNegation = !!flag

// Negation with logical operators
val combined = !a && b || !c
val precedence = !(x || y) && !z