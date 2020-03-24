import { Model } from 'dva';

import { ClassifyEnum, ItemEntity } from '@/globalState';
import produce from 'immer';

export interface TodoModelState {
  classify: ClassifyEnum;
  items: ItemEntity[];
}

export interface TodoModelType extends Model {
  state: TodoModelState;
}

const TodoModel: TodoModelType = {
  namespace: 'todo',
  state: {
    classify: ClassifyEnum.ALL,
    items: [],
  },
  reducers: {
    changeClassify(state: TodoModelState, action: any) {
      return produce(state, draft => {
        draft.classify = action.payload;
      });
    },
    addItem(state: TodoModelState, action: any) {
      return produce(state, draft => {
        draft.items.push(action.payload);
      });
    },
    delItem(state: TodoModelState, action: any) {
      const id = action.payload.id;
      const index = state.items.findIndex(item => item.id === id);
      return produce(state, draft => {
        draft.items.splice(index, 1);
      });
    },
    changeItemFinished(state: TodoModelState, action: any) {
      const id = action.payload.id;
      const finished = action.payload.finished;
      const index = state.items.findIndex(item => item.id === id);
      return produce(state, draft => {
        draft.items[index].finished = finished;
      });
    },
    changeItemText(state: TodoModelState, action: any) {
      const id = action.payload.id;
      const text = action.payload.text;
      const index = state.items.findIndex(item => item.id === id);
      return produce(state, draft => {
        draft.items[index].text = text;
      });
    },
    exchangeItems(state: TodoModelState, action: any) {
      const { id, toId } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      const toIndex = state.items.findIndex(item => item.id === toId);

      return produce(state, draft => {
        draft.items[index] = state.items[toIndex];
        draft.items[toIndex] = state.items[index];
      });
    },
  },
  effects: {
    // *onClickClassify({ payload }, { put }) {
    //     yield put({ type: "changeClassify", payload })
    // }
  },
};

export default TodoModel;
