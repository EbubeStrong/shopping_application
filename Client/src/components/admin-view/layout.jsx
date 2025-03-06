import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useEffect, useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [showAddButton, setShowAddButton] = useState(() => {
    const saved = localStorage.getItem("showAddButton");
    const initialValue = JSON.parse(saved);
    return initialValue || false;
  });

  useEffect(() => {
    localStorage.setItem("showAddButton", JSON.stringify(showAddButton));
  }, [showAddButton]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Admin SideBar */}
      <AdminSideBar
        open={openSidebar}
        setOpen={setOpenSidebar}
        setShowAddButton={setShowAddButton}
      />

      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <AdminHeader
          setOpen={setOpenSidebar}
          setOpenCreateProductsDialog={setOpenCreateProductsDialog}
          openCreateProductsDialog={openCreateProductsDialog}
          setShowButton={setShowButton}
          showButton={showButton}
          showAddButton={showAddButton}
        />

        <main
          className="flex flex-col flex-1 bg-muted/40 px-4 lg:ml-64 pt-[7rem] overflow-auto z-10"
          // style={{  paddingTop: "6rem" }}
        >
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
