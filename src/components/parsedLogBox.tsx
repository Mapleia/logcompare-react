import { Avatar, Card, CardContent, CardHeader, makeStyles,} from "@material-ui/core";
import React from "react";
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
              alt={props.data.metadata.fightName}
              src={props.data.metadata.fightIcon}
            />
          }
          title={props.data.metadata.fightName}
          subheader={`${props.data.metadata.permaLink} \n LogCompare ID: ${props.data.metadata.tryID}`}
        />
        <CardContent>
          <OverallChart data={props.data.data}/>
          
        </CardContent>
      </Card>
    );
  }
}

