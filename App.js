/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react'
import {
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

import SplashScreen from 'react-native-splash-screen'
import RNRestart from 'react-native-restart'
import {setJSExceptionHandler} from 'react-native-exception-handler'

import {Toast} from 'antd-mobile'

import LiveView from './src/agora/index'
import {isIphone47} from './src/libs/screenUtils'

const errorHandler = (e, isFatal) => {
    if (isFatal) {
        Alert.alert(
            'Unexpected error occurred',
            `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}

        We will need to restart the app.
        `,
            [{
                text: 'Restart',
                onPress: () => {
                    RNRestart.Restart()
                }
            }]
        )
    } else {
        console.log(e) // So that we can see it in the ADB logs in case of Android if needed
    }
}

setJSExceptionHandler(errorHandler)

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            channel: '00001',
            uid: '0',
            role: 1, // 1:Broadcaster 2:Audience
            showLive: false,
            err: undefined
        }
    }

    componentDidMount() {
        SplashScreen.hide()
    }

    get isBroadcaster() {
        return this.state.role === 1
    }

    containerTouched = () => {
        Keyboard.dismiss()
        return false
    }

    handleJoin = () => {
        if (this.state.channel === '') {
            this.setState({
                err: 'channel is empty'
            })
        } else if (this.state.uid === '') {
            this.setState({
                err: 'uid is empty'
            })
        } else {
            this.setState({
                showLive: true
            })
        }
    }

    handleCancel = (err) => {
        this.setState({
            showLive: false,
            err
        })
    }

    handleSegmentChange = (role) => {
        this.setState({
            role
        })
    }

    render() {
        const {channel, uid, role, showLive, err} = this.state

        const leftStyle = this.isBroadcaster ? styles.roleLeftSelected : styles.roleLeftUnSelected
        const leftTextStyle = this.isBroadcaster ? styles.textRoleSelected : styles.textRoleUnSelected

        const rightStyle = this.isBroadcaster ? styles.roleRightUnSelected : styles.roleRightSelected
        const rightTextStyle = this.isBroadcaster ? styles.textRoleUnSelected : styles.textRoleSelected

        if (showLive) {
            return (
                <LiveView onCancel={this.handleCancel} channel={channel} uid={uid} role={role}/>
            )
        }
        return (
            <View style={styles.container} onStartShouldSetResponder={this.containerTouched}>

                <Text style={styles.welcome}>声网 agora.io</Text>

                <Text style={styles.textChannelNo}>channel</Text>
                <TextInput style={styles.textInput}
                           placeholder='Joining in the same channel'
                           keyboardType="numeric"
                           onChangeText={value => this.setState({channel: value})}
                           value={channel}/>

                <Text style={styles.textUserId}>uid</Text>
                <TextInput style={styles.textInput}
                           placeholder='Unique id for each member in one channel'
                           keyboardType="numeric"
                           multiline={false}
                           maxLength={6}
                           onChangeText={value => this.setState({uid: value})}
                           value={uid}/>

                <Text style={styles.textRole}>role</Text>
                <View style={styles.roleWrap}>
                    <TouchableOpacity
                        style={leftStyle}
                        onPress={this.handleSegmentChange.bind(this, 1)}>
                        <Text style={leftTextStyle}>Broadcaster</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={rightStyle}
                        onPress={this.handleSegmentChange.bind(this, 2)}>
                        <Text style={rightTextStyle}>Audience</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.handleJoin}>
                    <Text style={styles.buttonText}>Enter</Text>
                </TouchableOpacity>

                {!!err && <Text style={styles.errorText}>Error： {err}</Text>}

                <Text style={styles.companyText}>Powered by agora.io inc.</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: isIphone47 ? 50 : 100,
        marginBottom: isIphone47 ? 50 : 60,
        color: 'black'
    },
    textChannelNo: {
        fontSize: 18,
        color: '#333333',
    },
    textUserId: {
        fontSize: 18,
        color: '#333333',
        marginTop: 15,
    },
    textRole: {
        fontSize: 18,
        color: '#333333',
        marginTop: 15,
    },
    roleWrap: {
        height: 34,
        flexDirection: 'row',
        marginTop: 15,
        borderColor: '#5caaf6',
        borderRadius: 5,
        borderWidth: 1,
    },
    roleLeftSelected: {
        flex: 1,
        backgroundColor: '#5caaf6',
        borderBottomLeftRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    roleLeftUnSelected: {
        flex: 1,
        backgroundColor: '#00000000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    roleRightSelected: {
        flex: 1,
        backgroundColor: '#5caaf6',
        borderBottomRightRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    roleRightUnSelected: {
        flex: 1,
        backgroundColor: '#00000000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textRoleSelected: {
        fontSize: 16,
        color: '#ffffff',
    },
    textRoleUnSelected: {
        fontSize: 16,
        color: '#333333'
    },
    textInput: {
        height: 44,
        backgroundColor: '#F5FCFF',
        borderRadius: 20,
        borderColor: '#cccccc',
        borderWidth: 0.5,
        marginTop: 15,
        paddingHorizontal: 20,
    },
    button: {
        paddingHorizontal: 20,
        height: 44,
        backgroundColor: '#5caaf6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 36,
    },
    buttonText: {
        backgroundColor: '#5caaf6',
        textAlign: 'center',
        color: '#fff'
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'red',
        marginTop: 15,
    },
    companyText: {
        position: 'absolute',
        zIndex: 99,
        fontSize: 14,
        color: 'black',
        alignSelf: 'center',
        bottom: isIphone47 ? 20 : 54
    }
})