import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";


import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddBoxIcon from '@material-ui/icons/AddBox';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import Alert from "@material-ui/lab/Alert";

import { DropzoneAreaBase, FileObject } from "material-ui-dropzone";
import { useState } from "react";

import { FinalReport, ParsedReport, PercentileReport, Progress } from "./interfaces";
import ParsedLogBox from "./components/parsedLogBox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    control: {
        justifyContent: 'center',
        display: 'flex',
        marginBottom: 10,
      },
  })
);

export default function App() {
    const [metas, setMeta] = useState<ParsedReport[]>([]);
    const [reports, setReports] = useState<FinalReport[]>([]); // Name: FinalReport
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [link, setLink] = useState("");
    const [account, setAccount] = useState("");
    const [active, setActive] = useState<number>(0);
    const [progress, setProgress] = useState<Map<number, Progress>>(new Map());
    const [files, setFiles] = useState<FileObject[]>([]);
    const classes = useStyles();

    const DEV_ENV = false;
    const API_LINK = DEV_ENV? "http://127.0.0.1:8000" : "https://logcompare.herokuapp.com";

    // Handle closing Alert
    function handleClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    // Based on given metadata and map key, get the percentiles data.
    async function getPercentiles(meta: ParsedReport) {
        try {
            var percentiles = await fetch(`${API_LINK}/api/percentiles/?name=${meta.name}`);
            const P_REPORT = await percentiles.json();
            var filtered = P_REPORT.filter((encounter: PercentileReport) => {
                return encounter.tryID === meta.tryID;
            });
            return filtered;
        } catch(err) {
            setError(err);
            return [];
        }
    }
    
    // Handle uploading new files
    async function handleAddFiles(newFiles: FileObject[]) {
        setFiles((prevState) => [...prevState, ...newFiles]);
        for (const file of newFiles) {
            try {
                var input = new FormData();
                input.append("file", file.file);
                var upload_report = await fetch(`${API_LINK}/api/fights/upload_report/`, { method: "POST", body: input });
                let meta = await upload_report.json();
                setMeta((prevState) => [...prevState, meta]);
            } catch (err) {
                setError(err);
            }
        }
    }

    async function compareItems() {
        var finalArr: FinalReport[] = [];

        for (let i = 0; i < metas.length; i++) {
            if (progress.get(i) === Progress.Done) {
                finalArr.push(reports[i])
            }
            setProgress((prevState) => new Map(prevState).set(i, Progress.Started));
            var data :PercentileReport[] = await getPercentiles(metas[i]);
            let final: FinalReport = {
                metadata: metas[i],
                data: data
            }
            finalArr.push(final);
            setProgress((prevState) => new Map(prevState).set(i, Progress.Done));
        }

        setReports(finalArr);
    }

    async function handleAddLink(e?: React.FormEvent<HTMLFormElement>) {
        if (e) e.preventDefault();
        var arr = link.replace(/\n/g, ",").split(",").map((link) => link.trim());
        var arrLink: string[] = metas.map((meta) => meta.permaLink);
        var filtered = arr.filter((e) => arrLink.indexOf(e) < 0, arrLink);
        console.log(`Links list size: ${arr.length}`);
        console.log(`filtered list size: ${filtered.length}`)
        if ( arr.length > filtered.length) {
            setError("Link already added.");
            setOpen(true);
            return;
        }
        for (const link of filtered) {
            try {
                // fetch percentile report from dps.report id
                var upload_report = await fetch(`${API_LINK}/api/fights/upload_report/`, {
                    method: "POST",
                    body: JSON.stringify({ link: link}),
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                });
                let meta: ParsedReport = await upload_report.json();
                setMeta((prevState) => [...prevState, meta]);
            } catch (err) {
                setError(err);
            }
        }
        
    }

    async function handleAccountSearch(e? : React.FormEvent<HTMLFormElement>) {
        if (e) e.preventDefault();
        try {
            var account_fight = await fetch(`${API_LINK}/api/fights/account_fight/?account=${account}`);
            let metas: ParsedReport[] = await account_fight.json();
            setMeta((prevState) => [...prevState, ...metas]);
        }
        catch (err) {
            setError(err);
        }
    }

    function a11yProps(index: any) {
        return {
          id: `scrollable-auto-tab-${index}`,
          'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }

    // depending on Progress attribute, set appropriate progress circle
    function renderProgress(index: number) {
        switch (progress.get(index)) {
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

    function handleDropBoxDelete(deletedFileObject: FileObject) {
        setFiles(files.splice(files.findIndex((file) => file.file.name === deletedFileObject.file.name), 0));
    }

    return (
        <Container maxWidth="lg">
            <Box paddingTop={2} paddingBottom={2} marginBottom={1} color="primary.main">
                <Typography variant="h2" align="center">Log Compare</Typography>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">{error}</Alert>
            </Snackbar>
            <DropzoneAreaBase
                fileObjects={files}
                maxFileSize={200000000000}
                acceptedFiles={[".evtc", ".zevtc"]}
                onAdd={handleAddFiles}
                filesLimit={10}
                onDelete={handleDropBoxDelete}
                showPreviews={true}
                showPreviewsInDropzone={true}
                useChipsForPreview={true}
                previewGridProps={{ container: { spacing: 1, direction: "row" } }}
                previewChipProps={{ classes: { root: classes.previewChip } }}
                previewText="Selected files"
            />
            <form noValidate autoComplete="off" onSubmit={(e) => handleAddLink(e)}>
                <TextField
                id="dpsreport-full-width"
                name="dpsreport"
                label="dps.report"
                style={{ margin: 8 }}
                placeholder="https://dps.report/..."
                helperText="Paste dps.report links here! Separate by newline or commas."
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={5}
                value={link}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setLink(e.target.value)}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <IconButton className={classes.iconButton} aria-label="search-account" onClick={(e) => handleAddLink()}>
                            <AddBoxIcon />
                        </IconButton>
                        <Divider className={classes.divider} orientation="vertical" />
                        <IconButton className={classes.iconButton} aria-label="clear-input" onClick={(e) => {setLink("")}}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                />
            </form>
            <form noValidate autoComplete="off" onSubmit={(e) => handleAccountSearch(e)}>
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
                            <IconButton aria-label="search-account" onClick={(e) => handleAccountSearch()}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                    }}
                />
                </form>
            <ButtonGroup size="large" color="primary" aria-label="control-group" className={classes.control}>
                <Button variant="outlined" size={"large"} color="primary" onClick={compareItems}>
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
            </ButtonGroup>
            <Tabs
                value={active}
                indicatorColor="primary"
                textColor="primary"
                onChange={(e, value) => setActive(value)}
                aria-label="report-tabs"
                scrollButtons="auto"
                variant="scrollable">{metas.map((value, index) => {
                    return(<Tab label={value.tryID} key={index} value={index} icon={renderProgress(index)} {...a11yProps(index)} />)
                })}</Tabs>
            <ParsedLogBox isEmpty={reports.length === 0} data={reports[active]} />
        </Container>
    )
}