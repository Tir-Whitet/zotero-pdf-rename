import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { renameSelectedItems } from "./rename";
import { messageWindow } from "./rename";

// 用于包裹静态方法，添加日志记录和错误处理功能。
// 每次调用被装饰的方法时，它会记录调用信息（包括方法名），并在发生错误时记录错误详情。
function example(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
      throw e;
    }
  };
  return descriptor;
}

export class BasicExampleFactory {
  @example
  static registerPrefs() {
    const prefOptions = {
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs-title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
      defaultXUL: true,
    };
    ztoolkit.PreferencePane.register(prefOptions);
  }
}

export class KeyExampleFactory {
  @example
  static registerRenameShortcuts() {
    if (!Zotero.Prefs.get("pdfrename.shortcut.enable")) {
      messageWindow(`Shortcut off`, "default");
      ztoolkit.Shortcut.unregisterAll();
      return;
    }
    ztoolkit.Shortcut.unregisterAll();
    const modSet = Zotero.Prefs.get("pdfrename.shortcut.modifiers")?.toString();
    const keySet = Zotero.Prefs.get("pdfrename.shortcut.key")?.toString();
    messageWindow(`Shortcut on: ${modSet}+${keySet}`, "success");
    ztoolkit.Shortcut.register("event", {
      id: `${config.addonRef}-key-rename`,
      key: keySet || "D",
      modifiers: modSet,
      callback: (keyOptions) => {
        addon.hooks.renameSelectedItems();
      },
    });
  }

  @example
  static exampleShortcutConflictingCallback() {
    const conflictingGroups = ztoolkit.Shortcut.checkAllKeyConflicting();
    new ztoolkit.ProgressWindow("Check Key Conflicting")
      .createLine({
        text: `${conflictingGroups.length} groups of conflicting keys found. Details are in the debug output/console.`,
      })
      .show(-1);
    ztoolkit.log(
      "Conflicting:",
      conflictingGroups,
      "All keys:",
      ztoolkit.Shortcut.getAll()
    );
  }
}

export class UIExampleFactory {
  @example
  static registerRightClickMenuItemRename() {
    const menuIcon = `chrome://${config.addonRef}/content/icons/favicon@0.5x.png`;
    // item menuitem with icon
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-itemmenu-renamePDF",
      label: getString("menuitem-renamePDF"),
      commandListener: (ev) => addon.hooks.renameSelectedItems(),
      icon: menuIcon,
    });
  }
}
