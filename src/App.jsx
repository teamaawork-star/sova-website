import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Sparkles, Wind, Droplets, X, CheckCircle, Lock, Trash2, LogOut, Edit, Plus, Save, ArrowLeft, ArrowRight, Loader2, ChevronDown, ChevronUp, ShieldCheck, Upload, Search, Play, RotateCcw, Check, Download } from 'lucide-react';
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const IconMap = { Wind, Droplets, Sparkles };

// --- БАЗОВЫЕ ДАННЫЕ ---
const defaultHero = {
  badge: "Добро пожаловать в SOVA",
  title1: "Подарите себе",
  titleHighlight: "гармонию",
  title2: "и красоту",
  description: "Профессиональный массаж и современные аппаратные методики коррекции фигуры в уютной атмосфере нашей студии.",
  bgImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
};

const defaultSeo = {
  title: "Студия массажа и коррекции фигуры SOVA | Саров",
  description: "Профессиональный массаж, LPG, УЗ-кавитация и аппаратная коррекция фигуры в Сарове. Запишитесь онлайн!",
  keywords: "массаж саров, lpg массаж, коррекция фигуры, сова"
};

const massageServicesData = [
  {
    title: "Массаж по зонам",
    description: "Глубокая проработка отдельных участков тела для снятия мышечных зажимов и напряжения.",
    image: "https://images.unsplash.com/photo-1600334129128-68505dcecbfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "Спина (ШВЗ, грудной и поясничный отдел, руки)", duration: "40 минут", price: "1500 руб." },
      { name: "Курс массажа спины (10 сеансов)", duration: "40 минут", price: "13000 руб." },
      { name: "Шейно-воротниковая зона", duration: "20 минут", price: "900 руб." },
      { name: "Курс массажа ШВЗ (10 сеансов)", duration: "20 минут", price: "8000 руб." },
      { name: "Массаж головы", duration: "20 минут", price: "900 руб." },
      { name: "Курс массажа головы (10 сеансов)", duration: "20 минут", price: "8000 руб." },
      { name: "Ноги (ягодицы, бедра, голени, стопы)", duration: "40 минут", price: "1500 руб." },
      { name: "Курс массажа ног (10 сеансов)", duration: "40 минут", price: "13000 руб." },
      { name: "Задняя поверхность тела (спина, руки, ноги)", duration: "60 минут", price: "2200 руб." }
    ]
  },
  {
    title: "Комплексный и Детский массаж",
    description: "Общие расслабляющие и оздоровительные процедуры для всего тела, а также бережный уход для детей.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "Общий массаж всего тела", duration: "1 час 30 минут", price: "2800 руб." },
      { name: "Расслабляющий массаж тела", duration: "1 час 30 минут", price: "2800 руб." },
      { name: "Массаж задней поверхности тела (дети до 14 лет)", duration: "50 минут", price: "1600 руб." }
    ]
  },
  {
    title: "SPA - программы",
    description: "Полноценные ритуалы для глубокого расслабления, обновления кожи и снятия стресса.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "SPA-уход с массажем спины (+ обертывание)", duration: "1 час 30 минут", price: "3000 руб." },
      { name: "Стоунотерапия (массаж горячими камнями)", duration: "1 час 50 минут", price: "3500 руб." },
      { name: "SPA-уход релакс/антистресс (+ обертывание)", duration: "2 часа 30 минут", price: "4000 руб." },
      { name: "Талассотерапия (+ обертывание водорослями)", duration: "2 часа 30 минут", price: "5500 руб." }
    ]
  }
];

const bodyShapingServicesData = [
  {
    category: "Вакуумный массаж",
    description: "Аппаратное воздействие для ускорения лимфотока, эффективного разбивания жировых отложений и борьбы с целлюлитом.",
    image: "https://images.unsplash.com/photo-1564551139785-5eb9c0a6b579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    iconName: "Wind",
    items: [
      { name: "Бедра и ягодицы (спереди и сзади)", duration: "40 минут", price: "1400 руб." },
      { name: "Живот", duration: "20 минут", price: "900 руб." },
      { name: "Абонемент: живот + бока (10 сеансов)", duration: "30 минут", price: "8000 руб." },
      { name: "Абонемент: бедра + ягодицы (10 сеансов)", duration: "40 минут", price: "12000 руб." }
    ]
  },
  {
    category: "LPG-массаж",
    description: "Передовая вакуумно-роликовая технология для моделирования контуров тела и повышения упругости кожи.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    iconName: "Sparkles",
    items: [
      { name: "Всего тела", duration: "45 минут", price: "1900 руб." },
      { name: "Костюм для LPG (покупается 1 раз)", duration: "единоразово", price: "800 руб." },
      { name: "Абонемент на 10 сеансов (+ костюм в подарок)", duration: "45 минут", price: "17000 руб." }
    ]
  },
  {
    category: "УЗ кавитация",
    description: "Безоперационная ультразвуковая липосакция для локального уничтожения жировых клеток.",
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    iconName: "Droplets",
    items: [
      { name: "Живот (1 сеанс)", duration: "30 минут", price: "1200 руб." },
      { name: "Живот (Курс 8 сеансов)", duration: "30 минут", price: "8500 руб." },
      { name: "Живот (Курс 12 сеансов)", duration: "30 минут", price: "12000 руб." },
      { name: "Бедра и ягодицы (1 сеанс)", duration: "60 минут", price: "1900 руб." },
      { name: "Бедра и ягодицы (Курс 8 сеансов)", duration: "60 минут", price: "13500 руб." },
      { name: "Бедра и ягодицы (Курс 12 сеансов)", duration: "60 минут", price: "20000 руб." }
    ]
  },
  {
    category: "Криолиполиз",
    description: "Эффективное расщепление локальных жировых отложений путем их контролируемого охлаждения.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    iconName: "Sparkles",
    items: [
      { name: "Зона бедер (2 насадки)", duration: "40 минут", price: "6000 руб." },
      { name: "Зона ягодиц (2 насадки)", duration: "40 минут", price: "6000 руб." },
      { name: "Зона боков (2 насадки)", duration: "40 минут", price: "6000 руб." },
      { name: "Зона живота (1 насадка)", duration: "40 минут", price: "3500 руб." },
      { name: "Зона рук (2 насадки)", duration: "40 минут", price: "3000 руб." }
    ]
  },
  {
    category: "Аппаратные услуги",
    description: "Современные методики лифтинга, миостимуляции и лимфодренажа для создания идеального силуэта.",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    iconName: "Wind",
    items: [
      { name: "RF-лифтинг тела 1 зона (1 сеанс)", duration: "30 минут", price: "1200 руб." },
      { name: "RF-лифтинг тела 1 зона (10 сеансов)", duration: "30 минут", price: "10000 руб." },
      { name: "Миостимуляция (1 сеанс)", duration: "40 минут", price: "1100 руб." },
      { name: "Миостимуляция (10 сеансов)", duration: "40 минут", price: "10000 руб." },
      { name: "Лазерный липолиз (1 сеанс)", duration: "30 минут", price: "900 руб." },
      { name: "Лазерный липолиз (10 сеансов)", duration: "30 минут", price: "7000 руб." },
      { name: "Прессотерапия (1 сеанс)", duration: "45 минут", price: "1200 руб." },
      { name: "Прессотерапия (10 сеансов)", duration: "45 минут", price: "10000 руб." }
    ]
  }
];
const teamMembersData = [{ name: "Екатерина Игнатова", role: "Владелица студии", description: "Основательница SOVA...", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }];
const equipmentDefaultData = [{ title: "Оборудование для LPG-массажа", description: "Передовая технология...", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: "Безболезненно, Мощный лимфодренаж" }];
const faqDefaultData = [{ question: "Сколько нужно процедур?", answer: "Обычно курс состоит из 8-12 сеансов." }];

const defaultResults = [
  { 
    title: "LPG-массаж: минус 4 см в талии", 
    description: "Результат после курса из 10 сеансов. Улучшился тургор кожи и ушли отеки.",
    before: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=800", // Замените на реальные фото
    after: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800"
  },
  { 
    title: "УЗ-кавитация: коррекция зоны бедер", 
    description: "Проработка локальных жировых отложений. Результат 8 процедур.",
    before: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800",
    after: "https://images.unsplash.com/photo-1600334129128-68505dcecbfa?q=80&w=800"
  }
];

const defaultReviews = [
  "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=400", // Скриншоты отзывов
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400",
  "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=400"
];


export default function App() {
  // Проверяем адрес в браузере: если там /admin, сразу включаем окно входа
   const [currentView, setCurrentView] = useState(() => {
    // 1. Если в адресной строке НЕТ слова /admin, то ВСЕГДА показываем обычный сайт
    if (window.location.pathname !== '/admin') {
      return 'main';
    }

    // 2. Если мы находимся именно на /admin, то проверяем пропуск
    const sessionData = localStorage.getItem('sova_admin_session');
    if (sessionData) {
      try {
        const { timestamp } = JSON.parse(sessionData);
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (Date.now() - timestamp < oneDay) {
          return 'adminPanel'; // Пропуск действителен, пускаем
        } else {
          localStorage.removeItem('sova_admin_session');
        }
      } catch (e) {
        localStorage.removeItem('sova_admin_session');
      }
    }
    
    // 3. Если мы на /admin, но пропуска нет или он истек — просим пароль
    return 'adminLogin';
  });
  
  // Состояния данных
  const [heroData, setHeroData] = useState(defaultHero);
  const [seoData, setSeoData] = useState(defaultSeo); // <-- НОВОЕ ПОЛЕ SEO
  const [massageServices, setMassageServices] = useState(massageServicesData);
  const [bodyShapingServices, setBodyShapingServices] = useState(bodyShapingServicesData);
  const [teamMembers, setTeamMembers] = useState(teamMembersData);
  const [equipmentData, setEquipmentData] = useState(equipmentDefaultData);
  const [faqData, setFaqData] = useState(faqDefaultData);
  const [resultsData, setResultsData] = useState(defaultResults);
  const [reviewsData, setReviewsData] = useState(defaultReviews);
  const [bookingsList, setBookingsList] = useState([]);
  
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- ДАННЫЕ ДЛЯ КВИЗА ---
  const [quizStep, setQuizStep] = useState(0); // 0: intro, 1-3: вопросы, 4: результат
  const [quizAnswers, setQuizAnswers] = useState([]);

  const [quizQuestions, setQuizQuestions] = useState([
    {
      question: "Какая ваша главная цель визита?",
      options: [
        { label: "Снять стресс и расслабиться", value: "relax", icon: <Wind className="w-8 h-8 mb-3" /> },
        { label: "Скорректировать фигуру", value: "shape", icon: <Sparkles className="w-8 h-8 mb-3" /> },
        { label: "Избавиться от боли в мышцах", value: "pain", icon: <ShieldCheck className="w-8 h-8 mb-3" /> },
      ]
    },
    {
      question: "Какая зона требует особого внимания?",
      options: [
        { label: "Спина и шея", value: "back" },
        { label: "Живот и бока", value: "belly" },
        { label: "Бедра и ягодицы", value: "legs" },
        { label: "Все тело", value: "full" },
      ]
    },
    {
      question: "Какой метод воздействия вам ближе?",
      options: [
        { label: "Классический ручной массаж", value: "manual" },
        { label: "Современные аппаратные методики", value: "machine" },
        { label: "SPA-процедуры и обертывания", value: "spa" },
      ]
    }
  ]);

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
    
    if (goal === 'pain' || zone === 'back') {
      return { title: 'Массаж спины и ШВЗ', desc: 'Глубокая проработка мышц, снятие зажимов, спазмов и тяжести.' };
    }

    if (method === 'spa' || goal === 'relax') {
      return { title: 'SPA-уход релакс/антистресс', desc: 'Полное погружение в расслабление с массажем и обертыванием.' };
    }

    return { title: 'Общий массаж всего тела', desc: 'Классический сеанс для гармонии души и тела, снятия усталости.' };
  };

 // --- МАГИЯ SEO: ДИНАМИЧЕСКАЯ ПОДМЕНА ТЕГОВ (С ЗАЩИТОЙ) ---
  useEffect(() => {
    if (seoData) { // <-- Проверяем, что данные вообще есть
      document.title = seoData.title || "Студия массажа SOVA";
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', seoData.description || "");
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', seoData.keywords || "");
    }
  }, [seoData]);

  // --- ЧТЕНИЕ ИЗ FIREBASE ПРИ ЗАГРУЗКЕ САЙТА (С ЗАЩИТОЙ) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = localStorage.getItem('sova_admin_session');
        const token = session ? JSON.parse(session).token : '';

        const bookingsRes = await fetch('/api/get_bookings.php', {
          headers: { 'X-Auth-Token': token } // <-- Предъявляем пропуск
        });
        const loadedBookings = await bookingsRes.json();
        setBookingsList(loadedBookings);

        const contentSnap = await getDocs(collection(db, "site_content"));
        contentSnap.docs.forEach(doc => {
          // Если база вернула пустоту, мы берем стандартные данные (... || defaultData)
          if (doc.id === 'hero') setHeroData(doc.data() || defaultHero);
          if (doc.id === 'seo') setSeoData(doc.data() || defaultSeo);
          if (doc.id === 'massage') setMassageServices(doc.data().items || massageServicesData);
          if (doc.id === 'body') setBodyShapingServices(doc.data().items || bodyShapingServicesData);
          if (doc.id === 'team') setTeamMembers(doc.data().items || teamMembersData);
          if (doc.id === 'equipment') setEquipmentData(doc.data().items || equipmentDefaultData);
          if (doc.id === 'faq') setFaqData(doc.data().items || faqDefaultData);
          if (doc.id === 'results') setResultsData(doc.data().items || defaultResults);
          if (doc.id === 'reviews') setReviewsData(doc.data().items || defaultReviews);
          if (doc.id === 'quiz') setQuizQuestions(doc.data().items || quizQuestions);
        });
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const [activeTab, setActiveTab] = useState('massage');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', date: '', time: '', specialist: '' });
// --- УМНАЯ МАСКА ДЛЯ ТЕЛЕФОНА ---
  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // Оставляем только цифры
    let formatted = '+7 ';
    
    if (!input || input === '7' || input === '8') {
      setBookingData({ ...bookingData, phone: '' });
      return;
    }
    if (input[0] === '7' || input[0] === '8') input = input.substring(1); // Убираем первую 7 или 8
    
    if (input.length > 0) formatted += '(' + input.substring(0, 3);
    if (input.length >= 4) formatted += ') ' + input.substring(3, 6);
    if (input.length >= 7) formatted += '-' + input.substring(6, 8);
    if (input.length >= 9) formatted += '-' + input.substring(8, 10);
    
    setBookingData({ ...bookingData, phone: formatted });
  };

  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ ФОРМЫ ---
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' });
  // Получаем сегодняшнюю дату для блокировки календаря (формат YYYY-MM-DD)
  const todayDate = new Date().toISOString().split('T')[0];
  // Доступные слоты времени
  
  const [showPromo, setShowPromo] = useState(false);
  const [promoClosed, setPromoClosed] = useState(false);
  // --- ТАЙМЕР ДЛЯ БАННЕРА (10 секунд = 10000 миллисекунд) ---
  useEffect(() => {
    if (!promoClosed && currentView === 'main') {
      const timer = setTimeout(() => {
        setShowPromo(true);
      }, 10000);
      return () => clearTimeout(timer); // Очищаем таймер, если клиент ушел с сайта раньше
    }
  }, [promoClosed, currentView]);

  // --- СБРОС ВРЕМЕНИ ПРИ СМЕНЕ УСЛУГИ ---
  useEffect(() => {
    setBookingData(prev => ({ ...prev, time: '' }));
  }, [selectedService]);


  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [adminPanelTab, setAdminPanelTab] = useState('bookings');
  const [contentTab, setContentTab] = useState('hero');
  const [editingItem, setEditingItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);

  const [selectedServiceData, setSelectedServiceData] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // --- ЛОГИКА САЙТА ---
const openModal = (serviceName = '') => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
    setIsSubmitted(false);
    setIsSubmitting(false);
    // Генерируем капчу (два числа от 1 до 10)
    setCaptcha({ 
      num1: Math.floor(Math.random() * 10) + 1, 
      num2: Math.floor(Math.random() * 10) + 1, 
      answer: '' 
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setBookingData({ name: '', phone: '', date: '', time: '', specialist: '' });
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 300);
  };

const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // ПРОВЕРКА КАПЧИ И ВРЕМЕНИ
    if (parseInt(captcha.answer) !== (captcha.num1 + captcha.num2)) {
      alert("Неверный ответ на математический вопрос. Попробуйте еще раз!");
      return;
    }
    if (!bookingData.time) {
      alert("Пожалуйста, выберите время сеанса.");
      return;
    }

    setIsSubmitting(true);
    
    // Формируем время окончания (для календаря)
    const [h, m] = bookingData.time.split(':');
    const endH = String((Number(h) + 1) % 24).padStart(2, '0');
    const endTime = `${endH}:${m}`;

    // Создаем саму заявку
    const newBooking = {
      name: bookingData.name,
      phone: bookingData.phone,
      service: selectedService || 'Не указана',
      specialist: bookingData.specialist || 'Любой', // <-- ДОБАВИЛИ ЭТО
      time: bookingData.time,
      endTime: endTime,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const WEBHOOK_URL = 'ВАШ_WEBHOOK_URL_ЗДЕСЬ'; // <-- ВАЖНО: Вставьте сюда вашу ссылку от Albato!

    try {
      const res = await fetch('/api/add_booking.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
      });
      const result = await res.json();

// ЯНДЕКС.МЕТРИКА: Отправка цели (замените 12345678 на ваш реальный номер счетчика позже)
      if (window.ym) {
        window.ym(12345678, 'reachGoal', 'booking_success');
      }

      setBookingsList([{ ...newBooking, id: result.id }, ...bookingsList]);
      setIsSubmitted(true);

      setBookingsList([{ ...newBooking, id: result.id }, ...bookingsList]);
      setIsSubmitted(true);

      if (WEBHOOK_URL !== 'ВАШ_WEBHOOK_URL_ЗДЕСЬ') {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBooking)
        });
      }
    } catch (error) {
      console.error("Ошибка при сохранении заявки:", error);
      alert("Не удалось отправить заявку.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openServiceDetails = (service) => {
    setSelectedServiceData(service);
    setCurrentView('serviceDetails');
    window.scrollTo(0, 0);
  };

const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(''); 
    
    try {
      const res = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPass })
      });
      
      const result = await res.json();

      if (result.status === 'success') {
        localStorage.setItem('sova_admin_session', JSON.stringify({ 
          timestamp: Date.now(),
          token: result.token
        }));
        window.location.href = '/admin'; 
      } else {
        setLoginError(result.message || 'Неверный пароль');
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setLoginError('Ошибка связи с сервером');
    }
  };

const toggleBookingStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'new' ? 'done' : 'new';
    const session = JSON.parse(localStorage.getItem('sova_admin_session'));
    
    try {
      await fetch('/api/update_booking.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Auth-Token': session ? session.token : '' // <-- Предъявляем пропуск
        },
        body: JSON.stringify({ id: id, status: newStatus })
      });
      setBookingsList(bookingsList.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

const deleteBooking = async (id) => {
    if(window.confirm('Точно удалить эту заявку?')) {
      const session = JSON.parse(localStorage.getItem('sova_admin_session'));
      try {
        await fetch('/api/delete_booking.php', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Auth-Token': session ? session.token : '' // <-- Предъявляем пропуск
          },
          body: JSON.stringify({ id: id })
        });
        setBookingsList(bookingsList.filter(b => b.id !== id));
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      }
    }
  };


const exportToExcel = () => {
    if (bookingsList.length === 0) {
      alert('Нет заявок для выгрузки');
      return;
    }

    // Заголовки столбцов
    const headers = ['Имя', 'Телефон', 'Услуга', 'Дата', 'Время', 'Статус'];

    // Формируем строки (оборачиваем в кавычки на случай запятых внутри текста)
    const rows = bookingsList.map(b => [
      `"${b.name}"`, 
      `"${b.phone}"`, 
      `"${b.service}"`, 
      `"${b.date}"`, 
      `"${b.time}"`, 
      `"${b.status === 'done' ? 'Обработано' : 'Новая'}"`
    ]);

    // Добавляем спецсимвол BOM (\uFEFF), чтобы русский Excel не сломал кодировку
    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    // Создаем виртуальный файл и запускаем скачивание
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Формируем красивое имя файла с текущей датой
    const today = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-');
    link.setAttribute('download', `Заявки_SOVA_${today}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ЛОГИКА РЕДАКТОРА КОНТЕНТА ---
  const handleEditClick = (index) => {
    setEditingIndex(index);
    if (contentTab === 'hero') {
      setEditingItem(JSON.parse(JSON.stringify(heroData)));
    } else if (contentTab === 'seo') {
      setEditingItem(JSON.parse(JSON.stringify(seoData)));
    } else if (contentTab === 'massage') {
      setEditingItem(JSON.parse(JSON.stringify(massageServices[index])));
    } else if (contentTab === 'body') {
      setEditingItem(JSON.parse(JSON.stringify(bodyShapingServices[index])));
    } else if (contentTab === 'team') {
      setEditingItem(JSON.parse(JSON.stringify(teamMembers[index])));
    } else if (contentTab === 'equipment') {
      setEditingItem(JSON.parse(JSON.stringify(equipmentData[index])));
    } else if (contentTab === 'faq') {
      setEditingItem(JSON.parse(JSON.stringify(faqData[index])));
    }
  };

  const handleSaveContent = async () => {
    try {
      if (contentTab === 'hero') {
        setHeroData(editingItem);
        await setDoc(doc(db, "site_content", "hero"), editingItem);
      } else if (contentTab === 'seo') {
        setSeoData(editingItem);
        await setDoc(doc(db, "site_content", "seo"), editingItem);
      } else {
        let newData = [];
        if (contentTab === 'massage') { newData = [...massageServices]; newData[editingIndex] = editingItem; setMassageServices(newData); }
        if (contentTab === 'body') { newData = [...bodyShapingServices]; newData[editingIndex] = editingItem; setBodyShapingServices(newData); }
        if (contentTab === 'team') { newData = [...teamMembers]; newData[editingIndex] = editingItem; setTeamMembers(newData); }
        if (contentTab === 'equipment') { newData = [...equipmentData]; newData[editingIndex] = editingItem; setEquipmentData(newData); }
        if (contentTab === 'faq') { newData = [...faqData]; newData[editingIndex] = editingItem; setFaqData(newData); }
        
        await setDoc(doc(db, "site_content", contentTab), { items: newData });
      }
      setEditingItem(null);
      setEditingIndex(-1);
    } catch (error) {
      console.error("Ошибка сохранения контента:", error);
      alert("Ошибка при сохранении!");
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditingIndex(-1);
  };

  const handleItemChange = (itemIdx, field, value) => {
    const updated = { ...editingItem };
    updated.items[itemIdx][field] = value;
    setEditingItem(updated);
  };

  const handleDeleteItem = async (index) => {
    if(window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      try {
        let newData = [];
        if (contentTab === 'massage') { newData = massageServices.filter((_, i) => i !== index); setMassageServices(newData); }
        if (contentTab === 'body') { newData = bodyShapingServices.filter((_, i) => i !== index); setBodyShapingServices(newData); }
        if (contentTab === 'team') { newData = teamMembers.filter((_, i) => i !== index); setTeamMembers(newData); }
        if (contentTab === 'equipment') { newData = equipmentData.filter((_, i) => i !== index); setEquipmentData(newData); }
        if (contentTab === 'faq') { newData = faqData.filter((_, i) => i !== index); setFaqData(newData); }
        
        await setDoc(doc(db, "site_content", contentTab), { items: newData });
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      }
    }
  };

  const handleAddNewItem = () => {
    let newBlock;
    let newIndex = 0;

    if (contentTab === 'massage') {
      newBlock = { title: "Новая услуга", description: "...", image: "", items: [] };
      setMassageServices([...massageServices, newBlock]);
      newIndex = massageServices.length;
    } else if (contentTab === 'body') {
      newBlock = { category: "Новый аппарат", description: "...", image: "", iconName: "Sparkles", items: [] };
      setBodyShapingServices([...bodyShapingServices, newBlock]);
      newIndex = bodyShapingServices.length;
    } else if (contentTab === 'team') {
      newBlock = { name: "Имя сотрудника", role: "Должность", description: "О специалисте...", image: "" };
      setTeamMembers([...teamMembers, newBlock]);
      newIndex = teamMembers.length;
    } else if (contentTab === 'equipment') {
      newBlock = { title: "Название аппарата", description: "Описание...", image: "", features: "Плюс 1, Плюс 2" };
      setEquipmentData([...equipmentData, newBlock]);
      newIndex = equipmentData.length;
    } else if (contentTab === 'faq') {
      newBlock = { question: "Новый вопрос?", answer: "Ответ на вопрос..." };
      setFaqData([...faqData, newBlock]);
      newIndex = faqData.length;
    }
    
    handleEditClick(newIndex);
  };

const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file); // Прикрепляем файл

      try {
        // Отправляем картинку на наш PHP-скрипт
        const res = await fetch('/api/upload_image.php', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (data.status === 'success') {
          // Если сервер успешно сохранил, подставляем ссылку в контент
          if (contentTab === 'hero') {
             setEditingItem({ ...editingItem, bgImage: data.url });
          } else {
             setEditingItem({ ...editingItem, image: data.url });
          }
        } else {
          alert('Ошибка сервера: ' + data.message);
        }
      } catch (err) {
        console.error("Сбой загрузки:", err);
        alert("Не удалось загрузить картинку. Проверьте соединение.");
      }
    }
  };

  // ==========================================
  // ВИД: АВТОРИЗАЦИЯ АДМИНИСТРАТОРА
  // ==========================================
  if (currentView === 'adminLogin') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm relative">
          <button onClick={() => setCurrentView('main')} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-4"><Lock className="w-6 h-6" /></div>
            <h2 className="text-2xl font-serif text-stone-800">Вход в панель</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input type="password" placeholder="Введите пароль" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none text-center" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
              {loginError && <p className="text-red-500 text-xs text-center mt-2">{loginError}</p>}
            </div>
            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 rounded-xl transition-colors">Войти</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // ВИД: ПАНЕЛЬ АДМИНИСТРАТОРА
  // ==========================================
  if (currentView === 'adminPanel') {
    const renderAdminContentList = () => {
      let dataToRender = [];
      if (contentTab === 'massage') dataToRender = massageServices;
      if (contentTab === 'body') dataToRender = bodyShapingServices;
      if (contentTab === 'team') dataToRender = teamMembers;
      if (contentTab === 'equipment') dataToRender = equipmentData;
      if (contentTab === 'faq') dataToRender = faqData;

      if (contentTab === 'hero') {
        return (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 flex flex-col justify-between shadow-sm items-center text-center">
            <div className="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
              <img src={heroData.bgImage} alt="hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <h3 className="text-white text-3xl font-serif">{heroData.title1} <span className="text-sky-400">{heroData.titleHighlight}</span> {heroData.title2}</h3>
              </div>
            </div>
            <p className="text-stone-500 mb-6 max-w-xl">{heroData.description}</p>
            <button onClick={() => handleEditClick(0)} className="bg-sky-500 text-white px-8 hover:bg-sky-600 font-medium py-3 rounded-xl flex items-center justify-center"><Edit className="w-4 h-4 mr-2" /> Редактировать</button>
          </div>
        )
      }

if (contentTab === 'seo') {
        return (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><Search className="w-8 h-8" /></div>
            <h3 className="text-2xl font-serif text-stone-800 mb-2">{seoData.title}</h3>
            <p className="text-stone-500 mb-4 max-w-xl">{seoData.description}</p>
            
            <div className="w-full max-w-md space-y-3 mb-8 text-left">
              <div className="bg-stone-50 px-4 py-3 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-400 font-mono uppercase tracking-wider block mb-1">Доступное время записи</span>
                <span className="text-sm text-stone-800 font-medium">{seoData.availableTimes || defaultSeo.availableTimes}</span>
              </div>
              <div className="bg-stone-50 px-4 py-3 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-400 font-mono uppercase tracking-wider block mb-1">Ключевые слова</span>
                <span className="text-sm text-stone-600 font-medium">{seoData.keywords}</span>
              </div>
            </div>
            <button onClick={() => handleEditClick(0)} className="bg-sky-500 text-white px-8 hover:bg-sky-600 font-medium py-3 rounded-xl flex items-center justify-center"><Edit className="w-4 h-4 mr-2" /> Настроить SEO и время</button>
          </div>
        )
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataToRender.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="mb-4">
                {item.image && (<div className="w-full h-32 rounded-xl overflow-hidden mb-4 relative"><img src={item.image} alt="" className="w-full h-full object-cover" /></div>)}
                <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">{item.title || item.category || item.name || item.question}</h3>
                <p className="text-sm text-stone-500 line-clamp-2">{item.description || item.answer || item.role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(idx)} className="flex-1 bg-sky-50 text-sky-600 hover:bg-sky-100 font-medium py-2 rounded-xl flex items-center justify-center text-sm"><Edit className="w-4 h-4 mr-2" /> Изменить</button>
                <button onClick={() => handleDeleteItem(idx)} className="flex-none bg-white border border-stone-200 text-red-400 hover:bg-red-50 hover:text-red-500 font-medium px-3 rounded-xl flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light text-sky-500 tracking-widest">SOVA</h1>
            <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded font-medium">Админ-панель</span>
          </div>
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button onClick={() => setAdminPanelTab('bookings')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${adminPanelTab === 'bookings' ? 'bg-white text-sky-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>Заявки</button>
            <button onClick={() => setAdminPanelTab('content')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${adminPanelTab === 'content' ? 'bg-white text-sky-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>Контент сайта</button>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://sova-sarov.ru" className="text-sm text-stone-500 hover:text-sky-600">На сайт</a>
            <button onClick={() => {
  localStorage.removeItem('sova_admin_session');
  window.location.href = 'https://sova-sarov.ru';
}} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg cursor-pointer"><LogOut className="w-4 h-4" /> Выйти</button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6">
          {isLoadingData ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>
          ) : adminPanelTab === 'bookings' ? (
            <>
              {/* Рендер заявок (Оставлен как был) */}
              <div className="flex justify-between items-end mb-8">
                <div><h2 className="text-3xl font-serif mb-2">Заявки с сайта</h2></div>
                <button onClick={exportToExcel} className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium border border-green-200 flex items-center transition-colors shadow-sm">
                  <Download className="w-4 h-4 mr-2" /> В Excel
                </button>
              </div>
              {bookingsList.length === 0 ? (
                <div className="bg-white rounded-2xl border p-12 text-center text-stone-500">Пока нет заявок.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookingsList.map((booking) => (
                     <div key={booking.id} className={`bg-white rounded-2xl border p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center ${booking.status === 'done' ? 'border-green-200 bg-green-50/30' : 'border-stone-200'}`}>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                        <div>
                          <span className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Клиент</span>
                          <strong className="text-stone-800 text-lg block">{booking.name}</strong>
                          <a href={`tel:${booking.phone}`} className="text-sky-600 hover:underline text-sm font-medium">{booking.phone}</a>
                        </div>
                        <div className="md:col-span-2">
                          <span className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Услуга</span>
                          <span className="text-stone-800 font-medium block mb-1">{booking.service}</span>
                          <span className="text-sky-600 font-bold text-sm bg-sky-50 px-2 py-1 rounded">
                            {(() => {
                              for (const cat of massageServices) {
                                const found = cat.items?.find(i => booking.service?.includes(i.name));
                                if (found) return found.price;
                              }
                              for (const cat of bodyShapingServices) {
                                const found = cat.items?.find(i => booking.service?.includes(i.name));
                                if (found) return found.price;
                              }
                              return 'Цена не указана';
                            })()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Время</span>
                          <div className="flex items-center text-stone-700 text-sm font-medium"><Clock className="w-4 h-4 mr-1.5 text-stone-400" />{booking.date} в {booking.time}</div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                        <button onClick={() => toggleBookingStatus(booking.id, booking.status)} className={`flex-1 md:flex-none flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border ${booking.status === 'done' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-stone-600 border-stone-200'}`}>
                          <CheckCircle className={`w-4 h-4 mr-2 ${booking.status === 'done' ? 'text-green-600' : 'text-stone-400'}`} /> {booking.status === 'done' ? 'Обработано' : 'Отметить как готовое'}
                        </button>
                        <button onClick={() => deleteBooking(booking.id)} className="flex-none flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-red-500 bg-white border border-stone-200 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
                <div><h2 className="text-3xl font-serif mb-2">Управление контентом</h2></div>
                {!['hero', 'seo'].includes(contentTab) && (
                  <button onClick={handleAddNewItem} className="bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center"><Plus className="w-4 h-4 mr-2" /> Добавить элемент</button>
                )}
              </div>

              {/* НАВИГАЦИЯ ПО РАЗДЕЛАМ САЙТА (ДОБАВЛЕНО SEO) */}
              <div className="flex overflow-x-auto pb-2 border-b border-stone-200 mb-6 space-x-2 scrollbar-hide">
                {[
                  { id: 'hero', label: 'Главный экран' },
                  { id: 'seo', label: 'SEO настройки' },
                  { id: 'massage', label: 'Массаж' },
                  { id: 'body', label: 'Коррекция' },
                  { id: 'team', label: 'Команда' },
                  { id: 'equipment', label: 'Оборудование' },
                  { id: 'faq', label: 'Вопрос-ответ' },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => {setContentTab(tab.id); setEditingItem(null);}} 
                    className={`px-5 py-2.5 font-medium text-sm rounded-xl whitespace-nowrap transition-colors ${contentTab === tab.id ? 'bg-sky-100 text-sky-700' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {!editingItem ? renderAdminContentList() : (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 animate-fade-in shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
                    <h3 className="text-2xl font-serif text-stone-800">Редактирование</h3>
                    <button onClick={handleCancelEdit} className="text-stone-400 hover:text-stone-700"><X className="w-6 h-6" /></button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* ЛЕВАЯ КОЛОНКА */}
                    <div className="space-y-4 lg:col-span-1">
                      
                      {contentTab === 'seo' && (
                        <div className="space-y-5 lg:col-span-2 w-full max-w-2xl">
                          <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl mb-4">
                            <p className="text-xs text-sky-800 leading-relaxed">Здесь вы можете изменить общие настройки сайта: расписание для записи, а также теги для Яндекса и Google.</p>
                          </div>
                          
                          <div className="bg-stone-50 border border-stone-200 p-5 rounded-xl">
                            <label className="block text-sm font-medium mb-1 text-stone-800">Доступное время (через запятую)</label>
                            <input 
                              type="text" 
                              className="w-full border border-stone-300 p-3 rounded-xl text-sm" 
                              placeholder="Например: 09:00, 11:30, 15:00" 
                              value={editingItem.availableTimes || ''} 
                              onChange={e => setEditingItem({...editingItem, availableTimes: e.target.value})} 
                            />
                            <p className="text-xs text-stone-500 mt-2">Оставьте пустым для расписания по умолчанию (с 10:00 до 20:00)</p>
                          </div>

                          <div><label className="block text-sm font-medium mb-1">Title (Главный заголовок сайта)</label><input type="text" className="w-full border p-3 rounded-xl text-sm font-medium" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /></div>
                          <div><label className="block text-sm font-medium mb-1">Description (Описание для сниппета в поиске)</label><textarea className="w-full border p-3 rounded-xl text-sm min-h-[100px]" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /></div>
                          <div><label className="block text-sm font-medium mb-1">Keywords (Ключевые слова через запятую)</label><textarea className="w-full border p-3 rounded-xl text-sm" value={editingItem.keywords} onChange={e => setEditingItem({...editingItem, keywords: e.target.value})} /></div>
                        </div>
                      )}

                      {contentTab === 'hero' && (
                        <>
                          <div><label className="block text-sm font-medium mb-1">Бейдж</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.badge} onChange={e => setEditingItem({...editingItem, badge: e.target.value})} /></div>
                          <div className="grid grid-cols-3 gap-2">
                            <div><label className="block text-sm font-medium mb-1">Заголовок 1</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.title1} onChange={e => setEditingItem({...editingItem, title1: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium text-sky-600 mb-1">Цветное слово</label><input type="text" className="w-full border border-sky-300 bg-sky-50 p-3 rounded-xl text-sm" value={editingItem.titleHighlight} onChange={e => setEditingItem({...editingItem, titleHighlight: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium mb-1">Заголовок 2</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.title2} onChange={e => setEditingItem({...editingItem, title2: e.target.value})} /></div>
                          </div>
                          <div><label className="block text-sm font-medium mb-1">Описание</label><textarea className="w-full border p-3 rounded-xl text-sm min-h-[100px]" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /></div>
                        </>
                      )}

                      {['massage', 'body', 'equipment', 'team', 'faq'].includes(contentTab) && (
                        <>
                          {['massage', 'body', 'equipment'].includes(contentTab) && <div><label className="block text-sm font-medium mb-1">Заголовок</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.title || editingItem.category || ''} onChange={e => setEditingItem(prev => prev.title !== undefined ? {...prev, title: e.target.value} : {...prev, category: e.target.value})} /></div>}
                          
                          {contentTab === 'team' && (
                            <>
                              <div><label className="block text-sm font-medium mb-1">Имя</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                              <div><label className="block text-sm font-medium mb-1">Должность</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.role} onChange={e => setEditingItem({...editingItem, role: e.target.value})} /></div>
                            </>
                          )}
                          {contentTab === 'faq' && <div><label className="block text-sm font-medium mb-1">Вопрос</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.question} onChange={e => setEditingItem({...editingItem, question: e.target.value})} /></div>}
                          <div><label className="block text-sm font-medium mb-1">{contentTab === 'faq' ? 'Ответ' : 'Описание'}</label><textarea className="w-full border p-3 rounded-xl text-sm min-h-[100px]" value={editingItem.description || editingItem.answer || ''} onChange={e => contentTab === 'faq' ? setEditingItem({...editingItem, answer: e.target.value}) : setEditingItem({...editingItem, description: e.target.value})} /></div>
                          {contentTab === 'equipment' && <div><label className="block text-sm font-medium mb-1">Особенности (через запятую)</label><textarea className="w-full border p-3 rounded-xl text-sm" value={editingItem.features} onChange={e => setEditingItem({...editingItem, features: e.target.value})} /></div>}
                        </>
                      )}
                    </div>
                    
                    {/* ПРАВАЯ КОЛОНКА */}
                    {contentTab !== 'seo' && (
                      <div>
                        {contentTab !== 'faq' && (
                          <div className="mb-6">
                            <label className="block text-sm font-medium mb-1">Фотография</label>
                            <div className="flex flex-col gap-3">
                              <input type="text" className="w-full border p-3 rounded-xl text-sm" placeholder="Вставьте ссылку на фото..." value={editingItem.image || editingItem.bgImage || ''} onChange={e => contentTab === 'hero' ? setEditingItem({...editingItem, bgImage: e.target.value}) : setEditingItem({...editingItem, image: e.target.value})} />
                              <div className="relative">
                                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                  <button className="w-full bg-stone-50 border py-2.5 rounded-xl text-sm flex justify-center items-center"><Upload className="w-4 h-4 mr-2" /> Загрузить фото</button>
                              </div>
                            </div>
                            {(editingItem.image || editingItem.bgImage) && (
                              <div className="mt-4 w-full h-32 rounded-xl overflow-hidden border"><img src={editingItem.image || editingItem.bgImage} alt="" className="w-full h-full object-cover" /></div>
                            )}
                          </div>
                        )}

                        {['massage', 'body'].includes(contentTab) && (
                          <div>
                            <label className="block text-sm font-medium mb-3">Вложенные услуги и цены</label>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                              {editingItem.items?.map((item, itemIdx) => (
                                <div key={itemIdx} className="bg-stone-50 border p-4 rounded-xl relative">
                                  <button onClick={() => setEditingItem({...editingItem, items: editingItem.items.filter((_, i) => i !== itemIdx)})} className="absolute top-3 right-3 text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                  <div className="space-y-3 pt-2">
                                    <div><label className="text-xs text-stone-500">Название</label><input type="text" className="w-full border p-2 rounded-lg text-sm" value={item.name} onChange={e => handleItemChange(itemIdx, 'name', e.target.value)} /></div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div><label className="text-xs text-stone-500">Длительность</label><input type="text" className="w-full border p-2 rounded-lg text-sm" value={item.duration || ''} onChange={e => handleItemChange(itemIdx, 'duration', e.target.value)} /></div>
                                      <div><label className="text-xs text-stone-500">Цена</label><input type="text" className="w-full border p-2 rounded-lg text-sm" value={item.price} onChange={e => handleItemChange(itemIdx, 'price', e.target.value)} /></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => setEditingItem({...editingItem, items: [...(editingItem.items || []), { name: "Новая под-услуга", price: "0 руб." }]})} className="w-full border-2 border-dashed py-3 rounded-xl mt-4 text-sm font-medium text-stone-500 flex justify-center items-center"><Plus className="w-4 h-4 mr-1" /> Добавить вариант (цену)</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-stone-100">
                    <button onClick={handleCancelEdit} className="px-6 py-2.5 rounded-xl font-medium bg-stone-100 hover:bg-stone-200">Отмена</button>
                    <button onClick={handleSaveContent} className="px-6 py-2.5 rounded-xl font-medium text-white bg-sky-500 hover:bg-sky-600 flex items-center"><Save className="w-4 h-4 mr-2" /> Сохранить</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }



  // ==========================================
  // ВИД: ДЕТАЛЬНАЯ СТРАНИЦА УСЛУГИ
  // ==========================================
  if (currentView === 'serviceDetails' && selectedServiceData) {
    const title = selectedServiceData.title || selectedServiceData.category;
    return (
      <div className="min-h-screen bg-stone-50 font-sans text-slate-800">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex flex-col items-center cursor-pointer" onClick={() => setCurrentView('main')}><h1 className="text-3xl md:text-4xl font-light text-sky-500 tracking-[0.3em] ml-2">SOVA</h1></div>
            <button onClick={() => setCurrentView('main')} className="text-stone-500 hover:text-sky-600 font-medium text-sm flex items-center"><ArrowLeft className="w-4 h-4 mr-1.5" /> На главную</button>
          </div>
        </header>
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={selectedServiceData.image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-stone-900/40"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center px-4"><h1 className="text-4xl md:text-6xl text-white font-serif tracking-wide drop-shadow-lg">{title}</h1></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <button onClick={() => setCurrentView('main')} className="text-sky-600 font-medium text-sm flex items-center mb-8"><ArrowLeft className="w-4 h-4 mr-1.5" /> К списку услуг</button>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100 mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-stone-800 mb-6">О процедуре</h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-10">{selectedServiceData.description}</p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-800 mb-6">Варианты и стоимость</h2>
            <div className="space-y-4">
              {selectedServiceData.items?.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border border-stone-100 hover:border-sky-200 hover:bg-sky-50/50 gap-4">
                  <div>
                    <h4 className="font-medium text-stone-800 text-lg">{item.name}</h4>
                    {(item.description || item.duration) && (
                      <div className="flex items-center text-sm text-stone-500 mt-1 space-x-3">{item.duration && <span><Clock className="w-3.5 h-3.5 inline mr-1" /> {item.duration}</span>}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xl font-semibold text-sky-600">{item.price}</span>
                    <button onClick={() => openModal(`${title} - ${item.name}`)} className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-sm font-medium">Выбрать</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ВИД: ОСНОВНОЙ САЙТ
  // ==========================================
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-800">
      
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-light text-sky-500 tracking-[0.3em] ml-2">SOVA</h1>
            <p className="text-[0.55rem] md:text-xs text-stone-500 tracking-widest mt-1 uppercase text-center">Студия массажа<br className="md:hidden"/> и коррекции фигуры</p>
          </div>
          {/* ОБНОВЛЕННОЕ МЕНЮ */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-stone-600">
            <button onClick={() => scrollToSection('services')} className="hover:text-sky-500">Услуги</button>
            <button onClick={() => scrollToSection('results')} className="hover:text-sky-500">Результаты</button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-sky-500">Отзывы</button>
            <button onClick={() => scrollToSection('team')} className="hover:text-sky-500">Команда</button>
            <button onClick={() => scrollToSection('contacts')} className="hover:text-sky-500">Контакты</button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* ТЕЛЕФОН */}
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

     {/* HERO SECTION С ВСТРОЕННЫМ КВИЗОМ */}
      <section className="relative bg-stone-100 overflow-hidden min-h-[85vh] flex items-center">
        {/* Обновленный фон, чтобы и текст, и карточка квиза читались отлично */}
        <div className="absolute inset-0 z-0">
          <img src={heroData.bgImage} alt="Background" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-stone-50/95 via-stone-50/80 to-stone-50/30"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* ЛЕВАЯ ЧАСТЬ: Текст и основные кнопки (занимает 7 из 12 колонок) */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-sky-100/80 backdrop-blur-sm text-sky-700 text-sm font-semibold mb-6 shadow-sm border border-sky-200/50">{heroData.badge}</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-800 mb-6 leading-tight">
                {heroData.title1} <br className="hidden lg:block"/> <span className="text-sky-600">{heroData.titleHighlight}</span> {heroData.title2}
              </h2>
              <p className="text-lg text-stone-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">{heroData.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => scrollToSection('services')} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all text-center">Смотреть услуги</button>
                <button onClick={() => openModal()} className="bg-white/80 backdrop-blur-sm border border-stone-200 px-8 py-3.5 rounded-full font-medium hover:bg-white transition-colors text-center shadow-sm">Записаться на сеанс</button>
              </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Интерактивный квиз (занимает 5 из 12 колонок) */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:mx-0 mt-8 lg:mt-0">
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden">
                
                {/* Декоративный блик для красоты */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

                {quizStep === 0 && (
                  <div className="animate-fade-in relative z-10 text-center py-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-50 to-white text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-sky-100"><Sparkles className="w-7 h-7" /></div>
                    <h2 className="text-2xl font-serif text-stone-800 mb-3">Не знаете, какую услугу выбрать?</h2>
                    <p className="text-stone-500 text-sm mb-8 leading-relaxed">Пройдите короткий тест, и мы подберем идеальную процедуру специально для вас.</p>
                    <button 
                      onClick={() => { setQuizStep(1); setQuizAnswers([]); }} 
                      className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3.5 rounded-2xl font-medium flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                    >
                      <Play className="w-4 h-4 mr-2" /> Начать подбор
                    </button>
                  </div>
                )}

                {quizStep > 0 && quizStep <= quizQuestions.length && (
                  <div className="animate-fade-in relative z-10">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-500 tracking-widest uppercase">Вопрос {quizStep} из {quizQuestions.length}</span>
                      <div className="w-24 h-1.5 bg-stone-200/50 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: `${(quizStep / quizQuestions.length) * 100}%` }}></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-serif text-stone-800 mb-6 leading-snug">{quizQuestions[quizStep - 1].question}</h3>
                    <div className="flex flex-col gap-3">
                      {quizQuestions[quizStep - 1].options.map((opt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleQuizAnswer(opt.value)}
                          className="bg-white/80 border border-stone-100 p-4 rounded-2xl hover:border-sky-300 hover:bg-sky-50 hover:shadow-sm transition-all flex items-center text-left group"
                        >
                          {opt.icon ? <span className="text-stone-400 group-hover:text-sky-500 transition-colors mr-4 scale-75">{opt.icon}</span> : <div className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-sky-400 mr-4 transition-colors"></div>}
                          <span className="font-medium text-stone-700 text-sm">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep > quizQuestions.length && (
                  <div className="animate-fade-in relative z-10 text-center py-2">
                    <div className="w-14 h-14 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"><Check className="w-7 h-7" /></div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">Вам подойдет:</span>
                    <h2 className="text-2xl font-serif text-sky-600 mb-3 leading-tight">{getQuizResult().title}</h2>
                    <p className="text-stone-600 text-sm mb-8 leading-relaxed">{getQuizResult().desc}</p>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => openModal(getQuizResult().title)}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-2xl font-medium shadow-md transition-all"
                      >
                        Записаться на процедуру
                      </button>
                      <button 
                        onClick={() => { setQuizStep(0); setQuizAnswers([]); }}
                        className="w-full bg-white/50 border border-stone-200 text-stone-500 hover:bg-white py-3 rounded-2xl font-medium flex items-center justify-center transition-all text-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-2" /> Пройти заново
                      </button>
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-stone-800 mb-6">Наши Услуги и Цены</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg">Выберите подходящую процедуру для глубокого расслабления или эффективной коррекции фигуры.</p>
          </div>
          
          {/* Переключатель вкладок */}
          <div className="flex justify-center mb-16">
            <div className="bg-stone-200/50 p-1.5 rounded-full inline-flex flex-col sm:flex-row w-full sm:w-auto border border-stone-200/50 shadow-sm">
              <button onClick={() => setActiveTab('massage')} className={`px-8 py-3.5 rounded-full text-sm font-medium w-full sm:w-auto transition-all duration-300 ${activeTab === 'massage' ? 'bg-white text-sky-600 shadow-md scale-105' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/50'}`}>Услуги массажа</button>
              <button onClick={() => setActiveTab('body')} className={`px-8 py-3.5 rounded-full text-sm font-medium w-full sm:w-auto mt-2 sm:mt-0 transition-all duration-300 ${activeTab === 'body' ? 'bg-white text-sky-600 shadow-md scale-105' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/50'}`}>Коррекция фигуры</button>
            </div>
          </div>

          {/* Новый макет: SPA-Меню */}
          <div className="flex flex-col gap-20 md:gap-32 animate-fade-in">
            {(activeTab === 'massage' ? massageServices : bodyShapingServices).map((item, idx) => {
               const IconComp = IconMap[item.iconName] || Sparkles;
               return (
                <div key={idx} className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                  
                  {/* Левая часть: Фото и описание (Закрепляется при скролле) */}
                  <div className="w-full lg:w-5/12 lg:sticky lg:top-32 relative group">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-md mb-6 relative">
                      <img src={item.image} alt={item.title || item.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                      {/* Иконка для аппаратных услуг */}
                      {activeTab === 'body' && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm">
                          <IconComp className="w-6 h-6 text-sky-500" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-3xl font-serif text-stone-800 mb-4">{item.title || item.category}</h3>
                    <p className="text-stone-500 leading-relaxed text-lg">{item.description}</p>
                  </div>

                  {/* Правая часть: Список услуг и цен */}
                  <div className="w-full lg:w-7/12 flex flex-col gap-3 md:gap-4 lg:pt-4">
                    {item.items?.map((subItem, sIdx) => (
                      <div key={sIdx} className="bg-white p-5 md:p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                        <div className="flex-1 pr-4">
                          <h4 className="font-medium text-stone-800 text-lg group-hover:text-sky-700 transition-colors">{subItem.name}</h4>
                          {subItem.duration && (
                            <span className="text-stone-400 text-sm mt-2 flex items-center">
                              <Clock className="w-4 h-4 mr-1.5 text-stone-300" />{subItem.duration}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end border-t border-stone-50 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                          <span className="text-xl md:text-2xl font-semibold text-sky-600 whitespace-nowrap">{subItem.price}</span>
                          <button 
                            onClick={() => openModal(`${item.title || item.category} - ${subItem.name}`)} 
                            className="bg-stone-50 text-stone-600 hover:bg-sky-500 hover:text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            Записаться
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
               );
            })}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Наша Команда</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-stone-50 shadow-md">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-1">{member.name}</h3>
                <span className="text-sky-600 text-sm font-medium mb-4">{member.role}</span>
                <p className="text-stone-500 text-sm leading-relaxed flex-1">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT SECTION */}
      <section id="equipment" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Наше Оборудование</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {equipmentData.map((item, idx) => (
              <div key={idx} className="bg-stone-50 rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 flex flex-col sm:flex-row gap-6 hover:shadow-md">
                <div className="w-full sm:w-1/3 h-48 sm:h-auto shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features?.split(',').map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center text-xs font-medium text-stone-600">
                        <ShieldCheck className="w-4 h-4 text-sky-500 mr-2" /> {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* ГАЛЕРЕЯ ДО/ПОСЛЕ */}
      <section id="results" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Результаты наших клиентов</h2>
            <p className="text-stone-500">Реальные изменения после курсов процедур в нашей студии</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {resultsData.map((res, idx) => (
              <div key={idx} className="group">
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                    <img src={res.before} alt="До" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">До</div>
                  </div>
                  <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-sky-400">
                    <img src={res.after} alt="После" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-sky-500 text-white text-xs px-3 py-1 rounded-full">После</div>
                  </div>
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Отзывы и впечатления</h2>
            <p className="text-stone-500">Что говорят о нас гости студии</p>
          </div>
          <div className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide">
            {reviewsData.map((rev, idx) => (
              <div key={idx} className="min-w-[280px] md:min-w-[320px] aspect-[9/16] bg-white rounded-3xl shadow-md overflow-hidden border border-stone-100 flex-shrink-0 transform hover:-translate-y-2 transition-transform duration-300">
                <img src={rev} alt="Отзыв" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-sm text-stone-400">Листайте вправо, чтобы увидеть больше →</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Вопрос-ответ</h2></div>
          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden transition-all duration-300">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-stone-100 text-left">
                  <span className="font-medium text-stone-800 pr-4">{faq.question}</span>
                  {openFaqIndex === idx ? <ChevronUp className="w-5 h-5 text-sky-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />}
                </button>
                {openFaqIndex === idx && <div className="px-6 py-5 bg-stone-50 text-stone-600 text-sm leading-relaxed border-t">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

{/* CONTACTS / FOOTER */}
      <section id="contacts" className="py-16 bg-sky-800 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          
          {/* Главный заголовок секции - теперь строго по центру */}
          <h2 className="text-3xl md:text-4xl font-serif mb-10 text-center">Как нас найти</h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* ЛЕВАЯ КОЛОНКА (35%): Информация */}
            <div className="w-full lg:w-[35%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              
              <div className="mb-8 w-full border-b border-white/10 pb-8">
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-sky-200 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="uppercase tracking-wider text-sm font-medium">Наш адрес</span>
                </div>
                <span className="text-xl font-light text-white block leading-relaxed">проспект Музрукова, д.37 к.3</span>
              </div>
              
              <a href="tel:+79101258250" className="group flex flex-col items-center lg:items-start mb-8 w-full">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-light text-white tracking-wide whitespace-nowrap">+7 910-125-82-50</span>
                </div>
              </a>
              
              <button onClick={() => openModal()} className="w-full px-8 bg-white text-sky-900 hover:bg-sky-50 font-medium py-4 rounded-full transition-colors text-lg shadow-md mt-auto">
                Записаться онлайн
              </button>
            </div>

            {/* ПРАВАЯ КОЛОНКА (65%): Карта Яндекса */}
            <div className="w-full lg:w-[65%] h-80 lg:h-auto min-h-[350px] rounded-2xl overflow-hidden border border-white/10 shadow-inner relative bg-stone-100/10">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A5bd4448c7935bb1d9d7b082ee77117acbad4684acf8b86717e288673a4a24dbc&amp;source=constructor" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                allowFullScreen={true} 
                style={{ position: 'absolute', top: 0, left: 0 }}
                title="Карта студии SOVA"
              ></iframe>
            </div>
            
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <h1 className="text-2xl font-light text-white tracking-[0.2em] mb-1">SOVA</h1>
            <p className="text-xs uppercase tracking-wider mb-4">Студия массажа и коррекции фигуры</p>
            
          </div>
          <div className="text-center md:text-right text-sm">
            <p className="mb-2">проспект Музрукова д.37 к.3</p>
            <p>© {new Date().getFullYear()} Студия «SOVA». Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* PROMO BANNER */}
      {showPromo && (
        <div className="fixed bottom-6 right-6 z-[90] max-w-sm w-[calc(100%-3rem)] bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-sky-500 to-sky-400 p-5 relative">
            <button 
              onClick={() => { setShowPromo(false); setPromoClosed(true); }} 
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl"><Sparkles className="w-6 h-6 text-white" /></div>
              <h4 className="font-serif text-xl font-medium text-white">Первый раз у нас?</h4>
            </div>
          </div>
          <div className="p-6">
            <p className="text-stone-600 text-sm mb-5 leading-relaxed">
              Запишитесь сейчас и получите скидку <strong className="text-sky-500 font-bold text-base">15%</strong> на любой массаж или процедуру коррекции фигуры!
            </p>
            <button
              onClick={() => {
                setShowPromo(false);
                setPromoClosed(true);
                openModal(); // Открываем форму записи
              }}
              className="w-full bg-sky-50 hover:bg-sky-100 text-sky-600 font-medium py-3 rounded-xl transition-colors text-sm flex justify-center items-center"
            >
              Забрать скидку
            </button>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md relative shadow-2xl">
            <button onClick={closeModal} className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full"><X className="w-5 h-5" /></button>
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8" /></div>
                <h3 className="text-2xl font-serif text-stone-800 mb-2">Заявка отправлена!</h3>
                <p className="text-stone-500 mb-6">Спасибо, {bookingData.name}! Мы свяжемся с вами в ближайшее время.</p>
                <button onClick={closeModal} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full font-medium">Закрыть</button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-serif text-stone-800 mb-2">Онлайн-запись</h3>
                <form onSubmit={handleBookingSubmit} className="space-y-5 mt-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700">Услуга</label>
                    <select className="w-full border-stone-200 p-3 rounded-xl text-sm bg-stone-50 focus:ring-2 focus:ring-sky-500 outline-none transition-all" value={selectedService} onChange={e => setSelectedService(e.target.value)}>
                      <option value="" disabled>Выберите услугу</option>
                      <optgroup label="Массаж">{massageServices.flatMap(s => s.items?.map(i => `${s.title} (${i.name})`) || []).map((n, i) => <option key={i} value={n}>{n}</option>)}</optgroup>
                      <optgroup label="Коррекция фигуры">{bodyShapingServices.flatMap(c => c.items?.map(i => `${c.category} - ${i.name}`) || []).map((n, i) => <option key={i} value={n}>{n}</option>)}</optgroup>
                    </select>
                  </div>

                  {/* ВЫБОР МАСТЕРА */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700">Желаемый специалист (необязательно)</label>
                    <select 
                      className="w-full border-stone-200 p-3 rounded-xl text-sm bg-stone-50 focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                      value={bookingData.specialist} 
                      onChange={e => setBookingData({...bookingData, specialist: e.target.value})}
                    >
                      <option value="">Любой свободный мастер</option>
                      {teamMembers.map((m, i) => (
                        <option key={i} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-stone-700">Имя</label>
                      <input required type="text" placeholder="Ваше имя" className="w-full border border-stone-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={bookingData.name} onChange={e => setBookingData({...bookingData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-stone-700">Телефон</label>
                      <input required type="tel" placeholder="+7 (999) 000-00-00" className="w-full border border-stone-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={bookingData.phone} onChange={handlePhoneChange} maxLength={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700">Дата сеанса</label>
                    <input required type="date" min={todayDate} className="w-full border border-stone-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-stone-50" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                  </div>

                  {/* ИСПРАВЛЕННЫЙ БЛОК: Свободное время */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-stone-700">Свободное время</label>
                    {(() => {
                      if (!selectedService) {
                        return <p className="text-sm text-stone-500 py-2 bg-stone-100 px-4 rounded-xl">Сначала выберите услугу в списке выше 👆</p>;
                      }
                      
                      const timesString = seoData?.availableTimes || defaultSeo.availableTimes || "10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00";
                      const activeSlots = timesString.split(',').map(t => t.trim()).filter(Boolean);

                      return (
                        <div className="flex flex-wrap gap-2 animate-fade-in">
                          {activeSlots.map(t => (
                            <button 
                              key={t} 
                              type="button" 
                              onClick={() => setBookingData({...bookingData, time: t})}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${bookingData.time === t ? 'bg-sky-500 text-white border-sky-500 shadow-md scale-105' : 'bg-white text-stone-600 border-stone-200 hover:border-sky-300 hover:bg-sky-50'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* КАПЧА */}
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-center justify-between gap-4 mt-2">
                    <label className="text-sm text-stone-600 font-medium">
                      Проверка от спама: <strong className="text-lg text-stone-800 ml-1">{captcha.num1} + {captcha.num2} = ?</strong>
                    </label>
                    <input 
                      required 
                      type="number" 
                      className="w-20 border border-stone-300 p-2 rounded-lg text-center focus:ring-2 focus:ring-sky-500 outline-none" 
                      value={captcha.answer} 
                      onChange={e => setCaptcha({...captcha, answer: e.target.value})} 
                    />
                  </div>

                  {/* СОГЛАСИЕ НА ОБРАБОТКУ ДАННЫХ */}
                  <div className="flex items-start gap-3 mt-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <input 
                      type="checkbox" 
                      id="privacy" 
                      required 
                      className="mt-1 w-4 h-4 text-sky-500 border-stone-300 rounded focus:ring-sky-500 cursor-pointer" 
                    />
                    <label htmlFor="privacy" className="text-xs text-stone-600 leading-relaxed cursor-pointer">
                      Я даю согласие на обработку моих персональных данных в соответствии с <a href="/policy.html" target="_blank" className="text-sky-600 hover:underline">Политикой конфиденциальности</a>.
                    </label>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-4 rounded-xl mt-6 flex justify-center items-center shadow-lg hover:shadow-xl transition-all">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Отправить заявку"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}