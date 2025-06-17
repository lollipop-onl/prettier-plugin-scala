// Simple lambda
numbers.map { n => n * 2 }

// Multi-parameter lambda  
pairs.map { case (x, y) => x + y }

// Nested lambda
matrix.map { row => row.map { cell => cell.toDouble } }

// Lambda with type annotation
strings.filter { s: String => s.length > 5 }