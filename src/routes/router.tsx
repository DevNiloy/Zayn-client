import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/public/Home/Home";

import About from "../pages/public/about/About";
import Shop from "../pages/public/shop/Shop";
// import Contact from "../pages/public/contact/Contact";
import Cart from "../pages/public/cart/Cart";
import ProductDetails from "../pages/public/products/ProductDetails";
import CheckoutPage from "@/pages/public/checkout/Checkout";

import AdminLayout from "@/layouts/AdminLayout";
import AdminGuard from "@/layouts/AdminGuard";
import AllOrders from "@/pages/adminpages/AllOrders/AllOrders";
import AddProduct from "@/pages/adminpages/AddProduct/AddProduct";
import OrderDetails from "@/pages/adminpages/OrderDetails/OrderDetails";
import EditProduct from "@/pages/adminpages/EditProduct/EditProduct";
import ProductList from "@/pages/adminpages/ProductList/ProductList";
import AddCategory from "@/pages/adminpages/AddCategory/AddCategory";
import AuthPage from "@/pages/auth/AuthPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      // {
      //   path: "contact",
      //   element: <Contact />,
      // },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "cart",
        element: <Cart></Cart>,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "product/:slug",
        element: <ProductDetails />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
    ],
  },

  {
    path: "/adminpannel",
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          // সরাসরি /adminpannel এ গেলে এটি দেখাবে
          // { index: true, element: <AllOrders /> },
          { index: true, element: <ProductList /> },
          { path: "orders", element: <AllOrders /> },
          { path: "orders/:id", element: <OrderDetails /> },
          { path: "add-product", element: <AddProduct /> },
          { path: "edit-product/:id", element: <EditProduct /> },
          { path: "all-product", element: <ProductList /> },
          { path: "add-categories", element: <AddCategory /> },
        ],
      },
    ],
  },
]);
