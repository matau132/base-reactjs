import * as React from 'react';
import { useSelector } from 'react-redux';
import { RingLoader } from 'react-spinners';
import { AppState } from '../../reducer';
import { IndexedObject } from '../../utils/type';
import styles from './spinner.module.css';

const Spinner: React.FC<IndexedObject> = () => {
  const authenLoading = useSelector((state: AppState) => state.authentication.loading);
  const registerLoading = useSelector((state: AppState) => state.register.updating);
  const updateLoading = useSelector((state: AppState) => state.update.updating);

  if (authenLoading || registerLoading || updateLoading) {
    return (
      <div className={styles.wrapper}>
        <RingLoader size={50} color="#61dafb" />
      </div>
    );
  }
  return null;
};

export default Spinner;
