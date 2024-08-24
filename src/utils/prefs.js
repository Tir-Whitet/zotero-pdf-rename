"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPref = getPref;
exports.setPref = setPref;
exports.clearPref = clearPref;
const package_json_1 = require("../../package.json");
/**
 * Get preference value.
 * Wrapper of `Zotero.Prefs.get`.
 * @param key
 */
function getPref(key) {
    return Zotero.Prefs.get(`${package_json_1.config.prefsPrefix}.${key}`, true);
}
/**
 * Set preference value.
 * Wrapper of `Zotero.Prefs.set`.
 * @param key
 * @param value
 */
function setPref(key, value) {
    return Zotero.Prefs.set(`${package_json_1.config.prefsPrefix}.${key}`, value, true);
}
/**
 * Clear preference value.
 * Wrapper of `Zotero.Prefs.clear`.
 * @param key
 */
function clearPref(key) {
    return Zotero.Prefs.clear(`${package_json_1.config.prefsPrefix}.${key}`, true);
}
