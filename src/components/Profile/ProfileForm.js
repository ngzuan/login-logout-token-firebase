import { useRef, useContext } from "react"
import AuthContext from "../../store/auth-context"
import { useNavigate } from "react-router-dom"

import classes from "./ProfileForm.module.css"

const ProfileForm = () => {
  const newPasswordInputRef = useRef()

  const authCtx = useContext(AuthContext)

  const navigate = useNavigate()

  const submitHandle = (event) => {
    event.preventDefault()

    const enteredNewPassword = newPasswordInputRef.current.value

    //
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDwcCkw5GGoxinYXxx1q0R9OhdmK-qgabE",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      navigate("/", { replace: true }) //thay history trong v5
    })
  }
  return (
    <form className={classes.form} onSubmit={submitHandle}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
