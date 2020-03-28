import React, { useState, useEffect, memo } from 'react';
import { useHistory } from 'umi';
import styles from './index.less';
import { ClassifyEnum } from '@/globalState';
import { useDispatch, useSelector } from 'dva';
import { TodoModelState } from '@/models/todo';

/**
 * 主程序
 */
export default () => {
  const dispatch = useDispatch();

  const todoState = useSelector<{ todo: TodoModelState }, TodoModelState>(
    state => state.todo,
  );

  //添加事项的Input状态
  const [inputText, setInputText] = useState('');

  //分类状态
  const classify = todoState.classify;

  //事项状态
  const items = todoState.items;

  //添加事项
  const addItem = () => {
    //添加
    dispatch({
      type: 'todo/addItem',
      payload: {
        id: createId(),
        text: inputText,
        finished: false,
      },
    });
    //清除
    setInputText('');
  };

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
            id={item.id}
            key={item.id}
            text={item.text}
            finished={item.finished}
            upToId={index === 0 ? undefined : filterItems[index - 1].id}
            downToId={
              index === items.length - 1 ? undefined : filterItems[index + 1].id
            }
          />
        ))}
      </ul>

      <div>
        <button
          style={classify === ClassifyEnum.ALL ? { color: 'red' } : undefined}
          onClick={() =>
            dispatch({
              type: 'todo/changeClassify',
              payload: ClassifyEnum.ALL,
            })
          }
        >
          全部
        </button>
        <button
          style={
            classify === ClassifyEnum.UN_FINISHED ? { color: 'red' } : undefined
          }
          onClick={() =>
            dispatch({
              type: 'todo/changeClassify',
              payload: ClassifyEnum.UN_FINISHED,
            })
          }
        >
          未完成
        </button>
        <button
          style={
            classify === ClassifyEnum.FINISHED ? { color: 'red' } : undefined
          }
          onClick={() =>
            dispatch({
              type: 'todo/changeClassify',
              payload: ClassifyEnum.FINISHED,
            })
          }
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
  id: number;
  text: string;
  finished: boolean;

  //使用id精准交换
  upToId?: number;
  downToId?: number;
};

/**
 * memo浅对比，数据未改变，不render
 * 将方法放到内部，避免重复创建新function导致的浅对比与预测不相符的问题
 */
const Item = memo(function(props: ItemProps) {
  const { id, text, finished, upToId, downToId } = props;

  const dispatch = useDispatch();
  const history = useHistory();

  const onChangeFinished = (finished: boolean) => {
    dispatch({
      type: 'todo/changeItemFinished',
      payload: {
        id,
        finished,
      },
    });
  };

  const onChangeText = (text: string) => {
    dispatch({
      type: 'todo/changeItemText',
      payload: {
        id,
        text,
      },
    });
  };

  const onClickUp = upToId
    ? () => {
        dispatch({
          type: 'todo/exchangeItems',
          payload: {
            id,
            toId: upToId,
          },
        });
      }
    : undefined;

  const onClickDown = downToId
    ? () => {
        dispatch({
          type: 'todo/exchangeItems',
          payload: {
            id,
            toId: downToId,
          },
        });
      }
    : undefined;

  const onClickDel = () => {
    dispatch({
      type: 'todo/delItem',
      payload: {
        id,
      },
    });
  };

  const onClickDetail = () => {
    history.push(`/detail/${id}`);
  };

  //测试render次数。去掉memo可以发现只要其中一个地方修改所有Item都跑render了
  console.count(`render:${id}`);

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
});

//唯一id创建方法
let __id = 10000;
function createId(): number {
  return __id++;
}
