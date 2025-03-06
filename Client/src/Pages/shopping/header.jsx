import { Button } from "../../components/ui/button"
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { logoutUser } from "../../../store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// import { logoutUser } from "../../../store/auth-slice";




function ShoppingHeader() {
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
      <div className="flex justify-between items-center px-4 py-3 bg-background ">
        <div>Shopping View Header</div>
        <Button
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-red-600"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    );
}

export default ShoppingHeader;