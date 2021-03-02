import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default function useStyles() {
  return makeStyles((theme: Theme) => createStyles({
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
}