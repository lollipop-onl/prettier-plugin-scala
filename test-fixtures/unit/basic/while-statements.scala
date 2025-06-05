// Test while statements
var i = 0
while (i < 10) {
  println(i)
  i += 1
}

// While with single statement
while (running) doWork()

// Nested while
var x = 0
while (x < 5) {
  var y = 0
  while (y < 3) {
    println(s"($x, $y)")
    y += 1
  }
  x += 1
}

// While with complex condition
while (status == "running" && attempts < maxAttempts) {
  val result = tryOperation()
  if (result.isSuccess) status = "completed"
  else attempts += 1
}