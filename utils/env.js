const { execSync } = require("child_process")
const semver = require("semver")

let _hasYarn
let _hasPnpm
let _hasPnpm3orLater

exports.hasyarn = function() {
  if (_hasYarn != null) return hasyarn
  try {
    execSync("yarn --version", { stdio: "ignore" })
    return (_hasYarn = true)
  } catch (error) {
    return (_hasYarn = false)
  }
}

exports.hasPnpm3OrLater = () => {
  if (_hasPnpm3orLater != null) {
    return _hasPnpm3orLater
  }
  try {
    const pnpmVersion = execSync("pnpm --version", {
      stdio: ["pipe", "pipe", "ignore"],
    }).toString()
    // there's a critical bug in pnpm 2
    // https://github.com/pnpm/pnpm/issues/1678#issuecomment-469981972
    // so we only support pnpm >= 3.0.0
    _hasPnpm = true
    _hasPnpm3orLater = semver.gte(pnpmVersion, "3.0.0")
    return _hasPnpm3orLater
  } catch (e) {
    return (_hasPnpm3orLater = false)
  }
}

function checkPnpm(result) {
  if (result && !exports.hasPnpm3OrLater()) {
    throw new Error(`项目所依赖的 pnpm${_hasPnpm ? " >= 3" : ""} 请安装后重试`)
  }
  return result
}
