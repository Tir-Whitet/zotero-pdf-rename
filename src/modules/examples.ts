import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { renameSelectedItems } from "./rename";
import { messageWindow } from "./rename";

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
    if (!Zotero.Prefs.get("pdfrename.enableShortcut")) {
      messageWindow(`Shortcut disabled`, "default");
      ztoolkit.Shortcut.unregisterAll();
      return;
    }
    const modSet = Zotero.Prefs.get("pdfrename.renameMod")?.toString();
    const keySet = Zotero.Prefs.get("pdfrename.renameKey")?.toString();
    messageWindow(`Shortcut enabled: ${modSet}+${keySet}`, "success");
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
