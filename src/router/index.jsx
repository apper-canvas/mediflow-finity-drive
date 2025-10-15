import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Patients = lazy(() => import("@/components/pages/Patients"));
const PatientDetail = lazy(() => import("@/components/pages/PatientDetail"));
const PatientForm = lazy(() => import("@/components/pages/PatientForm"));
const Appointments = lazy(() => import("@/components/pages/Appointments"));
const AdmissionDischarge = lazy(() => import("@/components/pages/AdmissionDischarge"));
const Prescriptions = lazy(() => import("@/components/pages/Prescriptions"));
const Invoices = lazy(() => import("@/components/pages/Invoices"));
const InvoiceDetail = lazy(() => import("@/components/pages/InvoiceDetail"));
const Staff = lazy(() => import("@/components/pages/Staff"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Dashboard />
      </Suspense>
    )
  },
  {
    path: "patients",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Patients />
      </Suspense>
    )
  },
  {
    path: "patients/new",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <PatientForm />
      </Suspense>
    )
  },
  {
    path: "patients/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <PatientDetail />
      </Suspense>
    )
  },
  {
    path: "patients/:id/edit",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <PatientForm />
      </Suspense>
    )
  },
  {
    path: "appointments",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Appointments />
      </Suspense>
    )
  },
  {
    path: "prescriptions",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Prescriptions />
      </Suspense>
    )
  },
  {
    path: "admissions",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <AdmissionDischarge />
      </Suspense>
    )
  },
  {
    path: "invoices",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Invoices />
      </Suspense>
    )
  },
  {
    path: "invoices/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <InvoiceDetail />
      </Suspense>
    )
  },
  {
    path: "invoices/create",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Prescriptions />
      </Suspense>
    )
  },
  {
    path: "staff",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Staff />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);