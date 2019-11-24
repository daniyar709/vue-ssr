// node服务器
const express = require("express");
const Vue = require("vue");

// 创建express实例·
const app = express();
const fs = require("fs");

//创建渲染器
const { createBundleRenderer } = require("vue-server-renderer");
const serverBundle = require("../dist/server/vue-ssr-server-bundle.json");
const clientManifest = require("../dist/client/vue-ssr-client-manifest.json");
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: fs.readFileSync("../public/index.temp.html", "utf-8"),
  clientManifest
});

// 中间件处理静态文件请求
app.use(express.static("../dist/client/", { index: false }));

// 将路由的处理全交给vue
app.get("*", async (req, res) => {
  try {
    console.log(req);
    const context = {
      url: req.url,
      title: "ssr test"
    };
    const html = await renderer.renderToString(context);
    res.send(html);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log("渲染服务器启动成功");
});
