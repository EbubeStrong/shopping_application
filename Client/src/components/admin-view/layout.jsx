import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Admin SideBar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <AdminHeader
          setOpen={setOpenSidebar}
          setOpenCreateProductsDialog={setOpenCreateProductsDialog}
          openCreateProductsDialog={openCreateProductsDialog}
          setShowButton={setShowButton}
          showButton={showButton}
        />

        <main className="flex flex-col flex-1 bg-muted/40 px-4 py-20 overflow-auto ">
          <Outlet
            setOpen={setOpenSidebar}
            // a way for passing of props through / when using Outlet
            context={{
              showButton,
              setShowButton,
              openCreateProductsDialog,
              setOpenCreateProductsDialog,
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
