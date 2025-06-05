// 実世界のScalaコード例（シンプル版）
package com.example.service

import scala.collection.mutable

// メインのサービスクラス
class UserService(database: Database) {
  private val cache = Map[String, User]()
  
  def this() = this(new InMemoryDatabase())
}

// ケースクラス（データモデル）
case class User(name: String, email: String, age: Int) {
  val id: String = java.util.UUID.randomUUID().toString
  
  def isAdult: Boolean = age >= 18
}

object User {
  given userOrdering: String = "default"
}

// トレイト（リポジトリパターン）
trait Database

// 実装クラス
class InMemoryDatabase extends Database {
  private val storage = Map[String, User]()
}

// ジェネリッククラス（キャッシュサービス）
class Cache[T <: AnyRef](maxSize: Int) {
  private val storage = mutable.LinkedHashMap[String, T]()
}

// パターンマッチング用のsealed trait
sealed trait Result[T]
case class Success[T](value: T) extends Result[T]
case class Failure(error: String) extends Result[String]

// 設定用ケースクラス
case class DatabaseConfig(
  host: String,
  port: Int,
  username: String,
  maxConnections: Int = 10
)