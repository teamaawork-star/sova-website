import React from 'react';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

// Компонент принимает функцию openModal как параметр (проп) из App.jsx
export default function Header({ openModal }) {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Логотип теперь работает как ссылка на главную страницу */}
        <Link to="/" className="flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-light text-sky-500 tracking-[0.3em] ml-2">SOVA</h1>
          <p className="text-[0.55rem] md:text-xs text-stone-500 tracking-widest mt-1 uppercase text-center">Студия массажа<br className="md:hidden"/> и коррекции фигуры</p>
        </Link>
        
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-stone-600">
          {/* Мы заменили onClick на стандартные ссылки со слешем. 
              Это важно для многостраничника: если клиент на странице услуги 
              нажмет "Отзывы", сайт вернет его на главную и прокрутит к отзывам */}
          <a href="/#services" className="hover:text-sky-500">Услуги</a>
          <a href="/#results" className="hover:text-sky-500">Результаты</a>
          <a href="/#reviews" className="hover:text-sky-500">Отзывы</a>
          <a href="/#team" className="hover:text-sky-500">Команда</a>
          <a href="/#contacts" className="hover:text-sky-500">Контакты</a>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="tel:+79101258250" className="hidden md:flex items-center text-stone-700 font-medium hover:text-sky-500 mr-2 text-sm sm:text-base">
            <Phone className="w-4 h-4 mr-1.5" /> +7 910-125-82-50
          </a>
          <button onClick={() => openModal()} className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-medium">
            <span className="hidden sm:inline">Записаться</span>
            <span className="sm:hidden"><Phone className="w-4 h-4" /></span>
          </button>
        </div>
      </div>
    </header>
  );
}