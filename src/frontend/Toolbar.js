import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const styles = {
  root: {
    width: '100%',
  },
  grid: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
  },
  item: {
    margin: '0 5px',
  },
};

export const actions = store => {
  return {
    onPaste(event) {
      event.preventDefault();
      if (!(event.clipboardData && event.clipboardData.items)) {
        return;
      }

      // DataTransferItem
      const items = event.clipboardData.items;

      for (const item of items) {
        if (item.type.includes('image')) {
          const blob = item.getAsFile();
          const source = URL.createObjectURL(blob);
          store.dispatch({ type: 'load-image', payload: { source, blob } });
        }
      }
    },
    onSave() {
      const filereader = new FileReader();
      filereader.addEventListener('load', () => {
        localStorage.setItem('image', filereader.result);
      });
      filereader.readAsDataURL(store.state.imageBlock.blob);
    },
    onLoad(source) {
      store.dispatch({ type: 'load-image', payload: { source, blob: null } });
    },
    onGenerate(width, height) {
      store.dispatch({ type: 'generate', payload: [width, height] });
    },
  };
};

export const Toolbar = props => {
  const { store } = props;
  const { onSave, onLoad, onGenerate, onPaste } = actions(store);
  const { source, savedImage } = store.state;
  const handleLoad = () => onLoad(savedImage);

  return (
    <div style={styles.root}>
      <Box p={2}>
        <Grid container direction="column">
          <Grid item>
            <Button onClick={onSave} disabled={!!source}>
              Save
            </Button>
            <Button onClick={handleLoad}>Load</Button>
            <Button
              variant="contained"
              onClick={() => props.onGenerate() || onGenerate(10, 10)}
              disabled={source == null}
              color="primary"
            >
              Generate
            </Button>
          </Grid>
          <Grid item>
            <TextField id="image-input" label="Paste Image" onPaste={onPaste} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
