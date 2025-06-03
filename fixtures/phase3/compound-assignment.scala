// Test compound assignment operators
object CompoundAssignmentTest {
  def test(): Unit = {
    var x = 10
    x += 5      // Addition assignment
    x -= 3      // Subtraction assignment
    x *= 2      // Multiplication assignment
    x /= 4      // Division assignment
    x %= 3      // Modulo assignment
    
    // With complex expressions
    var y = 20
    y += x * 2
    y -= (x + 5)
    
    // Regular assignment for comparison
    x = x + 1
    y = y * 2
  }
}