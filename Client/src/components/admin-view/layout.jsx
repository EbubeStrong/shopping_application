import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      {/* Admin SideBar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <AdminHeader setOpen={setOpenSidebar} />

        <main className="flex flex-1 bg-muted/40 px-4 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
