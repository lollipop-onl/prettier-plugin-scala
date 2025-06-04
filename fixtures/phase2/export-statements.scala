// Scala 3 export statements test file
// Basic export
// Export with specific selectors
// Export with renaming
// Export with exclusion
// Export given instances
// Export only given instances
// Multiple nested export
// Complex export with package path
export mypackage._
export mypackage.{A, B, C}
export mypackage.{A => RenamedA, B}
export mypackage.{A => _, B}
export mypackage.{given, _}
export mypackage.given
export scala.collection.{List, Map => ScalaMap}
export cats.effect.{IO, Resource => CatsResource}


