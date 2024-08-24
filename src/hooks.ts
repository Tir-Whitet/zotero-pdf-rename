import {
  BasicExampleFactory,
  KeyExampleFactory,
  UIExampleFactory,
} from "./modules/examples";
import { config } from "../package.json";
import { getString, initLocale } from "./utils/locale";
import { registerPrefsScripts } from "./modules/preferenceScript";
import { renameSelectedItems } from "./modules/rename";


// 等待 Zotero 初始化、解锁和用户界面准备就绪的异步操作完成。
// 初始化本地化环境。
// 设置进度窗口的默认图标。
// 注册偏好设置、快捷键和右键菜单项。
async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);
  initLocale();
  ztoolkit.ProgressWindow.setIconURI(
    "default",
    `chrome://${config.addonRef}/content/icons/favicon.png`
  );

  BasicExampleFactory.registerPrefs();
  KeyExampleFactory.registerRenameShortcuts();
  UIExampleFactory.registerRightClickMenuItemRename();
}

// 卸载所有注册的工具和监听器。
// 关闭任何打开的对话框窗口。
// 清理附加数据并删除 Zotero 中的插件实例。
function onShutdown(): void {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
  // Remove addon object
  addon.data.alive = false;
  delete Zotero[config.addonInstance];
}

/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case "load":
      registerPrefsScripts(data.window);
      break;
    default:
      return;
  }
}

// Add your hooks here. For element click, etc.
// Keep in mind hooks only do dispatch. Don't add code that does real jobs in hooks.
// Otherwise the code would be hard to read and maintian.

export default {
  onStartup,
  onShutdown,
  onPrefsEvent,
  renameSelectedItems,
};
