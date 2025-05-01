import { Metric, MQTTBroker } from "./classes.ts";
import { DBConnector } from "./DBConnector.ts";


let _instance: Segretaria;

function metricValue2dtype(m: Metric, v: any) {
    switch (m.dtype) {
        case "string": return v.toString();
        case "int": return parseInt(v, 10);
        case "float": return parseFloat(v);
        case "bool": return v === 'true' || v === true;
        case "json": return typeof v === 'string' ? JSON.parse(v) : v;
        default: throw new Error(`Unsupported dtype: ${this.dtype}`);
    }
}

class Segretaria {
    db: DBConnector;
    brokers: Array<MQTTBroker>;
    metrics: Array<Metric>;

    constructor(db: DBConnector, brokers: Array<MQTTBroker>, metrics: Array<Metric>) {
        this.metrics = metrics;
        this.brokers = brokers;
        this.db = db;

        brokers.forEach(c => {
            c.client.on('error', (err) => { throw `Can't connect to broker ${c.url}: ${err}`; });
            c.client.on('connect', () => {
                console.info(`Connected to broker ${c.url}`);
                c.client.on('message', (topic, message, packet) => this.handleMQTTMessage(topic, message, packet));
                c.client.subscribe(c.topics);
            });
            c.client.connect();
        });
    }

    private handleMQTTMessage(topic, message, packet) {
        console.log(`${topic}: ${message}`);
        
        this.metrics.forEach(m => {
            if (m.topic == topic)
                this.db.insertMetricValue(m, metricValue2dtype(m, message));
        })
    }
}


export default function getSegretaria(db: DBConnector, brokers: Array<MQTTBroker>, metrics: Array<Metric>): Segretaria {
    if (db == null) throw "No DB connector specified";
    if (brokers == null) throw "No MQTT brokers specified";
    if (metrics == null) throw "No metrics specified";

    if (_instance == null) _instance = new Segretaria(db, brokers, metrics);
    return _instance;
}