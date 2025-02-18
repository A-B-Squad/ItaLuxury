'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const LanguageSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [currentLang, setCurrentLang] = useState<string>('fr');

    // Effect to check the initial language from localStorage or browser settings
    useEffect(() => {
        const storedLang = localStorage.getItem('lang') || navigator.language.slice(0, 2); // Fallback to browser language
        setCurrentLang(storedLang);
        document.documentElement.lang = storedLang;
        document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
    }, []);

    const switchLanguage = (lang: string) => {
        setCurrentLang(lang);
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        router.refresh(); 
    };

    return (
        <div className="flex gap-4">
            {/* Language Buttons with better styling and accessibility */}
            <button
                onClick={() => switchLanguage('fr')}
                className={`px-4 py-2 rounded-md ${currentLang === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} transition-colors duration-300`}
                aria-pressed={currentLang === 'fr'}
            >
                FR
            </button>
            <button
                onClick={() => switchLanguage('ar')}
                className={`px-4 py-2 rounded-md ${currentLang === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} transition-colors duration-300`}
                aria-pressed={currentLang === 'ar'}
            >
                عربي
            </button>
        </div>
    );
};

export default LanguageSwitcher;
