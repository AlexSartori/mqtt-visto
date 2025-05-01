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
export class StorageStrategy {
    label: string
    precision: number
    keep?: number
    duration?: number

    constructor(s: any) {
        this.label = s.label;
        this.precision = s.precision;
        this.keep = s.keep;
        this.duration = s.duration;
    }
}

export class Metric {
    id: string
    dtype: 'int' | 'float' | 'bool' | 'string' | 'json'
    topic: string
    
    constructor(m: any) {
        this.id = m.id;
        this.dtype = m.dtype;
        this.topic = m.topic;
    }
}
