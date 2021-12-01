## Step1 Node.js を ES6 以降で実装できるようにする

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

上記のようにすると全 polyfill を読み込むので確実だがファイルサイズが少し大きくなので、その場合以下のように`useBuiltIns`を使うのも良さそう。

```js
// babel.config.js
const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      corejs: 3,
    },
  ],
];
module.exports = { presets };
```

※上記の babel.config.js を`.babelrc`で書くなら以下

```json:.babelrc
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ]
    ]
}
```
