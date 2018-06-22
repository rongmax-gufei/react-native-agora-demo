import React from 'react'
import {Scene, Stack, Router} from 'react-native-router-flux'
import {
    Login,
    VideoChat,
    ScreenShare
} from './pages'

export const RKey = {
    ROOT: 'root',
    LOGIN: 'Login',
    VIDEO_CHAT: 'VideoChat',
    SCREEN_SHARE: 'ScreenShare'
}

const ROUTER = () => (<Router>
    <Stack key={RKey.ROOT}>
        <Scene key={RKey.LOGIN} component={Login} hideNavBar/>
        <Scene key={RKey.VIDEO_CHAT} component={VideoChat} hideNavBar/>
        <Scene key={RKey.SCREEN_SHARE} component={ScreenShare} hideNavBar/>
    </Stack>
</Router>)

export default ROUTER