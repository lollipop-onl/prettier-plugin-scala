// Phase 2: 高度な機能のテスト（シンプル版）

// ジェネリクス・型パラメータ
class Box[T](value: T)
class Container[T <: AnyRef](item: T)
class Wrapper[T >: Nothing](content: T)
def identity[T](x: T): T = x
trait Repository[T]

// ケースクラス
case class User(name: String, email: String)
case class Product[T](id: Int, value: T)

// new演算子
val person = new Person("Alice", 30)
val numbers = new List[Int]()
val empty = new StringBuilder()

// パターンマッチング
def describe(x: Any): String = x match {
  case 1 => "one"
  case 2 => "two"
  case n if n > 10 => "big number"
  case _ => "something else"
}

// For内包表記
val squares = for (i <- 1 to 10) yield i * i
val evens = for (i <- 1 to 20 if i % 2 == 0) yield i

// メソッド呼び出しとラムダ式
val doubled = List(1, 2, 3).map(x => x * 2)

// 中置記法
val range = 1 to 10