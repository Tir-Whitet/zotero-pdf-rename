import process from "process";
import { execSync } from "child_process";
import { exit } from "process";
import minimist from "minimist";
// import cmd from "./zotero-cmd.json" assert { type: "json" };
// Create a new zotero-cmd.json; Original zotero-cmd.json is not available.
import cmd from "./zotero-cmd.json" with { type: "json" };
const { exec } = cmd;

// Run node start.js -h for help
const args = minimist(process.argv.slice(2));

if (args.help || args.h) {
  console.log("Start Zotero Args:");
  console.log(
    "--zotero(-z): Zotero exec key in zotero-cmd.json. Default the first one."
  );
  console.log("--profile(-p): Zotero profile name.");
  exit(0);
}

const zoteroPath = exec[args.zotero || args.z || Object.keys(exec)[0]];
const profile = args.profile || args.p;

const startZotero = `${zoteroPath} --debugger --purgecaches ${
  profile ? `-p ${profile}` : ""
}`;

execSync(startZotero);
exit(0);
