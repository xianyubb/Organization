"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XYSignal = exports.XYMessage = void 0;
/** 生成系统提示
 * @param message i18n 翻译信息
 */
function XYMessage(message, language = "zh_cn", ...info) {
    return `§a[§6${i18n.get("Organization")}§a] §c${i18n.trl(language, message, info)}`;
}
exports.XYMessage = XYMessage;
/** 生成表单提示
 * @param message i18n 翻译信息
 * @param language 语言 默认 zh_cn
 * @param info 参数
 */
function XYSignal(message, language = "zh_cn", ...info) {
    return `${i18n.trl(language, message, info)}`;
}
exports.XYSignal = XYSignal;
