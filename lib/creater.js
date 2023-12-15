const Eventemiiter = require("events")
const inquirer = require("inquirer")

const { logWithSpinner } = require("../utils/spinner")

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
  async resolvePreset(name ,clone) {
    let preset
    
  }
}
