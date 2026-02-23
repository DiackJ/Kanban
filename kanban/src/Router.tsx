import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import AuthPage from './Auth/AuthPage'; 
import MainPage from './Main-page/MainPage';

const router = createBrowserRouter ([
    {
        path: "/",
        element: <Root />,
        // pages
        children: [
            {
                path: "signup",
                element: <AuthPage />,
            },
            {
                path: "login",
                element: <AuthPage />,
            },
            {
                path: "boards",
                element: <MainPage />,
            },
        ],
    },
]);

export default router;