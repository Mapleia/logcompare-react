import React, { useState } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import {
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  ListItemAvatar,
} from "@material-ui/core";
import { ListItem, ListItemText, List } from "@material-ui/core";
import { FinalReport, ParsedReport, PercentileReport } from "./interfaces";
import ParsedLogBox from "./components/parsedLogBox";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
    },
  })
);

export default function App() {
  const [files, setFiles] = useState<File[]>([]); // Files[]
  const [reports, setReports] = useState<Map<string, FinalReport>>(new Map()); // Filename: FinalReport
  const [progress, setProgress] = useState<Map<string, number>>(new Map()); // Filename: progress
  const [activeID, setActiveID] = useState<string>("");
  const API_LINK = "https://mapleia.pythonanywhere.com";
  const ORIGIN = "http://mapleia.github.io";
  const classes = useStyles();

  async function getData(file: File): Promise<FinalReport | null> {
    if (file) {
      try {
        // send dps.report id
        // upload_report will
        //   1. send file to dps.report
        //   2. get from /getJson?id=dr_id
        //   3. save to logcompare db
        //   4. return ParsedReport json

        // Create new form with file.
        let formData = new FormData();
        formData.append("file", file);

        // Post to Log Compare API.
        var jsonData = await fetch(
          `${API_LINK}/api/encounters/upload_report/`,
          {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin": ORIGIN,
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            },
            body: formData,
          }
        );

        if (jsonData.ok) {
          // Parse report
          const PARSED: ParsedReport = await jsonData.json();

          // Get all reports from the fight
          const P_REPORT = await fetch(`${API_LINK}/api/percentiles/?name=${PARSED.fightName}`);

          if (P_REPORT.ok) {
            // Parse report (which is an array of Encounters)
            const everything = await P_REPORT.json();
            // from the list, filter for tryID
            var filtered = everything.filter((encounter: PercentileReport) => {
              return encounter.tryID === PARSED.tryID;
            });
            return { metadata: PARSED, data: filtered };
          } else {
            return null;
          }
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return null;
  }

  async function handleCompare() {
    //Send file to dps.report and send id to API
    // For each parsed json file, upload to log compare database and set progress to 100
    for (const file of files) {
      if (progress.get(file.name) !== 0) {
        continue;
      }
      try {
        setProgress((prevState) => {
          return new Map(prevState).set(file.name, 10);
        });

        // fetch percentile report from dps.report id
        const DR_DATA = await getData(file);

        if (DR_DATA) {
          setProgress((prevState) => {
            return new Map(prevState).set(file.name, 70);
          });
          setProgress((prevState) => {
            return new Map(prevState).set(file.name, 100);
          });
          setReports(function (prevState) {
            return new Map(prevState).set(file.name, DR_DATA);
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  function handleDropBoxChange(fls: File[]) {
    var listprogress: Map<string, number> = new Map(progress);
    fls.forEach((file: File) => {
      if (!listprogress.has(file.name)) {
        listprogress.set(file.name, 0);
      }
    });
    setFiles(fls);
    setProgress(listprogress);
  }

  function handleDropBoxDelete(f: File) {
    setFiles(
      files.splice(
        files.findIndex((file) => file.name === f.name),
        0
      )
    );

    setProgress(() => {
      var copy = progress;
      copy.delete(f.name);
      return copy;
    });
  }

  function handleMassDelete() {
    setFiles([]);
    setReports(new Map());
    setProgress(new Map());
    setActiveID("");
  }
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
      <DropzoneArea
        maxFileSize={20000000}
        acceptedFiles={[".evtc", ".zevtc"]}
        onChange={handleDropBoxChange}
        filesLimit={10}
        onDelete={handleDropBoxDelete}
        showPreviews={true}
        showPreviewsInDropzone={false}
        useChipsForPreview={true}
        previewGridProps={{ container: { spacing: 1, direction: "row" } }}
        previewChipProps={{ classes: { root: classes.previewChip } }}
        previewText="Selected files"
      />

      <Box marginTop={2} marginBottom={2}>
        <Button
          variant="outlined"
          size={"large"}
          color="primary"
          onClick={handleCompare}
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

        <List dense className={classes.root}>
          {files.map((file: File) => {
            return (
              <ListItem
                button
                key={file.name}
                divider={true}
                onClick={() => {
                  setActiveID(file.name);
                }}
              >
                <ListItemAvatar>
                  <CircularProgress
                    variant="determinate"
                    value={progress.get(file.name)}
                    style={{ marginRight: 10 }}
                  />
                </ListItemAvatar>
                <ListItemText primary={`File: ${file.name}`} />
              </ListItem>
            );
          })}
        </List>
      </Box>

      <ParsedLogBox isEmpty={reports.size === 0} data={reports.get(activeID)} />
    </Container>
  );
}
