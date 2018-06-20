/**
 * Agoraio React Native App
 * https://github.com/facebook/react-native
 * @Learnta Inc.
 */

import React, {Component, PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal
} from 'react-native'

import {RtcEngine, AgoraVideoView, AgoraScreenShareView} from 'react-native-agoraio'

import {Toast} from 'antd-mobile'

import {screenW, screenH} from '../libs/screenUtils'

export default class RNAgoraExample extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mainUid: 0,
            remotes: [],
            isJoinSuccess: false,
            isBroadcasting: false,
            enableBroadcast: false,
            isSwitchCamera: false,
            isMute: false,
            disableVideo: false,
            isHideButtons: false,
            visible: false
        }
    }

    componentWillMount() {
        //初始化Agora
        const options = {
            appid: '858c0ae5d2574d6884a257c912b198c0', //控制台申请
            channelProfile: 1, //频道模式,1:直播互动
            videoProfile: 40, //640x480(resolution)、15(fps)、500(kbps)
            clientRole: this.props.role, //1:Broadcaster 2:Audience，实现双向语音通话设置角色为主播即可
            swapWidthAndHeight: true,
        }
        // 初始化声网
        RtcEngine.init(options)
        // 加入房间
        let uid = parseInt(this.props.uid, 10)
        this.setState({
            mainUid: uid,
        }, () => {
            RtcEngine.joinChannel(this.props.channel, this.state.mainUid)
        })
    }

    componentDidMount() {

        // 当前版本号
        RtcEngine.getSdkVersion((version) => {
            console.log(version)
        })

        // 启用说话者音量提示
        RtcEngine.enableAudioVolumeIndication(500, 3)

        // 所有的原生通知统一管理
        RtcEngine.eventEmitter({
            onFirstRemoteVideoDecoded: (data) => {
                // 远端首帧视频接收解码
                console.log(data)
                // 有远程视频加入返回uid，AgoraVideoView根据uid来设置remoteUid值
                const {remotes} = this.state
                const newRemotes = [...remotes]

                // 存在断网重连导致回调多次该方法的情况，已加入过的远程视频不再重复添加
                if (!remotes.find(uid => uid === data.uid)) {
                    newRemotes.push(data.uid)
                }
                this.setState({remotes: newRemotes})
            },
            onUserOffline: (data) => {
                // 有人离开了
                console.log(data)
                const {remotes} = this.state
                const newRemotes = remotes.filter(uid => uid !== data.uid)
                this.setState({remotes: newRemotes})
            },
            onJoinChannelSuccess: (data) => {
                // 加入房间成功
                console.log(data)
                const {isBroadcaster} = this.state
                // 打开美颜
                RtcEngine.openBeautityFace()
                // 开启摄像头预览
                if (isBroadcaster)
                    RtcEngine.startPreview()
                this.setState({
                    isJoinSuccess: true
                })
            },
            onAudioVolumeIndication: (data) => {
                // 声音回调
                // console.log(data)
            },
            onUserJoined: (data) => {
                // 有人来了
                console.log(data)
            },
            onBoardcast: (data) => {
                // 屏幕共享广播
                console.log(data)
                if (data.code === '1000') {
                    this.setState({
                        isBroadcasting: !this.state.isBroadcasting
                    }, () => {
                        RtcEngine.enableLocalVideo(this.state.isBroadcasting)
                    })
                }
            },
            onError: (data) => {
                console.log(data)
                // 错误
                if (data.msg === '17') {
                    RtcEngine.leaveChannel()
                    RtcEngine.destroy()
                }

                const {onCancel} = this.props
                onCancel(data.msg)
            }
        })
    }

    componentWillUnmount() {
        RtcEngine.removeEmitter()
    }

    onPressVideo = (suid) => {
        console.log('suid:' + suid)

        const {remotes} = this.state
        let newRemotes = [...remotes]

        newRemotes = newRemotes.map(x => (x === suid ? this.state.mainUid : x));

        this.setState({
            remotes: newRemotes,
            mainUid: suid
        })
    }

    handlerBroadcast = () => {
        this.setState({
            enableBroadcast: !this.state.enableBroadcast
        }, () => {
            if (this.state.enableBroadcast) RtcEngine.startBroadcasting()
            else {
                RtcEngine.stopBroadcasting()
                this.setState({
                    isBroadcasting: false
                })
            }
        })
    }

    handlerCancel = () => {

        if (this.state.isBroadcasting) RtcEngine.stopBroadcasting()

        RtcEngine.leaveChannel()
        RtcEngine.destroy()

        const {onCancel} = this.props
        onCancel()
    }

    handlerSwitchCamera = () => {
        RtcEngine.switchCamera()
    }

    handlerMuteAllRemoteAudioStreams = () => {
        this.setState({
            isMute: !this.state.isMute
        }, () => {
            RtcEngine.muteAllRemoteAudioStreams(this.state.isMute)
        })
    }

    handlerChangeVideo = () => {
        this.setState({
            disableVideo: !this.state.disableVideo
        }, () => {
            this.state.disableVideo ? RtcEngine.disableVideo() : RtcEngine.enableVideo()
        })
    }

    handlerHideButtons = () => {
        this.setState({
            isHideButtons: !this.state.isHideButtons
        })
    }

    render() {
        const {isBroadcasting, isSwitchCamera, isMute, disableVideo, isHideButtons, remotes, isJoinSuccess, mainUid} = this.state
        if (!isJoinSuccess) {
            return (
                <View style={styles.prerareView}>
                    <Text>正在创建视频会议...</Text>
                </View>
            )
        }
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.handlerHideButtons}
                style={styles.container}>
                {!isBroadcasting && <AgoraVideoView style={styles.fullScreenView}
                                                    renderUid={mainUid}/>}
                {/*{isBroadcasting && <AgoraScreenShareView style={styles.fullScreenView} showSharedScreen/>}*/}
                <View style={styles.absView}>
                    <View style={styles.videoView}>
                        {remotes.map((v, k) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={this.onPressVideo.bind(this, v)}
                                    key={k}>
                                    <AgoraVideoView
                                        style={styles.remoteView}
                                        zOrderMediaOverlay
                                        renderUid={v}/>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    {!isHideButtons &&
                    <View>
                        <OperateButton
                            style={styles.operationWrap}
                            onPress={this.handlerCancel}
                            source={require('../../images/hangup.png')}
                        />
                        <View style={styles.bottomView}>
                            <OperateButton
                                onPress={this.handlerBroadcast}
                                source={require('../../images/btn_request_broadcast.png')}
                            />
                            <OperateButton
                                onPress={this.handlerSwitchCamera}
                                source={isSwitchCamera ? require('../../images/switch_camera.png') : require('../../images/unswitch-camera.png')}
                            />
                            <OperateButton
                                onPress={this.handlerMuteAllRemoteAudioStreams}
                                source={isMute ? require('../../images/mute.png') : require('../../images/unmute.png')}
                            />
                            <OperateButton
                                onPress={this.handlerChangeVideo}
                                source={disableVideo ? require('../../images/cameraoff.png') : require('../../images/cameraon.png')}
                            />
                        </View>
                    </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }
}

class OperateButton extends PureComponent {
    render() {

        const {onPress, source, style, imgStyle = {width: 55, height: 55}} = this.props

        return (
            <TouchableOpacity
                style={style}
                onPress={onPress}
                activeOpacity={0.7}>
                <Image
                    style={imgStyle}
                    source={source}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    prerareView: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4'
    },
    absView: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between'
    },
    videoView: {
        padding: 5,
        flexWrap: 'wrap',
        flexDirection: 'row',
        zIndex: 100
    },
    fullScreenView: {
        flex: 1
    },
    remoteView: {
        width: (screenW - 20) / 3,
        height: (screenH - 20) / 3,
        margin: 5
    },
    bottomView: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    operationWrap: {
        alignSelf: 'center',
        marginBottom: -10
    },
    operationButton: {
        width: 55,
        height: 55
    }
})