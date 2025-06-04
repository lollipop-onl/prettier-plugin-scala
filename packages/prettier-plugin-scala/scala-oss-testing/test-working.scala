package test

case class Person(name: String, age: Int) {
  def isAdult: Boolean = age >= 18
  
  def greet(): String = s"Hello, I'm $name"
}

object PersonService {
  given defaultName: String = "Anonymous"
  
  def create(name: String, age: Int): Person = {
    Person(name, age)
  }
}