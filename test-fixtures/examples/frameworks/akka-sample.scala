// Akka Actor System sample code
import akka.actor.{Actor, ActorLogging, ActorRef, ActorSystem, Props}
import akka.pattern.ask
import akka.util.Timeout
import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._
import scala.util.{Success, Failure}

object AkkaExample extends App {
  
  class GreeterActor extends Actor with ActorLogging {
    def receive = {
      case Greet(name) =>
        log.info(s"Greeting $name")
        sender() ! s"Hello, $name!"
      case _ =>
        log.warning("Unknown message received")
    }
  }
  
  case class Greet(name: String)
  
  implicit val system: ActorSystem = ActorSystem("GreeterSystem")
  implicit val ec: ExecutionContext = system.dispatcher
  implicit val timeout: Timeout = Timeout(5.seconds)
  
  val greeter: ActorRef = system.actorOf(Props[GreeterActor], "greeter")
  
  val futureGreeting: Future[Any] = greeter ? Greet("Akka")
  
  futureGreeting.onComplete {
    case Success(message) => println(s"Received: $message")
    case Failure(exception) => println(s"Failed: ${exception.getMessage}")
  }
  
  Thread.sleep(1000)
  system.terminate()
}