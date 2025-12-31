const http = require("http");

const db = [];

const server = http.createServer((req, res) => {
  const method = req.method;
  const path = req.url;

  switch (method) {
    case "GET":
      switch (path) {
        case "/":
          res
            .writeHead(200, { "Content-Type": "text/plain" })
            .end("Hello, World!\n");
          break;
        case "/contact-us":
          res
            .writeHead(200, { "Content-Type": "text/plain" })
            .end("Contact us at miheercodes@gmail.com");
          break;
        case "/tweet":
          res
            .writeHead(200, { "Content-Type": "text/plain" })
            .end(db.join("\n"));
          break;
        default:
          res
            .writeHead(404, { "Content-Type": "text/plain" })
            .end("Not Found\n");
      }
      break;
    case "POST":
      switch (path) {
        case "/tweet":
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            console.log("Tweet received:", body);
            db.push(body);
            res
              .writeHead(200, { "Content-Type": "text/plain" })
              .end("Tweet received\n");
          });
            break;
        default:
          res
            .writeHead(404, { "Content-Type": "text/plain" })
            .end("Not Found\n");
      }
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" }).end("Not Found\n");
  }
});

server.listen(3000, () => {
  console.log("Server running at PORT: 3000");
});
