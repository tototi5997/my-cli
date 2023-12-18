const fs = require("fs-extra")

const remotePresetMap = {
  react: "tototi5997/zli-template",
}

// 远程仓库下载指定模板到临时目录
module.exports = async function (name, targetDir, clone) {
  const os = require("os")
  const path = require("path")
  const download = require("download-git-repo")

  const tmpdir = path.join(os.tmpdir(), "zli")

  await fs.remove(tmpdir)
  await new Promise((resolve, reject) => {
    download(remotePresetMap[name], tmpdir, { clone }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })

  return {
    targetDir,
    tmpdir
  }
}
