const fs = require("fs-extra")
const path = require("path")

module.exports = async function copyFile(temp, target) {
  await fs.copy(temp, target)
  // 删除 .git 文件
  await fs.remove(path.resolve(target, "./.git"))
  const pkgJSON = await fs.readJson(target + "/package.json")
  return pkgJSON
}
