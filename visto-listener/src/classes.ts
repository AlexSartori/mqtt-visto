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

export class Dashboard {
    plots: Array<Plot>
}

export class Plot {
    title: string
    type: 'line' | 'bar'
    legend: boolean
    datasets: Array<PlotDataset>

    constructor(plot: any) {
        this.title = plot.title;
        this.type = plot.type;
        this.legend = plot.legend;
        this.datasets = plot.datasets.map((d: any) => new PlotDataset(d));
    }
}

export class PlotDataset {
    name: string
    metric_id: string

    constructor(dataset: any) {
        this.name = dataset.name;
        this.metric_id = dataset.metric_id;
    }
}