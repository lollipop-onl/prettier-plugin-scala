import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Complex annotations parsing", () => {
  it("should parse basic annotation", () => {
    const code = `@Test
class MyTest`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse annotation with single parameter list", () => {
    const code = `@Entity(name = "users")
class User`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse annotation with empty parameter list", () => {
    const code = `@Inject()
class MyService`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse Play Framework DI constructor annotation", () => {
    const code = `class MyController @Inject()(val components: ControllerComponents)`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse multiple annotations", () => {
    const code = `@Entity(name = "users")
@Table(schema = "public")
@JsonIgnoreProperties(ignoreUnknown = true)
class User`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse complex annotation arguments", () => {
    const code = `@JsonProperty(value = "user_name", required = true)
val userName: String`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse annotations with nested expressions", () => {
    const code = `@RequestMapping(value = Array("/users"), method = Array(GET, POST))
def users(): String`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse Play Framework controller with DI", () => {
    const code = `@Singleton
class UserController @Inject()(
  val controllerComponents: ControllerComponents,
  val userService: UserService
) extends BaseController`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse method-level annotations", () => {
    const code = `class UserService {
  @Transactional
  @PreAuthorize("hasRole('ADMIN')")
  def deleteUser(id: Long): Unit = ???
}`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse multiple parameter lists in annotation (new feature)", () => {
    const code = `@Component()(val config: Config)
class ConfigService`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse complex DI annotation with multiple parameters", () => {
    const code = `@Service()(val db: Database, var cache: Cache)
class DataService`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse annotation with parameter defaults", () => {
    const code = `@Component()(val timeout: Int = 5000, val retries: Int = 3)
class HttpService`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse real Play Framework controller pattern", () => {
    const code = `@Singleton
class UserController @Inject()(
  val components: ControllerComponents,
  val userService: UserService
) extends BaseController {
  def index = Action { Ok("Hello") }
}`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });
});
