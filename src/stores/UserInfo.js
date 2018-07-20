import {action, observable} from 'mobx'

class UserInfo {
    @observable channel = '00001'
    @observable uid = '0'
    @observable role = '1'

    @action
    setChannel = (channle) => {
        this.channel = channle
    }

    @action
    setUid = (uid) => {
        this.uid = uid
    }

    @action
    setRole = (role) => {
        this.role = role
    }
}

export default new UserInfo()
