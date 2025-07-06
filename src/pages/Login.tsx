import { useState } from 'react';
import axios from 'axios';

// Giriş yanıtı tipi tanımı
interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
    };
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post<LoginResponse>(
                'http://localhost:5000/api/auth/login',
                { email, password }
            );

            localStorage.setItem('token', res.data.token);
            alert('Giriş başarılı!');

            // TODO: Görev listesine yönlendirme yapılabilir
        } catch (err: any) {
            const message =
                err.response?.data?.error || 'Sunucu hatası oluştu.';
            alert('Giriş hatası: ' + message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <h2>Giriş Yap</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                />
                <button
                    type="submit"
                    style={{ width: '100%', padding: '0.5rem' }}
                >
                    Giriş Yap
                </button>
            </form>
        </div>
    );
};

export default Login;
