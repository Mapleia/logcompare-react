import { PercentileReport } from "../interfaces";
import { ArgumentAxis, BarSeries, Chart, ValueAxis, Legend, Title, Tooltip, } from "@devexpress/dx-react-chart-material-ui";
import { ArgumentScale, EventTracker, Stack,ValueScale } from "@devexpress/dx-react-chart";
import { scaleBand, } from "@devexpress/dx-chart-core";

export default function OverallChart(props: { data: PercentileReport[] | undefined, title: string }) {
  const modifyPercentileDomain = () => [0, 1.0];

  return (
    <Chart 
      rotated
      data={props.data? props.data : []}>
      <ArgumentScale factory={scaleBand} />
      <ArgumentAxis />
      <ValueScale name="percentile" modifyDomain={modifyPercentileDomain} />
      <ValueAxis scaleName="percentile"/>
      <BarSeries
        valueField="percentrankdps"
        argumentField="account"
        name="Percentile DPS"
        scaleName="percentile"
      />
      <BarSeries
        valueField="percentrankmight"
        argumentField="account"
        name="Percentile Might"
        scaleName="percentile"

      />
      <BarSeries
        valueField="percentrankquickness"
        argumentField="account"
        name="Percentile Quickness"
        scaleName="percentile"

      />
      <BarSeries
        valueField="percentrankalacrity"
        argumentField="account"
        name="Percentile Alacrity"
        scaleName="percentile"

      />
      <BarSeries
        valueField="percentrankfury"
        argumentField="account"
        name="Percentile Fury"
        scaleName="percentile"

      />
      <Stack />
      <Legend />
      <EventTracker />
      <Tooltip />
      <Title text={props.title}/>
    </Chart>
  );
}
