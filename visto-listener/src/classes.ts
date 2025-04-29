export class MQTTBroker {
    label?: string
    url: string
    username?: string
    password?: string
    topics?: Array<string>
    client?: any

    constructor(broker: any) {
        this.label = broker.label
        this.url = broker.url
        this.username = broker.username
        this.password = broker.password
        this.topics = broker.topics;
        this.client = broker.client
    }
}