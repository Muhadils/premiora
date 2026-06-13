import { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "Admin Login | Premiora",
  description: "Login untuk masuk ke dasbor admin.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo textClassName="text-slate-900" />
        </div>
        
        <div className="bg-white p-8 shadow-sm rounded-2xl border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Selamat Datang</h1>
            <p className="text-sm text-slate-500 mt-2">
              Silakan login dengan akun Supabase Anda untuk mengakses Dasbor Admin.
            </p>
          </div>
          
          <LoginForm />
        </div>
        
        <p className="text-center text-xs text-slate-400">
          Hanya untuk akses internal.
        </p>
      </div>
    </div>
  );
}
