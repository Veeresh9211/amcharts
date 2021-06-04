import React from 'react';
import { Chart1 } from './chart1/chart1';
import { Chart2 } from './chart2/chart2';
import { Chart3 } from './chart3/chart3';
import './chartContainers.scss';

export const ChartContainers = () =>{
    return(
        <div className="chartContainers">
            <Chart1/>
            <Chart2/>
            <Chart3/>
        </div>
    )
}