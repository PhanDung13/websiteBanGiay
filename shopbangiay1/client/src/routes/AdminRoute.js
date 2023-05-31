import LayoutAdmin from "components/layout/adminLayout";
import React from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const AdminRoute = (props) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      {user?.role === 1 ? (
        <LayoutAdmin>
          <Route {...props} />
        </LayoutAdmin>
      ) : (
        <Route
          render={(props) => (
            <Redirect
              to={{
                pathname: "/notfound",
                state: { from: props.location },
              }}
            />
          )}
        />
      )}
    </>
  );
};

export default AdminRoute;
