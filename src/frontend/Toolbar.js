import React from 'react';

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

export const Toolbar = ({ store }) => {
  const { onSave, onLoad, onGenerate, onPaste } = actions(store);
  const { source, savedImage } = store.state;
  const handleLoad = () => onLoad(savedImage);

  return (
    <div style={styles.root}>
      <div style={styles.grid}>
        <div style={styles.item}>
          <button onClick={onSave} disabled={!!source}>
            Save
          </button>
        </div>
        <div style={styles.item}>
          <button onClick={handleLoad}>Load</button>
        </div>
        <div style={styles.item}>
          <button onClick={() => onGenerate(10, 10)} disabled={source == null}>
            Generate
          </button>
        </div>
        <div>
          <label htmlFor="paste">Paste Image</label>
          <input name="paste" type="text" onPaste={onPaste}></input>
        </div>
      </div>
    </div>
  );
};
