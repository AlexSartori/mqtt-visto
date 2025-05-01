import { Client } from 'pg';

import { Metric } from './classes.ts';


let _instance: DBConnector;


export class DBConnector {
    db: Client

    constructor() {
        this.db = new Client({
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
            database: process.env.POSTGRES_DB
        });

        this.db.connect().then(() => {
            console.log("[DB] Connection successful");
        }).catch((e: any) => {
            console.error("[DB] Cannot connect: ");
            console.error(e);
            process.exit(-1);
        });
    }

    private getMetricTableName(metric_id: string): string {
        return `metric_${metric_id}`;
    }

    addMetricIfNotExists(m: Metric): Promise<void> {
        let tname = this.getMetricTableName(m.id);
        let dtype = {
            'int': 'INTEGER',
            'float': 'REAL',
            'bool': 'BOOLEAN',
            'string': 'TEXT',
            'json': 'JSON'
        }[m.dtype]

        return new Promise<void>((resolve, reject) => {
            this.db.query(`\
                CREATE TABLE IF NOT EXISTS "${tname}" ( \
                    ts TIMESTAMP PRIMARY KEY, \
                    value ${dtype} NOT NULL \
                )`
            ).then(() => resolve()).catch(reject);
        });
    }

    insertMetricValue(m: Metric, value: any): Promise<void> {
        let tname = this.getMetricTableName(m.id);
        
        return new Promise<void>((resolve, reject) => {
            this.db.query(
                `INSERT INTO ${tname} (ts, value) VALUES (NOW(), $1)`,
                [value]
            ).then(() => resolve()).catch(reject);
        });
    }
}

export default function getDBConnector(): DBConnector {
    if (_instance == null) _instance = new DBConnector();
    return _instance;
}
