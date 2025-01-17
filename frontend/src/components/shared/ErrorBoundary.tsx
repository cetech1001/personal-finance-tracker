import { ErrorInfo, ReactNode, Component } from 'react';

interface ErrorBoundaryProps {
    children?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('ErrorBoundary caught an error', error, info);
    }

    public render(): ReactNode {
        if (this.state.hasError) {
            return <h2>Something went wrong. Please try again later.</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
