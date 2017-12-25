/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';

const {width} = Dimensions.get('window');

import {RtcEngine, AgoraView} from 'react-native-agoraio'

export default class RNAgoraExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            remotes: [],
            isJoinSuccess: false,
            isSpeaker: false,
            isMute: false
        };
    }

    componentWillMount() {
        //初始化Agora
        const options = {
            appid: '858c0ae5d2574d6884a257c912b198c0',//控制台申请
            channelProfile: 1,//频道模式,1:直播互动
            videoProfile: 40,//640x480(resolution)、15(fps)、500(kbps)
            clientRole: 1,//1:Broadcaster,2:Audience
            swapWidthAndHeight: true
        };
        RtcEngine.init(options);
    }

    componentDidMount() {
        // 加入房间，该方法让用户加入通话频道，在同一个频道内的用户可以互相通话，多个用户加入同一个频道，可以群聊。同一个频道里不能出现两个相同的UID，请保证传入的 UID 不相同。
        RtcEngine.joinChannel('00001', 0);//0:系统自动分配
        // 启用说话者音量提示
        // RtcEngine.enableAudioVolumeIndication(500, 3);

        //所有的原生通知统一管理
        RtcEngine.eventEmitter({
            onFirstRemoteVideoDecoded: (data) => {
                console.log("onFirstRemoteVideoDecoded:\n" + data);
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
                console.log("onUserOffline:\n" + data);
                // 有人离开了！
                const {remotes} = this.state;
                const newRemotes = remotes.filter(uid => uid !== data.uid);
                this.setState({remotes: newRemotes});
            },
            onJoinChannelSuccess: (data) => {
                console.log("onJoinChannelSuccess:\n" + data);
                RtcEngine.startPreview();
                // 加入房间成功!
                this.setState({
                    isJoinSuccess: true
                });
            },
            onAudioVolumeIndication: (data) => {
                console.log("onAudioVolumeIndication:\n" + data);
                // 音量提示回调

            },
            onUserJoined: (data) => {
                console.log("onUserJoined:\n" + data);
                // 有人来了!
            },
            onLeaveChannel: (data) => {
                console.log("onLeaveChannel:\n" + data);
                // 离开频道
            },
            onWarning: (data) => {
                console.log("onWarning:\n" + data);
                // 发生警告信息
            },
            onError: (data) => {
                console.log("onError:\n" + data);
                // 错误!
                RtcEngine.leaveChannel();
            }
        })
    }

    componentWillUnmount() {
        RtcEngine.removeEmitter()
    }

    handlerCancel = () => {
        RtcEngine.leaveChannel();
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
        this.setState({
            isSpeaker: !this.state.isSpeaker
        }, () => {
            RtcEngine.setEnableSpeakerphone(this.state.isSpeaker);
        });
    };

    render() {
        const {isMute, isSpeaker, remotes, isJoinSuccess} = this.state;

        if (!isJoinSuccess) {
            return (
                <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>正在创建视频会议...</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <AgoraView ref="localVideo" style={styles.localView} showLocalVideo={true}/>
                <View style={styles.absView}>
                    <View style={styles.videoView}>
                        {remotes.map((v, k) => {
                            console.log("remotes k:" + k + " v:" + v)
                            return (
                                <AgoraView
                                    style={styles.remoteView}
                                    key={k}
                                    zOrderMediaOverlay={true}
                                    remoteUid={v}
                                />
                            )
                        })}
                    </View>
                    <View>
                        <VideoOperateButton
                            style={{alignSelf: 'center'}}
                            onPress={this.handlerCancel}
                            imgStyle={{width: 60, height: 60}}
                            source={require('../images/btn_endcall.png')}
                        />
                        <View style={styles.bottomView}>
                            <VideoOperateButton
                                onPress={this.handlerMuteAllRemoteAudioStreams}
                                source={isMute ? require('../images/icon_muted.png') : require('../images/btn_mute.png')}
                            />
                            <VideoOperateButton
                                onPress={this.handlerSwitchCamera}
                                source={require('../images/btn_switch_camera.png')}
                            />
                            <VideoOperateButton
                                onPress={this.handlerSetEnableSpeakerphone}
                                source={isSpeaker ? require('../images/icon_speaker.png') : require('../images/btn_speaker.png')}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const VideoOperateButton = ({onPress, source, style, imgStyle = {width: 50, height: 50}}) => {
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
};

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