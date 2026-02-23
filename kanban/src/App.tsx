import {  RouterProvider } from 'react-router-dom';
import router from './Router';
import './App.css';
import { ThemeProvider } from './context/ToggleThemeProvider';

function App() {

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>  
  )
}

export default App
