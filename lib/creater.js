const Eventemiiter = require("events")
const inquirer = require("inquirer")

const loadRemotePreset = require("../utils/load-remote-preset")
const { logWithSpinner, stopSpinner } = require("../utils/spinner")
const { error } = require("../utils/logger")
const { defaults } = require("../utils/options")
const { exit } = require("../utils/common")

module.exports = class Creater extends Eventemiiter {
  constructor(name, context) {
    super()
    this.name = name
    this.context = context
    // this.run = this.run.bind(this)
  }

  // 创建方法
  async create(cliOptions = {}, preset = null) {
    const { name, context } = this
  }

  // 解析预设
  async resolvePreset(name, clone) {
    let preset = null
    logWithSpinner(`Fetching remote preset ${chalk.cyan(name)}...`)
    this.emit("creation", { event: "fetch-remote-preset" })

    try {
      preset = await loadRemotePreset(name, this.context, clone)
      stopSpinner()
    } catch (error) {
      stopSpinner()
      error(`Failed fetching remote preset ${chalk.cyan(name)}:`)
      throw error
    }

    if (name === 'default' && !preset) {
      preset = defaults.presets.default
    }
    if (!preset) {
      error(`preset "${name}" not found`)
      exit(1)
    }

    return preset
  }
}
