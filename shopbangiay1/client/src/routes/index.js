import ListProduct from "components/admin/Cart";
import Category from "components/admin/category";
import AddCategory from "components/admin/category/NewCategory";
import Chat from "components/admin/Chat";
import Comment from "components/admin/Comment";
import Products from "components/admin/products";
import Dashboard from "components/admin/dashboard";
import NewProduct from "components/admin/products/NewProduct";
import User from "components/admin/user";
import { ROUTES } from "constants/routes";
import ActivationEmail from "pages/activationEmail";
import CartProduct from "pages/cartProduct";
import {
  default as DetailProduct,
  default as DetailProductPage,
} from "pages/detail-product";
import HistoryCart from "pages/HistoryCart";
import Homepage from "pages/homepage";
import NotFount from "pages/NotFound";
import ProductsType from "pages/ProductsType";
import ResetPassword from "pages/resetPassword";
import Search from "pages/search";
import React from "react";
import { Switch, withRouter } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoute";

const AppRoutesComponent = () => {
  return (
    <div>
      <Switch>
        <PublicRoute path="/add" component={NewProduct} />
        <PublicRoute path="/addCate" component={AddCategory} />
        <PublicRoute path="/search" component={Search} />
        <AdminRoute path="/admin/product" component={Products} />
        <AdminRoute path="/admin/Dashboard" component={Dashboard} />
        <AdminRoute path="/admin/user" component={User} />
        <AdminRoute path="/admin/comments" component={Comment} />
        <AdminRoute path="/admin/chat" component={Chat} />
        <AdminRoute path="/admin/order" component={ListProduct} />
        <AdminRoute path="/admin/category" component={Category} />
        <PublicRoute path="/user/reset/:token" component={ResetPassword} />
        <PublicRoute path={ROUTES.HOMEPAGE} exact component={Homepage} />
        <PublicRoute path="/history-cart" exact component={HistoryCart} />
        <PublicRoute path={ROUTES.DETAIL} exact component={DetailProduct} />
        <PublicRoute path={ROUTES.PRODUCTTYPE} exact component={ProductsType} />
        <PublicRoute path={ROUTES.CART} exact component={CartProduct} />
        <PublicRoute path={ROUTES.LOGIN} component={Login} />
        <PublicRoute path={ROUTES.ACTIVATION} component={ActivationEmail} />
        <PublicRoute path={ROUTES.REGISTER} component={Register} />
        <PublicRoute path="/notfound" component={NotFount} />
        <PublicRoute
          path={ROUTES.DETAILPRODUCT}
          component={DetailProductPage}
        />
      </Switch>
    </div>
  );
};

export default withRouter(AppRoutesComponent);
