"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyToolkit = void 0;
const index_1 = require("zotero-plugin-toolkit/dist/index");
const hooks_1 = require("./hooks");
class Addon {
    constructor() {
        this.data = {
            alive: true,
            env: __env__,
            // ztoolkit: new MyToolkit(),
            ztoolkit: new index_1.default(),
        };
        this.hooks = hooks_1.default;
        this.api = {};
    }
}
/**
 * Alternatively, import toolkit modules you use to minify the plugin size.
 *
 * Steps to replace the default `ztoolkit: ZoteroToolkit` with your `ztoolkit: MyToolkit`:
 *
 * 1. Uncomment this file's line 30:            `ztoolkit: new MyToolkit(),`
 *    and comment line 31:                      `ztoolkit: new ZoteroToolkit(),`.
 * 2. Uncomment this file's line 10:            `ztoolkit: MyToolkit;` in this file
 *    and comment line 11:                      `ztoolkit: ZoteroToolkit;`.
 * 3. Uncomment `./typing/global.d.ts` line 12: `declare const ztoolkit: import("../src/addon").MyToolkit;`
 *    and comment line 13:                      `declare const ztoolkit: import("zotero-plugin-toolkit").ZoteroToolkit;`.
 *
 * You can now add the modules under the `MyToolkit` class.
 */
const basic_1 = require("zotero-plugin-toolkit/dist/basic");
const ui_1 = require("zotero-plugin-toolkit/dist/tools/ui");
const preferencePane_1 = require("zotero-plugin-toolkit/dist/managers/preferencePane");
class MyToolkit extends basic_1.BasicTool {
    constructor() {
        super();
        this.UI = new ui_1.UITool(this);
        this.PreferencePane = new preferencePane_1.PreferencePaneManager(this);
    }
    unregisterAll() {
        (0, basic_1.unregister)(this);
    }
}
exports.MyToolkit = MyToolkit;
exports.default = Addon;
