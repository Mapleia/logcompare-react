import React, { useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { Button, Container, Typography, Box, CircularProgress, ListItemAvatar } from '@material-ui/core';
import { ListItem, ListItemText, List } from '@material-ui/core';
import { FinalReport, ParsedReport, PercentileReport } from './interfaces';
import ParsedLogBox from './components/parsedLogBox';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210
    },
    root: {
      width: '100%',
      backgroundColor: theme.palette.grey[300],
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
    },
  }));

export default function App() {
  const [files, setFiles] = useState<File[]>([]); // Files[]
  const [reports, setReports] = useState<Map<string, FinalReport>>(new Map()); // Filename: FinalReport
  const [progress, setProgress] = useState<Map<string, number>>(new Map()); // Filename: progress
  const [activeID, setActiveID] = useState<string>('');
  const API_LINK = 'http://127.0.0.1:8000';
  
  const classes = useStyles();

  async function getData(pid: string) : Promise<FinalReport | null> {
    if (pid) {
      try {  
          const HEADER = {
              'mode': 'cors',
              'Origin': 'http://localhost:3000',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS'
          };

          // send dps.report id
          // upload_report will
          //   1. get from /getJson?id=dr_id 
          //   2. save to logcompare db
          //   3. return ParsedReport json
          var jsonData = await fetch(`${API_LINK}/api/encounters/upload_report/?id=${pid}`, {method: 'POST', headers: HEADER});

          if (jsonData.ok) {
              const PARSED: ParsedReport = await jsonData.json();
              const P_REPORT = await fetch(`${API_LINK}/api/percentiles/?name=${PARSED.fightName}`);
              
              if (P_REPORT.ok) {
                  const everything = await P_REPORT.json();
                  var filtered = undefined;
                  // from the list, filter for tryID
                  filtered = everything.filter((encounter: PercentileReport) => {
                      return encounter.tryID === pid;
                  });
                  return {metadata: PARSED, data: filtered};
              } else {
                return null;
              }
          }
      } catch(err) {
        return Promise.reject(err);
      }
    }
    return null;
  }

  async function handleCompare() {
    //Send file to dps.report and send id to API

    function get_form(file: File) {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('generator', 'ei');
      formData.append('json', '1');
      return formData;
    }

    const header = {
      'mode': 'cors',
      'Origin': 'http://localhost:3000',
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS'
    };

    console.log(header);
    // For each parsed json file, upload to log compare database and set progress to 100
    for(const file of files) {
      if (progress.get(file.name) !== 0) {
        continue;
      }
      try {
        // Upload to dps.report
        // get permaLink and ID
        const DR_UPLOAD = await fetch('https://dps.report/uploadContent', 
        { 
          method: 'POST',
          body: get_form(file),
          //headers: header 
        });
        const DR_META = await DR_UPLOAD.json();
        console.log(DR_META);
        setProgress((prevState) => {
          return new Map(prevState).set(file.name, 30);
        })
        
        // fetch percentile report from dps.report id
        const DR_DATA = await getData(DR_META['id']);

        if (DR_DATA) {
          setProgress((prevState) => {
            return new Map(prevState).set(file.name, 70);
          })
          DR_DATA.metadata.permaLink = DR_META.permalink;
  
          setProgress((prevState) => {
            return new Map(prevState).set(file.name, 100);
          })
          setReports(function(prevState) {
            return new Map(prevState).set(file.name, DR_DATA);
          })
        }
        
      } catch(err) {
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
    })
    setFiles(fls);
    setProgress(listprogress);
  }

  function handleDropBoxDelete(f: File) {
    setFiles(files.splice(files.findIndex(file => file.name === f.name), 0));

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
      
      <Box paddingTop={2} paddingBottom={2} marginBottom={1} color="primary.main">
        <Typography variant="h2" align="center">Log Compare</Typography>
      </Box>
      <DropzoneArea
        maxFileSize={20000000}
        acceptedFiles={['.evtc', '.zevtc']}
        onChange={handleDropBoxChange}
        filesLimit={10}
        onDelete={handleDropBoxDelete}
        showPreviews={true}
        showPreviewsInDropzone={false}
        useChipsForPreview={true}
        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
        previewChipProps={{ classes: { root: classes.previewChip } }}
        previewText="Selected files"
      />

      <Box marginTop={2} marginBottom={2}>
        <Button variant="outlined"
          size={'large'}
          color="primary"
          onClick={handleCompare}>Compare</Button>
        <Button variant="outlined"
          size={'large'}
          color="primary"
          onClick={() => window.location.reload()}>Refresh Page</Button>
        <Button variant="outlined"
          size={'large'}
          color="primary"
          onClick={handleMassDelete}>Clear All</Button>

        <List dense className={classes.root}>
          {files.map((file: File) => {
            return (
              <ListItem button key={file.name} divider={true} onClick={() => { setActiveID(file.name) }}>
                <ListItemAvatar>
                  <CircularProgress variant="determinate" value={progress.get(file.name)} style={{marginRight: 10}}/>
                </ListItemAvatar>
                <ListItemText primary={`File: ${file.name}`} />
              </ListItem>
              )
          })}
        </List>
      </Box>
      
      <ParsedLogBox isEmpty={(reports.size === 0)} data={reports.get(activeID)} />
    
    </Container>)
}