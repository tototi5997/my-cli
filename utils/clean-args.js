function cleanArgs(cmd) {
  const args = {}
  cmd?.options?.forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ""))
    // 如果没有传递option或者有与之相同的命令，则不被拷贝
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key]
    }
  })
  return args
}

module.exports = cleanArgs
