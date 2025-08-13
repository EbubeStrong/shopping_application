import { useState } from "react";
import CommonForm from "@/components/common/form";
import { Link, useNavigate } from "react-router-dom";
import { loginFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../store/auth-slice";
import { useToast } from "@/hooks/use-toast";


const initialState = {
  userName: "",
  email: "",
  password: "",
};


const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch()
  const { toast } = useToast()
  const navigate = useNavigate();
  

  
//   async function onSubmit(e) {
//   e.preventDefault();
  
//   try {
    // const data = await dispatch(loginUser(formData)).unwrap();

//     if (data?.payload?.success) {
//       toast({
//         title: data.payload.message,
//       });
//       navigate("/auth/register");  // Uncomment if you want redirection
//     } else {
//       toast({
//         title: data?.payload?.message || "An error occurred",
//         variant: "destructive",
//       });
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     toast({
//       title: "Something went wrong. Please try again.",
//       variant: "destructive",
//     });
//   }
// }

async function onSubmit(e) {
  e.preventDefault();

  try {
    // unwrap() returns the fulfilled payload directly
    const data = await dispatch(loginUser(formData)).unwrap();

    if (data?.success) {
      toast({
        title: data.message,
      });
      navigate("/auth/register"); // Uncomment if you want redirection
    } else {
      toast({
        title: data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    toast({
      title: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }
}



  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-light text-foreground">
          Sign in to your Account
        </h1>

        <div className="flex items-center justify-center mt-2">
          <p>Don't have an account</p>

          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </div>
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;
