import { ReactNode } from "react";

export default function PageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl font-medium text-blue-950">{children}</h1>;
}
