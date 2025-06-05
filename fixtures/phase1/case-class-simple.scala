// Basic case class definition
case class Person(name: String)

// Case class with multiple parameters
case class User(name: String, age: Int, email: String)

// Case class with named arguments usage
val user = User("John", 25, "john@example.com")
val updatedUser = user.copy(name = "Jane", age = 26)