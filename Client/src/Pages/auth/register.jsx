import { useState } from "react";
import CommonForm from "@/components/common/form";
import { Link, useNavigate } from "react-router-dom";
import { registerFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../store/auth-slice";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const   AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const {toast} = useToast()

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // function onSubmit(e) {
  //   e.preventDefault();
  //   dispatch(registerUser(formData))
  //     .unwrap()
  //     .then((data) => {
  //       console.log("Register Response:", data);

  //       if (data?.payload?.success) {
  //         toast({
  //           title: data?.payload?.message,
  //         });
  //         navigate("/auth/login");
  //       } else {
  //         toast({
  //           title: data?.payload?.message,
  //           variant: "destructive",
  //         });
  //       }
  //     });
  // }
  // console.log(formData);
  // console.log("Dispatching Register:", formData);

  function onSubmit(e) {
    e.preventDefault();

    console.log("Submitting Form Data:", formData);

    dispatch(registerUser(formData))
      .unwrap() // Ensures the returned value is resolved properly
      .then((data) => {
        // console.log("Register Response:", data);

        if (data?.success) {
          toast({
            title: data.message,
          });
          navigate("/auth/login");
        } else {
          toast({
            title: data.message || "Registration failed",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Registration Error:", error);
        toast({
          title: error?.message || "Something went wrong",
          variant: "destructive",
        });
      });
  }


  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-light text-foreground">
          Create new account
        </h1>

        <div className="flex items-center justify-center mt-2">
          <p>Already have an account</p>

          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </div>
      </div>

      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthRegister;
