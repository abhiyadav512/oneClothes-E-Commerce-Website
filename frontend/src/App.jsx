import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './pages/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/admin/Dashboard';
import ProtectedRoute from './features/auth/ProtectedRoute';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './store/store';
import Category from './pages/Category';
import SingleProduct from './pages/SingleProduct';
import Products from './pages/Products';
import Favorite from './pages/Favorite';
import SearchResults from './pages/SearchResults';
import ProfilePage from './pages/ProfilePage';
import Orders from './pages/Orders';
import VerifyOtp from './features/auth/verify-otp';

const queryClient = new QueryClient();

// ✅ Main Router
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {

        path: "/categories/:category",
        element:
          <Category />,
      },
      {
        path: "/product/:ProdId",
        element: <SingleProduct />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },

      {
        path: "/profile",
        element: (
          <ProfilePage />
        ),
      },

      {
        path: "/favorite",
        element: (
          <Favorite />
        ),
      },
      {
        path: "/verify-otp",
        element: (
          <VerifyOtp />
        ),
      },
      
      {
        path: "/orders",
        element: (
          <Orders />
        ),
      },

      {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
