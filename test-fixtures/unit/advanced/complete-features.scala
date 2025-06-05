// Phase 3: 完全版機能のテスト

// 論理演算子
val condition1 = x && y
val condition2 = a || b
val complex = x && y || z

// クラス内メンバー初期化（apply式）
class DataManager {
  private val cache = Map[String, User]()
  val defaultNumbers = List(1, 2, 3)
  var counter = 0
}

// 文字列補間
val name = "John"
val age = 25
val greeting = s"Hello $name"
val formatted = f"Score: $age%.2f"
val complex = s"User $name scored ${age} points!"

// 補助コンストラクタ
class Person(name: String, age: Int) {
  def this(name: String) = this(name, 0)
  def this() = this("Unknown", 0)
}

// 高度な中置記法
val list = List(1, 2, 3)
val appended = list :+ 4
val prepended = 0 :: list
val combined = list ++ List(4, 5, 6)

// given定義（Scala 3）
given stringValue: String = "default"

// 型パラメータ付きコンストラクタ
val users = List[User]()
val cache = Map[String, List[Int]]()
val nested = Map[String, Map[Int, String]]()