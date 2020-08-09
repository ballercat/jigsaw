const reduce = (state, action) => {
  switch (action.type) {
    case 'init':
      const savedImage = localStorage.getItem('image');
      return {
        imageBlock: {
          source: null,
          savedImage,
        },
      };
    case 'load-image':
      return {
        ...state,
        imageBlock: {
          ...state.imageBlock,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default function store(update) {
  let state = {};
  let store = {
    state,
    dispatch(action) {
      store.state = reduce(state, action);
      update(store);
    },
  };
  return store;
}
