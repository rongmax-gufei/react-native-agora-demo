import React, {Component} from 'react'
import {Platform, BackHandler, ToastAndroid} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Provider} from 'mobx-react'

import Router, {RKey} from './src/routes'
import stores from './src/stores/index'

import './src/libs/globe'
import './src/libs/utils'

global.__IOS__ = Platform.OS === 'ios'
global.__ANDROID__ = Platform.OS === 'android'

if (!__DEV__) {
    global.console = {
        log: () => {
        },
        error: () => {
        },
        warn: () => {
        },
    }
}

export default class App extends Component {

    componentWillMount() {
        if (__ANDROID__) BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    componentWillUnmount() {
        if (__ANDROID__) BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }

    onBackAndroid = () => {
        const currentRoutes = Actions.state.routes
        const currentRoute = currentRoutes[0].routeName
        const bTopPage = currentRoutes.length <= 1
        const sTargetPage = (currentRoute === RKey.HOME)
        if (bTopPage && sTargetPage) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                BackHandler.exitApp()
                return false
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT)
            return true;
        }
        Actions.pop()
        return true;
    }

    render() {
        return (<Provider {...stores}>
            <Router/>
        </Provider>)
    }
}
