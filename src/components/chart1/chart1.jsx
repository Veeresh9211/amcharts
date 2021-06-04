import React, { useEffect, useState } from 'react';
import './chart1.scss';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from 'axios';

am4core.useTheme(am4themes_animated);

export const Chart1 = ()=>{

    const [monthlyBalances, setMonthlyBalances] = useState([]);
    const [accountSummaries, setAccountSummaries] = useState([]);


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
        const accountSummariesResponse = await axios.get('https://a287443a087f.ngrok.io/api/get_account_summaries', axiosConfig);

        const totalActivityResponse = await axios.get('https://a287443a087f.ngrok.io/api/get_total_activity', axiosConfig);
        const monthlyBalancesList = totalActivityResponse.data.MonthlyBalances;
        setMonthlyBalances(monthlyBalancesList);
        setAccountSummaries(accountSummariesResponse.data.AccountSummaries);
        }
        fetchFinancialData()
        }, [])
    let chart;
    chart = am4core.create("chartdiv1", am4charts.XYChart);

    chart.paddingRight = 20;

    chart.data = monthlyBalances;        
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;
        
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.marginLeft = 0;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";
    chart.cursor.lineX.disabled = true;

    function createSeries(field, name) {
  
        // Set up series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.name = name;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "date";
        series.sequencedInterpolation = true;
        series.stacked = true;
        
        // Configure columns
        series.columns.template.width = am4core.percent(60);
        series.columns.template.tooltipText = `Account Name = ${name} \n Account Balance = {valueY} \n Month-Year = {categoryX}`;
        
        return series;
      }
    //   let keyss = monthlyBalances[0] && Object.keys(monthlyBalances[0]);
    //   keyss && keyss.forEach((k,index)=>{
    //       debugger
    //     createSeries(k, k);
    //   })
      createSeries("balance0",accountSummaries[0]["Account Name"]);
      createSeries("balance1", accountSummaries[1]["Account Name"]);
      createSeries("balance2", accountSummaries[2]["Account Name"]);
      createSeries("balance3", accountSummaries[3]["Account Name"]);
       

   
  
      return (
        <>
            <h4>
                Total Monthly Balances of All Accounts
            </h4>
            <div id="chartdiv1">
            </div>
        </>
      );
  }
  
