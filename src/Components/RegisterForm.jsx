import { useState } from "react";
import { useAuth } from "../providers/authProvider";
import { toast } from "react-hot-toast";
import { onlyTextValidation, passwordValidation, alphaNumericValidation } from "../validations/validations";
import { useNavigate } from "react-router-dom";

export const RegisterForm = ({allUsers}) => {
  const [fullNameInput, setFullNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [inputErrors, setInputErrors] = useState({usernameError: undefined, passwordInputError: undefined, confirmPasswordInputError: undefined, fullNameError: undefined})
  const { register } = useAuth();
  const navigate= useNavigate()


  const handleBlur = ({ target: { name, value } }, callBackFunction) => {
   
    setInputErrors(existingValues => ({
      ...existingValues,
      [name + "Error"]: callBackFunction(value)
    }))
    
  }


  const comparePasswords = (confirmPassword) => {
   
    return passwordInput === confirmPassword ? undefined : "Passwords should be the same"
  }
  
 const isUsernameExist = (username) => {
  const result = allUsers.find(user => user.username === username)
   return result ? true : false
 } 

  

  const isOkToRegister = () => {
    if(
      onlyTextValidation(fullNameInput) ||
    alphaNumericValidation(usernameInput) ||
    passwordValidation(passwordInput) ||
    comparePasswords(confirmPasswordInput)
    
    ) {
      return false
    } else {
      if (fullNameInput.trim() === "" ||
      usernameInput.trim() === "" ||
      passwordInput.trim() === "" ||
      confirmPasswordInput.trim() === "") {
        toast.error("Field(s) cannot be blank")
        return false
      }
    }


    isUsernameExist(usernameInput) && toast.error("Username already taken")
     return !(isUsernameExist(usernameInput)) 
  }

  return (
    <section>
      <h2 style={{ color: "white" }}>Create User</h2>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if(isOkToRegister()){
            const newUser = {
              username: usernameInput,
              password: passwordInput,
              fullName: fullNameInput,
            }
             register(newUser)
            .then(() => {
              toast.success("registered");
            })
            .catch(() => {
              toast.error("registration failed");
            });
            localStorage.setItem("user", JSON.stringify(newUser))
           
          setUsernameInput("");
          setPasswordInput("");
          setFullNameInput("");
          navigate("User/")
          // navigate(0) //refresh so user in localStorage will reflect

          } else {
            toast.error("Please check your inputs");
          }
         
        }}
      >
        <input
        name="fullName"
          type="text"
          placeholder="fullname"
          onChange={(e) => {
            setFullNameInput(e.target.value);
          }}
          value={fullNameInput}
          autoComplete=""
          onBlur={(e) => handleBlur(e, onlyTextValidation)}
          
        />
         <div style={{color: "white",  borderRadius: "12px", backgroundColor: "maroon"}}>{inputErrors.fullNameError}</div>
        
        <input
        name= "username"
          type="text"
          placeholder="username"
          onChange={(e) => {
            setUsernameInput(e.target.value);
          }}
          value={usernameInput}
          autoComplete=""
          onBlur={(e) => handleBlur(e, alphaNumericValidation)}
        />
        <div style={{color: "white",  borderRadius: "12px", backgroundColor: "maroon"}}>{inputErrors.usernameError}</div>

        <input
        name="passwordInput"
          type="password"
          placeholder="password"
          onChange={(e) => {
            setPasswordInput(e.target.value);
          }}
          value={passwordInput}
          autoComplete=""
          onBlur={(e) => handleBlur(e, passwordValidation)}
          />
          <div style={{color: "white",  borderRadius: "12px", backgroundColor: "maroon"}}>{inputErrors.passwordInputError}</div>
         <input
         name="confirmPasswordInput"
          type="password"
          placeholder="password"
          onChange={(e) => {
            setConfirmPasswordInput(e.target.value);
          }}
          value={confirmPasswordInput}
          autoComplete=""
          onBlur={(e) => handleBlur(e, comparePasswords)}
        />
        <div style={{color: "white",  borderRadius: "12px", backgroundColor: "maroon"}}>{inputErrors.confirmPasswordInputError}</div>
        <input type="submit" value="submit"  style={{
            background:
              "linear-gradient(90deg, rgba(57,95,43,0.9921218487394958) 5%, rgba(247,123,60,1) 50%, rgba(57,95,43,1) 95%)",
          }} />
      </form>
    </section>
  );
};
