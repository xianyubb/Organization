/** 生成系统提示
 * @param message i18n 翻译信息
 */

export function createSystemMessage(message: string, language: string = "zh_cn", ...info: Array<any>) {
    return `§a[§6${i18n.get("Organization")}§a] §c${i18n.trl(language, message, info)}`;
}
