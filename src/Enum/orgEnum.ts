

export enum orgLevel {
    Normal = 0,
    Middle = 1,
    High = 2
}

export enum playerLevel {
    Member = 0,
    Manager = 1,
    Owner = 2
}

export function LeveltoString(level: orgLevel) {
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