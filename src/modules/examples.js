"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIExampleFactory = exports.KeyExampleFactory = exports.BasicExampleFactory = void 0;
const package_json_1 = require("../../package.json");
const locale_1 = require("../utils/locale");
const rename_1 = require("./rename");
function example(target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
        try {
            ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
            return original.apply(this, args);
        }
        catch (e) {
            ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
            throw e;
        }
    };
    return descriptor;
}
class BasicExampleFactory {
    static registerPrefs() {
        const prefOptions = {
            pluginID: package_json_1.config.addonID,
            src: rootURI + "chrome/content/preferences.xhtml",
            label: (0, locale_1.getString)("prefs-title"),
            image: `chrome://${package_json_1.config.addonRef}/content/icons/favicon.png`,
            defaultXUL: true,
        };
        ztoolkit.PreferencePane.register(prefOptions);
    }
}
exports.BasicExampleFactory = BasicExampleFactory;
__decorate([
    example
], BasicExampleFactory, "registerPrefs", null);
class KeyExampleFactory {
    static registerRenameShortcuts() {
        var _a, _b;
        if (!Zotero.Prefs.get("pdfrename.shortcut.enable")) {
            (0, rename_1.messageWindow)(`Shortcut off`, "default");
            ztoolkit.Shortcut.unregisterAll();
            return;
        }
        ztoolkit.Shortcut.unregisterAll();
        const modSet = (_a = Zotero.Prefs.get("pdfrename.shortcut.modifiers")) === null || _a === void 0 ? void 0 : _a.toString();
        const keySet = (_b = Zotero.Prefs.get("pdfrename.shortcut.key")) === null || _b === void 0 ? void 0 : _b.toString();
        (0, rename_1.messageWindow)(`Shortcut on: ${modSet}+${keySet}`, "success");
        ztoolkit.Shortcut.register("event", {
            id: `${package_json_1.config.addonRef}-key-rename`,
            key: keySet || "D",
            modifiers: modSet,
            callback: (keyOptions) => {
                addon.hooks.renameSelectedItems();
            },
        });
    }
    static exampleShortcutConflictingCallback() {
        const conflictingGroups = ztoolkit.Shortcut.checkAllKeyConflicting();
        new ztoolkit.ProgressWindow("Check Key Conflicting")
            .createLine({
            text: `${conflictingGroups.length} groups of conflicting keys found. Details are in the debug output/console.`,
        })
            .show(-1);
        ztoolkit.log("Conflicting:", conflictingGroups, "All keys:", ztoolkit.Shortcut.getAll());
    }
}
exports.KeyExampleFactory = KeyExampleFactory;
__decorate([
    example
], KeyExampleFactory, "registerRenameShortcuts", null);
__decorate([
    example
], KeyExampleFactory, "exampleShortcutConflictingCallback", null);
class UIExampleFactory {
    static registerRightClickMenuItemRename() {
        const menuIcon = `chrome://${package_json_1.config.addonRef}/content/icons/favicon@0.5x.png`;
        // item menuitem with icon
        ztoolkit.Menu.register("item", {
            tag: "menuitem",
            id: "zotero-itemmenu-renamePDF",
            label: (0, locale_1.getString)("menuitem-renamePDF"),
            commandListener: (ev) => addon.hooks.renameSelectedItems(),
            icon: menuIcon,
        });
    }
}
exports.UIExampleFactory = UIExampleFactory;
__decorate([
    example
], UIExampleFactory, "registerRightClickMenuItemRename", null);
