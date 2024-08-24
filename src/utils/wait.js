"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitUntil = waitUntil;
exports.waitUtilAsync = waitUtilAsync;
/**
 * Wait until the condition is `true` or timeout.
 * The callback is triggered if condition returns `true`.
 * @param condition
 * @param callback
 * @param interval
 * @param timeout
 */
function waitUntil(condition, callback, interval = 100, timeout = 10000) {
    const start = Date.now();
    const intervalId = ztoolkit.getGlobal("setInterval")(() => {
        if (condition()) {
            ztoolkit.getGlobal("clearInterval")(intervalId);
            callback();
        }
        else if (Date.now() - start > timeout) {
            ztoolkit.getGlobal("clearInterval")(intervalId);
        }
    }, interval);
}
/**
 * Wait async until the condition is `true` or timeout.
 * @param condition
 * @param interval
 * @param timeout
 */
function waitUtilAsync(condition, interval = 100, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const intervalId = ztoolkit.getGlobal("setInterval")(() => {
            if (condition()) {
                ztoolkit.getGlobal("clearInterval")(intervalId);
                resolve();
            }
            else if (Date.now() - start > timeout) {
                ztoolkit.getGlobal("clearInterval")(intervalId);
                reject();
            }
        }, interval);
    });
}
