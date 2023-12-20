const chalk = require("chalk")
const semver = require("semver")

const { logWithSpinner, stopSpinner } = require("../utils/spinner")
const { log } = require("../utils/logger")
const requrieNodeVersion = require("../package.json").engines.node

module.exports = async function checkEnv() {
  logWithSpinner(`${chalk.green("正在检查系统环境...")}`)
  await checkNodeVersion(requrieNodeVersion)
  stopSpinner()
  log("系统环境监测完毕")
}

function checkNodeVersion(wanted) {
  if (!semver.satisfies(process.version, wanted)) {
    stopSpinner()
    log()
    console.log(
      chalk.red(
        "您使用的 Node 版本号是：" +
          " " +
          chalk.green(process.version) +
          "\n" +
          "Zli" +
          "需运行在:" +
          " " +
          chalk.green(wanted)
      )
    )
    log('请升级您的 Node 版本')
    process.exit(1)
  }
}
