// Implicit val definition
implicit val context: ExecutionContext = ExecutionContext.global

// Implicit parameter in method
def compute(implicit ctx: ExecutionContext): Future[Int] = ???

// Implicit class definition
implicit class RichString(s: String) {
  def reverse: String = s.reverse
}

// Implicit def conversion
implicit def stringToInt(s: String): Int = s.toInt