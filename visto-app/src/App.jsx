import "./css/style.css"
import { api_request } from "./utils.js";

import React from "react";
import { H1, PlotCard } from "./Components.jsx";


export function App() {
    return <Dashboard />;
}

function Dashboard() {
    let [plots, setPlots] = React.useState([])

    React.useEffect(() => {
        api_request('GET', '/plots').then(async res => setPlots(await res.json())).catch(err => console.error(err));
    }, [])

    return plots.length && plots.map(p => <PlotCard plot={p} key={p.title} />);
}
