This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

npm i eslint
{
  "extends": ["next/core-web-vitals","eslint:recommended"]
} eslint配置
npm i stylelint stylelint-config-standard-scss -D 样式  
{
    "extends":"stylelint-config-standard-scss"
}stylelint配置 .stylelint.json文件
在setting中的code action （editor）中的setting.json中配置
    "editor.codeActionsOnSave": {
        "source.fixAll.stylelint":true 
    }

配置prettier 代码格式化 .prettierrc  文件  插件prettier-code formatter
{
    "arrowParens": "always",
    "bracketSpacing": true,
    "endOfLine": "lf",
    "htmlWhitespaceSensitivity": "css",
    "insertPragma": false,
    "jsxBracketSameLine": false,
    "jsxSingleQuote": false,
    "printWidth": 80,
    "proseWrap": "preserve",
    "quoteProps": "as-needed",
    "requirePragma": false,
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "useTabs": false,
    "vueIndentScriptAndStyle": false,
    "parser": "babel"
  }

  保存代码时 自动格式化代码 format on save

  使用mockjs生成假数据
  npm i @types/mockjs -D  由于是ts  导入会有问题 需要安装这个


  由于单纯的使用children会报错 类型“{ children: Element; }”与类型“IntrinsicAttributes”不具有相同的属性
  // import type { NextPage } from "next";
import Navbar  from "../Navbar";
import Footer from "../Footer";
import React from 'react'
interface LayoutProps {
    children: React.ReactNode;
 }
 const Layout = ({children}:LayoutProps) => {
    return (    
        <div>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    )
}

export default Layout