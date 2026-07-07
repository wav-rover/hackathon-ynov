import { BrowserRouter, Route, Routes } from "react-router-dom"

import { BrandProvider } from "@/components/brand/BrandProvider"
import { AppLayout } from "@/components/layout/AppLayout"
import { AccountPage } from "@/pages/AccountPage"
import { MyPetsPage } from "@/pages/MyPetsPage"
import { SignInPage } from "@/pages/SignInPage"
import { SignUpPage } from "@/pages/SignUpPage"

export function App() {
  return (
    <BrowserRouter>
      <BrandProvider>
        <Routes>
          <Route path="/" element={<AppLayout />} />
          <Route path="/:brandSlug" element={<AppLayout />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/:brandSlug/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/:brandSlug/signup" element={<SignUpPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/:brandSlug/account" element={<AccountPage />} />
          <Route path="/my-pets" element={<MyPetsPage />} />
          <Route path="/:brandSlug/my-pets" element={<MyPetsPage />} />
        </Routes>
      </BrandProvider>
    </BrowserRouter>
  )
}

export default App
