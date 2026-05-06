'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, User, Lock, AlertTriangle } from 'lucide-react';

import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ProfileSchema = z.object({
  name: z.string().max(100).optional(),
});

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must not exceed 72 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof ProfileSchema>;
type PasswordFormValues = z.infer<typeof PasswordSchema>;

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[240px_1fr] gap-8 py-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">{children}</div>
    </div>
  );
}

// ─── Profile section ──────────────────────────────────────────────────────────

function ProfileSection() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    // TODO: wire to PATCH /users/me when endpoint is ready
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ name: values.name ?? null });
    setSaving(false);
    toast.success('Profile updated');
  };

  return (
    <Section icon={User} title="Profile" description="Your public display name and account email.">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="s-name">Display name</Label>
          <Input id="s-name" placeholder="Your name" {...register('name')} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="s-email">Email</Label>
          <Input id="s-email" value={user?.email ?? ''} disabled className="bg-slate-50 text-slate-500" />
          <p className="text-[11px] text-slate-400">Email cannot be changed.</p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button
            type="submit"
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
            disabled={saving || !isDirty}
          >
            {saving ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Saving…</> : 'Save changes'}
          </Button>
          {user?.isEmailVerified === false && (
            <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded px-2 py-1">
              Email not verified
            </span>
          )}
        </div>
      </form>
    </Section>
  );
}

// ─── Password section ─────────────────────────────────────────────────────────

function PasswordSection() {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
  });

  const onSubmit = async (_values: PasswordFormValues) => {
    setSaving(true);
    // TODO: wire to POST /auth/change-password when endpoint is ready
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    reset();
    toast.success('Password updated');
  };

  return (
    <Section icon={Lock} title="Password" description="Use a strong password you don't use elsewhere.">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="s-cur-pw">Current password</Label>
          <Input id="s-cur-pw" type="password" {...register('currentPassword')} />
          {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="s-new-pw">New password</Label>
          <Input id="s-new-pw" type="password" {...register('newPassword')} />
          {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="s-conf-pw">Confirm new password</Label>
          <Input id="s-conf-pw" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
            disabled={saving}
          >
            {saving ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Updating…</> : 'Update password'}
          </Button>
        </div>
      </form>
    </Section>
  );
}

// ─── Danger zone ──────────────────────────────────────────────────────────────

function DangerSection() {
  const { logout } = useAuth();

  return (
    <Section
      icon={AlertTriangle}
      title="Danger zone"
      description="Irreversible actions. Proceed with caution."
    >
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Sign out all devices</p>
            <p className="text-xs text-slate-500 mt-0.5">Invalidates all active sessions including this one.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 text-slate-700 border-slate-200"
            onClick={() => {
              toast.success('All sessions signed out');
              logout();
            }}
          >
            Sign out all
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">Delete account</p>
            <p className="text-xs text-slate-500 mt-0.5">Permanently deletes your account and all data.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={() => toast.error('Account deletion is not yet available.')}
          >
            Delete account
          </Button>
        </div>
      </div>
    </Section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
        </header>

        <div className="flex-1 overflow-auto">
          <div className=" mx-auto px-8 divide-y divide-slate-200">
            <ProfileSection />
            <PasswordSection />
            <DangerSection />
          </div>
        </div>
      </main>
    </div>
  );
}
