// Test annotations
@Test
def testMethod(): Unit = {}

@RequestMapping("/api/users")
@ResponseBody
class UserController {}

@Deprecated("Use newMethod instead")
@Since("1.0")
def oldMethod(): String = "old"

@Inject()
@Named("database")
val dbService: DatabaseService = null

@JsonProperty("user_name")
@NotNull
var userName: String = ""

// Annotation with parameters
@SpringBootApplication(scanBasePackages = Array("com.example"))
class Application {}

// Multiple annotations on the same line
@Entity @Table(name = "users") @NamedQuery(name = "User.findAll", query = "SELECT u FROM User u")
class User {}