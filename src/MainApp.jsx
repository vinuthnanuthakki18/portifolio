import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FallbackSpinner from "./components/FallbackSpinner";
import NavBarWithRouter from "./components/NavBar";
import Home from "./components/Home";
import endpoints from "./constants/endpoints";

function MainApp() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.routes, { method: "GET" })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error("Error fetching routes:", err));
  }, []);

  return (
    <Router>
      <div className="MainApp">
        <NavBarWithRouter />
        <main className="main">
          <Switch>
            <Route exact path="/" component={Home} />
            {data &&
              data.sections.map((route) => {
                const SectionComponent = React.lazy(() =>
                  import(`./components/${route.component}`)
                );
                return (
                  <Route
                    key={route.headerTitle}
                    path={route.path}
                    render={() => (
                      <Suspense fallback={<FallbackSpinner />}>
                        <SectionComponent header={route.headerTitle} />
                      </Suspense>
                    )}
                  />
                );
              })}
              
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default MainApp;
