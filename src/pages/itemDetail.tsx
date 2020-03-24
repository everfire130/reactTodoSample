import React, { useState } from 'react';
import styles from './itemDetail.css';
import { useParams, useHistory, TodoModelState } from 'umi';
import { useDispatch, useSelector } from 'dva';
import { ItemEntity } from '@/globalState';

export default () => {
  const history = useHistory();
  const parsms = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const item = useSelector<{ todo: TodoModelState }, ItemEntity | undefined>(
    state => state.todo.items.find(single => `${single.id}` === parsms.id),
  );
  const [inputText, setInputText] = useState(item?.text ?? '');

  return (
    <div>
      <h1 className={styles.title}>TodoDetail</h1>
      <input
        value={inputText}
        onChange={evt => setInputText(evt.currentTarget.value)}
        placeholder="请输入待办事项"
        onKeyDown={evt => {
          //判断回车事件
          if (evt.keyCode === 13) {
            if (item) {
              dispatch({
                type: 'todo/changeItemText',
                payload: {
                  id: parseInt(parsms.id),
                  text: inputText,
                },
              });
            }

            alert('修改完成');
            history.goBack();
          }
        }}
      />
    </div>
  );
};
