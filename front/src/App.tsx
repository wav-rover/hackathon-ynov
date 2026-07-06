import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/AppLayout"
import { AccountPage } from "@/pages/AccountPage"
import { MyPetsPage } from "@/pages/MyPetsPage"
import { SignInPage } from "@/pages/SignInPage"
import { SignUpPage } from "@/pages/SignUpPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/my-pets" element={<MyPetsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
