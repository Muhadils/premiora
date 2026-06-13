"use client";

import { useActionState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "@/lib/actions/auth.actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            name="email" 
            type="email" 
            placeholder="Email Admin" 
            className="pl-10 h-12" 
            required 
            autoComplete="email"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            name="password" 
            type="password" 
            placeholder="Password" 
            className="pl-10 h-12" 
            required 
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base" disabled={isPending}>
        {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
        Login ke Dashboard
      </Button>
    </form>
  );
}
