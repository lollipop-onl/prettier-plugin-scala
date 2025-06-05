package com.example.medium

class Calculator {
  def add(a: Int, b: Int): Int = a + b
  
  def multiply(a: Int, b: Int): Int = {
    a * b
  }
  
  def processNumbers(numbers: List[Int]): List[Int] = {
    numbers.map(x => x * 2)
  }
}

object MathUtils {
  def factorial(n: Int): Int = {
    if (n <= 1) 1 else n * factorial(n - 1)
  }
  
  def isEven(n: Int): Boolean = n % 2 == 0
  
  def main(args: Array[String]): Unit = {
    val calc = new Calculator()
    println(calc.add(5, 3))
    println(calc.multiply(4, 7))
    println(factorial(5))
  }
}