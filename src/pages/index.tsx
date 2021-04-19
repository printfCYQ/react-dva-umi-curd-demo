import styles from './index.less';
import { Button } from 'antd';
import { history } from 'umi';

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <Button
        onClick={() => {
          history.push('/users');
        }}
      >
        users
      </Button>
      <Button
        onClick={() => {
          history.push('/prousers');
        }}
      >
        prousers
      </Button>
    </div>
  );
}
