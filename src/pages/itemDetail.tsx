import React, { useState } from 'react';
import styles from './itemDetail.css';
import { useParams, useHistory } from 'umi';
import globalState from '@/globalState';

export default () => {
  const history = useHistory();
  const parsms = useParams<{ id: string }>();
  const item = globalState.items.find(
    single => single.id === parseInt(parsms.id),
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
              item.text = inputText;
            }

            alert('修改完成');
            history.goBack();
          }
        }}
      />
    </div>
  );
};
