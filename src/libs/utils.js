import {Platform} from 'react-native';
import {Dimensions} from "react-native";

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};