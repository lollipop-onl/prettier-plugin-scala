// Basic inline and transparent keywords
inline def debug(msg: String): Unit = println(msg)
transparent def identity[T](x: T): T = x

// Inline values
inline val MAX_SIZE = 1000
inline val DEBUG_MODE = true

// Transparent values
transparent val defaultConfig = Config.default

// Combined modifiers
inline transparent def combine(x: Int, y: Int): Int = x + y
private inline def helper(s: String): String = s.toUpperCase
final transparent def process[T](value: T): T = value

// Class definitions
inline class Wrapper(val value: Int) extends AnyVal
transparent class Container[T](val data: T)

// Given definitions
inline given Ord[Int] = intOrdering
transparent given Conversion[String, Int] = stringToInt

// Method definitions with parameters
inline def calculate(x: Double, y: Double): Double = x * y
transparent def asString[T](value: T): String = value.toString