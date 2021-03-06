import { Avatar, Card, CardContent, CardHeader, makeStyles, Link} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import OverallChart from "./OverallChart";
import { FinalReport } from '../interfaces';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function ParsedLogBox(props: {data: FinalReport | undefined, isEmpty: boolean}) {
  const classes = useStyles();
  
  if (!props.data)
    return (
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar
              variant="square"
              className={classes.large}
              alt={undefined}
              src={undefined}
            />
          }
          title={undefined}
          subheader={undefined}
        />
        <CardContent>
          {!props.isEmpty && <LinearProgress />}
        </CardContent>
      </Card>
  );
  else {
    return (
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar
              variant="square"
              className={classes.large}
              alt={props.data.metadata.name}
              src={props.data.metadata.icon}
            />
          }
          title={props.data.metadata.name}
          subheader={<Link href={props.data.metadata.permaLink}>{props.data.metadata.permaLink}</Link>}
        />
        <CardContent>
          <OverallChart data={props.data.data.filter((item) => {
            return item.archetype === "DPS"
          }).sort((a, b) => {
            return a.percentrankdps - b.percentrankdps
          })} title={"DPS: Compare Percentiles"}/>

          <OverallChart data={props.data.data.filter((item) => {
            return item.archetype === "SUPPORT"
          }).sort((a, b) => {
            return a.percentrankdps - b.percentrankdps
          })} title={"SUPPORT: Compare Percentiles"}/>

          <OverallChart data={props.data.data.filter((item) => {
            return item.archetype === "HEALER"
          })} title={"HEALER: Compare Percentiles"}/>
        </CardContent>
      </Card>
    );
  }
}

