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
  

  
  function onSubmit(e) {
    e.preventDefault()
     dispatch(
      loginUser(formData)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message
          });
          navigate("/auth/register");
        }
        else {
          toast({
            title: data?.payload?.message,
            variant: "destructive"
          });
        }
        // console.log(data)
      })
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
