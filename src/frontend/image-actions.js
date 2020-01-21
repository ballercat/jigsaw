const imageActions = store => {
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
  };
};

export default imageActions;
