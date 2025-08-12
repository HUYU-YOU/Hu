'use client'
import { signIn } from "next-auth/react";

export default function GoogleLoginButton({ label = "Se connecter avec Google" }) {
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/profile' })}
      aria-label={label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb',
        background: '#fff', cursor: 'pointer', fontWeight: 600
      }}
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.4 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.6 18.9 14 24 14c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6 28.9 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.1 0 9.7-2 13-5.2l-6-4.9C29 35.6 26.6 36 24 36c-5.1 0-9.5-3.6-10.9-8.4l-6.6 5C9.6 39.7 16.3 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-5.1 8-11.3 8-6.6 0-12-5.4-12-12 0-1.3.2-2.6.6-3.8l-6.6-5C4.7 17.5 4 20.7 4 24c0 11.1 8.9 20 20 20 11.1 0 20-8.9 20-20 0-1.2-.1-2.3-.4-3.5z"/>
      </svg>
      {label}
    </button>
  );
}
