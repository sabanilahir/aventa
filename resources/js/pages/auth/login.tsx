import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthCardLayout from '@/layouts/auth/auth-card-layout';
import AppLogoIcon from '@/components/app-logo-icon'; // Pastikan import logo Anda

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login({ status }: { status?: string }) {
  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthCardLayout>
      <Head title="Log in" />

      {/* Kartu Coklat Bronze Mewah */}
      <div className="w-full rounded-2xl bg-[#342418]/95 border border-amber-500/30 p-8 shadow-2xl backdrop-blur-md">

        {/* Header Kartu: Logo + Judul */}
        <div className="mb-6 flex flex-col items-center text-center">
          {/* Logo diletakkan di dalam kartu agar ukurannya terkunci rapi */}
          <div className="mb-4 flex w-full justify-center">
            <AppLogoIcon className="h-14 w-auto max-w-[140px] object-contain drop-shadow-md" />
          </div>

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400">
            Selamat Datang
          </h2>
          <p className="mt-1 text-xs text-amber-200/80">
            Masukkan kredensial Anda untuk masuk
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={submit}>
          <div className="grid gap-4">
            {/* Input Email */}
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-amber-100/90 text-xs font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoFocus
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="superadmin@example.com"
                className="h-11 bg-[#24180f]/90 border-amber-500/30 text-amber-50 placeholder:text-amber-200/40 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl"
              />
              <InputError message={errors.email} />
            </div>

            {/* Input Password */}
            <div className="grid gap-1.5">
              <Label htmlFor="password" className="text-amber-100/90 text-xs font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
                className="h-11 bg-[#24180f]/90 border-amber-500/30 text-amber-50 placeholder:text-amber-200/40 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl"
              />
              <InputError message={errors.password} />
            </div>

            {/* Checkbox Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="remember"
                checked={data.remember}
                onCheckedChange={(checked) => setData('remember', !!checked)}
                className="border-amber-400/50 data-[state=checked]:bg-amber-500 data-[state=checked]:text-[#24180f]"
              />
              <Label htmlFor="remember" className="text-xs text-amber-200/80 cursor-pointer">
                Remember me
              </Label>
            </div>

            {/* Tombol Gradient Gold */}
            <Button
              type="submit"
              className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 font-bold text-[#24180f] hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98]"
              disabled={processing}
            >
              {processing ? <LoaderCircle className="h-5 w-5 animate-spin text-[#24180f]" /> : 'Log in'}
            </Button>
          </div>
        </form>

        {status && (
          <div className="mt-4 text-center text-xs text-amber-300 bg-amber-950/60 p-2 rounded-lg border border-amber-500/30">
            {status}
          </div>
        )}
      </div>
    </AuthCardLayout>
  );
}
