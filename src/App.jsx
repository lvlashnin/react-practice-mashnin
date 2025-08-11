/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useMemo, useReducer, useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    el => el.id === product.categoryId,
  ); // find by product.categoryId
  const user = usersFromServer.find(el => el.id === category.ownerId); // find by category.ownerId

  return {
    ...product,
    categoryTitle: category.title,
    categoryIcon: category.icon,
    userName: user.name,
    userSex: user.sex,
  };
});

export const App = () => {
  const [stateSettings, setStateSettings] = useState({
    filterbyUser: 'all',
    filterbyCategory: 'all',
    searchQuery: '',
    sortBy: 'id',
    sortDirection: 'asc',
    isReset: false,
  });

  const displayedProducts = useMemo(() => {
    let result = products;
    if (stateSettings.filterbyUser !== 'all') {
      result = result.filter(
        product => product.userName === stateSettings.filterbyUser,
      );
    }
    if (stateSettings.searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(stateSettings.searchQuery),
      );
    }
    if (stateSettings.filterbyCategory !== 'all') {
      result = result.filter(
        product => product.categoryTitle === stateSettings.filterbyCategory,
      );
    }

    if (stateSettings.isReset) {
      result = products;
      setStateSettings(prev => ({
        ...prev,
        isReset: false,
      }));
    }
    return result;
  }, [stateSettings]);

  const handleFiletr = userName => {
    setStateSettings(prev => ({
      ...prev,
      filterbyUser: userName,
    }));
  };

  const handleSerch = event => {
    setStateSettings(prev => ({
      ...prev,
      searchQuery: event.target.value,
    }));
  };

  const handleCategoryFilter = categoryTitle => {
    setStateSettings(prev => ({
      ...prev,
      filterbyCategory: categoryTitle,
    }));
  };

  const handleResetAll = () => {
    setStateSettings(prev => ({ stateSettings: { ...prev, isReset: true } }));
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => handleFiletr('all')}
                className={cn({
                  'is-active': stateSettings.filterbyUser === 'all',
                })}
              >
                All
              </a>
              {usersFromServer.map(user => {
                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    key={user.id}
                    onClick={() => handleFiletr(user.name)}
                    className={cn({
                      'is-active': user.name === stateSettings.filterbyUser,
                    })}
                  >
                    {user.name}
                  </a>
                );
              })}
              {/* <a data-cy="FilterUser" href="#/">
                User 1
              </a>

              <a data-cy="FilterUser" href="#/" className="is-active">
                User 2
              </a>

              <a data-cy="FilterUser" href="#/">
                User 3
              </a> */}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={stateSettings.searchQuery}
                  onChange={event => handleSerch(event)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button mr-6 is-outlined is-success')}
                onClick={() => handleCategoryFilter('all')}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    data-cy="Category"
                    // className="button mr-2 my-1 is-info"
                    href="#/"
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.title)}
                    className={cn('button', 'my-1', {
                      'is-info':
                        category.title === stateSettings.filterbyCategory,
                    })}
                  >
                    {category.title}
                  </a>
                );
              })}

              {/* <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a> */}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedProducts.length ? (
                displayedProducts.map(product => {
                  return (
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.categoryIcon} - ${product.categoryTitle}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': product.userSex === 'm',
                          'has-text-danger': product.userSex === 'f',
                        })}
                      >
                        {product.userName}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <p>No products matching selected criteria</p>
              )}
              {/* <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  1
                </td>

                <td data-cy="ProductName">Milk</td>
                <td data-cy="ProductCategory">🍺 - Drinks</td>

                <td data-cy="ProductUser" className="has-text-link">
                  Max
                </td>
              </tr>

              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  2
                </td>

                <td data-cy="ProductName">Bread</td>
                <td data-cy="ProductCategory">🍞 - Grocery</td>

                <td data-cy="ProductUser" className="has-text-danger">
                  Anna
                </td>
              </tr>

              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  3
                </td>

                <td data-cy="ProductName">iPhone</td>
                <td data-cy="ProductCategory">💻 - Electronics</td>

                <td data-cy="ProductUser" className="has-text-link">
                  Roma
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
