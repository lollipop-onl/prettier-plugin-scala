// Basic opaque types
opaque type UserId = String
opaque type Email = String

// Opaque type with type parameters
opaque type Id[T] = T
opaque type Container[+T] = List[T]

// Opaque type with bounds
opaque type Handle[T <: AnyRef] = T
opaque type EventId[T <: Event] = UUID

// Opaque type with complex types
opaque type Config = Map[String, List[String]]
opaque type Pair[A, B] = (A, B)

// Opaque type with union types
opaque type StringOrInt = String | Int

// Opaque type with intersection types
opaque type Combined = Named & Aged

// Mixed with regular types
type RegularType = String | Int
opaque type OpaqueType = String