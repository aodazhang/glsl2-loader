# glsl2-loader

Simple and faster glsl loader, support webpack4 / webpack5.

[中文](./README_ZH.md)

## Quick Start

1.Installation this package

```shell
npm install glsl2-loader -D
# or
pnpm i glsl2-loader -D
```

2.Configure `webpack.config.js`

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

3.You can introduce the glsl file like this:

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

## License

[MIT](http://www.opensource.org/licenses/mit-license.php)
