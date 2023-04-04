import { Spin } from 'antd';
import { FC } from 'react';

import styles from './Loader.module.css';

type LoaderProps = {
  message?: string;
};

const Loader: FC<LoaderProps> = ({ message }) => {
  return (
    <div className={styles.container}>
      <Spin tip={message} />
    </div>
  );
};

export default Loader;
