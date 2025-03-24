import './App.css';
import AppRoutes from './routes';
import { NotificationProvider } from './contexts/NotificationContext';
import FloatingNotificationBell from './components/FloatingNotificationBell';

function App() {
    return (
        <div className={'min-h-screen'}>
            <NotificationProvider>
                <FloatingNotificationBell />
                <AppRoutes />
            </NotificationProvider>
        </div>
    );
}

export default App;
