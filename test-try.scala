val result = try {
  riskyOperation()
} catch {
  case e: IOException => "IO Error"
  case e: Exception => "General Error"
} finally {
  cleanup()
}