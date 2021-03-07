/* import React, { useState } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import {
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  ListItemAvatar,
  Snackbar,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
  ButtonGroup,
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ClearIcon from '@material-ui/icons/Clear';
import { ListItem, ListItemText, List } from "@material-ui/core";
import { FinalReport, ParsedReport, PercentileReport, Progress } from "./interfaces";
import ParsedLogBox from "./components/parsedLogBox";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
    root: {
      width: "100%",
      backgroundColor: theme.palette.grey[300],
      display: "flex",
      flexDirection: "row",
      padding: 0,
      marginTop: 10,
      marginBottom: 10,
    },
    
    control: {
      justifyContent: 'center',
      display: 'flex',
      marginBottom: 10,
    },
    list: {
      maxWidth: "100%",
      backgroundColor: theme.palette.grey[300],
      display: "flex",
      flexFlow: "row wrap",
      padding: 0,
    },
    listItem: {
      maxWidth: "20%",
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  })
);

export default function App() {
  const [files, setFiles] = useState<File[]>([]); // Files[]
  const [links, setLinks] = useState<string[]>([]); // Links[]
  const [accountTries, setTrys] = useState<string[]>([]); // accountTries[]
  const [account, setAccount] = useState("");
  const [link, setLink] = useState("");
  const [reports, setReports] = useState<Map<string, FinalReport>>(new Map()); // Name: FinalReport
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map()); // Name: progress

  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState(null);
  const [activeID, setActiveID] = useState<string>("");
  const DEV_ENV = false;
  const API_LINK = DEV_ENV? "http://127.0.0.1:8000" : "https://logcompare.herokuapp.com";
  const classes = useStyles();

  // returns percentile data, given a report
  async function getPercentiles(report: ParsedReport): Promise<FinalReport> {
    // Get all reports from the fight
    const P_REPORT = await fetch(`${API_LINK}/api/percentiles/?name=${report.name}`);

    let allPercentiles = P_REPORT.ok ? await P_REPORT.json() : [];
    var filtered = allPercentiles.filter((encounter: PercentileReport) => {
      return encounter.tryID === report.tryID;
    });
    const result: FinalReport = { 
      metadata: report,
      data: filtered,
      progress: Progress.Done
    };
    return result;
  }

  // returns report, given either a form (with a file) or a link to dps.report
  async function getData(input: FormData | string): Promise<FinalReport> {
    // Post to Log Compare API.
    // Send file to dps.report, save to logcompare db and return ParsedReport json
    if (typeof input === 'string') {
      var jsonData = await fetch(`${API_LINK}/api/fights/upload_report/`, {
        method: "POST",
        body: input,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    } else {
      jsonData = await fetch(`${API_LINK}/api/fights/upload_report/`, {
        method: "POST",
        body: input,
      });
    }
    const PARSED: ParsedReport = await jsonData.json();
    if (jsonData.ok) return await getPercentiles(PARSED);
    return Promise.reject(PARSED);
  }

  function statusUpdate(name: string, data: any, successful: boolean) {
    if (successful) {
      setProgress((prevState) => {
        return new Map(prevState).set(name, Progress.Done);
      });
      setReports(function (prevState) {
        return new Map(prevState).set(name, data);
      });
    } else {
      setProgress((prevState) => {
        return new Map(prevState).set(name, Progress.Error);
      });
      setError(data);
    }
  }
  // handle compare, sets progresses
  async function handleCompare(form: boolean, e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (form) {
      e.preventDefault();
    }
    //Send file to dps.report and send id to API
    // For each parsed json file, upload to log compare database and set progress to 100
    for (const file of files) {
      if (progress.get(file.name) === Progress.Done) {
        continue;
      }
      setProgress((prevState) =>
        new Map(prevState).set(file.name, Progress.Started)
      );
      try {
        let formData = new FormData();
        formData.append("file", file);

        // fetch percentile report from dps.report id
        const DR_DATA = await getData(formData);
        statusUpdate(file.name, DR_DATA, true);
      } catch (err) {
        statusUpdate(file.name, err, false);
      }
    }

    for (const link of links) {
      if (progress.get(link) === Progress.Done) {
        continue;
      }
      setProgress((prevState) =>
        new Map(prevState).set(link, Progress.Started)
      );
      try {
        // fetch percentile report from dps.report id
        console.log(JSON.stringify({ link: link }))
        const DR_DATA = await getData(JSON.stringify({ link: link }));
        statusUpdate(link, DR_DATA, true);
      } catch (err) {
        statusUpdate(link, err, false);
      }
    }
  }

  // handles file deletion
  function handleDropBoxDelete(f: File) {
    setFiles(files.splice(files.findIndex((file) => file.name === f.name), 0));

    setProgress(() => {
      var copy = progress;
      copy.delete(f.name);
      return copy;
    });
  }

  // handles clearing all state all
  function handleMassDelete() {
    setFiles([]);
    setLinks([]);
    setReports(new Map());
    setProgress(new Map());
    setError(null);
    setActiveID("");
  }

  async function handleAccountSearch(form: boolean, e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (form) {
      e.preventDefault();
    }
    var jsonData = await fetch(`${API_LINK}/api/fights/account_fight/?account=${account}`);
    if (jsonData.ok) {
      const PARSED: ParsedReport[] = await jsonData.json();
      for (const report of PARSED) {
        setTrys((prevState) => [...prevState, report.tryID])
        setProgress((prevState) =>
        new Map(prevState).set(report.tryID, Progress.Started)
        );
        try {
          const P_REPORT = await getPercentiles(report);
          statusUpdate(report.tryID, P_REPORT, true);
        } catch(err) {
          statusUpdate(report.tryID, err, false);
        }
      }
    }
  }

  // depending on Progress attribute, set appropriate progress circle
  function renderProgress(value: Progress | undefined) {
    switch (value) {
      case Progress.Started:
        return (
          <CircularProgress variant="indeterminate" style={{ marginRight: 10 }}/>
        );
      case Progress.Done:
        return (
          <CircularProgress
            variant="determinate"
            value={100}
            style={{ marginRight: 10 }}
          />
        );
      default:
        return (
          <CircularProgress
            variant="indeterminate"
            value={2}
            style={{ marginRight: 10 }}
          />
        );
    }
  };

  // handles Error Alert
  function handleClose(event?: React.SyntheticEvent, reason?: string) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  
  return (
    <Container maxWidth="lg">
      <Box
        paddingTop={2}
        paddingBottom={2}
        marginBottom={1}
        color="primary.main"
      >
        <Typography variant="h2" align="center">
          Log Compare
        </Typography>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <DropzoneArea
        maxFileSize={200000000000}
        acceptedFiles={[".evtc", ".zevtc"]}
        onChange={(fls) => setFiles(fls)}
        filesLimit={10}
        onDelete={handleDropBoxDelete}
        //showPreviews={true}
        showPreviewsInDropzone={true}
        //useChipsForPreview={true}
        //previewGridProps={{ container: { spacing: 1, direction: "row" } }}
        //previewChipProps={{ classes: { root: classes.previewChip } }}
        //previewText="Selected files"

      />
      <form noValidate autoComplete="off">
        <TextField
          id="dpsreport-full-width"
          name="dpsreport"
          label="dps.report"
          style={{ margin: 8 }}
          placeholder="https://dps.report/..."
          helperText="Paste a dps.report link here!"
          fullWidth
          margin="normal"
          variant="outlined"
          value={link}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setLink(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  className={classes.iconButton}
                  aria-label="search-for-account"
                  onClick={(e) => setLinks((prevState) => [...prevState, link])}
                  //edge="false"
                >
                  <AddBoxIcon />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton 
                  className={classes.iconButton} 
                  aria-label="clear-input"
                  onClick={(e) => {setLink("")}}
                  //edge="start"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
      <form noValidate autoComplete="off" onSubmit={(e) => handleAccountSearch(true, e)}>
        <TextField
            id="account-full-width"
            label="Account"
            style={{ margin: 8 }}
            placeholder="Gw2 Account Name"
            helperText="Search for your account"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setAccount(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton aria-label="search-account"
                    onClick={(e) => handleAccountSearch(false, e)}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      <ButtonGroup size="large" color="primary" aria-label="control-group" className={classes.control}>
        <Button
          variant="outlined"
          size={"large"}
          color="primary"
          onClick={(e) => handleCompare(false, e)}
        >
          Compare
        </Button>
        <Button
          variant="outlined"
          size={"large"}
          color="primary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
        <Button
          variant="outlined"
          size={"large"}
          color="primary"
          onClick={handleMassDelete}
        >
          Clear All
        </Button>
      </ButtonGroup>
      <List dense className={classes.list}>
          {files.map((file: File) => {
            return (
              <ListItem
                className={classes.listItem}
                button
                key={file.name}
                divider={true}
                onClick={() => {
                  setActiveID(file.name);
                }}
              >
                <ListItemAvatar>
                  {renderProgress(progress.get(file.name))}
                </ListItemAvatar>
                <ListItemText primary={`File: ${file.name}`} />
              </ListItem>
            );
          })}
          {links.map((link: string) => {
            return (
              <ListItem
                className={classes.listItem}
                button
                key={link}
                divider={true}
                onClick={() => {
                  setActiveID(link);
                }}
              >
                <ListItemAvatar>
                  {renderProgress(progress.get(link))}
                </ListItemAvatar>
                <ListItemText primary={`Link: ${link}`} />
              </ListItem>
            );
          })}
          {accountTries.map((tryID: string) => {
            return (
              <ListItem
                button
                className={classes.listItem}
                key={tryID}
                divider={true}
                onClick={() => {
                  setActiveID(tryID);
                }}
              >
                <ListItemAvatar>
                  {renderProgress(progress.get(tryID))}
                </ListItemAvatar>
                <ListItemText primary={`tryID: ${tryID}`} />
              </ListItem>
            );
          })}
        </List>
      <ParsedLogBox isEmpty={reports.size === 0} data={reports.get(activeID)} />
    </Container>
  );
}
 */