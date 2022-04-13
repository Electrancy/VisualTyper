let isLeftShiftPressed = false,
    isRightShiftPressed = false,
    isLeftControlPressed = false,
    capsLock = false;
const resetTypedTriggers = ['Down', 'Up', 'Left', 'Right', 'Enter'];
const resetTypedLeftControlTriggersHoldEmit = ['A'];

const shiftNumbers = ")!@#$%^&*(";
const otherSymbols = {
    'Back Quote': '`',
    'Minus': "-",
    "Equals": "="
}
const shiftOtherSymbols = {
    'Back Quote': '~',
    'Minus': "_",
    "Equals": "+"
}
const characterSymbols = {
    "Open Bracket": "[",
    "Close Bracket": "]",
    "Semicolon": ";",
    "Quote": "\'",
    "Comma": ",",
    "Period": ".",
    "Back Slash": "\\",
    "Slash": "/"
}
const shiftCharacterSymbols = {
    "Open Bracket": "{",
    "Close Bracket": "}",
    "Semicolon": ":",
    "Quote": "\"",
    "Comma": "<",
    "Period": ">",
    "Back Slash": "|",
    "Slash": "?"
}

const handleKey = { 
    "conditions": (handleKeyData) => {
        const {  isKeyPressed, clearTyped, strData } = handleKeyData;
        if (strData=="Left Control")
            return false;
        if (isLeftControlPressed) {
            clearTyped('Control+Key Pressed', !resetTypedLeftControlTriggersHoldEmit.includes(strData));
            return true;
        } else if (resetTypedTriggers.includes(strData)) {
            clearTyped(resetTypedTriggers.join('/')+" Pressed");
            return true;
        }
        return false;
    },
    "Caps Lock": () => {
        capsLock = !capsLock;
    },
    "Left Control": () => {
        isLeftControlPressed = true;
    },
    "Left Shift": () => {
        isLeftShiftPressed = true;
    },
    "Right Shift": () => {
        isRightShiftPressed = true;
    },
    "Backspace": (handleKeyData) => {
        const {  typed , handleTypedReplaceAll } = handleKeyData;
        handleTypedReplaceAll(typed.slice(0, -1));
    },
    "Space": (handleKeyData) => {
        const { handleTyped } = handleKeyData;
        handleTyped(true,' ');
    },
    "Released Left Shift": () => {
        isLeftShiftPressed = false;
    },
    "Released Right Shift": () => {
        isRightShiftPressed = false;
    },
    "Released Left Control": () => {
        isLeftControlPressed = false;
    },
    "undefined": (handleKeyData) => {
        const {  strData, handleTyped } = handleKeyData;
        handleTyped((isLeftShiftPressed || isRightShiftPressed || capsLock), shiftCharacterize(strData), characterize(strData));
    },
};

function shiftCharacterize(data) {
    if (shiftNumbers[data])
        data = shiftNumbers[data];
    else if (shiftCharacterSymbols[data])
        data = shiftCharacterSymbols[data];
    else if (shiftOtherSymbols[data])
        data = shiftOtherSymbols[data];
    if (data.length==1)
        return data;
    else
        return ''
}

function characterize(data) {
    if (characterSymbols[data])
        data = characterSymbols[data];
    if (otherSymbols[data])
        data = otherSymbols[data];
    if (data.length==1)
        return data.toLowerCase();
    else
        return ''
}

module.exports = handleKey;