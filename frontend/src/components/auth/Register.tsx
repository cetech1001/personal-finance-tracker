import {ChangeEvent, FormEvent, useState} from 'react';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register(formData.username, formData.password);
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <input type="text" name="username" value={formData.username} onChange={onChange} placeholder="Username" required />
                <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Password" required />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} placeholder="Confirm Password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
