import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <div className="flex flex-col gap-3 min-h-[85vh] items-center justify-center">
      <Outlet />
    </div>
  );
}
