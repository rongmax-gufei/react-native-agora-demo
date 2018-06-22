import {Dimensions, Platform} from 'react-native';

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};