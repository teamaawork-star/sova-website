import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <Link to="/" className="text-2xl font-light text-white tracking-[0.2em] mb-1 hover:text-sky-400 transition-colors">SOVA</Link>
          <p className="text-xs uppercase tracking-wider mb-2">Студия массажа и коррекции фигуры</p>
          <a href="/policy.html" target="_blank" rel="noopener noreferrer" className="text-xs text-stone-500 hover:text-stone-300 underline mt-2">Политика конфиденциальности</a>
        </div>
        <div className="text-center md:text-right text-sm">
          <p className="mb-2">проспект Музрукова, д.37 к.3</p>
          <p>© {new Date().getFullYear()} Студия «SOVA». Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}