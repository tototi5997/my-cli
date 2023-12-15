/**
 * aa-xx 转 aaXx
 * @param {String} str String
 * @returns
 */
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""))
}

module.exports = camelize
