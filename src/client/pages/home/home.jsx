import React from 'react';

import UsersTable from './users-table';

import styles from './home.styles';


function Home() {
  return (
    <div>
      <div className={styles.title}>Users</div>
      <UsersTable />
    </div>
  );
}

export default Home;
