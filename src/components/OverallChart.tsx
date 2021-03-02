import { PercentileReport } from "../interfaces";
import { ArgumentAxis, BarSeries, Chart, ValueAxis, Legend, Title, Tooltip, } from "@devexpress/dx-react-chart-material-ui";
import { ArgumentScale, EventTracker, Stack, } from "@devexpress/dx-react-chart";
import { scaleBand, } from "@devexpress/dx-chart-core";

export default function OverallChart(props: { data: PercentileReport[], title: string }) {

  return (
    <Chart 
      rotated
      data={props.data}>
      <ArgumentScale factory={scaleBand} />
      <ArgumentAxis />
      <ValueAxis />
      <BarSeries
        valueField="percentrankdps"
        argumentField="account"
        name="Percentile DPS"
      />
      <BarSeries
        valueField="percentrankmight"
        argumentField="account"
        name="Percentile Might"
      />
      <BarSeries
        valueField="percentrankquickness"
        argumentField="account"
        name="Percentile Quickness"
      />
      <BarSeries
        valueField="percentrankalacrity"
        argumentField="account"
        name="Percentile Alacrity"
      />
      <BarSeries
        valueField="percentrankfury"
        argumentField="account"
        name="Percentile Fury"
      />
      <Stack />
      <Legend />
      <EventTracker />
      <Tooltip />
      <Title text={props.title}/>
    </Chart>
  );
}
