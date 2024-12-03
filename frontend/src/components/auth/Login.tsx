import {ChangeEvent, FormEvent, useState} from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Typography,
    FormLabel,
    FormControl,
    TextField,
    FormControlLabel, Checkbox, Button, Divider, Link
} from "@mui/material";
import { AuthCard } from './partials/AuthCard';
import { AuthContainer } from './partials/AuthContainer';
import {ForgotPassword} from "./ForgotPassword";

export const Login = () => {
    const { login } = useAuth();
    // const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    /*const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };*/

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = new FormData(e.currentTarget);
            console.log({
                email: data.get('email'),
                password: data.get('password'),
            });
            // await login(formData.username, formData.password);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        /*<Box component="section" sx={{p: 2, border: '1px dashed grey'}}>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={onSubmit}>
                <input type="text" name="username" value={formData.username} onChange={onChange} placeholder="Username"
                       required/>
                <input type="password" name="password" value={formData.password} onChange={onChange}
                       placeholder="Password" required/>
                <button type="submit">Login</button>
            </form>
        </Box>*/
        <AuthContainer direction="column" justifyContent="space-between">
            <AuthCard variant="outlined">
                {/*<SitemarkIcon />*/}
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={onSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={!!error}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={error ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={!!error}
                            helperText={error}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={error ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <ForgotPassword open={open} handleClose={() => setOpen(false)} />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        // onClick={validateInputs}
                    >
                        Sign in
                    </Button>
                    <Link
                        component="button"
                        type="button"
                        onClick={() => setOpen(true)}
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                    >
                        Forgot your password?
                    </Link>
                </Box>
                <Divider>or</Divider>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={{ textAlign: 'center' }}>
                        Don&apos;t have an account?{' '}
                        <Link href={"/register"} variant="body2" sx={{ alignSelf: 'center' }}>
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
};
