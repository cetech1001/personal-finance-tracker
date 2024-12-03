import {FormEvent, useState} from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Typography,
    FormLabel,
    FormControl,
    TextField,
    Button, Divider, Link, Alert
} from "@mui/material";
import { AuthCard } from './partials/AuthCard';
import { AuthContainer } from './partials/AuthContainer';
import {ForgotPassword} from "./ForgotPassword";
import {Logo} from "../shared/logo";
import Warning from "@mui/icons-material/Warning";

export const Login = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = new FormData(e.currentTarget);
            const email = data.get('email') as string || '';
            const password = data.get('password') as string || '';
            await login(email, password);
        } catch (e: any) {
            setError(e.response?.data?.message || e.message);
        }
    };

    return (
        <AuthContainer direction="column" justifyContent="space-between">
            <AuthCard variant="outlined">
                <Logo sx={{ width: 50, height: 50 }}/>
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
                    <ForgotPassword open={open} handleClose={() => setOpen(false)} />
                    {error && (
                        <Alert icon={<Warning fontSize="inherit" />} severity="error">
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
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
