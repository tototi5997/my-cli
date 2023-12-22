#!/usr/bin/env node
const { program } = require("commander")
const chalk = require("chalk")
const minimist = require("minimist")
const packageJson = require("../package.json")

program.version(packageJson.version).usage(`${chalk.green("<command>")} [options]`)

program
  .command("create <project-name>") // <>必须输入的恶参数，[]可以选择输入的参数
  .description("create a new project")
  .option("-d, --default", "使用默认的预设")
  .option("-f, --force", "强制性覆盖创建")
  .option("-p, --preset", "设置预设")
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow("检测到您输入了多个名称，将以第一个参数作为项目名"))
    }
    require("../lib/create")(name, options)
    // require("../lib/create")
  })

// 创建检查命令
program
  .command("doctor")
  .description("check the environment")
  .action(() => {
    require("../lib/checkEnv")()
  })

program
  .command("tree")
  .description("view tree")
  .option("-d, --deep", "tree deep")
  .action((_, options) => {
    console.log(options.deep)
    require("../utils/tree")(process.cwd(), '', 0)
  })

program.parse(process.argv)
