import { useState, useEffect } from 'react';
import {  Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scanner } from './Components/Scanner';
import  {Bonuses}  from '../src/Components/Bonuses.tsx'
import { Menu, Sun, Moon } from 'lucide-react';
import  MobileMenu  from './Components/MobileMenu'
import { Login } from './Components/Login';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Tariffs} from "./Components/Tariffs.tsx";
import easyBonus from  './assets/easy-bonus-512x512.png'
import {EditProfie} from "./Components/EditProfie.tsx";
import { LanguageSwitcher } from './Components/LanguageSwitch.tsx'
import { useTranslation } from 'react-i18next';
import './translations/translation.tsx';
import {Prizes} from "./Components/Prizes.tsx";

const AppContent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user } = useAuth();
    const { t: _t } = useTranslation();

        useEffect(() => {
            const isDark = localStorage.getItem('darkMode') === 'true';
            setIsDarkMode(isDark);
            if (isDark) {
                document.documentElement.classList.add('dark');
            }
        }, []);

        const toggleDarkMode = () => {
            setIsDarkMode(!isDarkMode);
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', (!isDarkMode).toString());
        };

    const handleMenuClick = () => {
        if (user) {
            setIsMenuOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 [transition:background-color_0.2s]">
            <nav className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                           <img src={easyBonus} alt="easyBonus" className="w-6 h-6 dark:text-gray-200"/>
                            <Link to="/" className="text-gray-900 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-extrabold ml-2">
                                EasyBonus
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            >
                                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                            </button>
                            <button 
                                disabled={!user}
                                onClick={handleMenuClick}
                                className={`p-2 rounded-md ${
                                    user 
                                        ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200' 
                                        : 'text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed'
                                }`}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            
            <MobileMenu 
                isOpen={isMenuOpen} 
                setIsOpen={setIsMenuOpen} 
                totalPoints={totalPoints} 
            />
            
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Scanner />
                        </ProtectedRoute>
                    } />
                    <Route path="/bonuses" element={
                        <ProtectedRoute>
                            <Bonuses onUpdatePoints={setTotalPoints} />
                        </ProtectedRoute>
                    } />
                    <Route path="/tariffs" element={
                        <ProtectedRoute>
                            <Tariffs     />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit" element={
                        <ProtectedRoute>
                            <EditProfie     />
                        </ProtectedRoute>
                    } />
                    <Route path="/prizes" element={
                        <ProtectedRoute>
                           <Prizes/>
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
};

export const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};