const fs = require("fs-extra")

const remotePresetMap = {
  mobx: "Walker-Leee/react-temp-mobx",
}

// 远程仓库下载指定模板到临时目录
module.exports = async function (name, targetDir, clone) {
  const os = require("os")
  const path = require("path")
  const download = require("download-git-repo")

  const tempDir = path.join(os.tmpdir(), "zli")

  await fs.remove(tempDir)
  await new Promise((resolve, reject) => {
    download(remotePresetMap[name], tmpdir, { clone }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })

  return {
    targetDir,
    tempDir
  }
}
