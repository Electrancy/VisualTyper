var gkm = require('gkm');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const handleKey = require('./handle-key');
const port = process.env.PORT || 3000;
const connectionStatus = {
    justConnected: false
};
const debugMode=false;
const clearOnType=true;
var typed = "";

function handleKeyPressed(functionToCall, returnFunctionCall=false) {
    const result = (this.event == 'key.pressed');
    const handleKeyData = { typed, strData: this.strData, isKeyPressed: handleKeyPressed, clearTyped, handleTyped, handleTypedReplaceAll }
    if (result && functionToCall) {
        if (!returnFunctionCall) {
            functionToCall(handleKeyData);
        } else {
            return functionToCall(handleKeyData);
        }
    }
    return result;
}

function handleKeyReleased(functionToCall) {
    const result = (this.event == 'key.released');
    const handleKeyData = { typed, strData: this.strData, isKeyPressed: handleKeyPressed, clearTyped, handleTyped, handleTypedReplaceAll }
    if (result && functionToCall) {
        functionToCall(handleKeyData);
    }
}

function handleTyped(condition=false, onTrue, onFalse='') {
    typed += condition ? onTrue : onFalse
    io.emit('typed', typed);
    if (clearOnType)
        console.clear();
    console.log(typed);
}

function handleTypedReplaceAll(replacement) {
    typed = replacement;
    io.emit('typed', typed);
    if (clearOnType)
        console.clear();
    console.log(typed);
}

function clearTyped(caseNum, isHandlingTyped) {
    typed="";
    console.log(`Clear ${caseNum}`);
    if (isHandlingTyped) {
        handleTyped();
    }
}

// Listen to all mouse events (click, pressed, released, moved, dragged)
gkm.events.on('mouse.pressed', function (data) {
    clearTyped(3);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    if (!connectionStatus.justConnected) {
        console.log("Connection to web client established!")
        connectionStatus.justConnected = true;
        setTimeout(()=>{
            connectionStatus.justConnected = false;
        },1000)
    }
});

gkm.events.on('key.*', function (data) {
    const strData = data.toString();
    this.strData=strData;
    handleKeyPressed=handleKeyPressed.bind(this);
    handleKeyReleased=handleKeyReleased.bind(this);
    clearTyped= clearTyped.bind(this);
    
    if (debugMode)
        console.log(this.event + ' ' + data);

    if (!handleKeyPressedCases(strData)) {
        handleKeyReleased(handleKey[`Released ${strData}`]);
    }
});

function handleKeyPressedCases(strData) {
    if (handleKey["conditions"] && handleKeyPressed(handleKey["conditions"], true)) {
        return true;
    } else if (handleKey[strData] && handleKeyPressed(handleKey[strData])) {
        return true;
    } else if (handleKey[undefined] && handleKeyPressed(handleKey[undefined])) {
        return true;
    } else {
        return false;
    }
}

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
