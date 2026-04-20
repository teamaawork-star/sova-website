import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ServicePage({ openModal, massageServices, bodyShapingServices }) {
  // 1. Достаем название услуги из адресной строки
  const { id } = useParams();
  const serviceName = decodeURIComponent(id);

  // 2. Ищем данные об этой конкретной услуге в наших массивах
  // Объединяем все услуги в один плоский список для удобного поиска
  const allCategories = [...massageServices, ...bodyShapingServices];
  
  let currentService = null;
  let parentCategory = null;

  // Ищем услугу во вложенных массивах items
  allCategories.forEach(cat => {
    const foundItem = cat.items?.find(item => item.name === serviceName);
    if (foundItem) {
      currentService = foundItem;
      parentCategory = cat;
    }
  });

  // Автоматическая прокрутка вверх при открытии страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Если услуга не найдена (например, ошибку ввели в ссылке)
  if (!currentService) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
        <h1 className="text-2xl font-serif text-stone-800 mb-4">Услуга не найдена</h1>
        <Link to="/" className="text-sky-500 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-stone-50 min-h-screen pb-20">
      {/* Шапка страницы с картинкой */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={parentCategory.image} 
          alt={serviceName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6 text-sm font-medium bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Назад к списку
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif text-white shadow-sm">{serviceName}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-serif text-stone-800 mb-6">О процедуре</h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                {parentCategory.description} Специалисты нашей студии подберут индивидуальную интенсивность воздействия, 
                учитывая ваши пожелания и особенности организма.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">Длительность</h4>
                    <p className="text-stone-500 text-sm">{currentService.duration || 'Уточняйте у мастера'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">Безопасность</h4>
                    <p className="text-stone-500 text-sm">Сертифицированные мастера и стерильное оборудование</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-serif text-stone-800 mb-6">Почему выбирают нас</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Уютная атмосфера', 'Мастера с опытом от 5 лет', 'Удобная локация', 'Чай после процедур'].map((item, i) => (
                  <li key={i} className="flex items-center text-stone-600 gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Боковая панель с ценой и записью */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-sky-100 sticky top-24">
              <span className="text-stone-400 text-sm uppercase tracking-widest mb-2 block">Стоимость</span>
              <div className="text-4xl font-bold text-sky-600 mb-6">{currentService.price}</div>
              
              <button 
                onClick={() => openModal(`${parentCategory.title || parentCategory.category} - ${serviceName}`)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-xl mb-4"
              >
                Записаться сейчас
              </button>
              
              <p className="text-xs text-stone-400 text-center leading-relaxed">
                Нажимая на кнопку, вы переходите к выбору удобного времени и мастера.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}