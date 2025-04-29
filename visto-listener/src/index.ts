import config from 'config';
import mqtt from 'mqtt';

import { MQTTBroker } from './classes.ts'


function setupClients(): Array<MQTTBroker> | null {
    if (!config.has('mqtt_brokers')) return null;

    let brokers: Array<MQTTBroker> = config.get('mqtt_brokers');
    brokers.forEach(b => {
        b.client = mqtt.connect(b.url, {manualConnect: true, username: b.username, password: b.password});
    });

    console.log("Initialized");
    console.log("Configured brokers:");
    brokers.forEach(b => console.log("    - " + (b.label || '<no_label>') + " (" + b.url + "), connected=" + b.client.connected));
    
    return brokers;
}


function messageHandler(topic, message, packet) {
    console.log(`${topic}: ${message}`);
}


(function main() {
    let brokers = setupClients();

    if (!brokers) {
        console.error("No MQTT brokers specified");
        return -1;
    }

    brokers.forEach(c => {
        c.client.on('error', (err) => console.error(`Can't connect to broker ${c.url}: ${err}`));
        c.client.on('connect', () => {
            console.info(`Connected to broker ${c.url}`);
            c.client.on('message', messageHandler);
            c.client.subscribe(c.topics);
        });
        c.client.connect();
    });
})();