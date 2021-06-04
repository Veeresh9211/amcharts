import React, { useEffect, useState } from 'react';
import './chart3.scss';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from 'axios';

am4core.useTheme(am4themes_animated);

export const Chart3 = ()=>{

      // Create chart instance
      let chart = am4core.create("chartdiv3", am4charts.PieChart);
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
                const accountSummariesList = accountSummariesResponse.data.AccountSummaries;
                setAccountSummaries(accountSummariesList);
        }
        fetchFinancialData()
        }, [])
      
      // Add data
      chart.data = accountSummaries;
      
      // Add label
      chart.innerRadius = 100;
      let label = chart.seriesContainer.createChild(am4core.Label);
      label.text = "Accounts";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 30;
      chart.scrollbarY = new am4core.Scrollbar();
      chart.scrollbarY.marginLeft = 0;

    // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "zoomY";
      chart.cursor.lineX.disabled = true;
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "Current Balance";
      pieSeries.dataFields.category = "Account Name";
      
      return (
        <>
            <h4>
                Account Summaries Pie/Donut Chart
            </h4>
            <div id="chartdiv3">
            </div>
        </>
      );
  }
  

  