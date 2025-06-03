// Test auxiliary constructors (def this)
class Rectangle(width: Double, height: Double) {
  def this(size: Double) = this(size, size)
  
  def this() = this(1.0)
}

// Simple auxiliary constructor with multiple parameters
class Point(x: Double, y: Double) {
  def this() = this(0.0, 0.0)
  def this(x: Double) = this(x, 0.0)
}

// Auxiliary constructor with different parameter names
class Person(firstName: String, lastName: String) {
  def this(fullName: String) = this(fullName, "")
}

// Chain of auxiliary constructors
class Book(title: String, author: String, year: Int) {
  def this(title: String, author: String) = this(title, author, 2024)
  def this(title: String) = this(title, "Unknown")
  def this() = this("Untitled")
}