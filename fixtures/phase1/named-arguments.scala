// Method call with named arguments
obj.method(name = "value", count = 42)

// Constructor with named arguments
val config = AppConfig(
  host = "localhost",
  port = 8080,
  timeout = 30
)

// Case class copy with named arguments
if (user.age >= 18) {
  user.copy(name = user.name.toUpperCase)
} else {
  user
}