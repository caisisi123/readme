import http from 'http';
import fs from 'fs';
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // 构造文件路径，__dirname 表示当前脚本所在目录
        const filePath = './index.html'

        // 读取文件内容并发送给客户端
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            }
        });
    } else if (req.url === '/dist/parser.js') {
        // 如果请求的是 /dist/parser.js 路径，则返回 parser.js 文件
        const jsPath = "./dist/parser.js";
        fs.readFile(jsPath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/javascript'); // 设置响应类型为 JavaScript
                res.end(data);
            }
        });
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


