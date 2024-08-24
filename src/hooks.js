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
const examples_1 = require("./modules/examples");
const package_json_1 = require("../package.json");
const locale_1 = require("./utils/locale");
const preferenceScript_1 = require("./modules/preferenceScript");
const rename_1 = require("./modules/rename");
function onStartup() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            Zotero.initializationPromise,
            Zotero.unlockPromise,
            Zotero.uiReadyPromise,
        ]);
        (0, locale_1.initLocale)();
        ztoolkit.ProgressWindow.setIconURI("default", `chrome://${package_json_1.config.addonRef}/content/icons/favicon.png`);
        examples_1.BasicExampleFactory.registerPrefs();
        examples_1.KeyExampleFactory.registerRenameShortcuts();
        examples_1.UIExampleFactory.registerRightClickMenuItemRename();
    });
}
function onShutdown() {
    var _a, _b;
    ztoolkit.unregisterAll();
    (_b = (_a = addon.data.dialog) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.close();
    // Remove addon object
    addon.data.alive = false;
    delete Zotero[package_json_1.config.addonInstance];
}
/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
function onPrefsEvent(type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (type) {
            case "load":
                (0, preferenceScript_1.registerPrefsScripts)(data.window);
                break;
            default:
                return;
        }
    });
}
// Add your hooks here. For element click, etc.
// Keep in mind hooks only do dispatch. Don't add code that does real jobs in hooks.
// Otherwise the code would be hard to read and maintian.
exports.default = {
    onStartup,
    onShutdown,
    onPrefsEvent,
    renameSelectedItems: rename_1.renameSelectedItems,
};
