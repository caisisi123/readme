"use strict";
const tagMap = new Map;
tagMap.set("#", "h1");
tagMap.set("##", "h2");
tagMap.set("###", "h3");
tagMap.set("---", "hr");
tagMap.set("", "p");
function getHTag(tag, openingTagPattern = '<') {
    if (tag !== undefined)
        return `${openingTagPattern}${tagMap.get(tag)}>`;
    else
        return `${openingTagPattern}p>`;
}
function openingHTMLTag(tag) {
    return getHTag(tag, '<');
}
function closingHTMLTag(tag) {
    return getHTag(tag, '</');
}
class markdownDoc {
    constructor() {
        this.content = '';
    }
    add(...contents) {
        contents.forEach((value) => this.content += value);
    }
    get() {
        return this.content;
    }
}
class CurrentLine {
    constructor(line) {
        this.line = line;
    }
}
class visitor {
    constructor(tag) {
        this.tag = tag;
    }
    visit(line, markdownDocument) {
        markdownDocument.add(openingHTMLTag(this.tag), line.line, closingHTMLTag(this.tag), '\n');
    }
}
class element {
    constructor(line) {
        this.line = line;
    }
    accept(visitor, doc) {
        visitor.visit(this.line, doc);
    }
}
//职责链模式
//首先创建对应标签的处理函数
class ChainHandle {
    constructor(tag, v, doc) {
        this.tag = tag;
        this.next = null;
        this.v = v;
        this.doc = doc;
        this.tag = tag;
    }
    setNext(next) {
        this.next = next;
    }
    CanHandle(line) {
        const res = line.line.startsWith(this.tag);
        if (res)
            line.line = line.line.substring(this.tag.length);
        return res;
    }
    Handle(line) {
        if (this.CanHandle(line))
            this.v.visit(line, this.doc);
        else
            this.next && this.next.Handle(line);
    }
}
//创建处理链
function build(doc) {
    const h1 = new ChainHandle("#", new visitor("#"), doc);
    const h2 = new ChainHandle("##", new visitor("##"), doc);
    const h3 = new ChainHandle("###", new visitor("###"), doc);
    const hr = new ChainHandle("---", new visitor("---"), doc);
    const p = new ChainHandle("", new visitor(""), doc);
    h3.setNext(h2);
    h2.setNext(h1);
    h1.setNext(hr);
    hr.setNext(p);
    return h3;
}
//综合应用
//处理html
function dealMarkdown(markdownID = 'markdown', outputID = 'markdown-output') {
    const markdown = document.getElementById(markdownID);
    const markdownoutput = document.getElementById(outputID);
    if (markdown !== null) {
        markdown.onkeyup = (e) => {
            renderHtml(markdown, markdownoutput);
        };
        window.onload = (e) => {
            renderHtml(markdown, markdownoutput);
        };
    }
}
function markdownToHTML(text) {
    const doc = new markdownDoc();
    const lines = text.split('\n');
    const chain = build(doc);
    lines.forEach((line) => {
        chain.Handle(new CurrentLine(line));
    });
    return doc.get();
}
function renderHtml(markdown, markdownoutput) {
    if (markdown.value)
        markdownoutput.innerHTML = markdownToHTML(markdown.value);
    else
        markdownoutput.innerHTML = '<p></p>';
}
//# sourceMappingURL=parser.js.map