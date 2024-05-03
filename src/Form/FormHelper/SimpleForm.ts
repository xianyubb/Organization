interface Button {
    text: string;
    Callback: (player: Player) => void;
}

/**
 * 按钮表单
 */
export class XYSimpleForm {
    player: Player;

    ButtonList: Button[] = [];

    form: SimpleForm;

    /**
     * @constructor
     * @param title 表单标题
     * @param content 表单内容
     * @param player 要发送表单的玩家
     */
    constructor(title: string, content: string, player: Player) {
        this.player = player;
        this.form = mc.newSimpleForm();
        this.form.setTitle(title).setContent(content);
    }

    /**
     * 添加一个按钮
     * @param text 按钮显示文字
     * @param Callback 按钮回调函数
     */
    addButton(text: string, Callback:
        /**
         * @param player 点击按钮的玩家
         */
        (player: Player) => void) {
        this.ButtonList.push({
            text,
            Callback
        });
        this.form.addButton(text);
        return this;
    }

    /**
     * 发送表单
     */
    send() {
        this.player.sendForm(this.form, (player, id) => {
            if (id === null) return;
            try {
                this.ButtonList[id].Callback(player);
            } catch (e) {
                // ignore
            }
        });
    }
}
