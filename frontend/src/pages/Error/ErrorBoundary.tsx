import React, { ErrorInfo, ReactNode } from 'react';
import { connect } from 'react-redux';
import BlueLink from "../../components/Text/BlueLink.tsx";
import { RootState } from "../../store/store.ts";
import { logout } from "../../api/requests/authApi.ts";

interface ErrorBoundaryProps {
    children: ReactNode;
    user: any;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Произошла ошибка:', error, errorInfo);
        const { user } = this.props;
        console.log('Информация о пользователе:', user);
    }

    handleRedirect = async () => {
        const { user } = this.props;

        // Если роль пользователя 1, вызываем logout
        if (user && user.roleId === 1) {
            await logout();  // Вызов асинхронной функции logout
            window.location.href = '/';  // Перенаправляем на главную после логаута
        } else if (user && (user.roleId === 1 || user.roleId === 4)) {
            window.location.href = '/user';  // Перенаправление на страницу user
        } else if (user && (user.roleId === 2 || user.roleId === 3)) {
            window.location.href = '/building';  // Перенаправление на страницу building
        } else {
            window.location.href = '/';  // В случае других ролей, перенаправляем на главную
        }
    };

    render() {
        const { hasError } = this.state;
        const { user } = this.props;

        if (hasError) {
            return (
                <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
                    <div className="bg-white p-6 rounded shadow-md w-80 text-center">
                        <h2 className="text-2xl font-bold text-red-600">Что-то пошло не так!</h2>
                        <p className="text-gray-500 mt-2">
                            Приносим извинения за доставленные неудобства. Нам уже известно о проблеме, и мы скоро её
                            решим.
                        </p>

                        <BlueLink
                            to="#"
                            text="Вернуться на главную"
                            onClick={this.handleRedirect}
                        />
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(ErrorBoundary);
