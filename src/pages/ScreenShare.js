/**
 * Agoraio React Native App
 * https://github.com/facebook/react-native
 * @Learnta Inc.
 */

import {Component} from "react";
import {
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

import {Container} from '../component/index'

export default class App extends Component {
    render() {
        return (<Container style={styles.container}></Container>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        backgroundColor: '#F5FCFF',
    }
})