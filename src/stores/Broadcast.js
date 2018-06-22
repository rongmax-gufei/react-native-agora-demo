import { observable, action } from 'mobx'

class Broadcast {

    @observable broadcasting = false

    @action
    updateBroadcast = (val) => {
        this.broadcasting = val
    }
}

export default new Broadcast()