/* <div className={classes.sidetab}>
        <Tabs
          value={activeID}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {links.map((link: string) => {
              return (<Tab icon={renderProgress(progress.get(link))} label={link.replace("https://dps.report/", "")} {...a11yProps(link)} />);
            })}
        </Tabs>
        {links.map((link: string, index: number) => {
              return (
                <TabPanel value={activeID} index={index}>
                  <ParsedLogBox isEmpty={reports.size === 0} data={reports.get(activeID)} />
                </TabPanel>
              );
            })}
      </div> 
      
      function handleChange(event: React.ChangeEvent<{}>, value: string) {
    setActiveID(value);
  };

  function a11yProps(index: any) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

style:
sidetab: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
      
      */