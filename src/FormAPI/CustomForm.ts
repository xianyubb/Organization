

interface Control {
    id: number
    type: 'Label' | 'Input' | 'Switch' | 'Dropdown' | 'Slider' | 'StepSlider'
    Callback: (data: any, player: Player) => void
}


/**
 * 自定义表单
 */
export class XYCustomForm {
    player: Player

    form: CustomForm

    ControlList: Control[] = []

    Controlid: number = -1

    /**
     * 
     * @param title 表单标题
     * @param player 要发送表单的玩家
     */
    constructor(title: string, player: Player) {
        this.player = player
        this.form = mc.newCustomForm()
        this.form.setTitle(title)
    }

    /**
     * 添加数据
     * @param ControlType 控件类型
     * @param Callback 回调
     */
    private addData(
        ControlType: | 'Label' | 'Input' | 'Switch' | 'Dropdown' | 'Slider' | 'StepSlider',
        Callback: (data: any, player: Player) => void
    ) {
        this.ControlList.push({
            id: (this.Controlid += 1),
            type: ControlType,
            Callback
        })
    }

    /**
     * 添加一行文本
     * @param text 文本
     * @param Callback 回调
     * @returns 返回自己以便连续操作
     */
    public addLabel(text: string, Callback: (data: any, player: Player) => void) {
        this.form.addLabel(text)
        this.addData('Label', Callback)
        return this;
    }

    /**
     * 添加一行输入框
     * @param title 描述文本
     * @param Callback 回调
     * @param placeholder （可选参数）提示字符
     * @param _default (可选参数）默认内容
     * @returns 返回自己以便连续操作
     */
    public addInput(
        title: string,
        Callback: (data: any, player: Player) => void,
        placeholder?: string,
        _default?: string
    ) {
        this.form.addInput(title, placeholder, _default)
        this.addData('Input', Callback)
        return this;
    }

    /**
     * 增加一个开关
     * @param title 描述文本
     * @param Callback 回调
     * @param _default 默认状态
     * @returns 返回自己以便连续操作
     */
    public addSwitch(
        title: string,
        Callback: (data: any, player: Player) => void,
        _default?: boolean
    ) {
        this.form.addSwitch(title, _default)
        this.addData('Switch', Callback)
        return this;
    }


    /**
     * 增加一行下拉菜单
     * @param title 描述文本
     * @param items 选项文本列表
     * @param Callback （可选参数）下拉菜单默认选中的列表项序号
     * @param _default 
     * @returns 返回自己以便连续操作
     */
    public addDropdown(
        title: string,
        items: string[],
        Callback: (data: any, player: Player) => void,
        _default?: number
    ) {
        this.form.addDropdown(title, items, _default)
        this.addData('Dropdown', Callback)
        return this;
    }

    /**
     * 增加一行游标滑块
     * @param title 描述文本
     * @param min 最小值
     * @param max 最大值
     * @param Callback 回调
     * @param step （可选参数）游标滑块调整的最小分度值，默认为 1
     * @param _default （可选参数）游标滑块默认初始格数，数值必须在最小和最大格数之间。
     * @returns 
     */
    public addSlider(
        title: string,
        min: number,
        max: number,
        Callback: (data: any, player: Player) => void,
        step: number = 1,
        _default?: number
    ) {
        this.form.addSlider(title, min, max, step, _default)
        this.addData('Slider', Callback)
        return this;
    }

    /**
     * 增加一行步进滑块
     * @param title 描述文本
     * @param items 选项文本列表
     * @param Callback 回调
     * @param _default (可选参数) 步进滑块默认初始选项。序号从0开始编号
     * @returns 
     */
    public addStepSlider(
        title: string,
        items: string[],
        Callback: (data: any, player: Player) => void,
        _default?: number
    ) {
        this.form.addStepSlider(title, items, _default)
        this.addData('StepSlider', Callback)
        return this;
    }

    public send() {
        this.player.sendForm(this.form, (player, data) => {
            if (!data) return
            const { length } = data
            for (let i = 0; i < length; i += 1) {
                this.ControlList[i].Callback(data[this.ControlList[i].id], player)
            }
        })
    }
}
