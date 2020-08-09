// All the business logic

const reduce = (state, action, dispatch) => {
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
        image: action.payload.source,
        imageBlock: {
          ...state.imageBlock,
          ...action.payload,
        },
      };
    case 'generate':
      return state;
    default:
      return state;
  }
};

export default function store(update) {
  let state = {};
  let store = {
    state,
    dispatch(action) {
      store.state = reduce(state, action, store.dispatch);
      update(store);
    },
  };
  return store;
}
