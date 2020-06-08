import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';

import store from 'resources/store';
import history from 'services/history.service';

import * as userActions from 'resources/user/user.actions';

import Loading from 'components/loading';
import { ErrorBoundary } from 'components/error-boundary';

import { routes } from 'routes';
import AuthLayout from 'layouts/auth';
import MainLayout from 'layouts/main';
import SignIn from 'pages/sign-in';
import Home from 'pages/home';
import NotFound from 'pages/not-found';

import 'styles/global';

const pages = {
  [routes.signIn.name]: SignIn,
  [routes.home.name]: Home,
};

const spaces = [
  {
    name: 'public',
    layout: AuthLayout,
    routes: Object.values(routes).filter((r) => r.private === false),
  },
  {
    name: 'private',
    layout: MainLayout,
    routes: Object.values(routes).filter((r) => r.private === true),
  },
];

function App() {
  const [loading, setLoading] = React.useState(true);


  React.useEffect(() => {
    async function init() {
      try {
        await store.dispatch(userActions.getCurrentUser());
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) return null;

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ErrorBoundary fallback={<h1>Error!</h1>}>
          <Switch>
            {spaces.map((space) => (
              <Route
                key={space.name}
                exact
                path={space.routes.map((r) => r.path)}
              >
                <space.layout>
                  <React.Suspense fallback={<Loading />}>
                    <Switch>
                      {space.routes.map((route) => (
                        <Route
                          key={route.name}
                          exact={route.exact}
                          path={route.path}
                          component={pages[route.name]}
                        />
                      ))}
                    </Switch>
                  </React.Suspense>
                </space.layout>
              </Route>
            ))}
            <Route path="*" component={NotFound} />
          </Switch>
        </ErrorBoundary>
      </ConnectedRouter>
    </Provider>
  );
}

export default hot(App);
