import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ServicePage({ openModal, massageServices, bodyShapingServices }) {
  // useParams достает переменные прямо из ссылки браузера
  const { id } = useParams(); 

  return (
    <main className="pt-8 pb-20 min-h-[70vh] bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <Link to="/" className="inline-flex items-center text-stone-500 hover:text-sky-500 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад на главную
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-100">
          <span className="text-sky-500 font-bold tracking-widest uppercase text-xs mb-3 block">Услуга студии</span>
          <h1 className="text-3xl md:text-5xl font-serif text-stone-800 mb-6">
            Детальная страница: {id}
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed mb-8">
            Это шаблон будущей отдельной страницы. Скоро здесь появится подробное описание процедуры, ее этапы, противопоказания и список цен.
          </p>
          <button onClick={() => openModal()} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-md">
            Записаться на сеанс
          </button>
        </div>
      </div>
    </main>
  );
}