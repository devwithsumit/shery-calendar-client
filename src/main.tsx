import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import App from './App';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
        <BrowserRouter>
            <App />
            <Toaster
                containerStyle={{
                    top: '7%',
                }}
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        borderRadius: '12px',
                    },
                }}
            />
        </BrowserRouter>
    </Provider>

);
