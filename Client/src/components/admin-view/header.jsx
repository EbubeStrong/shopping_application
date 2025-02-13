import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch()
  const {toast} = useToast()
  const navigate = useNavigate()

  function handleLogout() { 
    // handle logout
    dispatch(
      logoutUser()).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message
          });
          navigate("/auth/login");
        }
        // else {
        //   toast({
        //     title: data?.payload?.message,
        //     variant: "destructive"
        //   });
        // }
      }
    )
  }
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
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