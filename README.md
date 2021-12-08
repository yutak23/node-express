## Step1 仮想マシンの環境を用意する

詳細は以下の Qiita を参照。

- [Windows 上に Linux(CentOS)の Web アプリ開発環境を virtualbox で構築する](https://qiita.com/yuta-katayama-23/items/6baf167464eca3376ea0)

## Step2 Node.js を ES6 以降で実装できるようにする

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
			corejs: 3
		}
	]
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

## Step3 Node.js の開発環境を整備する

以下のコミットの部分が開発環境の整備の部分。

- [polyfill の設定を babel.config.js に変更](https://github.com/yuta-katayama-23/node-express/commit/200cb9be0d9d9225a565f89ace8eac198690e8a3)
- [依存から@babel/polyfill を削除（誤って追加していた）](https://github.com/yuta-katayama-23/node-express/commit/6e655cf180579b470fe48c9d3c9e371982f078fb)
- [expres server をホットリロード化する](https://github.com/yuta-katayama-23/node-express/commit/c8f5351faf519e5393e65bb557934df76a760c7b)
- [【webpack.config.js の追加設定】name を追加](https://github.com/yuta-katayama-23/node-express/commit/a9ca93cb890afcb0cc3b864ce1c11b0cb7bc1b21)
- [【webpack.config.js の追加設定】mode 設定を追加](https://github.com/yuta-katayama-23/node-express/commit/a3d6770588ed07570ef048a94ccb21c29195fded)
- [【webpack.config.js の追加設定】output の設定を追加](https://github.com/yuta-katayama-23/node-express/commit/b2fc8e761fa40836034748dec02ec46e8757ae08)
- [【webpack.config.js の追加設定】externals の設定（webpack-node-externals）を追加](https://github.com/yuta-katayama-23/node-express/commit/caa1b3f5817d46d2a638ba01da59def7e5b526c6)
- [【webpack.config.js の追加設定】plugin の設定（eslint-webpack-plugin）を追加](https://github.com/yuta-katayama-23/node-express/commit/d7f4b09ade8c708fbcbb78fe3d804ec2c081b3c0)
- [ESLint/prettier の設定・VS Code の設定を追加](https://github.com/yuta-katayama-23/node-express/commit/3c94d922b2ee298b8332418e99bbeee3fdea9b4a)
- [prettier の設定（useTabs=true）](https://github.com/yuta-katayama-23/node-express/commit/d1a918329f9568beda0e9345f1b339230153ed61)
- [prettier のルールを追加しフォーマッティングを修正](https://github.com/yuta-katayama-23/node-express/commit/c7bc9ef1d7dedf2551c5195381edee568c901e4f)

詳細は以下の Qiita を参照。

- [Node.js(Express)の開発環境を整備する　 ESLint / Prettier / Visual Studio Code / ホットリロード](https://qiita.com/yuta-katayama-23/items/5d73bbe79c19301551df)
