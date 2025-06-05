// Basic context function type
type Executable[T] = ExecutionContext ?=> T

// Context function with parameters  
def run[T](body: ExecutionContext ?=> T): T = ???

// Context function lambda
val f: String ?=> Int = str => str.length

// Nested context functions
type Nested = String ?=> Int ?=> Boolean

// Context function with using parameters
def execute(using ctx: ExecutionContext): String ?=> Int = ???

// Multiple context function definitions
type Ctx1 = String ?=> Int
type Ctx2 = Int ?=> Boolean

// Context function in val definition
val handler: Logger ?=> String ?=> Unit = { msg => logger.info(msg) }

// Context function with complex return type
def async[T]: ExecutionContext ?=> Future[T] = future {
  // implementation
}

// Context function with type parameters
type Handler[A, B] = A ?=> B

// Implicit context function usage
def withContext[T](body: ExecutionContext ?=> T)(using ctx: ExecutionContext): T = body

// Chained context functions
val chain: Database ?=> Logger ?=> String ?=> Unit = { query =>
  logger.info(s"Executing: $query")
  database.execute(query)
}