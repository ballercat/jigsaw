export type State = {
  imageBlock?: {
    source: string | null;
    savedImage: string | null;
  };
  error?: Error;
};

interface InitAction {
  type: 'init';
}
interface LoadImageAction {
  type: 'load-image';
  payload: {
    source: string | null;
    savedImage: string | null;
  };
}
interface ErrorAction {
  type: 'error';
  payload: Error;
}

export type Action = InitAction | LoadImageAction | ErrorAction;

const reduce = (state: State, action: Action) => {
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
    case 'error':
      return {
        ...state,
        error: {
          toString: (str => str)(action.payload.toString()),
          message: action.payload.message,
        },
      };
    default:
      return state;
  }
};

export default function store(update: Function) {
  let state = {};
  let store = {
    state,
    dispatch(action: Action) {
      store.state = reduce(state, action);
      update(store);
    },
  };
  return store;
}
