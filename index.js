/**
 * @description 自定义 webpack glsl loader
 * @extends https://webpack.docschina.org/api/loaders/#examples
 */
const fs = require('fs')

/**
 * glsl-loader 思路
 * 1.正则识别当前文件中的 #include "xxx.glsl" 外部文件
 * 2.通过 webpack loader 获取 glsl 相对路径对应的完整文件路径
 * 3.通过 fs.readFile 读取外部文件内容
 * 4.递归分析外部文件内容关联的 #include "xxx.glsl"
 * 5.替换原始匹配内容
 */

/**
 * 分析当前文件 glsl 内容
 * @param {*} loader webpack this
 * @param {*} source 当前文件内容
 * @returns 处理后的文件内容
 */
async function parseGlsl(loader, source) {
  // 1.当前文件中需要引入的外部 glsl 文件
  const includes = []
  // 2.glsl 正则表达式
  const reg = /#include "([.\/\w]+)"/gi
  // 3.遍历匹配当前文件代码
  let match = reg.exec(source)
  while (match != null) {
    includes.push({
      path: match[1], // glsl 相对路径
      origin: match[0] // 原始匹配内容
    })
    match = reg.exec(source)
  }
  // 4.不存在 #include 则直接返回
  if (includes.length === 0) {
    return source
  }
  // 5.根据当前文件匹配的外部 glsl 生成 promise
  const promises = includes.map(
    include =>
      new Promise(resolve =>
        loader.resolve(loader.context, include.path, (_error, fullPath) =>
          resolve({ ...include, fullPath })
        )
      )
  )
  // 6.迭代 promise
  for await (const res of promises) {
    loader.addDependency(res.fullPath) // 添加文件依赖
    const content = fs.readFileSync(res.fullPath, { encoding: 'utf-8' }) // 读取外部文件内容
    const processContent = await parseGlsl(loader, content) // 递归分析外部文件内容
    source = source.replace(res.origin, processContent) // 替换原始匹配内容
  }
  return source
}

module.exports = async function (source) {
  this.cacheable(true) // 启用 webpack 缓存
  source = await parseGlsl(this, source)
  return `module.exports = ${JSON.stringify(source)}`
}
