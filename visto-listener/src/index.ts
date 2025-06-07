import config from 'config';
import mqtt from 'mqtt';

import getDBConnector, { DBConnector } from './DBConnector.ts';
import { Metric, MQTTBroker, StorageStrategy, Dashboard } from './classes.ts'
import getSegretaria from './Segretaria.ts';
import WebServer from './WebServer.ts';


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

function readDasboardConfig(): Dashboard {
    if (!config.has('dashboard')) throw "No dashboard configured";
    return config.get('dashboard');
}


(function main() {
    // let brokers = setupClients();
    // let metrics: Array<Metric> = readMetricsConfig();
    let dashboard: Dashboard = readDasboardConfig();
    // let db = setupDatabase(metrics);

    // getSegretaria(db, brokers, metrics);

    let ws = new WebServer(dashboard);
    ws.start(8009)
        .then(() => console.log("Started web server on port 8009"))
        .catch(err => console.error("Error starting web server:", err));
})();