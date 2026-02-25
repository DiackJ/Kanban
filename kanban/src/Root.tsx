import { Outlet } from 'react-router-dom';

function Root() {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Root;