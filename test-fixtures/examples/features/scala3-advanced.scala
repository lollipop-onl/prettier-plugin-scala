// Scala 3 advanced features sample
import scala.compiletime.{erasedValue, summonInline}

// Enum with ADT
enum Color(val rgb: Int):
  case Red extends Color(0xFF0000)
  case Green extends Color(0x00FF00) 
  case Blue extends Color(0x0000FF)
  case Custom(override val rgb: Int) extends Color(rgb)

// Union types
type StringOrInt = String | Int
type ID = StringOrInt

// Intersection types  
trait Named:
  def name: String

trait Aged:
  def age: Int

type Person = Named & Aged

// Opaque types
opaque type UserId = Long
object UserId:
  def apply(value: Long): UserId = value
  extension (id: UserId) def value: Long = id

// Extension methods
extension (s: String)
  def isBlank: Boolean = s.trim.isEmpty
  def lines: Array[String] = s.split("\n")

extension [T](list: List[T])
  def second: Option[T] = list.drop(1).headOption

// Given instances
given Conversion[String, UserId] = UserId(_)

given Ordering[Color] = Ordering.by(_.rgb)

// Context functions
type Executable[T] = ExecutionContext ?=> T

def runAsync[T](computation: Executable[T])(using ec: ExecutionContext): T =
  computation

// Match types
type Elem[X] = X match
  case String => Char
  case Array[t] => t
  case Iterable[t] => t

// Type lambdas
type MapK[F[_]] = [X] =>> F[Map[String, X]]

// Inline and transparent
inline def debug[T](inline value: T): T =
  println(s"Debug: $value")
  value

transparent inline def max(inline x: Int, inline y: Int): Int =
  if x > y then x else y

// Quotes and splices for macros (simplified)
import scala.quoted.*

inline def show[T](inline expr: T): String = 
  ${ showImpl('expr) }

def showImpl[T](expr: Expr[T])(using Quotes): Expr[String] =
  '{ s"Expression: ${$expr}" }

@main def runAdvancedFeatures(): Unit =
  val color = Color.Red
  val id: UserId = "123"
  val person = new Named with Aged:
    def name = "Alice"
    def age = 30
  
  println(s"Color: ${color.rgb}")
  println(s"ID: ${id.value}")
  println(s"Person: ${person.name}, age ${person.age}")
  
  val text = "Hello\nWorld"
  println(s"Lines: ${text.lines.mkString(", ")}")
  
  val numbers = List(1, 2, 3, 4, 5)
  println(s"Second: ${numbers.second}")
  
  val debugValue = debug(42)
  val maxValue = max(10, 20)
  
  println(show(debugValue + maxValue))