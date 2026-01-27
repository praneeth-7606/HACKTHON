import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="dashboard-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
