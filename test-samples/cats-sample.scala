// Cats functional programming sample
import cats.implicits._
import cats.data.{EitherT, OptionT}
import cats.effect.{IO, IOApp}

object CatsExample extends IOApp.Simple {
  
  // Type classes example
  trait Show[A] {
    def show(a: A): String
  }
  
  object Show {
    def apply[A](implicit ev: Show[A]): Show[A] = ev
    
    implicit val stringShow: Show[String] = (a: String) => s"'$a'"
    implicit val intShow: Show[Int] = (a: Int) => a.toString
  }
  
  // Extension method using cats syntax
  implicit class ShowOps[A](a: A) {
    def show(implicit ev: Show[A]): String = ev.show(a)
  }
  
  // Monad transformers
  type Result[A] = EitherT[IO, String, A]
  
  def fetchUser(id: Int): Result[User] = {
    if (id > 0) EitherT.rightT(User(id, s"User$id"))
    else EitherT.leftT("Invalid user ID")
  }
  
  def fetchProfile(user: User): Result[Profile] = {
    EitherT.rightT(Profile(user.id, s"Profile of ${user.name}"))
  }
  
  case class User(id: Int, name: String)
  case class Profile(userId: Int, description: String)
  
  // For comprehension with monad transformers
  val program: Result[String] = for {
    user <- fetchUser(42)
    profile <- fetchProfile(user)
  } yield s"${user.show} has ${profile.description}"
  
  def run: IO[Unit] = {
    program.value.flatMap {
      case Right(result) => IO.println(s"Success: $result")
      case Left(error) => IO.println(s"Error: $error")
    }
  }
}