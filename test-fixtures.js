#!/usr/bin/env node
import { execSync } from "child_process";
import { readdirSync, statSync } from "fs";
import { join, extname } from "path";

const pluginPath = "./packages/prettier-plugin-scala/lib/index.js";
const fixturesDir = "./fixtures";

// fixturesディレクトリ内の全ての.scalaファイルを再帰的に取得
function getAllScalaFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const entries = readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (extname(entry) === ".scala") {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

// テスト実行
function testFixtures() {
  console.log("🧪 Testing all Scala fixtures...\n");

  const scalaFiles = getAllScalaFiles(fixturesDir);
  let successCount = 0;
  let failureCount = 0;

  for (const file of scalaFiles) {
    try {
      console.log(`✅ Testing: ${file}`);
      execSync(`npx prettier --plugin ${pluginPath} "${file}"`, {
        stdio: "pipe",
        encoding: "utf8",
      });
      successCount++;
    } catch (error) {
      console.log(`❌ Failed: ${file}`);
      console.log(`   Error: ${error.message.split("\n")[0]}`);
      failureCount++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failure: ${failureCount}`);
  console.log(
    `   📈 Success rate: ${((successCount / (successCount + failureCount)) * 100).toFixed(1)}%`,
  );

  if (failureCount === 0) {
    console.log("\n🎉 All fixtures passed!");
  } else {
    console.log("\n⚠️  Some fixtures failed. Please check the errors above.");
    process.exit(1);
  }
}

// 個別フェーズのテスト
function testPhase(phase) {
  console.log(`🔍 Testing Phase ${phase} fixtures...\n`);

  const phaseDir = join(fixturesDir, `phase${phase}`);
  const scalaFiles = getAllScalaFiles(phaseDir);

  for (const file of scalaFiles) {
    try {
      console.log(`✅ ${file}`);
      const output = execSync(`npx prettier --plugin ${pluginPath} "${file}"`, {
        encoding: "utf8",
      });
      console.log("   Formatted successfully");
    } catch (error) {
      console.log(`❌ ${file}`);
      console.log(`   Error: ${error.message.split("\n")[0]}`);
    }
  }
}

// コマンドライン引数の処理
const args = process.argv.slice(2);
if (args.length > 0) {
  const phase = args[0];
  if (["1", "2", "3"].includes(phase)) {
    testPhase(phase);
  } else {
    console.log("Usage: node test-fixtures.js [1|2|3]");
    console.log("  1, 2, 3: Test specific phase");
    console.log("  no args: Test all fixtures");
  }
} else {
  testFixtures();
}
