"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeveltoString = exports.playerLevel = exports.orgLevel = void 0;
var orgLevel;
(function (orgLevel) {
    orgLevel[orgLevel["Normal"] = 0] = "Normal";
    orgLevel[orgLevel["Middle"] = 1] = "Middle";
    orgLevel[orgLevel["High"] = 2] = "High";
})(orgLevel || (exports.orgLevel = orgLevel = {}));
var playerLevel;
(function (playerLevel) {
    playerLevel[playerLevel["Member"] = 0] = "Member";
    playerLevel[playerLevel["Manager"] = 1] = "Manager";
    playerLevel[playerLevel["Owner"] = 2] = "Owner";
})(playerLevel || (exports.playerLevel = playerLevel = {}));
function LeveltoString(level) {
    switch (level) {
        case orgLevel.Normal:
            return "Normal";
        case orgLevel.Middle:
            return "Middle";
        case orgLevel.High:
            return "High";
        default:
    }
}
exports.LeveltoString = LeveltoString;
