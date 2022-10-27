import React, { useEffect, useState, useCallback } from "react"

//biến toàn cầu
let logoutTimer

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
})
const calculateRemainTime = (expirationTime) => {
  const currentTime = new Date().getTime()
  const adjExpirationTime = new Date(expirationTime).getTime()
  const remainingDuration = adjExpirationTime - currentTime
  return remainingDuration
  // từ mới remain duy trì,expiration hết hạn, duration : khoang thoi gian,
}
const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token")
  const storedExpirationDate = localStorage.getItem("expirationTime")
  const remainingTime = calculateRemainTime(storedExpirationDate)
  //nếu thời gian duy trì nhỏ hơn thì xóa ..
  if (remainingTime <= 3600) {
    localStorage.removeItem("token")
    localStorage.removeItem("expirationTime")
    return null
  }
  //tokenData
  return {
    token: storedToken,
    duration: remainingTime,
  }
}

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken()
  //dăt 1 biến token để ktra
  let initialToken
  //ban dau khong co token
  if (tokenData) {
    initialToken = tokenData.token
  }
  // dat initialToken vi de khi dang nhap mà request lại trang van ở chỗ đăng nhập
  const [token, setToken] = useState(initialToken)

  const useIsLogin = !!token
  //ngăn chặn vòng lặp vô hạn khi useEffect gọi sử dụng useCallback
  const logoutHandle = useCallback(() => {
    setToken(null)
    //xóa thông báo token
    localStorage.removeItem("token")
    localStorage.removeItem("expirationTime")
    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }, [])

  const loginHandle = (token, expirationTime) => {
    setToken(token)
    //thêm thông báo token
    localStorage.setItem("token", token)
    // thêm bộ đếm thời gian hết hạn đăng nhập
    localStorage.setItem("expirationTime", expirationTime)
    const remainningTime = calculateRemainTime(expirationTime)

    logoutTimer = setTimeout(logoutHandle, remainningTime)
  }
  useEffect(() => {
    if (tokenData) {
      console.log("token", tokenData.duration)
      logoutTimer = setTimeout(logoutHandle, tokenData.duration)
    }
  }, [tokenData, logoutHandle])
  const contextValue = {
    token: token,
    isLoggedIn: useIsLogin,
    login: loginHandle,
    logout: logoutHandle,
  }
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}
export default AuthContext
