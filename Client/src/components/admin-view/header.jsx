import { useEffect, useState } from "react";
import { AlignJustify, LogOut, LucideFileSpreadsheet } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { logoutUser, resetTokenAndCredentials } from "../../../store/auth-slice";
import { useLocation } from "react-router-dom";

function AdminHeader({
  setOpen,
  openCreateProductsDialog,
  setOpenCreateProductsDialog,
  setShowButton,
  showAddButton,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const location = useLocation();
  const isProductsPage = location.pathname === "/admin/products";

  useEffect(() => {
    if (!openCreateProductsDialog) setShowButton(true);
  }, [openCreateProductsDialog]);

  function handleLogout() {
    // handle logout
    // dispatch(logoutUser()).then((data) => {
    //   if (data?.payload?.success) {
    //     toast({
    //       title: data?.payload?.message,
    //     });
    //     navigate("/auth/login");
    //   }
    // }
     dispatch(resetTokenAndCredentials()).then(() => {
          toast({
            title: "Logged out successfully",
            className: "bg-white",
          });
        });
        sessionStorage.clear()
        navigate("/auth/login");
  }

  
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b fixed top-0 z-50 w-full ">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex gap-7 flex-1 justify-center items-center mb-3 pt-3">
        <div className=" w-full flex justify-end">
          {isProductsPage && showAddButton && (
            <Button
              className="block bg-white shadow-md cursor-pointer"
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setShowButton(false);
              }}
            >
              Add New Product
            </Button>
          )}
        </div>

        <Button
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-red-600"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
