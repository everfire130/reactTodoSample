import React, { useState, useEffect } from 'react';
import { useHistory } from 'umi';
import styles from './index.less';
import globalState, { ClassifyEnum, ItemEntity } from '@/globalState';
import { produce } from 'immer';

/**
 * 主程序
 */
export default () => {
  //添加事项的Input状态
  const [inputText, setInputText] = useState('');

  //分类状态
  const [classify, setClassify] = useState<ClassifyEnum>(ClassifyEnum.ALL);

  //事项状态
  const [items, setItems] = useState<ItemEntity[]>(globalState.items);

  const history = useHistory();

  //添加事项
  const addItem = () => {
    //添加
    setItems(
      produce(items, draft => {
        draft.push({
          id: createId(),
          text: inputText,
          finished: false,
        });
      }),
    );
    //清除
    setInputText('');
  };

  //改变完成状态
  const toggleFinishedItem = (id: number, finished: boolean) => {
    setItems(
      produce(items, draft => {
        const index = draft.findIndex(item => item.id === id);
        draft[index].finished = finished;
      }),
    );
  };

  //改变事项内容
  const modItem = (id: number, text: string) => {
    setItems(
      produce(items, draft => {
        const index = draft.findIndex(item => item.id === id);
        draft[index].text = text;
      }),
    );
  };

  //事项交换
  const exchangeItems = (id: number, toId: number) => {
    setItems(
      produce(items, draft => {
        const index = draft.findIndex(item => item.id === id);
        const toIndex = draft.findIndex(item => item.id === toId);
        draft[index] = items[toIndex];
        draft[toIndex] = items[index];
      }),
    );
  };

  //删除事项
  const deleteItem = (id: number) => {
    setItems(
      produce(items, draft => {
        const index = draft.findIndex(item => item.id === id);
        draft.splice(index, 1);
      }),
    );
  };

  useEffect(() => {
    //同步数据
    globalState.items = items;
  }, [items]);

  const filterItems = items.filter(item => {
    //分类
    if (classify === ClassifyEnum.ALL) {
      return true;
    } else if (classify === ClassifyEnum.UN_FINISHED) {
      return !item.finished;
    } else {
      return item.finished;
    }
  });

  return (
    <div>
      <h1 className={styles.title}>TODO</h1>

      <input
        value={inputText}
        onChange={evt => setInputText(evt.currentTarget.value)}
        placeholder="请输入待办事项"
        onKeyDown={evt => {
          //判断回车事件
          if (evt.keyCode === 13) {
            addItem();
          }
        }}
      />

      <ul>
        {filterItems.map((item, index) => (
          <Item
            key={item.id}
            text={item.text}
            finished={item.finished}
            onChangeText={text => modItem(item.id, text)}
            onChangeFinished={finished => toggleFinishedItem(item.id, finished)}
            onClickUp={
              index === 0
                ? undefined
                : () => exchangeItems(item.id, filterItems[index - 1].id)
            }
            onClickDown={
              index === items.length - 1
                ? undefined
                : () => exchangeItems(item.id, filterItems[index + 1].id)
            }
            onClickDel={() => deleteItem(item.id)}
            onClickDetail={() => history.push(`/detail/${item.id}`)}
          />
        ))}
      </ul>

      <div>
        <button
          style={classify === ClassifyEnum.ALL ? { color: 'red' } : undefined}
          onClick={() => setClassify(ClassifyEnum.ALL)}
        >
          全部
        </button>
        <button
          style={
            classify === ClassifyEnum.UN_FINISHED ? { color: 'red' } : undefined
          }
          onClick={() => setClassify(ClassifyEnum.UN_FINISHED)}
        >
          未完成
        </button>
        <button
          style={
            classify === ClassifyEnum.FINISHED ? { color: 'red' } : undefined
          }
          onClick={() => setClassify(ClassifyEnum.FINISHED)}
        >
          已完成
        </button>
      </div>
    </div>
  );
};

/**
 * 事项组件
 */
type ItemProps = {
  text: string;
  finished: boolean;
  onChangeText: (text: string) => void;
  onChangeFinished: (finished: boolean) => void;
  onClickUp?: () => void;
  onClickDown?: () => void;
  onClickDetail?: () => void;
  onClickDel?: () => void;
};

function Item(props: ItemProps) {
  const {
    text,
    finished,
    onChangeText,
    onChangeFinished,
    onClickUp,
    onClickDown,
    onClickDetail,
    onClickDel,
  } = props;

  return (
    <li>
      <input
        type="checkbox"
        checked={finished}
        onChange={evt => {
          onChangeFinished(evt.currentTarget.checked);
        }}
      />
      <input
        value={text}
        onChange={evt => onChangeText(evt.currentTarget.value)}
        placeholder="请输入待办事项"
      />
      <button onClick={onClickUp}>上</button>
      <button onClick={onClickDown}>下</button>
      <button onClick={onClickDetail}>详情</button>
      <button onClick={onClickDel}>删除</button>
    </li>
  );
}

//唯一id创建方法
let __id = 10000;
function createId(): number {
  return __id++;
}
