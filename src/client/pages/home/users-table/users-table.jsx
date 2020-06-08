import React from 'react';

import { View16 } from '@carbon/icons-react';

import config from 'config';
import Table from 'components/table';
import * as userApi from 'resources/user/user.api';
import * as dateHelper from 'helpers/date.helper';


const headers = [
  {
    key: '_id',
    header: 'Id',
  },
  {
    key: 'fullName',
    header: 'Full Name',
    isSortable: true,
    sortBy: ['firstName', 'lastName'],
  },
  {
    key: 'email',
    header: 'Email Address',
    isSortable: true,
  },
  {
    key: 'createdOn',
    header: 'Created On',
    isSortable: true,
  },
];

function UsersTable() {
  const [users, setUsers] = React.useState([]);
  const [totalAmount, setTotalAmount] = React.useState(0);

  const formatData = (data) => {
    return data.map((item) => ({
      ...item,
      id: item._id,
      fullName: `${item.firstName} ${item.lastName}`,
      createdOn: dateHelper.getDate(item.createdOn),
    }));
  };

  const requestData = async (options) => {
    const { data: payload } = await userApi.get(options);
    setUsers(formatData(payload.results));
    setTotalAmount(payload.totalAmount);
  };

  const shadowLogin = async ({ _id }) => {
    await userApi.shadowLogin(_id);
    window.open(config.webUrl);
  };

  const renderUsers = () => {
    return (
      <Table
        tableHeaders={headers}
        tableRows={users}
        totalAmount={totalAmount}
        rowActions={[{
          tooltipText: 'Shadow Login',
          icon: View16,
          onClick: shadowLogin,
          checkAvailability: () => true,
        }]}
        onDataRequest={requestData}
      />
    );
  };

  return <>{renderUsers()}</>;
}

export default UsersTable;
