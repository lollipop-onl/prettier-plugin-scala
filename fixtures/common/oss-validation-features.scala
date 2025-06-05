// Real-world features validated from OSS projects
package com.example.advanced

import scala.concurrent.ExecutionContext

// Case class with Greek letters
case class User(name: String, age: Int, email: String)

// Implicit class with named arguments
implicit class RichUser(user: User) {
  def updateProfile(): User = user.copy(name = "Updated")
}

// Usage combining all features
object ProcessorApp {
  implicit val ec: ExecutionContext = ExecutionContext.global
  
  val λ = (x: String) => x.toUpperCase
  val user = User("Alice", 25, "alice@example.com")
  
  val updatedUser = user.updateProfile()
  val processedName = λ(user.name)
}