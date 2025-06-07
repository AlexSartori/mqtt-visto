import Chart from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

import { formatDate } from './utils.js';


function H1({ children }) {
    return <h1 className="text-3xl font-sans mb-4">{children}</h1>;
}

function PlotCard({ plot }) {
    let datasets = plot.datasets.map(d => {
        return { label: d.name, data: d.data.map(o => {return {x: new Date(o.time), y: o.value}}) };
    })
    
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-xl">{plot.title}</h2>
            <Chart type={'line'} data={{
                labels: [],
                datasets: datasets
            }} options={{
                scales: {
                    x: {
                        type: 'time'
                    }
                },
                plugins: {
                    legend: { display: plot.legend }
                }
            }} />
        </div>
    );
}

export { H1, PlotCard };