import { Button } from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { House, LogOut, Menu } from "lucide-react";
import { logoutUser } from "../../../store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { shoppingViewHeaderMenuItems } from "@/config";

// import { logoutUser } from "../../../store/auth-slice";


function MenuItems(){
  return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
    {shoppingViewHeaderMenuItems.map((menuItems) => {
      return <Link key={menuItems.id} to={menuItems.path} className="text-sm font-medium text-gray-900 hover:text-gray-900">
        {menuItems.label}
      </Link>
    })}
  </nav>
}



function ShoppingHeader() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();


  const {isAuthenticated} = useSelector((state) => state.auth);


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
    <header className="sticky top-0 z-40 w-full border-b  px-4 py-3 bg-background ">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-6 w-6 " />
          <span className="font-bold">Ecommerce</span>
        </Link>

        <div className="flex gap-4 justify-between items-center">
          <Button
            className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-red-600 lg:hidden"
            onClick={handleLogout}
          >
            <LogOut />
            Logout
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-full max-w-x5"
            ></SheetContent>
          </Sheet>

          <div className="hidden lg:block">
            <MenuItems />
          </div>

          {isAuthenticated ? <div></div> : null}
        </div>

        <Button
          className=" gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-red-600 hidden lg:inline-flex"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default ShoppingHeader;
