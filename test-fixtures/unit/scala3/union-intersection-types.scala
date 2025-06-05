// Scala 3 union and intersection types test file

// Basic union types
val stringOrInt: String | Int = "hello"
val boolOrNum: Boolean | Double = true

// Multiple union types
val multiUnion: String | Int | Boolean = 42
val complexUnion: List[String] | Map[String, Int] | Set[Boolean] = List("a")

// Parenthesized union types
val parenUnion: (String | Int) = "test"
val funcWithUnion: (String | Int) => Boolean = _.toString.nonEmpty

// Union types with generics
val listUnion: List[String | Int] = List("hello", 42)
val optionUnion: Option[String | Int] = Some("value")

// Basic intersection types
trait A
trait B
val intersection: A & B = new A with B

// Complex intersection types
trait Named { def name: String }
trait Aged { def age: Int }
val person: Named & Aged = new Named with Aged {
  def name = "John"
  def age = 30
}

// Function types with union/intersection
val func1: (String | Int) => String = _.toString
val func2: String => (Int | Boolean) = s => s.length
val func3: (A & B) => String = _.toString

// Type aliases with union/intersection
type StringOrInt = String | Int
type NamedAndAged = Named & Aged

// Method parameters with union types
def processValue(value: String | Int): String = value.toString
def complexMethod(data: List[String | Int], flag: Boolean | String): Unit = ()

// Return types with union/intersection
def getValue(): String | Int = if (scala.util.Random.nextBoolean()) "hello" else 42
def getInterface(): Named & Aged = person