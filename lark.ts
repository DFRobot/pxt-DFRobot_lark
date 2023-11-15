
//% weight=100 color=#1abc9c icon="\uf0b2" block="lark"
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

    }

    //% block="get lark module  time stamp" 
    //% weight=70
    export function getTime(): string {
        return ""
    }

    //% block="get lark module %type value (String)" 
    //% weight=60
    export function getValueString(type: ValueDataType): string {
        return ""
    }

    //% block="get lark module %type value (float)" 
    //% weight=50
    export function getValueFloat(type: UintDataType): number {
        return 1
    }

    //% block="get lark module %type unit" 
    //% weight=40
    export function getUnit(type: UintDataType): string {
        return ""
    }

    //% block="get lark module %str value (String)" 
    //% weight=30
    export function getValueString1(str: string): string {
        return ""
    }

    //% block="get lark module %str value (float)" 
    //% weight=20
    export function getValueFloat1(str: string): number {
        return 1
    }

    //% block="get lark module %str unit" 
    //% weight=10
    export function getUnit1(str: string): string {
        return ""
    }
    
}