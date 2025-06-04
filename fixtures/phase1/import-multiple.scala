// Test multiple import syntax
import scala.collection.{List, Map, Set}
import cats.{Functor, Monad, Applicative}
import java.util.{ArrayList, HashMap => JavaHashMap, HashSet}

// Import with wildcard and specific imports
import scala.collection.{mutable, _}

// Import with rename
import java.util.{List => JList, Map => JMap}

// Import with hide
import scala.collection.{List => _, _}

// Single import (should still work)
import scala.math.Pi
import scala.io._