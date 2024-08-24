"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPrefsScripts = registerPrefsScripts;
const package_json_1 = require("../../package.json");
const examples_1 = require("./examples");
function registerPrefsScripts(_window) {
    return __awaiter(this, void 0, void 0, function* () {
        // This function is called when the prefs window is opened
        // See addon/chrome/content/preferences.xul onpaneload
        if (!addon.data.prefs) {
            addon.data.prefs = {
                window: _window,
                columns: [],
                rows: [],
            };
        }
        else {
            addon.data.prefs.window = _window;
        }
        bindPrefEvents();
    });
}
function bindPrefEvents() {
    var _a, _b;
    (_a = addon.data
        .prefs.window.document.querySelector(`#zotero-prefpane-${package_json_1.config.addonRef}-shortcut-enable`)) === null || _a === void 0 ? void 0 : _a.addEventListener("command", (e) => {
        examples_1.KeyExampleFactory.registerRenameShortcuts();
    });
    (_b = addon.data
        .prefs.window.document.querySelector(`#zotero-prefpane-${package_json_1.config.addonRef}-shortcut-confirm`)) === null || _b === void 0 ? void 0 : _b.addEventListener("command", (e) => {
        examples_1.KeyExampleFactory.registerRenameShortcuts();
    });
}
