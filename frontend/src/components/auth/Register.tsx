import {FormEvent, useState} from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { useAuth } from '../../context/AuthContext';
import {AuthCard} from "./partials/AuthCard";
import {
    Alert,
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Link,
    TextField,
    Typography
} from "@mui/material";
import {AuthContainer} from "./partials/AuthContainer";
import {Logo} from "../shared/logo";

export const Register = () => {
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const rePassword = document.getElementById('rePassword') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            isValid = false;
        } else if (password.value !== rePassword.value) {
            setPasswordError('Passwords do not match');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = new FormData(e.currentTarget);
            const email = data.get('email') as string || '';
            const password = data.get('password') as string || '';
            await register(email, password);
        } catch (e: any) {
            setError(e.response?.data?.message || e.message);
        }
    };

    return (
        <AuthContainer direction="row">
            <AuthCard variant="outlined">
                <Logo sx={{ width: 50, height: 50 }}/>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    Register
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
                            error={!!emailError}
                            helperText={emailError}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={!!passwordError}
                            helperText={passwordError}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            required
                            fullWidth
                            variant="outlined"
                            color={passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Re-type Password</FormLabel>
                        <TextField
                            error={!!passwordError}
                            helperText={passwordError}
                            name="rePassword"
                            placeholder="••••••"
                            type="password"
                            id="rePassword"
                            autoComplete="new-password"
                            required
                            fullWidth
                            variant="outlined"
                            color={passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    {error && (
                        <Alert icon={<WarningIcon fontSize="inherit" />} severity="error">
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Create account
                    </Button>
                </Box>
                <Divider>or</Divider>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={{ textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link href={"/login"} variant="body2" sx={{ alignSelf: 'center' }}>
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
};
