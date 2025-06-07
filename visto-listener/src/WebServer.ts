import express from 'express';
import { Dashboard, Plot, PlotDataset } from './classes.ts';


class WebServer {
    app: express.Express;
    dashboard: Dashboard
    
    constructor(dashboard: Dashboard) {
        this.dashboard = dashboard;
        
        this.app = express();
        this.app.use(express.json());

        this.app.get('/plots', (req, res) => {
            let plots = dashboard.plots;
            let now = Date.now();
            
            plots.forEach(p => {
                p.datasets = p.datasets.map(d => {
                    let points = [];
                    for (let i = 0; i < 20; i++)
                        points.push({ "time": now + i * 1000, "value": Math.random() * 100 });
                    
                    return {...d, data: points}
                });
            });
            
            res.send(JSON.stringify(plots));
        });
    }

    start(port: number): Promise<void> {
        return new Promise<void>((resolve, reject) => this.app.listen(port, resolve).on('error', reject));
    }
}

export default WebServer;