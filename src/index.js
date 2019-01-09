/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal
} from 'react-native';

const {width} = Dimensions.get('window');

import {RtcEngine, AgoraView} from 'react-native-agoraio'

export default class RNAgoraExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            remotes: [],
            isJoinSuccess: false,
            isBroadcaster: false,
            isSwitchCamera: false,
            isMute: false,
            isSpeaker: true,
            disableVideo: true,
            isHideButtons: false,
            visible: false,
            selectUid: undefined
        };
    }

    componentWillMount() {
        //初始化Agora
        const options = {
            appid: '858c0ae5d2574d6884a257c912b198c0',//控制台申请
            channelProfile: 1,//频道模式,1:直播互动
            videoProfile: 40,//640x480(resolution)、15(fps)、500(kbps)
            clientRole: this.props.role,//1:Broadcaster,2:Audience，实现双向语音通话设置角色为主播即可
            swapWidthAndHeight: true,
        };
        // 初始化声网
        RtcEngine.init(options);
    }

    componentDidMount() {

        // 当前版本号
        RtcEngine.getSdkVersion((version) => {
            console.log(version)
        });

        //加入房间
        RtcEngine.joinChannel(this.props.channel, parseInt(this.props.uid));

        // 启用说话者音量提示
        RtcEngine.enableAudioVolumeIndication(500, 3);

        //所有的原生通知统一管理
        RtcEngine.eventEmitter({
            onFirstRemoteVideoDecoded: (data) => {
                console.log(data);
                // 有远程视频加入 返回重要的  uid  AgoraView 根据uid 来设置remoteUid值
                const {remotes} = this.state;
                const newRemotes = [...remotes];

                // 存在断网重连导致回调多次该方法的情况，已加入过的远程视频不再重复添加
                if (!remotes.find(uid => uid === data.uid)) {
                    newRemotes.push(data.uid);
                }
                this.setState({remotes: newRemotes});
            },
            onUserOffline: (data) => {
                console.log(data);
                // 有人离开了！
                const {remotes} = this.state;
                const newRemotes = remotes.filter(uid => uid !== data.uid);
                this.setState({remotes: newRemotes});
            },
            onJoinChannelSuccess: (data) => {
                // 加入房间成功
                console.log(data);
                const {isBroadcaster} = this.state;
                // 开启摄像头预览
                if (isBroadcaster)
                    RtcEngine.startPreview();
                this.setState({
                    isJoinSuccess: true
                });
            },
            onAudioVolumeIndication: (data) => {
                // 声音回调
                // console.log(data, '-----');
            },
            onUserJoined: (data) => {
                console.log(data);
                // 有人来了!
            },
            onError: (data) => {
                console.log(data);
                // 错误!

                if (data.err === 17) {
                    RtcEngine.leaveChannel();
                    RtcEngine.destroy();
                }

                const {onCancel} = this.props;
                onCancel(data.err)
            }
        })
    }

    componentWillUnmount() {
        RtcEngine.leaveChannel();
        RtcEngine.destroy();
        RtcEngine.removeEmitter();
    }

    handlerCancel = () => {
        RtcEngine.leaveChannel();
        RtcEngine.destroy();

        const {onCancel} = this.props;
        onCancel()
    };

    handlerChageRole = () => {
        this.setState({
            isBroadcaster: !this.state.isBroadcaster
        }, () => {
            RtcEngine.changeRole();
        })
    };

    handlerSwitchCamera = () => {
        RtcEngine.switchCamera();
    };

    handlerMuteAllRemoteAudioStreams = () => {
        this.setState({
            isMute: !this.state.isMute
        }, () => {
            RtcEngine.muteAllRemoteAudioStreams(this.state.isMute);
        })
    };

    handlerSetEnableSpeakerphone = () => {
        handlerMuteAllRemoteAudioStreams
        this.setState({
            isSpeaker: !this.state.isSpeaker
        }, () => {
            RtcEngine.setDefaultAudioRouteToSpeakerphone(this.state.isSpeaker);
        });
    };

    handlerChangeVideo = () => {
        this.setState({
            disableVideo: !this.state.disableVideo
        }, () => {
            this.state.disableVideo ? RtcEngine.enableVideo() : RtcEngine.disableVideo()
        })
    };

    handlerSwitchCamera = () => {
        RtcEngine.switchCamera();
    };

    handlerHideButtons = () => {
        this.setState({
            isHideButtons: !this.state.isHideButtons
        })
    };

    onPressVideo = (uid) => {
        this.setState({
            selectUid: uid
        }, () => {
            this.setState({
                visible: true
            })
        })
    };

    render() {
        const {isBroadcaster, isSwitchCamera, isMute, isSpeaker, disableVideo, isHideButtons, remotes, isJoinSuccess, visible} = this.state;

        if (!isJoinSuccess) {
            return (
                <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>正在创建视频会议...</Text>
                </View>
            )
        }

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.handlerHideButtons.bind(this)}
                style={styles.container}
            >
                <AgoraView style={styles.localView} showLocalVideo={true}/>
                <View style={styles.absView}>
                    {!visible ?
                        <View style={styles.videoView}>
                            {remotes.map((v, k) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => this.onPressVideo.bind(this, v)}
                                        key={k}
                                    >
                                        <AgoraView
                                            style={styles.remoteView}
                                            zOrderMediaOverlay={true}
                                            remoteUid={v}
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                        </View> : <View style={styles.videoView}/>
                    }

                    {!isHideButtons &&
                    <View>
                        <OperateButton
                            style={{alignSelf: 'center', marginBottom: -10}}
                            onPress={this.handlerCancel}
                            imgStyle={{width: 55, height: 55}}
                            source={require('../images/hangup.png')}
                        />
                        <View style={styles.bottomView}>
                            <OperateButton
                                onPress={this.handlerChageRole}
                                source={require('../images/btn_request_broadcast.png')}
                            />
                            <OperateButton
                                onPress={this.handlerSwitchCamera}
                                source={isSwitchCamera ? require('../images/switch_camera.png') : require('../images/unswitch-camera.png')}
                            />
                            <OperateButton
                                onPress={this.handlerMuteAllRemoteAudioStreams}
                                source={isMute ? require('../images/mute.png') : require('../images/unmute.png')}
                            />
                            <OperateButton
                                onPress={this.handlerChangeVideo}
                                source={disableVideo ? require('../images/cameraoff.png') : require('../images/cameraon.png')}
                            />
                        </View>
                    </View>
                    }
                </View>

                <Modal
                    visible={visible}
                    presentationStyle={'fullScreen'}
                    animationType={'slide'}
                    onRequestClose={() => {
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{flex: 1}}
                        onPress={() => this.setState({
                            visible: false
                        })}
                    >
                        <AgoraView
                            style={{flex: 1}}
                            zOrderMediaOverlay={true}
                            remoteUid={this.state.selectUid}
                        />
                    </TouchableOpacity>
                </Modal>
            </TouchableOpacity>
        );
    }
}

class OperateButton extends PureComponent {
    render() {

        const {onPress, source, style, imgStyle = {width: 55, height: 55}} = this.props;

        return (
            <TouchableOpacity
                style={style}
                onPress={onPress}
                activeOpacity={.7}
            >
                <Image
                    style={imgStyle}
                    source={source}
                />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
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
        justifyContent: 'space-between',
    },
    videoView: {
        padding: 5,
        flexWrap: 'wrap',
        flexDirection: 'row',
        zIndex: 100
    },
    localView: {
        flex: 1
    },
    remoteView: {
        width: (width - 40) / 3,
        height: (width - 40) / 3,
        margin: 5
    },
    bottomView: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});
