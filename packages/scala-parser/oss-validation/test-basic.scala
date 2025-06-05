package com.example

class BasicClass {
  val name = "Example"
  def greet(message: String) = s"Hello, $message"
}

object BasicObject {
  def main(args: Array[String]): Unit = {
    val instance = new BasicClass()
    println(instance.greet("World"))
  }
}