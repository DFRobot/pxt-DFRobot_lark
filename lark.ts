
//% weight=100 color=#1abc9c icon="\uf0b2" block="Lark"
namespace lark {

    export enum ValueDataType {
        //% block="Speed"
        Speed = 1,
        //% block="DIR"
        Direction = 2,
        //% block="Temp"
        Temp = 3,
        //% block="Humi"
        Humi = 4,
        //% block="Pressure"
        Pressure = 5
    }

    export enum UintDataType {
        //% block="Speed"
        Speed = 1,
        //% block="Temp"
        Temp = 2,
        //% block="Humi"
        Humi = 3,
        //% block="Pressure"
        Pressure = 4
    }


    const DEBUG                     = false      ///<Debugging information

    const CMD_GET_DATA              = 0x00      ///< Return the name based on the given name
    const CMD_GET_ALL_DATA          = 0x01      ///< Get all onboard sensor data
    const CMD_SET_TIME              = 0x02      ///< Set onboard RTC time
    const CME_GET_TIME              = 0x03
    const CMD_GET_UNIT              = 0x04      ///< Get sensor units
    const CMD_GET_VERSION           = 0x05      ///< Get version number
    const IIC_MAX_TRANSFER          = 32        ///< Maximum transferred data via I2C
    const I2C_ACHE_MAX_LEN          = 32
    const CMD_END                   = 0x05


    const ERR_CODE_NONE             = 0x00      ///< Normal communication 
    const ERR_CODE_CMD_INVAILED     = 0x01      ///< Invalid command
    const ERR_CODE_RES_PKT          = 0x02      ///< Response packet error
    const ERR_CODE_M_NO_SPACE       = 0x03      ///< Insufficient memory of I2C controller(master)
    const ERR_CODE_RES_TIMEOUT      = 0x04      ///< Response packet reception timeout
    const ERR_CODE_CMD_PKT          = 0x05      ///< Invalid command packet or unmatched command
    const ERR_CODE_SLAVE_BREAK      = 0x06      ///< Peripheral(slave) fault
    const ERR_CODE_ARGS             = 0x07      ///< Set wrong parameter
    const ERR_CODE_SKU              = 0x08      ///< The SKU is an invalid SKU, or unsupported by SCI Acquisition Module
    const ERR_CODE_S_NO_SPACE       = 0x09      ///< Insufficient memory of I2C peripheral(slave)
    const ERR_CODE_I2C_ADRESS       = 0x0A      ///< Invalid I2C address

    const STATUS_SUCCESS            = 0x53      ///< Status of successful response   
    const STATUS_FAILED             = 0x63      ///< Status of failed response


    
    let address = 0x42;
    let timeout = 2500;
    let errorCode = 0;
    let recvPkt = { status: 0, cmd: 0, lenL: 0, lenH: 0, buf: [] as number[]};

    //% block="lark module initialization until successful I2C mode address 0x42" 
    //% weight=90
    export function initDevice(): void {

    }

    //% block="lark module set time %year year %month month %day day %hour hour %min minute %sec second" 
    //% year.min=2000 year.max=2099 year.defl=2023
    //% month.min=1 month.max=12 month.defl=12
    //% day.min=1 day.max=31 day.defl=8
    //% hour.min=0 hour.max=59 hour.defl=11
    //% min.min=0 min.max=59 min.defl=0
    //% sec.min=0 sec.max=59 sec.defl=0
    //% inlineInputMode=inline
    //% weight=80
    export function setTime(year: number, month: number, day: number, hour: number, min: number, sec: number): void {
        let length = 7;
        let sendpkt = [CMD_SET_TIME, length & 0xFF, (length >> 8) & 0xFF, year-2000, month, day, 0, hour, min, sec];
        sendPacket(sendpkt, 3 + length);

        recvPacket(CMD_SET_TIME);
        if (recvPkt.status == STATUS_FAILED) { errorCode = recvPkt.buf[0]; }
        if (recvPkt.status == STATUS_SUCCESS) {
            length = (recvPkt.lenH << 8) | recvPkt.lenL;
            if (DEBUG) {
                serial.writeLine("set time");
            }
        }
    }

    //% block="get lark module  time stamp" 
    //% weight=70
    export function getTime(): string {
        let length = 0;
        let values = "";
        let sendpkt = [CME_GET_TIME, 0, 0];
        sendPacket(sendpkt, 3 + length);
        
        recvPacket(CME_GET_TIME);
        if (recvPkt.status == STATUS_FAILED) { errorCode = recvPkt.buf[0]; }
        if (recvPkt.status == STATUS_SUCCESS) {
            length = (recvPkt.lenH << 8) | recvPkt.lenL;
            for (let i = 0; i < length; i++) {
                values = values + String.fromCharCode(recvPkt.buf[i]);
            }
        }
        return values;
    }

    //% block="get lark module %type value (String)" 
    //% weight=60
    export function getValueString(type: ValueDataType): string {
        switch (type) {
            case ValueDataType.Speed: return getValue("Speed");
            case ValueDataType.Direction:  return getValue("Dir");
            case ValueDataType.Temp:  return getValue("Temp");
            case ValueDataType.Humi:  return getValue("Humi");
            case ValueDataType.Pressure:  return getValue("Pressure");
            default: return "";
        }
    }

    //% block="get lark module %type value (float)" 
    //% weight=50
    export function getValueFloat(type: UintDataType): number {
        switch (type) {
            case UintDataType.Speed: return parseFloat(getValue("Speed"));
            case UintDataType.Temp:  return parseFloat(getValue("Temp"));
            case UintDataType.Humi:  return parseFloat(getValue("Humi"));
            case UintDataType.Pressure:  return parseFloat(getValue("Pressure"));
            default: return 0;
        }
    }

    //% block="get lark module %type unit" 
    //% weight=40
    export function getUnitString(type: UintDataType): string {
        switch (type) {
            case UintDataType.Speed: return getUnit("Speed");
            case UintDataType.Temp:  return getUnit("Temp");
            case UintDataType.Humi:  return getUnit("Humi");
            case UintDataType.Pressure:  return getUnit("Pressure");
            default: return "";
        }
    }

    //% block="get lark module %str value (String)" 
    //% weight=30
    export function getValueString1(str: string): string {
        return getValue(str);
    }

    //% block="get lark module %str value (float)" 
    //% weight=20
    export function getValueFloat1(str: string): number {
        return parseFloat(getValue(str));
    }

    //% block="get lark module %str unit" 
    //% weight=10
    export function getUnitString1(str: string): string {
        return getUnit(str);
    }


    function getValue(keys: string): string {

        if (keys == null) { return ""; }
        let values = "";
        let length = keys.length;
        let sendpkt = [CMD_GET_DATA, length & 0xFF, (length >> 8) & 0xFF];
        for (let i = 0; i < keys.length; i++) {
            sendpkt.push(keys.charCodeAt(i));
        }
        // sendpkt.push(0); //加上"/0"
        sendPacket(sendpkt, 3 + length);

        recvPacket(CMD_GET_DATA);
        if (recvPkt.status == STATUS_FAILED) { errorCode = recvPkt.buf[0]; }
        if (recvPkt.status == STATUS_SUCCESS) {
            length = (recvPkt.lenH << 8) | recvPkt.lenL;
            for (let i = 0; i < length; i++) {
                values = values + String.fromCharCode(recvPkt.buf[i]);
            }
        }
        return values;
    }

    function getUnit(keys: string): string {

        if (keys == null) { return ""; }
        let values = "";
        let length = keys.length;
        let sendpkt = [CMD_GET_UNIT, length & 0xFF, (length >> 8) & 0xFF];
        for (let i = 0; i < keys.length; i++) {
            sendpkt.push(keys.charCodeAt(i));
        }
        // sendpkt.push(0); //加上"/0"
        sendPacket(sendpkt, 3 + length);

        recvPacket(CMD_GET_UNIT);
        if (recvPkt.status == STATUS_FAILED) { errorCode = recvPkt.buf[0]; }
        if (recvPkt.status == STATUS_SUCCESS) {
            length = (recvPkt.lenH << 8) | recvPkt.lenL;
            for (let i = 0; i < length; i++) {
                values = values + String.fromCharCode(recvPkt.buf[i]);
            }
        }
        return values;
    }

    function sendPacket(data: number[], length: number): void {
        let remain = length;
        let i = 0;
        while(remain){
            length = (remain > IIC_MAX_TRANSFER) ? IIC_MAX_TRANSFER : remain;
            if (remain > IIC_MAX_TRANSFER) {
                pins.i2cWriteBuffer(address, pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER, i * IIC_MAX_TRANSFER + length)), false);
            } else {
                pins.i2cWriteBuffer(address, pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER, i * IIC_MAX_TRANSFER + length)), true);
            }
            remain = remain - length;
            i = i + 1;
        }
    }

    function recvData(length: number): Buffer {

        let remain = length;
        let buf: Buffer = pins.createBuffer(0);
        while(remain){
            length = (remain > IIC_MAX_TRANSFER) ? IIC_MAX_TRANSFER : remain;
            if (remain > IIC_MAX_TRANSFER) {
                buf = buf.concat(pins.i2cReadBuffer(address, length));
            } else {
                buf = buf.concat(pins.i2cReadBuffer(address, length));
            }
            remain = remain - length;
        }
        return buf;
    }

    function recvFlush(): void {
        recvData(10);
    }
    

    function recvPacket(cmd: number): void {

        if (cmd > CMD_END) {
            errorCode = ERR_CODE_CMD_INVAILED; //There is no this command
            if (DEBUG) {
                serial.writeLine("cmd is error!")
            }
            return;
        }
        let data: Buffer;
        let length = 0;
        let t = control.millis();
        // recvPkt = { status: 0, cmd: 0, lenL: 0, lenH: 0, buf: [] };
        recvPkt.status = 0;
        recvPkt.cmd = 0;
        recvPkt.lenL = 0;
        recvPkt.lenH = 0;
        recvPkt.buf = [];
        while (control.millis() - t < timeout) {
            recvPkt.status = recvData(1)[0];
            switch(recvPkt.status){
                case STATUS_SUCCESS:
                case STATUS_FAILED:
                {
                    recvPkt.cmd = recvData(1)[0];
                    if (recvPkt.cmd != cmd) {
                        recvFlush();
                        errorCode = ERR_CODE_RES_PKT; //Response packet error
                        if (DEBUG) {
                            serial.writeLine("Response pkt is error!")
                        }
                        return;
                    }
                    data = recvData(2);
                    recvPkt.lenL = data[0];
                    recvPkt.lenH = data[1];
                    length = (recvPkt.lenH << 8) | recvPkt.lenL;
                    if (length) {
                        data = recvData(length);
                        for (let i = 0; i < length; i++) {
                            recvPkt.buf.push(data[i]);
                        }
                    }
                    return;
                }
            }
            basic.pause(50);
        }
        if (DEBUG) {
            serial.writeLine("Time out!")
        }
        errorCode = ERR_CODE_RES_TIMEOUT;
        return;
    }

}