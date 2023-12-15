const readline = require('readline')

//退出
exports.exit = function (code) {
  if (code > 0) {
    throw new Error(`Process exited with code ${code}`)
  }
}

// 清空console
exports.clearConsole = function (title) {
  if (process.stdout.isTTY) {
    const blank = "\n".repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}
