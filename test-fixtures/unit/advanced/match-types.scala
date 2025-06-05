// Basic match types
type Elem[X] = X match {
  case String => Char
  case Array[t] => t
}

// Complex match type with multiple cases
type Flatten[X] = X match {
  case Array[Array[t]] => Array[t]
  case Array[t] => Array[t]
  case t => t
}

// Match type with generic patterns
type Head[X] = X match {
  case List[h] => h
  case EmptyTuple => Nothing
}

// Match type with union results
type StringOrChar[X] = X match {
  case String => Char
  case Int => String | Char
}

// Match type with intersection results
type Combined[X] = X match {
  case String => Named & Aged
  case Int => String
}

// Match type with complex input
type Result[X] = List[X] | Option[X] match {
  case List[String] => Char
  case Option[Int] => Boolean
}

// Single case match type
type Single[X] = X match { case Any => String }