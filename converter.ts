//import showdown from "showdown";
const showdown = require("showdown");
const converter = new showdown.Converter();
const fs = require("fs");

const data = fs.readFileSync("reference-guide/performance.md", "utf8");
const html = converter.makeHtml(data);
fs.writeFile("index.html", html, () => {});
