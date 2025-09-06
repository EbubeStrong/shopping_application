import { ChartNoAxesCombined, ChartPie, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBasket } from "lucide-react";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet"; 
import { Button } from "../ui/button";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <ChartPie />,
  },
];

function MenuItems({setOpen, setShowAddButton}) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        return (
          <div
            className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            key={menuItem.id}
                onClick={() => {
                  navigate(menuItem.path)
                  menuItem.path === "/admin/products" ? setShowAddButton(true) : setShowAddButton(false)
                    !setOpen ? null : setOpen(false)
            }}
          >
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen, setShowAddButton }) {
  const navigate = useNavigate();
  return (
    <>
      {open && (
            <div
              className="fixed inset-0 bg-black/50 z-99"
              onClick={() => setOpen(false)}
            />
          )}

      <div
            className={`fixed top-0 left-0 h-full w-80 bg-white z-[100] transform transition-transform duration-300 ease-in-out ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="font-bold text-2xl">Admin Panel</h1>
              </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <MenuItems setOpen={setOpen} setShowAddButton={setShowAddButton} />

              {/* <HeaderRightContent setIsSheetOpen={setIsSheetOpen} /> */}
            </div>
          </div>

      <aside className="hidden w-64 h-screen fixed z-[999] left-0 top-0 flex-col border-r bg-background p-6 lg:flex ">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems setShowAddButton={setShowAddButton} />
      </aside>
    </>
  );
}

export default AdminSideBar;
