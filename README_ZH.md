# glsl2-loader

更加简单快捷的 glsl loader，支持 webpack4 / webpack5。

[English](./README.md)

## 快速开始

1.安装

```shell
npm install glsl2-loader -D
# or
pnpm i glsl2-loader -D
```

2.配置 `webpack.config.js`

```javascript
module: {
  rules: [
    // ...
    {
      test: /\.(glsl|vert|frag)$/,
      use: ['glsl2-loader']
    }
  ]
}
```

3.你可以在 glsl 中引入其他 glsl 文件：

```glsl
#include "/node_modules/lygia/math/saturate.glsl"
#include "../common/aces.glsl"

void main() {
  vec3 color = vec3(1.0, 0.0, 0.0);
  color = saturate(color);
  color = acesFilmicToneMapping(color);
  gl_FragColor = vec4(color, 1.0);
}
```

## 开源协议

[MIT](http://www.opensource.org/licenses/mit-license.php)
