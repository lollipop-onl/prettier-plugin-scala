package com.example.advanced

trait DataProcessor[T] {
  def process(data: T): T
}

case class User(name: String, age: Int, email: String)

class UserService extends DataProcessor[User] {
  override def process(user: User): User = {
    if (user.age >= 18) {
      user.copy(name = user.name.toUpperCase)
    } else {
      user
    }
  }
  
  def validateUser(user: User): Boolean = {
    user.name.nonEmpty && user.age > 0 && user.email.contains("@")
  }
}

object UserApp {
  def main(args: Array[String]): Unit = {
    val users = List(
      User("Alice", 25, "alice@example.com"),
      User("Bob", 16, "bob@example.com")
    )
    
    val service = new UserService()
    val processedUsers = users.map(service.process)
    
    processedUsers.foreach { user =>
      println(s"Processed user: ${user.name}, age: ${user.age}")
    }
  }
}