type markdownTag="#"|"##"|"###"|"---"|'';
const tagMap=new Map<markdownTag,string>
tagMap.set("#","h1")
tagMap.set("##","h2")
tagMap.set("###","h3")
tagMap.set("---","hr")
tagMap.set("","p")
function getHTag(tag:markdownTag,openingTagPattern='<'):string{
    if(tag!==undefined)
        return `${openingTagPattern}${tagMap.get(tag)}>`;
    else
        return `${openingTagPattern}p>`;
}
function openingHTMLTag(tag:markdownTag):string{
    return getHTag(tag,'<');
}
function closingHTMLTag(tag:markdownTag):string{
    return getHTag(tag,'</');
}
class markdownDoc{
    private content:string='';
    public add(...contents:string[]):void{
        contents.forEach((value)=>this.content+=value);
    }
    public  get():string{
        return this.content;
    }
}
interface CurrentLine{
    line:string;
}
class CurrentLine{
    constructor(line:string){
        this.line=line
    }
}
interface visitor{
    visit(line:CurrentLine,mardownDocument:markdownDoc):void;
}
class visitor{
    constructor(private tag:markdownTag){}
    visit(line:CurrentLine,markdownDocument:markdownDoc){
        markdownDocument.add(openingHTMLTag(this.tag),line.line,closingHTMLTag(this.tag),'\n');
    }
}
interface element{
    accept(visitor:visitor,doc:markdownDoc):void;
}
class element{
    constructor(private line:CurrentLine){}
    accept(visitor:visitor,doc:markdownDoc){
        visitor.visit(this.line,doc);
    }
}
//职责链模式
//首先创建对应标签的处理函数
class ChainHandle{
    protected next:ChainHandle|null=null;
    private v:visitor
    private doc:markdownDoc
    constructor(private tag:markdownTag,v:visitor,doc:markdownDoc){
        this.v=v;
        this.doc=doc;
        this.tag=tag
    }
    public setNext(next:ChainHandle):void{
        this.next=next
    }
    public CanHandle(line:CurrentLine):boolean{
        const res=line.line.startsWith(this.tag);
        if(res)
            line.line=line.line.substring(this.tag.length);
        return res;
    }
    public Handle(line:CurrentLine):void{
        if(this.CanHandle(line))
            this.v.visit(line,this.doc);
        else
            this.next&&this.next.Handle(line)
    }
}
//创建处理链
function build(doc:markdownDoc):ChainHandle{
    const h1=new ChainHandle("#",new visitor("#"),doc);
    const h2=new ChainHandle("##",new visitor("##"),doc);
    const h3=new ChainHandle("###",new visitor("###"),doc);
    const hr=new ChainHandle("---",new visitor("---"),doc);
    const p=new ChainHandle("",new visitor(""),doc);
    h3.setNext(h2);
    h2.setNext(h1);
    h1.setNext(hr);
    hr.setNext(p);
    return h3;
}
//综合应用
//处理html
function dealMarkdown(markdownID='markdown',outputID='markdown-output'):void{
    const markdown=<HTMLTextAreaElement>document.getElementById(markdownID);
    const markdownoutput=<HTMLLabelElement>document.getElementById(outputID);
    if(markdown!==null)
    {
        markdown.onkeyup=(e)=>{
            renderHtml(markdown,markdownoutput);
        }
        window.onload=(e)=>{
            renderHtml(markdown,markdownoutput);
        }
    }
}
function markdownToHTML(text:string)
{
    const doc=new markdownDoc();
    const lines=text.split('\n');
    const chain=build(doc);
    lines.forEach((line)=>{
        chain.Handle(new CurrentLine(line));
    });
    return doc.get();
}
function renderHtml(markdown:HTMLTextAreaElement,markdownoutput:HTMLLabelElement)
{
    if(markdown.value)
         markdownoutput.innerHTML=markdownToHTML(markdown.value);
    else
        markdownoutput.innerHTML='<p></p>'
}

