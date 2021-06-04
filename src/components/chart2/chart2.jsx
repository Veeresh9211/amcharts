import React, { useEffect, useState } from 'react';
import './chart2.scss';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from 'axios';

am4core.useTheme(am4themes_animated);

export const Chart2 = ()=>{

    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchFinancialData = async () => {
            const axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                // 
                params: { parentGuid: "F5606873-321E-4750-91B5-18E934A7F758" } 
            };
            const totalActivityResponse = await axios.get('https://a287443a087f.ngrok.io/api/get_total_activity', axiosConfig);
            const monthlyExpenses = totalActivityResponse.data.MonthlyExpenses;
            const monthlyIncome = totalActivityResponse.data.MonthlyIncome;

                let totalIncome = 0;
                let totalExpense = 0;
                let finalArray = [];

                monthlyIncome.forEach((month,index)=>{
                    for (var property in month) {
                        if(typeof month[property] !== 'string'){
                            totalIncome += month[property];    
                        }  
                    }
                    for (var property in monthlyExpenses[index]) {
                        if(typeof monthlyExpenses[index][property] !== 'string'){
                            totalExpense += monthlyExpenses[index][property];    
                        }  
                    }
                    let eachObject = {totalExpense: totalExpense*-1, totalIncome, month: month.date, netIncome: (totalIncome - totalExpense)}
                    finalArray.push(eachObject)
                })
                setMonthlyData(finalArray);
        }

        fetchFinancialData();

        }, [])
       

    let chart;
    chart = am4core.create("chartdiv2", am4charts.XYChart);

    chart.paddingRight = 20;
    chart.data= monthlyData;        
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    //line series for net income
    var lineSeries = chart.series.push(new am4charts.LineSeries());
    let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.fill = am4core.color("#000000");
    bullet.strokeWidth = 2;
    lineSeries.name = "Expenses";
    lineSeries.dataFields.valueY = "netIncome";
    lineSeries.dataFields.categoryX = "month";
    lineSeries.stroke = am4core.color("#000000");
    lineSeries.strokeWidth = 2;
    lineSeries.propertyFields.strokeDasharray = "lineDash";
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.marginLeft = 0;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";
    chart.cursor.lineX.disabled = true;
    //function for generating income and expense charts
    function createSeries(field, name, type, color) {
  
        // Set up series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.name = name;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "month";
        series.sequencedInterpolation = true;
        series.fill = am4core.color(color);
        series.stacked = true;
        series.columns.template.width = am4core.percent(30);
        series.columns.template.tooltipText = `${type} = {valueY} \n Month = {categoryX}`;
        return series;
      }
        createSeries('totalExpense', 234, 'Expense', '#E65D4B')
        createSeries('totalIncome', 234,'Income','#54AF0E')

   
      return (
        <>
            <h4>
                Total Monthly Balances of All Accounts
            </h4>
            <div id="chartdiv2">
            </div>
        </>
      );
  }
  
