import fs from "fs";

const cmd = JSON.parse(fs.readFileSync("./scripts/zotero-cmd.json", "utf-8"));
console.log("Parsed JSON:", cmd);
