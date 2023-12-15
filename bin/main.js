#!/usr/bin/env node
const { program } = require("commander")
const chalk = require("chalk")
const minimist = require("minimist")
const packageJson = require("../package.json")

const camelize = require("../utils/camelize")
const cleanArgs = require("../utils/clean-args")

program.version(packageJson.version).usage(`${chalk.green("<command>")} [options]`)

program
  .command("create <project-name>") // <>必须输入的恶参数，[]可以选择输入的参数
  .description("创建一个新的项目")
  .option("-d, --default", "使用默认的预设")
  .option("-f, --force", "强制性覆盖创建")
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow("检测到您输入了多个名称，将以第一个参数作为项目名"))
    }
    require('../lib/create')(name, options)
    // require("../lib/create")
  })

program.parse(process.argv)
