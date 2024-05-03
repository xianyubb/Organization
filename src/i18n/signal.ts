/** 生成系统提示
 * @param message i18n 翻译信息
 */
export function XYMessage(message: string, language: string = "zh_cn", ...info: Array<any>) {
    return `§a[§6${i18n.get("Organization")}§a] §c${i18n.trl(language, message, info)}`;
}

/** 生成表单提示
 * @param message i18n 翻译信息
 * @param language 语言 默认 zh_cn
 * @param info 参数
 */
export function XYSignal(message: string, language: string = "zh_cn", ...info: Array<any>) {
    return `${i18n.trl(language, message, info)}`;
}

