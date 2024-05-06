"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initData = void 0;
const fs = require("fs");
const __1 = require("../..");
function initData() {
    if (!fs.existsSync(`${__1.path}/orgData.json`)) {
        fs.mkdir(__1.path, () => {
            fs.writeFileSync(`${__1.path}/orgData.json`, JSON.stringify([]));
        });
    }
}
exports.initData = initData;
initData();
