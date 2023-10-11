## 项目介绍
这是一个使用typescript开发的markdown编辑器，支持实时预览，支持导出html文件。

## 启动服务器
`npm run server`

访问 http://127.0.0.1:3000/

## 支持的Markdown标签包括：

- `#`：一级标题
- `##`：二级标题
- `###`：三级标题
- `---`：水平线

## 代码结构
1. 映射markdown标签和html标签

```
type markdownTag="#"|"##"|"###"|"---"|'';
```

markTagType=>HTML标签

2. 通过访问者模式更新文档

```
interface visitor{
visit(line:CurrentLine,mardownDocument:markdownDoc):void;
}
```

3. 通过职责链模式确定由哪个具体的访问者更新文档

```
interface ChainHandle{
setNext(next:ChainHandle):void;
CanHandle(line:CurrentLine):boolean;
Handle(line:CurrentLine):void;
}
```
```

    h3handle.setNext(h2handle);
    h2handle.setNext(h1handle);
    h1handle.setNext(hrhandle);
    hrhandle.setNext(phandle);

```

## 示例效果
![图片描述](https://github.com/caisisi123/readme/raw/master/dist/img.png)

