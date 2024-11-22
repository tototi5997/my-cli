const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["bin/main.js"], // 入口文件
    bundle: true, // 打包成一个文件
    platform: "node", // 打包的平台
    outfile: "dist/main.js", // 输出文件
    banner: {
      js: "#!/usr/bin/env node",
    },
    external: ["fs", "path", 'electron'],
    minify: true, // 压缩代码
  })
  .then(() => {
    console.log("Build completed");
  })
  .catch((err) => {
    console.error("Build failed:", err);
    process.exit(1);
  });
