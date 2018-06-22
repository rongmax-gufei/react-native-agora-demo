import { Dimensions, PixelRatio } from 'react-native'
import storage from './storage'

global.storage = storage
global.gScreen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    navBarHeight: global.__IOS__ ? 64 : 50,
    navBarPaddingTop: global.__IOS__ ? 20 : 0,
    onePix: 1 / PixelRatio.get(),
    isIPad: Dimensions.get('window').width / Dimensions.get('window').height > 9 / 16
}
