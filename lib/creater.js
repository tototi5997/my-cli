const Eventemiiter = require("events")
const inquirer = require("inquirer")
const chalk = require("chalk")
const execa = require("execa")

const { logWithSpinner, stopSpinner } = require("../utils/spinner")
const loadRemotePreset = require("../utils/load-remote-preset")
const { hasyarn, hasPnpm3OrLater } = require("../utils/env")
const writeFileTree = require("../utils/write-file-tree")
const { log, error } = require("../utils/logger")
const { defaults } = require("../utils/options")
const copyFile = require("../utils/copy-file")
const { exit } = require("../utils/common")

module.exports = class Creater extends Eventemiiter {
  constructor(name, context) {
    super()
    this.name = name
    this.context = context
    this.run = this.run.bind(this)
  }

  run(command, args) {
    if (!args) {
      const [command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, { cwd: this.context })
  }

  // 创建方法
  async create(cliOptions = {}, preset = null) {
    const { name, context } = this

    // 是否解析预设
    // zli create foo --preset mobx
    if (cliOptions.preset) {
      preset = await this.resolvePreset(cliOptions.preset, cliOptions.clone)
    } else {
      preset = await this.resolvePreset(defaults.presets.default, cliOptions.clone)
    }

    log(chalk.blue.bold(`Zli cli v${require("../package.json").version}`))
    logWithSpinner("✨", `正在创建项目 ${chalk.yellow(context)}`)
    this.emit("creation", { event: "creating" })

    stopSpinner()
    // 设置文件名，版本号
    const { pkgVers, pkgDes } = await inquirer.prompt([
      {
        name: "pkgVers",
        message: `请输入项目版本号`,
        default: "1.0.0",
      },
      {
        name: "pkgDes",
        message: `请输入项目简介`,
        default: "project created by zli",
      },
    ])

    const pkgJSON = await copyFile(preset.tmpdir, preset.targetDir)
    const pkg = Object.assign(pkgJSON, {
      name: name,
      version: pkgVers,
      description: pkgDes,
    })

    logWithSpinner("📄", `生成 ${chalk.yellow('package.json')} 等模板文件...`)
    await writeFileTree(context, {
      "package.json": JSON.stringify(pkg, null, 2),
    })
    stopSpinner()

    const packageManager = (hasyarn() ? "yarn" : null) || (hasPnpm3OrLater() ? "pnpm" : "npm")

    log()
    log(`🎉  项目创建成功 ${chalk.yellow(name)}.`)
    log(
      `👉  请按如下命令，开始愉快开发吧` +
        "\n\n" +
        (this.context === process.cwd() ? `` : chalk.cyan(` ${chalk.gray("$")} cd ${name}`)) +
        "\n" +
        chalk.cyan(
          ` ${chalk.gray("$")} ${
            packageManager === "yarn" ? "yarn install" : packageManager === "pnpm" ? "pnpm install" : "npm install"
          }`
        ) +
        "\n" +
        chalk.cyan(
          ` ${chalk.gray("$")} ${
            packageManager === "yarn" ? "yarn start" : packageManager === "pnpm" ? "pnpm run start" : "npm start"
          }`
        )
    )
    log()
  }

  // 解析预设
  async resolvePreset(name, clone) {
    let preset = null
    logWithSpinner(`Fetching remote preset ${chalk.cyan(name)}...`)
    this.emit("creation", { event: "fetch_remote_preset" })

    try {
      preset = await loadRemotePreset(name, this.context, clone)
      stopSpinner()
    } catch (e) {
      stopSpinner()
      error(`Failed fetching remote preset ${chalk.cyan(name)}:`)
      console.log(e)
      throw e
    }

    if (name === "default" && !preset) {
      preset = defaults.presets.default
    }
    if (!preset) {
      error(`preset "${name}" not found`)
      exit(1)
    }

    return preset
  }
}
