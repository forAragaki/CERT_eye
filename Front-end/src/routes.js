import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import DnsView from 'src/views/dns/DnsView'
import HstsView from 'src/views/hsts/HstsView'
import CertView from 'src/views/cert/CertView'
import HttpView from 'src/views/https/HttpView'
import TrustView from 'src/views/trust/TrustView'
import UsedView from 'src/views/used/UsedView'
import ChainView from 'src/views/chaintrust/ChainView' 
import MainView from 'src/views/main/MainView'
import CdnView from 'src/views/cnd/CdnView'
import TableView from 'src/views/alltable/TableView'
const routes = [
  {
    path: 'certeye',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <CertView /> },
      { path: 'customers', element: <DnsView/> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'products', element: <HstsView/> },
      { path: 'settings', element: <TrustView /> },
      { path: 'Connection', element: <HttpView /> },
      { path: 'Cert', element: <UsedView /> },
      { path: 'Chain', element: <ChainView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'certeye',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: 'Cdn',element: <CdnView/> },
      { path: 'Table',element: <TableView/>},
      // { path: '/', element: <Navigate to="/app/Connection" /> },
      { path:'/', element: <MainView />},
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
