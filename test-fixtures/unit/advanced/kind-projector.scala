// Basic Kind Projector notation
type StringMap[V] = Map[String, *]
type ListFunctor = List[*]

// Multiple placeholders
type Function2Partial[R] = Function2[*, *, R]
type EitherLeft[R] = Either[*, R]

// Nested Kind Projector
type NestedMap = Map[String, List[*]]
type ComplexType[A] = List[Map[String, Either[A, *]]]

// Mixed with concrete types
type MixedTypes = Map[String, Either[Int, *]]

// With type bounds
type BoundedMap[T <: AnyRef] = Map[T, *]

// With variance annotations
type CovariantMap[+V] = Map[String, *]

// In class definitions
class Container[F[_]] extends Functor[*]

// In method signatures
class Test {
  def map[F[_]]: F[*] = ???
  def flatMap[G[_]]: List[G[*]] = ???
}