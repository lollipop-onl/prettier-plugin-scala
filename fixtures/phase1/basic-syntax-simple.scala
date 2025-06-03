// Phase 1: 基本構文のテスト（シンプル版）
package com.example

import scala.collection.mutable

// 基本的なクラス定義
class Person(name: String, age: Int) {
  def getName(): String = name
  val isAdult: Boolean = age >= 18
}

// オブジェクト定義
object Main {
  def main(args: Array[String]): Unit = {
    println("Hello, World!")
  }
}

// トレイト定義
trait Drawable {
  def draw(): Unit
}

// 変数定義
val globalValue = 42
var globalVariable = "hello"

// メソッド定義
def add(a: Int, b: Int): Int = a + b

// アクセス修飾子
private class Internal
protected val protectedValue = 10
final class FinalClass