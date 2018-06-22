import {observable} from 'mobx'

class UserInfo {
    @observable channel = ''
    @observable uid = ''
    @observable role = ''
}

export default new UserInfo()
