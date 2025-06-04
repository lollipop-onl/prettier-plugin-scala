// Advanced union and intersection types test

// Multiple union types
type ThreeTypes = String | Int | Boolean

// Intersection types  
type Combined = Named & Aged

// Parenthesized types
type ParenUnion = (String | Int)
type ParenIntersection = (Named & Aged)

// Complex combinations
type ComplexType = (String | Int) & (Named | Aged)
type NestedUnion = List[String | Int] | Map[String, Boolean]

// Generic type definitions
type Result[T] = T | String
type Container[A, B] = A | B