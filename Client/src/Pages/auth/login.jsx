import { useState } from "react";
import CommonForm from "@/components/common/form";
import { Link } from "react-router-dom";
import { loginFormControls } from "@/config";

const initialState = {
  userName: "",
  email: "",
  password: "",
};


const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  
  function onSubmit() {}

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
