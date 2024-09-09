"use client";

import { ReactFlowProvider } from "reactflow";

export default function Layout({ children }) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
