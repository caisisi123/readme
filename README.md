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
## 完成的需求列表

·创建一个应用程序来解析markdown。

·每当文本区域发生变化时，就再次解析整个文档。

·在用户按下Enter键的地方换行。

·起始字符将决定该行是否是markdown。

·#后跟一个空格将被替换为H1标题。

·##后跟一个空格将被替换为H2标题。

·###后跟一个空格将被替换为H3标题。

·---将被替换为一条水平分隔线。

·如果一行没有以markdown开头，则将该行视为一个段落。

·生成的HTML将在一个标签内显示。

·如果markdown文本区域的内容为空，则标签将包含一个空段落。

·使用Bootstrap进行布局，内容将拉伸到100%的高度。

## 示例效果
![图片描述](https://github.com/caisisi123/readme/raw/master/dist/img.png)

