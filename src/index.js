"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("zotero-plugin-toolkit/dist/basic");
const addon_1 = require("./addon");
const package_json_1 = require("../package.json");
const basicTool = new basic_1.BasicTool();
if (!basicTool.getGlobal("Zotero")[package_json_1.config.addonInstance]) {
    // Set global variables
    _globalThis.Zotero = basicTool.getGlobal("Zotero");
    _globalThis.ZoteroPane = basicTool.getGlobal("ZoteroPane");
    _globalThis.Zotero_Tabs = basicTool.getGlobal("Zotero_Tabs");
    _globalThis.window = basicTool.getGlobal("window");
    _globalThis.document = basicTool.getGlobal("document");
    _globalThis.addon = new addon_1.default();
    _globalThis.ztoolkit = addon.data.ztoolkit;
    ztoolkit.basicOptions.log.prefix = `[${package_json_1.config.addonName}]`;
    ztoolkit.basicOptions.log.disableConsole = addon.data.env === "production";
    ztoolkit.UI.basicOptions.ui.enableElementJSONLog =
        addon.data.env === "development";
    ztoolkit.UI.basicOptions.ui.enableElementDOMLog =
        addon.data.env === "development";
    ztoolkit.basicOptions.debug.disableDebugBridgePassword =
        addon.data.env === "development";
    Zotero[package_json_1.config.addonInstance] = addon;
    // Trigger addon hook for initialization
    addon.hooks.onStartup();
}
