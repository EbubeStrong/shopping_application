// import { House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  House,
  LayoutList,
  LogOut,
  LogOutIcon,
  Menu,
  ShoppingCart,
  UserCog,
  X,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
// import { shoppingViewHeaderMenuItems } from "@/config";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "../../../store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "../../../store/shop/cart-slice";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";

function MenuItems({ setIsSheetOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => (handleNavigate(menuItem), setIsSheetOpen && setIsSheetOpen(false))}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent({ setIsSheetOpen }) {
  const { user } = useSelector((state) => state.auth);
  // console.log(user, "userName")

  const { cartItems } = useSelector((state) => state.shopCart);
  // console.log(cartItems, "cartItems");

  const [openCartSheet, setOpenCartSheet] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    // handle logout
    dispatch(logoutUser()).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
          className: "bg-white",
        });
        // navigate("/auth/login");
      }
      // else {
      //   toast({
      //     title: data?.payload?.message,
      //     variant: "destructive"
      //   });
      // }
    });
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => (setOpenCartSheet(true), setIsSheetOpen && setIsSheetOpen(false))}
          variant="outline"
          size="icon"
          className="relative cursor-pointer"
        >
          <ShoppingCart className="w-6 h-6 cursor-pointer" />

          {/* Badge */}
          <span className="absolute -top-2 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
            {cartItems?.items?.length || 0}
          </span>

          <span className="sr-only">User cart</span>
        </Button>

        <UserCartWrapper
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
          open={openCartSheet}
          handleSetOpenCartSheet={setOpenCartSheet}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black cursor-pointer text-white font-extrabold">
              {user?.userName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          className="w-56 translate-y-6 bg-white"
        >
          <DropdownMenuLabel>
            Logged in as{" "}
            {user?.userName.charAt(0).toUpperCase() + user?.userName.slice(1)}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => (
              navigate("/shop/account"), setIsSheetOpen && setIsSheetOpen(false)
            )}
            className="cursor-pointer"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => (navigate("/shop/listing"), setIsSheetOpen(false))}
            className="cursor-pointer"
          >
            <LayoutList className="mr-2 h-4 w-4" />
            Listing
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer hover:text-red-500"
          >
            <LogOutIcon className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white px-4 py-3 bg-background ">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-6 w-6 " />
          <span className="font-bold">Ecommerce</span>
        </Link>

        {/* Custom Mobile Menu */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            onClick={() => setIsSheetOpen(!isSheetOpen)}
          >
            <Menu className="h-6 w-6 " />
            <span className="sr-only">Toggle header menu</span>
          </Button>

          {/* Overlay */}
          {isSheetOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSheetOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
              isSheetOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <MenuItems setIsSheetOpen={setIsSheetOpen} />
              <HeaderRightContent setIsSheetOpen={setIsSheetOpen} />
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>

      </div>
    </header>
  );
}
export default ShoppingHeader;