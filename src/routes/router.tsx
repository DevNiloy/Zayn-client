import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/public/Home/Home";
 
import About from "../pages/public/about/About";
import Shop from "../pages/public/shop/Shop";
import Contact from "../pages/public/contact/Contact";
import Cart from "../pages/public/cart/Cart";
import ProductDetails from "../pages/public/products/ProductDetails";

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
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path:'cart',
        element:<Cart></Cart>
      },
      {
        path:'product/:id',
        element:<ProductDetails/>
      }
    ],
  },
]);
