import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ServicePage({ openModal, massageServices, bodyShapingServices }) {
  const { id } = useParams();
  const serviceName = decodeURIComponent(id);

  const allCategories = [...massageServices, ...bodyShapingServices];
  
  let currentService = null;
  let parentCategory = null;

  allCategories.forEach(cat => {
    const foundItem = cat.items?.find(item => item.name === serviceName);
    if (foundItem) {
      currentService = foundItem;
      parentCategory = cat;
    }
  });

  // Логика "Похожих процедур": собираем все услуги, кроме текущей, и берем 3 штуки
  const allItems = allCategories.flatMap(c => c.items || []);
  const similarProcedures = allItems.filter(item => item.name !== serviceName).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
      {/* Шапка страницы */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={parentCategory.image} 
          alt={serviceName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link to="/#services" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6 text-sm font-medium bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Назад к списку
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif text-white shadow-sm leading-tight">{serviceName}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ОСНОВНАЯ КОЛОНКА */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* О процедуре */}
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

            {/* Противопоказания */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-red-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0 opacity-50"></div>
              <h2 className="text-2xl font-serif text-stone-800 mb-6 flex items-center relative z-10">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-3" /> 
                Противопоказания
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {[
                  'Острые воспалительные процессы', 
                  'Повышенная температура тела', 
                  'Онкологические заболевания', 
                  'Выраженное варикозное расширение вен', 
                  'Беременность (уточнять у мастера)', 
                  'Заболевания кожи в стадии обострения'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-stone-600 text-sm">
                    <span className="text-red-400 mr-2.5 mt-0.5">•</span> 
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-400 mt-6 relative z-10 border-t border-stone-100 pt-4">
                * Перед началом курса специалист студии обязательно проведет консультацию и убедится в отсутствии ограничений.
              </p>
            </div>

            {/* Почему выбирают нас */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-serif text-stone-800 mb-6">Почему выбирают нас</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Уютная атмосфера расслабления', 'Мастера с опытом от 5 лет', 'Персональный подход', 'Вкусный чай после процедур'].map((item, i) => (
                  <li key={i} className="flex items-center text-stone-600 gap-3 bg-stone-50 p-3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-sky-500 shrink-0" /> 
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* БОКОВАЯ КОЛОНКА (Цена и Кнопка) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-sky-100 sticky top-24">
              <span className="text-stone-400 text-sm uppercase tracking-widest mb-2 block font-medium">Стоимость сеанса</span>
              <div className="text-4xl font-bold text-sky-600 mb-8">{currentService.price}</div>
              
              <button 
                onClick={() => openModal(`${parentCategory.title || parentCategory.category} - ${serviceName}`)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 mb-4"
              >
                Записаться сейчас
              </button>
              
              <p className="text-xs text-stone-400 text-center leading-relaxed">
                Нажимая на кнопку, вы переходите к безопасному выбору удобного времени и мастера.
              </p>
            </div>
          </div>

        </div>

        {/* БЛОК ПОХОЖИЕ ПРОЦЕДУРЫ (На всю ширину снизу) */}
        {similarProcedures.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-serif text-stone-800 mb-6">Вам также может подойти</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProcedures.map((proc, idx) => (
                <Link 
                  key={idx} 
                  to={`/service/${encodeURIComponent(proc.name)}`} 
                  className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all group block"
                >
                  <h4 className="font-bold text-stone-800 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[3rem]">
                    {proc.name}
                  </h4>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-stone-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Длительность</span>
                      <span className="text-sm text-stone-600 font-medium">{proc.duration || 'По запросу'}</span>
                    </div>
                    <span className="font-bold text-lg text-sky-500">{proc.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}