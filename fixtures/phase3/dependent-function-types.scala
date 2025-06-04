// Basic dependent function types
type Identity = (x: String) => x.type
type Transform = (x: Int) => List[x.type]

// Multiple parameters
type Binary = (x: Int, y: String) => Map[x.type, y.type]
type Triple = (a: String, b: Int, c: Boolean) => Tuple3[a.type, b.type, c.type]

// Complex parameter types
type Complex = (list: List[String]) => Vector[list.type]
type Generic = (x: Option[Int]) => Container[x.type]

// Union and intersection types
type UnionDep = (x: String | Int) => List[x.type]
type IntersectionDep = (x: Named & Aged) => Container[x.type]

// Nested dependent function types
type Nested = (x: Int) => (y: String) => Map[x.type, y.type]
type HigherOrder = (f: (x: Int) => String) => f.type

// No parameters
type NoParams = () => String
type Unit = () => Unit

// Returning simple types
type Simple = (x: Int) => String
type Constant = (x: Any) => Int

// Tuple parameters
type TupleParam = (pair: (Int, String)) => List[pair.type]
type ComplexTuple = (data: (String, List[Int], Option[Boolean])) => Vector[data.type]