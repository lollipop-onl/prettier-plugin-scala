enum Color {
  case Red
  case Green
  case Blue
}

enum Planet(mass: Double, radius: Double) {
  case Mercury(3.303e+23, 2.4397e6)
  case Venus(4.869e+24, 6.0518e6)
  case Earth(5.976e+24, 6.37814e6)
}

enum Option[+T] {
  case Some(value: T)
  case None
}