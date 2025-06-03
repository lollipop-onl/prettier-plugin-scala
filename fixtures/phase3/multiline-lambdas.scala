// Test multiline lambda expressions (block form)

// Simple block lambda
val result1 = list.map { x => x * 2 }

// Multiline lambda with statements
val result2 = list.map { x =>
  val doubled = x * 2;
  doubled + 1
}

// Lambda with multiple statements  
val result3 = numbers.filter { n =>
  val isEven = n % 2 == 0;
  val isPositive = n > 0;
  isEven && isPositive
}