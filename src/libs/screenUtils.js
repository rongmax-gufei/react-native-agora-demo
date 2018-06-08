import {Platform} from 'react-native';
import {Dimensions} from "react-native";

export let screenW = Dimensions.get('window').width;
export let screenH = Dimensions.get('window').height;

// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

const i47_WIDTH = 375;
const i47_HEIGHT = 667;

const i55_WIDTH = 621;
const i55_HEIGHT = 1104;

/**
 * 4.7寸屏幕
 * @returns {boolean}
 */
export function isIphone47() {
    return (
        Platform.OS === 'ios' &&
        ((screenH === i47_HEIGHT && screenW === i47_WIDTH) ||
            (screenH === i47_WIDTH && screenW === i47_HEIGHT))
    )
}

/**
 * 5.5寸屏幕
 * @returns {boolean}
 */
export function isIphone55() {
    return (
        Platform.OS === 'ios' &&
        ((screenH === i55_HEIGHT && screenW === i55_WIDTH) ||
            (screenH === i55_WIDTH && screenW === i55_HEIGHT))
    )
}

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((screenH === X_HEIGHT && screenW === X_WIDTH) ||
            (screenH === X_WIDTH && screenW === X_HEIGHT))
    )
}

/**
 * 根据是否是iPhoneX返回不同的样式
 * @param iphoneXStyle
 * @param iosStyle
 * @param androidStyle
 * @returns {*}
 */

export function ifIphoneX(iphoneXStyle, iosStyle, androidStyle) {
    if (isIphoneX()) {
        return iphoneXStyle;
    } else if (Platform.OS === 'ios') {
        return iosStyle
    } else {
        if (androidStyle) return androidStyle;
        return iosStyle
    }
}
