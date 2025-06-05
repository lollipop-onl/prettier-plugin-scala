// ZIO functional effects sample
import zio._
import zio.http._
import zio.json._

object ZIOExample extends ZIOAppDefault {

  case class User(id: Long, name: String, email: String)
  
  object User {
    implicit val encoder: JsonEncoder[User] = DeriveJsonEncoder.gen[User]
    implicit val decoder: JsonDecoder[User] = DeriveJsonDecoder.gen[User]
  }

  // Service definition with ZLayer
  trait UserService {
    def getUser(id: Long): IO[UserError, User]
    def createUser(user: User): IO[UserError, User]
    def updateUser(id: Long, user: User): IO[UserError, User]
    def deleteUser(id: Long): IO[UserError, Unit]
  }

  case class UserError(message: String) extends Exception(message)

  // Service implementation
  case class UserServiceLive() extends UserService {
    private val users = Ref.make(Map.empty[Long, User])

    def getUser(id: Long): IO[UserError, User] = 
      for {
        userMap <- users.get
        user <- ZIO.fromOption(userMap.get(id))
                  .orElseFail(UserError(s"User not found: $id"))
      } yield user

    def createUser(user: User): IO[UserError, User] =
      for {
        _ <- users.update(_ + (user.id -> user))
      } yield user

    def updateUser(id: Long, user: User): IO[UserError, User] =
      for {
        _ <- getUser(id) // Check if user exists
        _ <- users.update(_ + (id -> user.copy(id = id)))
      } yield user.copy(id = id)

    def deleteUser(id: Long): IO[UserError, Unit] =
      for {
        _ <- getUser(id) // Check if user exists
        _ <- users.update(_ - id)
      } yield ()
  }

  // ZLayer for dependency injection
  val userServiceLayer: ZLayer[Any, Nothing, UserService] =
    ZLayer.succeed(UserServiceLive())

  // HTTP routes
  val routes: Routes[UserService, Nothing] = Routes(
    Method.GET / "users" / long("id") -> handler { (id: Long, req: Request) =>
      for {
        userService <- ZIO.service[UserService]
        user <- userService.getUser(id)
                  .mapError(err => Response.text(err.message).status(Status.NotFound))
      } yield Response.json(user.toJson)
    },
    
    Method.POST / "users" -> handler { (req: Request) =>
      for {
        userService <- ZIO.service[UserService]
        body <- req.body.asString
        user <- ZIO.fromEither(body.fromJson[User])
                  .mapError(err => Response.text(s"Invalid JSON: $err").status(Status.BadRequest))
        created <- userService.createUser(user)
                     .mapError(err => Response.text(err.message).status(Status.InternalServerError))
      } yield Response.json(created.toJson).status(Status.Created)
    }
  )

  // Application entry point
  def run: ZIO[Any, Throwable, Unit] = {
    val server = Server.serve(routes)
    
    server.provide(
      Server.default,
      userServiceLayer
    )
  }
}