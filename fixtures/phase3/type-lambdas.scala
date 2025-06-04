// Basic type lambda
type Identity = [X] =>> X
type ConstFunction = [X, Y] =>> X

// Type lambda with variance annotations
type CovariantFunction = [+X] =>> List[X]
type ContravariantFunction = [-X] =>> Function[X, String]

// Type lambda with type bounds
type BoundedFunction = [X <: AnyRef] =>> Option[X]
type LowerBoundedFunction = [X >: Nothing] =>> List[X]

// Complex type lambda with multiple constraints
type ComplexFunction = [+X <: AnyRef, -Y >: Nothing] =>> Map[X, Y]

// Nested type lambda
type NestedFunction = [F[_]] =>> [X] =>> F[X]

// Type lambda with union and intersection types
type UnionFunction = [X] =>> X | String
type IntersectionFunction = [X] =>> X & Serializable

// Type lambda in higher-kinded context
type MyTypeFunction[F[_]] = [X] =>> F[X]
type BinaryTypeFunction = [X, Y] =>> Map[X, Y]

// Type lambda with tuple result
type SwapFunction = [X, Y] =>> (Y, X)