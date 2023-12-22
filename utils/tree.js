const fs = require("fs")

module.exports = function printTree(dir, prefix = "", depth = 0, maxDepth = 0) {
  if (depth > maxDepth) {
    return
  }
  const files = fs.readdirSync(dir)
  files.forEach((file, index) => {
    const filePath = `${dir}/${file}`
    const isLast = index === files.length - 1
    console.log(`${prefix}${isLast ? "└──" : "├──"} ${file}`)
    if (fs.statSync(filePath).isDirectory()) {
      const newPrefix = `${prefix}${isLast ? "   " : "│  "}`
      printTree(filePath, newPrefix, depth + 1, maxDepth)
    }
  })
}
