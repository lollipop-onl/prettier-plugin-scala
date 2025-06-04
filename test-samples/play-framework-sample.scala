// Play Framework controller sample
package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class HomeController @Inject()(
  val controllerComponents: ControllerComponents
)(implicit ec: ExecutionContext) extends BaseController {

  implicit val userWrites: Writes[User] = Json.writes[User]
  implicit val userReads: Reads[User] = Json.reads[User]

  case class User(id: Long, name: String, email: String)

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def createUser() = Action.async(parse.json) { implicit request =>
    request.body.validate[User].fold(
      errors => {
        Future.successful(BadRequest(Json.obj("error" -> "Invalid JSON")))
      },
      user => {
        // Simulate database save
        Future.successful(Created(Json.toJson(user)))
      }
    )
  }

  def getUser(id: Long) = Action.async { implicit request =>
    // Simulate database lookup
    val user = User(id, s"User$id", s"user$id@example.com")
    Future.successful(Ok(Json.toJson(user)))
  }

  def updateUser(id: Long) = Action.async(parse.json) { implicit request =>
    request.body.validate[User].fold(
      errors => Future.successful(BadRequest(Json.obj("error" -> "Invalid JSON"))),
      user => {
        val updatedUser = user.copy(id = id)
        Future.successful(Ok(Json.toJson(updatedUser)))
      }
    )
  }

  def deleteUser(id: Long) = Action.async { implicit request =>
    // Simulate database delete
    Future.successful(NoContent)
  }
}