// thêm xác thực email,password,tự động logout sau 1 thời gian

import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./App"
import { AuthContextProvider } from "./store/auth-context"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>
)
