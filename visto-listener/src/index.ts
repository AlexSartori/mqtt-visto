import config from 'config';
import mqtt from 'mqtt';

import getDBConnector, { DBConnector } from './DBConnector.ts';
import { Metric, MQTTBroker, StorageStrategy } from './classes.ts'
import getSegretaria from './Segretaria.ts';


function setupDatabase(metrics: Array<Metric>): DBConnector {
    let conn = getDBConnector();

    // if (!config.has('strategies')) throw "No storage strategies specified";

    let strategies: Array<StorageStrategy> = config.get('strategies');
    strategies.forEach(s => {
        // TODO: check that the label is a valid db name
        // conn.ensureDB(s.label, s.precision, s.keep, s.duration);
    });

    (async () =>
        await Promise.all(metrics.map(m => {
            conn.addMetricIfNotExists(m);
        }))
    )();

    return conn;
}


function setupClients(): Array<MQTTBroker> {
    if (!config.has('mqtt_brokers')) throw "No MQTT brokers specified";

    let brokers: Array<MQTTBroker> = config.get('mqtt_brokers');
    brokers.forEach(b => {
        b.client = mqtt.connect(b.url, {manualConnect: true, username: b.username, password: b.password});
    });

    return brokers;
}


function readMetricsConfig(): Array<Metric> {
    if (!config.has('metrics')) throw "No metrics specified";
    return config.get('metrics');
}


(function main() {
    let brokers = setupClients();
    let metrics: Array<Metric> = readMetricsConfig();
    let db = setupDatabase(metrics);

    getSegretaria(db, brokers, metrics);
})();