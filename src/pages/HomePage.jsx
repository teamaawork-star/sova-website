import React, { useState } from 'react';
import { Phone, MapPin, Clock, Sparkles, Wind, Droplets, ShieldCheck, ChevronDown, ChevronUp, Play, RotateCcw, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const IconMap = { Wind, Droplets, Sparkles, ShieldCheck };

// В скобках мы принимаем "пропсы" — данные, которые нам передаст App.jsx
export default function HomePage({ 
  heroData, massageServices, bodyShapingServices, resultsData, 
  reviewsData, teamMembers, equipmentData, faqData, quizQuestions, openModal 
}) {
  
  // Состояния, которые нужны только для Главной страницы
  const [activeTab, setActiveTab] = useState('massage');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [quizStep, setQuizStep] = useState(0); 
  const [quizAnswers, setQuizAnswers] = useState([]);

  // Логика квиза
  const handleQuizAnswer = (value) => {
    setQuizAnswers([...quizAnswers, value]);
    setQuizStep(quizStep + 1);
  };

  const getQuizResult = () => {
    const [goal, zone, method] = quizAnswers;
    if (goal === 'shape') {
      if (method === 'machine') {
         if (zone === 'belly') return { title: 'УЗ кавитация (живот)', desc: 'Идеально для локального жиросжигания. Безболезненная альтернатива липосакции.' };
         if (zone === 'legs') return { title: 'Вакуумный массаж или Криолиполиз', desc: 'Эффективная борьба с целлюлитом и подтяжка кожи.' };
         return { title: 'LPG-массаж всего тела', desc: 'Комплексное моделирование контуров тела и лимфодренаж.' };
      }
      return { title: 'Антицеллюлитный / Вакуумный массаж', desc: 'Мощная ручная или вакуумная проработка проблемных зон для упругости кожи.' };
    }
    if (goal === 'pain' || zone === 'back') return { title: 'Массаж спины и ШВЗ', desc: 'Глубокая проработка мышц, снятие зажимов, спазмов и тяжести.' };
    if (method === 'spa' || goal === 'relax') return { title: 'SPA-уход релакс/антистресс', desc: 'Полное погружение в расслабление с массажем и обертыванием.' };
    return { title: 'Общий массаж всего тела', desc: 'Классический сеанс для гармонии души и тела, снятия усталости.' };
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      {/* HERO & QUIZ SECTION */}
      <section className="relative bg-stone-100 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroData.bgImage} alt="Background" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-stone-50/95 via-stone-50/80 to-stone-50/30"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-sky-100/80 backdrop-blur-sm text-sky-700 text-sm font-semibold mb-6 shadow-sm">{heroData.badge}</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-800 mb-6 leading-tight">{heroData.title1} <br className="hidden lg:block"/> <span className="text-sky-600">{heroData.titleHighlight}</span> {heroData.title2}</h2>
              <p className="text-lg text-stone-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">{heroData.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => scrollToSection('services')} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">Смотреть услуги</button>
                <button onClick={() => openModal()} className="bg-white/80 backdrop-blur-sm border border-stone-200 px-8 py-3.5 rounded-full font-medium shadow-sm hover:bg-white">Записаться на сеанс</button>
              </div>
            </div>
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:mx-0 mt-8 lg:mt-0">
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-sky-300 rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
                {quizStep === 0 && (
                  <div className="animate-fade-in relative z-10 text-center py-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-50 to-white text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm"><Sparkles className="w-7 h-7" /></div>
                    <h2 className="text-2xl font-serif text-stone-800 mb-3">Не знаете, какую услугу выбрать?</h2>
                    <p className="text-stone-500 text-sm mb-8 leading-relaxed">Пройдите короткий тест, и мы подберем идеальную процедуру.</p>
                    <button onClick={() => { setQuizStep(1); setQuizAnswers([]); }} className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3.5 rounded-2xl font-medium flex justify-center shadow-md"><Play className="w-4 h-4 mr-2" /> Начать подбор</button>
                  </div>
                )}
                {quizStep > 0 && quizStep <= quizQuestions.length && (
                  <div className="animate-fade-in relative z-10">
                    <div className="mb-6 flex items-center justify-between"><span className="text-xs font-bold text-sky-500 uppercase">Вопрос {quizStep} из {quizQuestions.length}</span><div className="w-24 h-1.5 bg-stone-200/50 rounded-full"><div className="bg-sky-500 h-full transition-all" style={{ width: `${(quizStep / quizQuestions.length) * 100}%` }}></div></div></div>
                    <h3 className="text-xl font-serif text-stone-800 mb-6">{quizQuestions[quizStep - 1].question}</h3>
                    <div className="flex flex-col gap-3">
                      {quizQuestions[quizStep - 1].options.map((opt, idx) => {
                        const IconComp = IconMap[opt.iconName];
                        return (
                          <button key={idx} onClick={() => handleQuizAnswer(opt.value)} className="bg-white/80 border border-stone-100 p-4 rounded-2xl hover:border-sky-300 hover:bg-sky-50 transition-all flex items-center text-left group">
                            {IconComp ? <IconComp className="text-stone-400 group-hover:text-sky-500 mr-4 w-5 h-5"/> : <div className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-sky-400 mr-4"></div>}
                            <span className="font-medium text-stone-700 text-sm">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {quizStep > quizQuestions.length && (
                  <div className="animate-fade-in relative z-10 text-center py-2">
                    <div className="w-14 h-14 bg-green-100 text-green-500 rounded-2xl flex justify-center items-center mx-auto mb-4"><Check className="w-7 h-7" /></div>
                    <span className="text-xs font-bold text-stone-400 uppercase block mb-2">Вам подойдет:</span>
                    <h2 className="text-2xl font-serif text-sky-600 mb-3">{getQuizResult().title}</h2>
                    <p className="text-stone-600 text-sm mb-8">{getQuizResult().desc}</p>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => openModal(getQuizResult().title)} className="w-full bg-sky-500 text-white py-3.5 rounded-2xl font-medium shadow-md">Записаться</button>
                      <button onClick={() => { setQuizStep(0); setQuizAnswers([]); }} className="w-full bg-white/50 text-stone-500 py-3 rounded-2xl font-medium flex justify-center text-sm"><RotateCcw className="w-3.5 h-3.5 mr-2" /> Заново</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-20 md:py-32 bg-stone-50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-serif text-stone-800 mb-6">Наши Услуги и Цены</h2><p className="text-stone-500 text-lg">Выберите процедуру для расслабления или коррекции фигуры.</p></div>
          <div className="flex justify-center mb-16"><div className="bg-stone-200/50 p-1.5 rounded-full inline-flex flex-col sm:flex-row w-full sm:w-auto"><button onClick={() => setActiveTab('massage')} className={`px-8 py-3.5 rounded-full text-sm font-medium w-full sm:w-auto transition-all ${activeTab === 'massage' ? 'bg-white text-sky-600 shadow-md scale-105' : 'text-stone-500 hover:bg-stone-100/50'}`}>Массаж</button><button onClick={() => setActiveTab('body')} className={`px-8 py-3.5 rounded-full text-sm font-medium w-full sm:w-auto mt-2 sm:mt-0 transition-all ${activeTab === 'body' ? 'bg-white text-sky-600 shadow-md scale-105' : 'text-stone-500 hover:bg-stone-100/50'}`}>Коррекция фигуры</button></div></div>
          <div className="flex flex-col gap-20 md:gap-32 animate-fade-in">
            {(activeTab === 'massage' ? massageServices : bodyShapingServices).map((item, idx) => {
               const IconComp = IconMap[item.iconName] || Sparkles;
               return (
                <div key={idx} className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                  <div className="w-full lg:w-5/12 lg:sticky lg:top-32 relative group">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-md mb-6 relative"><img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors"></div>{activeTab === 'body' && (<div className="absolute top-4 left-4 bg-white/90 p-3 rounded-2xl"><IconComp className="w-6 h-6 text-sky-500" /></div>)}</div>
                    <h3 className="text-3xl font-serif text-stone-800 mb-4">{item.title || item.category}</h3>
                    <p className="text-stone-500 leading-relaxed text-lg">{item.description}</p>
                  </div>
                  <div className="w-full lg:w-7/12 flex flex-col gap-3 md:gap-4 lg:pt-4">
                    {item.items?.map((subItem, sIdx) => (
                      <div key={sIdx} className="bg-white p-5 md:p-6 rounded-2xl border border-stone-100 shadow-sm hover:border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                        <div className="flex-1 pr-4"><h4 className="font-medium text-lg group-hover:text-sky-700">{subItem.name}</h4>{subItem.duration && (<span className="text-stone-400 text-sm mt-2 flex items-center"><Clock className="w-4 h-4 mr-1.5 text-stone-300" />{subItem.duration}</span>)}</div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between border-t border-stone-50 sm:border-0 pt-4 sm:pt-0">
                          <span className="text-xl md:text-2xl font-semibold text-sky-600">{subItem.price}</span>
                          <div className="flex gap-2 w-full sm:w-auto">
                            {/* Кнопка перехода на отдельную страницу */}
                            <Link to={`/service/${encodeURIComponent(subItem.name)}`} className="flex-1 sm:flex-none text-center bg-white border border-stone-200 text-stone-600 hover:text-sky-600 hover:border-sky-300 px-4 py-3 rounded-xl text-sm font-medium transition-all">Подробнее</Link>
                            {/* Старая кнопка записи */}
                            <button onClick={() => openModal(`${item.title || item.category} - ${subItem.name}`)} className="flex-1 sm:flex-none text-center bg-stone-50 text-stone-600 hover:bg-sky-500 hover:text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm">Записаться</button>
                          </div>
                        </div>                      </div>
                    ))}
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      </section>

      {/* ДО/ПОСЛЕ */}
      <section id="results" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Результаты наших клиентов</h2><p className="text-stone-500">Реальные изменения после курсов процедур</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {resultsData.map((res, idx) => (
              <div key={idx} className="group">
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg"><img src={res.before} className="w-full h-full object-cover" /><div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">До</div></div>
                  <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-sky-400"><img src={res.after} className="w-full h-full object-cover" /><div className="absolute top-4 left-4 bg-sky-500 text-white text-xs px-3 py-1 rounded-full">После</div></div>
                </div>
                <h3 className="text-xl font-serif text-stone-800 mb-2">{res.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{res.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section id="reviews" className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Отзывы и впечатления</h2><p className="text-stone-500">Что говорят о нас гости студии</p></div>
          <div className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide">
            {reviewsData.map((rev, idx) => (
              <div key={idx} className="w-[280px] md:w-[320px] flex-none aspect-[9/16] bg-white rounded-3xl shadow-md overflow-hidden border border-stone-100 transform hover:-translate-y-2 transition-transform duration-300">
                <img src={rev.image || rev} alt="Отзыв" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОМАНДА */}
      <section id="team" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Наша Команда</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-stone-50 rounded-3xl shadow-sm border overflow-hidden p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md"><img src={member.image} className="w-full h-full object-cover" /></div>
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-1">{member.name}</h3>
                <span className="text-sky-600 text-sm font-medium mb-4">{member.role}</span>
                <p className="text-stone-500 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* АППАРАТЫ */}
      <section id="equipment" className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Наше Оборудование</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {equipmentData.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/3 h-48 sm:h-auto shrink-0"><img src={item.image} className="w-full h-full object-cover rounded-2xl" /></div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">{item.description}</p>
                  <ul className="space-y-2">{item.features?.split(',').map((f, i) => <li key={i} className="flex items-center text-xs font-medium text-stone-600"><ShieldCheck className="w-4 h-4 text-sky-500 mr-2" /> {f.trim()}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Вопрос-ответ</h2></div>
          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div key={idx} className="border rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} className="w-full px-6 py-5 flex justify-between items-center bg-stone-50 hover:bg-stone-100 text-left"><span className="font-medium pr-4">{faq.question}</span>{openFaqIndex === idx ? <ChevronUp className="w-5 h-5 text-sky-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />}</button>
                {openFaqIndex === idx && <div className="px-6 py-5 bg-white text-sm border-t">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="py-16 bg-sky-800 text-white relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif mb-10 text-center">Как нас найти</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[35%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <div className="mb-8 w-full border-b border-white/10 pb-8">
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-sky-200 mb-2"><MapPin className="w-5 h-5" /><span className="uppercase tracking-wider text-sm font-medium">Наш адрес</span></div>
                <span className="text-xl font-light text-white block leading-relaxed">проспект Музрукова, д.37 к.3</span>
              </div>
              <a href="tel:+79101258250" className="group flex flex-col items-center lg:items-start mb-8 w-full">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"><Phone className="w-6 h-6 text-white" /></div>
                  <span className="text-2xl sm:text-3xl font-light text-white tracking-wide">+7 910-125-82-50</span>
                </div>
              </a>
              <button onClick={() => openModal()} className="w-full px-8 bg-white text-sky-900 font-medium py-4 rounded-full text-lg shadow-md mt-auto hover:bg-sky-50 transition-colors">Записаться онлайн</button>
            </div>
            <div className="w-full lg:w-[65%] min-h-[350px] rounded-2xl overflow-hidden border border-white/10 relative">
              <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A5bd4448c7935bb1d9d7b082ee77117acbad4684acf8b86717e288673a4a24dbc&amp;source=constructor" width="100%" height="100%" frameBorder="0" style={{ position: 'absolute', top: 0, left: 0 }} title="Карта"></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}