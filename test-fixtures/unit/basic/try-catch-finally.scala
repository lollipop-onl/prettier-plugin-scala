// Test try-catch-finally statements
val result = try {
  riskyOperation()
} catch {
  case e: IOException => "IO Error"
  case e: Exception => "General Error"
} finally {
  cleanup()
}

// Try without catch
try {
  doSomething()
} finally {
  closeResources()
}

// Try with just catch
val value = try {
  Integer.parseInt(str)
} catch {
  case _: NumberFormatException => 0
}

// Nested try-catch
try {
  val data = try {
    readFromFile()
  } catch {
    case e: FileNotFoundException => defaultData
  }
  processData(data)
} catch {
  case e: ProcessingException => handleError(e)
}