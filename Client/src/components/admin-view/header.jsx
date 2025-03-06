import { useEffect, useState } from "react";
import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../store/auth-slice";

function AdminHeader({
  setOpen,
  openCreateProductsDialog,
  setOpenCreateProductsDialog,
  setShowButton,
  showButton,
  showAddButton,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!openCreateProductsDialog) setShowButton(true);
  }, [openCreateProductsDialog]);

  function handleLogout() {
    // handle logout
    dispatch(logoutUser()).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      }
      // else {
      //   toast({
      //     title: data?.payload?.message,
      //     variant: "destructive"
      //   });
      // }
    });
  }
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b fixed top-0 z-50 w-full ">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex gap-7 flex-1 justify-center items-center mb-3 pt-3">
        <div className=" w-full flex justify-end">
          {showAddButton ? showButton && (
            <Button
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setShowButton(false);
              }}
            >
              Add New Product
            </Button>
          ) : ""}
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
