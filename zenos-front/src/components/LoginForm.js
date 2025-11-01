import React, { useState } from 'react';

/**
 * LoginForm component
 * Props:
 * - redirectUrl (string) optional, where to navigate after successful demo login
 */
function LoginForm({ redirectUrl = '/' }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const canSubmit = email.trim() !== '' && password.trim() !== '';

		const [showPassword, setShowPassword] = useState(false);

		const handleSubmit = (e) => {
		e.preventDefault();
		setError('');
		if (!canSubmit) {
			setError('Please enter username/email and password');
			return;
		}

		setLoading(true);
		// Demo: replace this with real API call
		setTimeout(() => {
			setLoading(false);
			alert('Logged in (demo): ' + email);
			window.location.href = redirectUrl;
		}, 700);
	};

	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<label className="field">
				Email
				<input
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					autoComplete="username"
				/>
			</label>

				<label className="field password-field">
					Senha
					<div className="password-input-wrap">
						<input
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							autoComplete="current-password"
						/>
						<button
							type="button"
							className="password-toggle"
							onClick={() => setShowPassword((s) => !s)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							<span className="eye-label">{showPassword ? 'Hide' : 'Show'}</span>
						</button>
					</div>
				</label>

			<div className="forgot-row">
				<a className="forgot" href="#">Esqueci minha senha</a>
			</div>

			{error && <div className="error">{error}</div>}

			<button type="submit" className="btn primary full" disabled={!canSubmit || loading}>
				{loading ? 'Signing in…' : 'Sign in'}
			</button>
		</form>
	);
}

export default LoginForm;
