// 文字列補間の詳細テスト
val name = "Alice"
val score = 95.5

val simple = s"Hello $name"
val expression = s"Score: ${score + 5}"
val formatted = f"Percentage: $score%.1f%%"
val multiline = s"""
  Name: $name
  Score: ${score * 2}
"""