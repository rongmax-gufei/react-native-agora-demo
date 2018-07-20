/**
 * Agoraio React Native App
 * https://github.com/facebook/react-native
 * @Learnta Inc.
 */

import React, {Component} from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

import {inject, observer} from "mobx-react/native"
import {Actions} from "react-native-router-flux"
import {RtcEngine, AgoraScreenShareView} from 'react-native-agoraio'

@inject('BroadcastStore')
@observer
export default class ScreenShare extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tick: 0
        }
    }

    componentDidMount() {
        this.timer = setInterval(
            () => {
                this.setState({
                    tick: this.state.tick + 1
                })
            },
            1000
        )

        RtcEngine.startBroadcasting()
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    onStopBroadcast = () => {
        RtcEngine.stopBroadcasting()
        Actions.pop()
    }

    render() {
        const {broadcasting} = this.props.BroadcastStore
        return (<View style={styles.container}>
            {broadcasting && <AgoraScreenShareView showSharedScreen style={styles.sharedVideo}/>}
            <Text style={styles.tick}>{this.state.tick}</Text>
            <View style={styles.absView}>
                <TouchableOpacity
                    style={styles.bottomView}
                    onPress={this.onStopBroadcast}
                    activeOpacity={0.7}>
                    <Image
                        style={{width: 55, height: 55}}
                        source={require('../../images/btn_request_broadcast.png')}/>
                </TouchableOpacity>
            </View>
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sharedVideo: {
        width: 200,
        height: 300
    },
    absView: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end'
    },
    tick: {
        fontSize: 100,
        color: 'green',
    },
    bottomView: {
        margin: 10,
    },
})
