import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  House,
  LayoutList,
  LogOut,
  LogOutIcon,
  Menu,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import { logoutUser } from "../../../store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UserCartWrapper from "@/components/shopping-view/cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "../../../store/shop/cart-slice/index";

// import { logoutUser } from "../../../store/auth-slice";

function MenuItems() {
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItems) => {
        return (
          <Link
            key={menuItems.id}
            to={menuItems.path}
            className="text-sm font-medium text-gray-900 hover:text-gray-900"
          >
            {menuItems.label}
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderRightContent() {
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
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black cursor-pointer text-white font-extrabold">
              {user?.userName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56 translate-y-6">
          <DropdownMenuLabel>
            Logged in as{" "}
            {user?.userName.charAt(0).toUpperCase() + user?.userName.slice(1)}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/listing")}>
            <LayoutList className="mr-2 h-4 w-4" />
            Listing
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b  px-4 py-3 bg-background ">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-6 w-6 " />
          <span className="font-bold">Ecommerce</span>
        </Link>

        {/* <div className="flex gap-4 justify-between items-center"> */}
        {/* <Button
            className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-red-600 lg:hidden"
            onClick={handleLogout}
          >
            <LogOut />
            Logout
          </Button> */}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* {isAuthenticated ? ( */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
        {/* // ) : null} */}
        {/* </div> */}

        {/* <Button
          className=" gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-red-600 hidden lg:inline-flex"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button> */}
      </div>
    </header>
  );
}

export default ShoppingHeader;
