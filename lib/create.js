const fs = require("fs-extra")
const path = require("path")
const chalk = require("chalk")
const inquirer = require("inquirer")
const validatePackageName = require("validate-npm-package-name")

const { stopSpinner } = require("../utils/spinner")
const { exit, clearConsole } = require("../utils/common")
const Creater = require("./creater")

async function create(projectName, opts) {
  const cwd = process.cwd() // 当前目录地址
  const inCurrent = projectName === "." // 当前目录下
  const name = inCurrent ? path.relative("../", cwd) : projectName // 文件名称
  const targetDir = path.resolve(cwd, projectName || ".") // 待创建的文件夹路径
  const result = validatePackageName(name) // 是否是合法的包名

  // 如果输入的不是合法的包名，则退出
  if (!result.validForNewPackages) {
    console.error(chalk.red(`不合法的项目名: "${name}"`))
    result.errors &&
      result.errors.forEach((err) => {
        console.error(chalk.red.dim("❌ " + err))
      })
    result.warnings &&
      result.warnings.forEach((warn) => {
        console.error(chalk.red.dim("⚠️ " + warn))
      })
    exit(1) // 退出程序
  }

  // 检查文件夹是否存在
  if (fs.existsSync(targetDir)) {
    // 是否是强制创建
    if (opts?.force) {
      await fs.remove(targetDir)
    } else {
      await clearConsole()
      if (inCurrent) {
        // 当前目录
      } else {
        const { overwrite } = await inquirer.prompt([
          {
            name: "overwrite",
            type: "list",
            message: `目标文件夹 ${chalk.cyan(targetDir)} 已经存在，请选择：`,
            choices: [
              { name: "覆盖", value: true },
              { name: "取消", value: false },
            ],
          },
        ])
        if (!overwrite) return
        // 删除原文件
        console.log(`\nRemoving ${chalk.cyan(targetDir)} ...`)
        await fs.remove(targetDir)
      }
    }
  }


  // 完成准备工作，开始创建
  const creater = new Creater(name)
  await creater.create()
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    stopSpinner(false)
  })
}
