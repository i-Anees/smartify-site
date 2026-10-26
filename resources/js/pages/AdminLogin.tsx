import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import '../../css/admin.css';

export default function AdminLogin({ loginUrl }: { loginUrl: string }) {
    const form = useForm({ email: '', password: '', remember: false });
    function submit(event: FormEvent) {
        event.preventDefault();
        form.post(loginUrl, { onFinish: () => form.reset('password') });
    }
    return <div className="admin-login"><Head title="Studio admin sign in"><meta name="robots" content="noindex,nofollow" /></Head><div className="admin-login-brand"><img src="/images/brand/smartify-logo.png" alt="Smartify Solutions" /><span>THE STUDIO / CONTENT MANAGEMENT</span></div><form onSubmit={submit} className="admin-login-form"><p className="admin-eyebrow">SMARTIFY SOLUTIONS</p><h1>Welcome back.</h1><p>Sign in to manage your studio’s website.</p><label>Email address<input type="email" autoComplete="username" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} required autoFocus />{form.errors.email && <span role="alert" className="admin-error">{form.errors.email}</span>}</label><label>Password<input type="password" autoComplete="current-password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} required />{form.errors.password && <span role="alert" className="admin-error">{form.errors.password}</span>}</label><label className="admin-checkbox"><input type="checkbox" checked={form.data.remember} onChange={(event) => form.setData('remember', event.target.checked)} />Remember me on this device</label><button className="admin-primary" disabled={form.processing}>{form.processing ? 'Signing in…' : 'Sign in →'}</button><p className="admin-login-note">Access is limited to authorized administrators.</p></form></div>;
}
