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

  it("should parse annotation with multiple parameter lists", () => {
    const code = `@Inject()()
class MyService`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse Play Framework DI annotation", () => {
    const code = `@Inject()(val components: ControllerComponents)
class MyController`;
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
});
