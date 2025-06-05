// Test if-else statements
val result = if (x > 0) "positive" else "non-positive"

// Nested if-else
val grade = if (score >= 90) "A"
else if (score >= 80) "B"
else if (score >= 70) "C"
else "F"

// If without else
if (condition) doSomething()

// If-else with blocks
val message = if (status == "success") {
  println("Operation completed")
  "Success!"
} else {
  println("Operation failed")
  "Error!"
}

// Combined with pattern matching
val result = if (x > 0) {
  x match {
    case 1 => "one"
    case _ => "other positive"
  }
} else "non-positive"