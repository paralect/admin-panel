import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import {
  DataTable,
  DataTableSkeleton,
  Button,
  Pagination,
  TooltipDefinition,
} from 'carbon-components-react';
import { Add16, FolderAdd16 } from '@carbon/icons-react';

import constants from 'helpers/constants';

import styles from './table.styles';


const {
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableBody,
  TableCell,
} = DataTable;

const DEBOUNCE_TIME = 500;
const LOADING_SCREEN_TIME = 1000;

function TableWrapper(props) {
  const {
    itemName,
    searchPlaceholder,
    tableHeaders,
    tableRows,
    rowActions,
    totalAmount,
    withoutSearch,
    addButton,
    emptyState,
    onRowClick,
    onDataRequest,
  } = props;

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSkeletonShown, setIsSkeletonShown] = React.useState(true);
  const [sortConfig, setSortConfig] = React.useState({
    sortBy: [],
    sortDirection: -1,
  });
  const [pageConfig, setPageConfig] = React.useState({
    page: 1,
    pageSize: constants.PAGE_SIZES[0],
  });
  const [searchText, setSearchText] = React.useState('');

  useEffect(() => {
    const requestData = async () => {
      setIsLoading(true);
      await onDataRequest({ ...sortConfig, ...pageConfig, searchText });
      setIsLoading(false);
    };

    requestData();
  }, [
    sortConfig.sortBy,
    sortConfig.sortDirection,
    pageConfig.page,
    pageConfig.pageSize,
    searchText,
  ]);

  useEffect(() => {
    const loadingScreenInterval = setInterval(() => {
      if (!isLoading) {
        setIsSkeletonShown(false);
        clearInterval(loadingScreenInterval);
      }
    }, LOADING_SCREEN_TIME);
  }, [isLoading]);

  const onSearchTextChange = _.debounce(setSearchText, DEBOUNCE_TIME);

  const renderRowActions = (row, index, listLength) => {
    return (
      <TableCell key={row.id}>
        {rowActions.map((action) => {
          if (!action.checkAvailability(row)) return null;

          const actionIcon = (
            <action.icon
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                action.onClick(event, row);
              }}
            />
          );

          return action.tooltipText ? (
            <TooltipDefinition
              align="center"
              direction={index + 1 > Math.floor(listLength / 2) ? 'top' : 'bottom'}
              tooltipText={action.tooltipText}
            >
              {actionIcon}
            </TooltipDefinition>
          ) : actionIcon;
        })}
      </TableCell>
    );
  };

  const renderLoadingTable = () => {
    return (
      <div>
        <div>
          {addButton && (
            <Button
              renderIcon={!Add16 || Add16.svgData ? undefined : Add16}
              kind="primary"
              size="small"
              onClick={addButton.onClick}
            >
              {addButton.title}
            </Button>
          )}
        </div>
        <DataTableSkeleton
          columnCount={rowActions.length ? tableHeaders.length + 1 : tableHeaders.length}
          headers={tableHeaders}
          rowCount={pageConfig.pageSize}
        />
      </div>
    );
  };

  const renderTable = () => {
    return (
      <>
        <DataTable
          rows={tableRows}
          headers={tableHeaders}
          render={({ rows, headers }) => {
            return (
              <TableContainer>
                <TableToolbar>
                  <TableToolbarContent>
                    {withoutSearch || (
                      <TableToolbarSearch
                        expanded
                        placeHolderText={searchPlaceholder || `Search ${itemName}`}
                        labelText={`Search ${itemName}`}
                        onChange={(event) => {
                          onSearchTextChange(event.target.value);
                        }}
                      />
                    )}
                    {addButton && (
                      <Button
                        renderIcon={!Add16 || Add16.svgData ? undefined : Add16}
                        kind="primary"
                        size="small"
                        onClick={addButton.onClick}
                      >
                        {addButton.title}
                      </Button>
                    )}
                  </TableToolbarContent>
                </TableToolbar>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader
                          key={header.key}
                          isSortable={header.isSortable}
                          isSortHeader={(header.sortBy || [header.key])
                            .every((field, i) => field === sortConfig.sortBy[i])}
                          sortDirection={sortConfig.sortDirection === 1 ? 'ASC' : 'DESC'}
                          onClick={() => {
                            const sortBy = header.sortBy || [header.key];
                            setSortConfig({
                              sortBy,
                              sortDirection: sortBy
                                .every((field, i) => field === sortConfig.sortBy[i])
                                ? -sortConfig.sortDirection : 1,
                            });
                          }}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                      <TableHeader />
                    </TableRow>
                  </TableHead>
                  {!!totalAmount && (
                    <TableBody>
                      {rows.map((row, index, array) => (
                        <TableRow
                          key={row.id}
                          onClick={() => {
                            onRowClick(tableRows[index]);
                          }}
                        >
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                          {renderRowActions(tableRows[index], index, array.length)}
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
                {!!totalAmount && totalAmount > constants.PAGE_SIZES[0] && (
                  <Pagination
                    page={pageConfig.page}
                    totalItems={totalAmount}
                    pageSize={pageConfig.pageSize}
                    pageSizes={constants.PAGE_SIZES}
                    onChange={(updated) => {
                      setPageConfig(updated);
                    }}
                  />
                )}
              </TableContainer>
            );
          }}
        />
        {!totalAmount && (
          <div>
            <emptyState.Icon />
            <div>{emptyState.title}</div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className={cn({ [styles.hidden]: isSkeletonShown })}>{renderTable()}</div>
      <div className={cn({ [styles.hidden]: !isSkeletonShown })}>{renderLoadingTable()}</div>
    </>
  );
}

TableWrapper.propTypes = {
  itemName: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  tableHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      isSortable: PropTypes.bool,
      sortBy: PropTypes.arrayOf(PropTypes.string.isRequired),
    }).isRequired,
  ).isRequired,
  addButton: PropTypes.shape({
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  withoutSearch: PropTypes.bool,
  tableRows: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  totalAmount: PropTypes.number.isRequired,
  rowActions: PropTypes.arrayOf(PropTypes.shape({
    tooltipText: PropTypes.string,
    icon: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    checkAvailability: PropTypes.func.isRequired,
  }).isRequired),
  emptyState: PropTypes.shape({
    title: PropTypes.string.isRequired,
    Icon: PropTypes.object.isRequired,
  }),
  onRowClick: PropTypes.func,
  onDataRequest: PropTypes.func.isRequired,
};

TableWrapper.defaultProps = {
  itemName: 'item',
  searchPlaceholder: undefined,
  withoutSearch: false,
  addButton: null,
  rowActions: [],
  emptyState: {
    title: 'There are no items yet',
    Icon: FolderAdd16,
  },
  onRowClick: () => {},
};

export default React.memo(TableWrapper);
