import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Sparkles, Wind, Droplets, X, CheckCircle, Lock, User, Trash2, LogOut, Edit, Plus, Save, ArrowLeft, ArrowRight, Loader2, ChevronDown, ChevronUp, ShieldCheck, Upload } from 'lucide-react';
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const IconMap = { Wind, Droplets, Sparkles };

// --- ДАННЫЕ ИЗ ПРАЙС-ЛИСТОВ (Резервные, если база пуста) ---
const massageServicesData = [
  {
    title: "Массаж спины",
    description: "Снимает напряжение, мышечные боли и зажимы, улучшает осанку и кровообращение. Включает шейно-воротниковую зону, грудной и поясничный отдел, верхние конечности.",
    image: "https://images.unsplash.com/photo-1600334129128-68505dcecbfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "1 сеанс (40 минут)", price: "1500 руб." },
      { name: "Курс 10 сеансов", price: "13000 руб." }
    ]
  },
  {
    title: "Массаж шейно-воротниковой зоны",
    description: "Избавляет от головных болей, чувства усталости, снимает напряжение в области шеи и надплечий.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "1 сеанс (20 минут)", price: "900 руб." },
      { name: "Курс 10 сеансов", price: "8000 руб." }
    ]
  },
  {
    title: "Массаж ног",
    description: "Снимает отечность, чувство тяжести и усталости после долгого дня, улучшает лимфоток. Включает ягодицы, бедра, голени, стопы.",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "1 сеанс (40 минут)", price: "1500 руб." },
      { name: "Курс 10 сеансов", price: "13000 руб." }
    ]
  }
];

const bodyShapingServicesData = [
  {
    category: "Вакуумный массаж",
    description: "Аппаратное воздействие, которое ускоряет лимфоток, эффективно разбивает жировые отложения и борется с целлюлитом, делая кожу упругой.",
    image: "https://images.unsplash.com/photo-1564551139785-5eb9c0a6b579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    iconName: "Wind",
    items: [
      { name: "Бедра и ягодицы (спереди и сзади)", duration: "40 минут", price: "1400 руб." },
      { name: "Живот", duration: "20 минут", price: "900 руб." }
    ]
  },
  {
    category: "УЗ кавитация",
    description: "Безоперационная липосакция. Ультразвуковые волны разрушают жировые клетки, позволяя точечно избавляться от локальных жировых ловушек.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    iconName: "Droplets",
    items: [
      { name: "УЗ кавитация (живот)", duration: "30 минут", price: "1200 руб." },
      { name: "УЗ кавитация (живот) 8 сеансов", price: "8500 руб." }
    ]
  }
];

const equipmentData = [
  {
    title: "Оборудование для LPG-массажа",
    description: "Передовая вакуумно-роликовая технология для глубокого лимфодренажа, устранения целлюлита и моделирования идеальных контуров тела.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Безболезненно", "Мощный лимфодренаж", "Снятие отеков"]
  },
  {
    title: "Аппарат УЗ-Кавитации и RF",
    description: "Многофункциональная платформа для безоперационной липосакции. Ультразвук разрушает жировые клетки, а радиочастотный лифтинг подтягивает кожу.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Локальное похудение", "Синтез коллагена", "Лифтинг-эффект"]
  }
];

const teamMembers = [
  {
    name: "Екатерина Игнатова",
    role: "Владелица студии",
    description: "Основательница SOVA, эксперт по коррекции фигуры и массажным методикам. Внимательно следит за качеством каждой процедуры.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Специалист 1",
    role: "Специалист по аппаратному массажу",
    description: "Мастер LPG и УЗ кавитации. Знает все секреты того, как быстро и безболезненно достичь идеальных контуров тела.",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const faqData = [
  {
    question: "Сколько процедур массажа или коррекции нужно для стойкого эффекта?",
    answer: "Для достижения выраженного и долгосрочного результата мы рекомендуем проходить процедуры курсом от 8 до 12 сеансов, в зависимости от индивидуальных особенностей вашего тела."
  },
  {
    question: "Что брать с собой на сеанс?",
    answer: "Ничего специального! Мы предоставляем все необходимые одноразовые материалы. Для процедуры LPG-массажа требуется специальный костюм — вы можете приобрести его у нас."
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('main');
  
  // Состояния данных
  const [massageServices, setMassageServices] = useState(massageServicesData);
  const [bodyShapingServices, setBodyShapingServices] = useState(bodyShapingServicesData);
  const [bookingsList, setBookingsList] = useState([]);
  
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- ЧТЕНИЕ ИЗ FIREBASE ПРИ ЗАГРУЗКЕ САЙТА ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        const loadedBookings = bookingsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        loadedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookingsList(loadedBookings);

        const contentSnap = await getDocs(collection(db, "site_content"));
        contentSnap.docs.forEach(doc => {
          if (doc.id === 'massage') setMassageServices(doc.data().items);
          if (doc.id === 'body') setBodyShapingServices(doc.data().items);
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
  const [bookingData, setBookingData] = useState({ name: '', phone: '', date: '', time: '' });

  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [adminPanelTab, setAdminPanelTab] = useState('bookings');
  const [contentTab, setContentTab] = useState('massage');
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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setBookingData({ name: '', phone: '', date: '', time: '' });
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 300);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newBooking = {
      name: bookingData.name,
      phone: bookingData.phone,
      service: selectedService || 'Не указана',
      date: bookingData.date,
      time: bookingData.time,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "bookings"), newBooking);
      setBookingsList([{ ...newBooking, id: docRef.id }, ...bookingsList]);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Ошибка при сохранении заявки:", error);
      alert("Не удалось отправить заявку. Пожалуйста, попробуйте еще раз.");
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

  // --- ЛОГИКА АДМИНКИ ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPass === 'admin') {
      setCurrentView('adminPanel');
      setLoginError('');
      setLoginPass('');
    } else {
      setLoginError('Неверный пароль');
    }
  };

  // ИЗМЕНЕНО: Работа со статусами в Firebase
  const toggleBookingStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'new' ? 'done' : 'new';
    try {
      await setDoc(doc(db, "bookings", id), { status: newStatus }, { merge: true });
      setBookingsList(bookingsList.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

  // ИЗМЕНЕНО: Удаление из Firebase
  const deleteBooking = async (id) => {
    if(window.confirm('Точно удалить эту заявку?')) {
      try {
        await deleteDoc(doc(db, "bookings", id));
        setBookingsList(bookingsList.filter(b => b.id !== id));
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      }
    }
  };

  // --- ЛОГИКА РЕДАКТОРА КОНТЕНТА ---
  const handleEditClick = (index) => {
    setEditingIndex(index);
    const sourceData = contentTab === 'massage' ? massageServices[index] : bodyShapingServices[index];
    setEditingItem(JSON.parse(JSON.stringify(sourceData)));
  };

  // ИЗМЕНЕНО: Сохранение контента в Firebase
  const handleSaveContent = async () => {
    try {
      if (contentTab === 'massage') {
        const newData = [...massageServices];
        newData[editingIndex] = editingItem;
        setMassageServices(newData);
        await setDoc(doc(db, "site_content", "massage"), { items: newData });
      } else {
        const newData = [...bodyShapingServices];
        newData[editingIndex] = editingItem;
        setBodyShapingServices(newData);
        await setDoc(doc(db, "site_content", "body"), { items: newData });
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

  // НОВОЕ: Удаление карточки услуги из БД
  const handleDeleteService = async (index) => {
    if(window.confirm('Вы уверены, что хотите удалить эту карточку со всеми услугами внутри?')) {
      try {
        if (contentTab === 'massage') {
          const newData = massageServices.filter((_, i) => i !== index);
          setMassageServices(newData);
          await setDoc(doc(db, "site_content", "massage"), { items: newData });
        } else {
          const newData = bodyShapingServices.filter((_, i) => i !== index);
          setBodyShapingServices(newData);
          await setDoc(doc(db, "site_content", "body"), { items: newData });
        }
      } catch (error) {
        console.error("Ошибка при удалении услуги:", error);
        alert("Не удалось удалить услугу.");
      }
    }
  };

  // НОВОЕ: Добавление новой карточки
  const handleAddServiceBlock = () => {
    const newBlock = {
      description: "Краткое описание процедуры...",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: [{ name: "Название", price: "0 руб.", duration: "30 минут" }]
    };

    if (contentTab === 'massage') {
      newBlock.title = "Новая услуга";
      setMassageServices([...massageServices, newBlock]);
    } else {
      newBlock.category = "Новый аппарат";
      newBlock.iconName = "Sparkles";
      setBodyShapingServices([...bodyShapingServices, newBlock]);
    }
    
    const newIndex = contentTab === 'massage' ? massageServices.length : bodyShapingServices.length;
    handleEditClick(newIndex);
  };

  // НОВОЕ: Загрузка фото с компьютера
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Внимание! Рекомендуется загружать фото до 2 МБ.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // ВИД: АВТОРИЗАЦИЯ АДМИНИСТРАТОРА
  // ==========================================
  if (currentView === 'adminLogin') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm relative">
          <button onClick={() => setCurrentView('main')} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-stone-800">Вход в панель</h2>
            <p className="text-sm text-stone-500 text-center mt-1">Пароль по умолчанию: <strong>admin</strong></p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Введите пароль" 
                className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none text-center"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
              />
              {loginError && <p className="text-red-500 text-xs text-center mt-2">{loginError}</p>}
            </div>
            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 rounded-xl transition-colors">
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // ВИД: ПАНЕЛЬ АДМИНИСТРАТОРА
  // ==========================================
  if (currentView === 'adminPanel') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light text-sky-500 tracking-widest">SOVA</h1>
            <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded font-medium">Админ-панель</span>
          </div>
          
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button 
              onClick={() => setAdminPanelTab('bookings')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${adminPanelTab === 'bookings' ? 'bg-white text-sky-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Заявки
            </button>
            <button 
              onClick={() => setAdminPanelTab('content')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${adminPanelTab === 'content' ? 'bg-white text-sky-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Услуги и Цены
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => {e.preventDefault(); setCurrentView('main');}} className="text-sm text-stone-500 hover:text-sky-600">На сайт</a>
            <button onClick={() => setCurrentView('main')} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Выйти
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6">
          {isLoadingData ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              <span className="ml-3 text-stone-500">Загрузка данных из базы...</span>
            </div>
          ) : adminPanelTab === 'bookings' ? (
            <>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-serif mb-2">Заявки с сайта</h2>
                  <p className="text-stone-500 text-sm">Здесь отображаются все бронирования, оставленные через форму.</p>
                </div>
                <div className="text-sm bg-white border border-stone-200 px-4 py-2 rounded-lg shadow-sm">
                  Всего заявок: <strong className="text-sky-600">{bookingsList.length}</strong>
                </div>
              </div>

              {bookingsList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium text-stone-800 mb-2">Заявок пока нет</h3>
                  <p className="text-stone-500 max-w-md">Когда клиент заполнит форму на сайте, его данные появятся здесь.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookingsList.map((booking) => (
                    <div key={booking.id} className={`bg-white rounded-2xl border transition-all p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shadow-sm hover:shadow-md ${booking.status === 'done' ? 'border-green-200 bg-green-50/30' : 'border-stone-200'}`}>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                        <div>
                          <span className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Клиент</span>
                          <strong className="text-stone-800 text-lg block">{booking.name}</strong>
                          <a href={`tel:${booking.phone}`} className="text-sky-600 hover:underline text-sm font-medium">{booking.phone}</a>
                        </div>
                        
                        <div className="md:col-span-2">
                          <span className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Услуга</span>
                          <span className="text-stone-800 font-medium">{booking.service}</span>
                        </div>

                        <div>
                          <span className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Желаемое время</span>
                          <div className="flex items-center text-stone-700 text-sm font-medium">
                            <Clock className="w-4 h-4 mr-1.5 text-stone-400" />
                            {booking.date} в {booking.time}
                          </div>
                          <span className="text-[10px] text-stone-400 mt-1 block">Создано: {new Date(booking.createdAt).toLocaleString('ru-RU')}</span>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                        <button 
                          onClick={() => toggleBookingStatus(booking.id, booking.status)}
                          className={`flex-1 md:flex-none flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${booking.status === 'done' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
                        >
                          <CheckCircle className={`w-4 h-4 mr-2 ${booking.status === 'done' ? 'text-green-600' : 'text-stone-400'}`} />
                          {booking.status === 'done' ? 'Обработано' : 'Отметить как готовое'}
                        </button>
                        
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="flex-none flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-red-500 bg-white border border-stone-200 hover:bg-red-50 hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 md:mr-2" />
                          <span className="hidden md:inline">Удалить</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-serif mb-2">Управление услугами</h2>
                  <p className="text-stone-500 text-sm">Редактируйте, добавляйте новые или удаляйте неактуальные услуги.</p>
                </div>
                <button 
                  onClick={handleAddServiceBlock}
                  className="bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" /> Добавить блок услуг
                </button>
              </div>

              <div className="flex border-b border-stone-200 mb-6">
                <button 
                  onClick={() => {setContentTab('massage'); setEditingItem(null);}} 
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${contentTab === 'massage' ? 'border-sky-500 text-sky-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                >
                  Услуги массажа
                </button>
                <button 
                  onClick={() => {setContentTab('body'); setEditingItem(null);}} 
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${contentTab === 'body' ? 'border-sky-500 text-sky-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                >
                  Коррекция фигуры
                </button>
              </div>

              {!editingItem ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(contentTab === 'massage' ? massageServices : bodyShapingServices).map((service, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow group">
                      <div>
                        <div className="w-full h-32 rounded-xl overflow-hidden mb-4 relative">
                          <img src={service.image} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">
                          {service.title || service.category}
                        </h3>
                        <p className="text-sm text-stone-500 line-clamp-2 mb-4">{service.description}</p>
                        <div className="text-xs text-stone-400 mb-4">
                          Включено услуг: {service.items?.length || 0}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleEditClick(idx)}
                          className="flex-1 bg-sky-50 text-sky-600 hover:bg-sky-100 font-medium py-2 rounded-xl transition-colors flex items-center justify-center text-sm"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Изменить
                        </button>
                        <button 
                          onClick={() => handleDeleteService(idx)}
                          className="flex-none bg-white border border-stone-200 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 font-medium px-3 rounded-xl transition-colors flex items-center justify-center"
                          title="Удалить карточку"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 animate-fade-in shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
                    <h3 className="text-2xl font-serif text-stone-800">Редактирование блока</h3>
                    <button onClick={handleCancelEdit} className="text-stone-400 hover:text-stone-700">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Заголовок / Название</label>
                        <input 
                          type="text" 
                          className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                          value={editingItem.title !== undefined ? editingItem.title : editingItem.category}
                          onChange={e => setEditingItem(prev => editingItem.title !== undefined ? {...prev, title: e.target.value} : {...prev, category: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Описание процедуры</label>
                        <textarea 
                          className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none min-h-[100px]"
                          value={editingItem.description}
                          onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                        />
                      </div>
                      
                      {/* НОВЫЙ БЛОК: ЗАГРУЗКА ФОТО */}
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Фотография</label>
                        <div className="flex flex-col gap-3">
                          <input 
                            type="text" 
                            className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="Вставьте ссылку на фото из интернета..."
                            value={editingItem.image}
                            onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                          />
                          <div className="flex items-center gap-3 relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <button className="w-full bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center text-sm border border-stone-200">
                                <Upload className="w-4 h-4 mr-2" /> Выбрать фото с компьютера
                              </button>
                          </div>
                          <p className="text-xs text-stone-400">Рекомендуется использовать сжатые картинки до 500 КБ.</p>
                        </div>
                        {editingItem.image && (
                          <div className="mt-4 w-full h-32 rounded-xl overflow-hidden border border-stone-200">
                            <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">Вложенные услуги и цены</label>
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {editingItem.items?.map((item, itemIdx) => (
                          <div key={itemIdx} className="bg-stone-50 border border-stone-200 rounded-xl p-4 relative">
                            <button 
                              onClick={() => setEditingItem({
                                ...editingItem, 
                                items: editingItem.items.filter((_, i) => i !== itemIdx)
                              })}
                              className="absolute top-3 right-3 text-stone-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="block text-xs text-stone-500 mb-1">Название услуги</label>
                                <input 
                                  type="text" 
                                  className="w-full border border-stone-200 rounded-lg p-2 text-sm outline-none"
                                  value={item.name}
                                  onChange={e => handleItemChange(itemIdx, 'name', e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-stone-500 mb-1">Длительность</label>
                                  <input 
                                    type="text" 
                                    className="w-full border border-stone-200 rounded-lg p-2 text-sm outline-none"
                                    placeholder="напр. 40 минут"
                                    value={item.duration || ''}
                                    onChange={e => handleItemChange(itemIdx, 'duration', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-stone-500 mb-1">Цена</label>
                                  <input 
                                    type="text" 
                                    className="w-full border border-stone-200 rounded-lg p-2 text-sm outline-none"
                                    value={item.price}
                                    onChange={e => handleItemChange(itemIdx, 'price', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setEditingItem({
                          ...editingItem, 
                          items: [...(editingItem.items || []), { name: "Новая под-услуга", price: "0 руб." }]
                        })}
                        className="w-full border-2 border-dashed border-stone-300 text-stone-500 hover:bg-stone-50 hover:text-stone-700 font-medium py-3 rounded-xl mt-4 transition-colors flex items-center justify-center text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Добавить вариант (цену)
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-stone-100">
                    <button onClick={handleCancelEdit} className="px-6 py-2.5 rounded-xl font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Отмена</button>
                    <button onClick={handleSaveContent} className="px-6 py-2.5 rounded-xl font-medium text-white bg-sky-500 hover:bg-sky-600 transition-colors flex items-center shadow-lg shadow-sky-500/30">
                      <Save className="w-4 h-4 mr-2" /> Сохранить изменения
                    </button>
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
            <div className="flex flex-col items-center cursor-pointer" onClick={() => setCurrentView('main')}>
              <h1 className="text-3xl md:text-4xl font-light text-sky-500 tracking-[0.3em] ml-2">SOVA</h1>
            </div>
            
            <button onClick={() => setCurrentView('main')} className="text-stone-500 hover:text-sky-600 font-medium text-sm flex items-center transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> На главную
            </button>
          </div>
        </header>

        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={selectedServiceData.image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-stone-900/40"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl text-white font-serif tracking-wide drop-shadow-lg">{title}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <button onClick={() => setCurrentView('main')} className="text-sky-600 hover:text-sky-700 font-medium text-sm flex items-center transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Вернуться к списку услуг
          </button>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100 mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-stone-800 mb-6">О процедуре</h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-10">
              {selectedServiceData.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <h3 className="text-xl font-serif text-stone-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-sky-500 mr-2" /> Эффект от процедуры
                </h3>
                <ul className="space-y-3 text-stone-600 text-sm">
                  <li className="flex items-start"><div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 mr-2 shrink-0"></div> Улучшение кровообращения и лимфотока</li>
                  <li className="flex items-start"><div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 mr-2 shrink-0"></div> Снятие мышечного напряжения и стресса</li>
                  <li className="flex items-start"><div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 mr-2 shrink-0"></div> Повышение тонуса и упругости кожи</li>
                  <li className="flex items-start"><div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 mr-2 shrink-0"></div> Глубокое расслабление и восстановление сил</li>
                </ul>
              </div>
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <h3 className="text-xl font-serif text-stone-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-sky-500 mr-2" /> Как проходит сеанс
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Наши специалисты используют индивидуальный подход. Перед началом процедуры проводится короткая консультация для выявления ваших пожеланий и противопоказаний. В работе применяются только гипоаллергенные масла и профессиональная косметика премиум-класса.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif text-stone-800 mb-6">Варианты и стоимость</h2>
            <div className="space-y-4">
              {selectedServiceData.items?.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border border-stone-100 hover:border-sky-200 hover:bg-sky-50/50 transition-colors gap-4">
                  <div>
                    <h4 className="font-medium text-stone-800 text-lg">{item.name}</h4>
                    {(item.description || item.duration) && (
                      <div className="flex items-center text-sm text-stone-500 mt-1 space-x-3">
                        {item.duration && <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {item.duration}</span>}
                        {item.description && <span>{item.description}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xl font-semibold text-sky-600 whitespace-nowrap">{item.price}</span>
                    <button onClick={() => openModal(`${title} - ${item.name}`)} className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-md shadow-sky-500/20">
                      Выбрать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sky-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-serif mb-4">Остались вопросы?</h3>
              <p className="text-sky-200 mb-8 max-w-lg mx-auto">Оставьте заявку, и наш администратор свяжется с вами, чтобы подробно рассказать об услуге и подобрать удобное время.</p>
              <button onClick={() => openModal(title)} className="bg-white text-sky-900 hover:bg-sky-50 px-8 py-3.5 rounded-full font-medium transition-colors shadow-lg shadow-black/10">
                Записаться на консультацию
              </button>
            </div>
          </div>
        </div>

        <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
              <h1 className="text-2xl font-light text-white tracking-[0.2em] mb-1">SOVA</h1>
              <p className="text-xs uppercase tracking-wider">Студия массажа и коррекции фигуры</p>
            </div>
            <div className="text-center md:text-right text-sm">
              <p className="mb-2">проспект Музрукова д.37 к.3</p>
              <p>© {new Date().getFullYear()} Студия «SOVA». Все права защищены.</p>
            </div>
          </div>
        </footer>

        {isModalOpen && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md relative animate-fade-in shadow-2xl">
              <button onClick={closeModal} className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors bg-stone-100 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif text-stone-800 mb-2">Заявка отправлена!</h3>
                  <p className="text-stone-500 mb-6">Спасибо, {bookingData.name}! Мы свяжемся с вами в ближайшее время.</p>
                  <button onClick={closeModal} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                    Закрыть
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-serif text-stone-800 mb-2">Онлайн-запись</h3>
                  <p className="text-sm text-stone-500 mb-6">Выберите удобное время, и мы подготовим все для вашего визита.</p>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Услуга</label>
                      <input 
                        readOnly
                        type="text" 
                        className="w-full border border-stone-200 rounded-xl p-3 text-sm bg-stone-50 text-stone-800"
                        value={selectedService}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Ваше имя</label>
                        <input required type="text" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={bookingData.name} onChange={e => setBookingData({...bookingData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Телефон</label>
                        <input required type="tel" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Дата</label>
                        <input required type="date" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Время</label>
                        <input required type="time" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-medium py-3.5 rounded-xl mt-6 transition-all shadow-lg shadow-sky-500/30 flex justify-center items-center"
                    >
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
            <p className="text-[0.55rem] md:text-xs text-stone-500 tracking-widest mt-1 uppercase text-center">
              Студия массажа<br className="md:hidden"/> и коррекции фигуры
            </p>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-stone-600">
            <button onClick={() => scrollToSection('services')} className="hover:text-sky-500 transition-colors">Услуги и цены</button>
            <button onClick={() => scrollToSection('team')} className="hover:text-sky-500 transition-colors">Команда</button>
            <button onClick={() => scrollToSection('equipment')} className="hover:text-sky-500 transition-colors">Аппараты</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-sky-500 transition-colors">Вопрос-ответ</button>
            <button onClick={() => scrollToSection('contacts')} className="hover:text-sky-500 transition-colors">Контакты</button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => openModal()} className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium">
              <Phone className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Записаться</span>
              <span className="sm:hidden">Запись</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative bg-stone-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/80 to-transparent"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-6">
              Добро пожаловать в SOVA
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6 leading-tight">
              Подарите себе <br/> <span className="text-sky-600">гармонию</span> и красоту
            </h2>
            <p className="text-lg text-stone-600 mb-10 leading-relaxed">
              Профессиональный массаж и современные аппаратные методики коррекции фигуры в уютной атмосфере нашей студии. Ваше тело скажет вам спасибо.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('services')}
                className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center">
                Смотреть услуги
              </button>
              <button 
                onClick={() => openModal()}
                className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 px-8 py-3.5 rounded-full font-medium transition-all flex items-center justify-center">
                Записаться на сеанс
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Наши Услуги и Цены</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Выберите подходящую процедуру для расслабления или эффективной коррекции фигуры.</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-stone-100 p-1 rounded-full inline-flex flex-col sm:flex-row w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('massage')}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-all w-full sm:w-auto ${activeTab === 'massage' ? 'bg-white text-sky-600 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
              >
                Услуги массажа
              </button>
              <button 
                onClick={() => setActiveTab('body')}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-all w-full sm:w-auto mt-2 sm:mt-0 ${activeTab === 'body' ? 'bg-white text-sky-600 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
              >
                Коррекция фигуры
              </button>
            </div>
          </div>

          {activeTab === 'massage' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {massageServices.map((service, idx) => (
                  <div key={idx} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                    <div className="h-56 overflow-hidden relative">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
                      <h3 className="absolute bottom-4 left-6 right-6 text-white text-xl md:text-2xl font-serif leading-tight">{service.title}</h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-sm text-stone-500 mb-6 flex-1">{service.description}</p>
                      <div className="space-y-4">
                        {service.items?.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex flex-col border-t border-stone-100 pt-4 first:border-0 first:pt-0 gap-2">
                            <div className="flex justify-between items-start gap-3">
                              <span className="text-sm font-medium text-stone-800">{item.name}</span>
                              <span className="text-sky-600 font-semibold whitespace-nowrap text-sm">{item.price}</span>
                            </div>
                            <button onClick={() => openModal(`${service.title} - ${item.name}`)} className="text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 py-2 px-4 rounded-xl w-fit transition-colors">
                              Записаться
                            </button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => openServiceDetails(service)} className="mt-6 w-full border border-sky-100 text-sky-600 hover:bg-sky-50 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center">
                        Подробнее об услуге <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'body' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bodyShapingServices.map((category, idx) => {
                  const IconComp = IconMap[category.iconName] || Sparkles;
                  return (
                  <div key={idx} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                    <div className="h-56 overflow-hidden relative">
                      <img src={category.image} alt={category.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white">
                          <IconComp className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white text-xl md:text-2xl font-serif">{category.category}</h3>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-sm text-stone-500 mb-6 flex-1">{category.description}</p>
                      <ul className="space-y-4">
                        {category.items?.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex flex-col border-t border-stone-100 pt-4 first:border-0 first:pt-0 gap-2">
                            <div className="flex justify-between items-start gap-3">
                              <div className="pr-2">
                                <span className="text-sm font-medium text-stone-800 block">{item.name}</span>
                                {item.description && (
                                  <span className="text-stone-500 text-xs block mt-1 leading-snug">{item.description}</span>
                                )}
                                {item.duration && (
                                  <span className="text-stone-400 text-xs block mt-1 flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    {item.duration}
                                  </span>
                                )}
                              </div>
                              <span className="text-sky-600 font-semibold whitespace-nowrap text-sm">{item.price}</span>
                            </div>
                            <button onClick={() => openModal(`${category.category} - ${item.name}`)} className="text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 py-2 px-4 rounded-xl w-fit transition-colors">
                              Записаться
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => openServiceDetails(category)} className="mt-6 w-full border border-sky-100 text-sky-600 hover:bg-sky-50 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center">
                        Подробнее об услуге <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Наша Команда</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Доверьтесь профессионалам. Наши специалисты регулярно повышают квалификацию и знают, как достичь лучших результатов.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center p-6 md:p-8 relative">
                {idx === 0 && (
                  <div className="absolute top-4 right-4 bg-sky-100 text-sky-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Руководитель
                  </div>
                )}
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-stone-50 shadow-md">
                  <img src={member.image} alt={``} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-1">{member.name}</h3>
                <span className="text-sky-600 text-sm font-medium mb-4">{member.role}</span>
                <p className="text-stone-500 text-sm leading-relaxed flex-1">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОБОРУДОВАНИЕ */}
      <section id="equipment" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Наше Оборудование</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Мы используем только проверенные, безопасные и высокоэффективные аппараты для коррекции фигуры и лифтинга.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {equipmentData.map((item, idx) => (
              <div key={idx} className="bg-stone-50 rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                <div className="w-full sm:w-1/3 h-48 sm:h-auto shrink-0">
                  <img src={item.image} alt={``} className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center text-xs font-medium text-stone-600">
                        <ShieldCheck className="w-4 h-4 text-sky-500 mr-2" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Вопрос-ответ</h2>
            <p className="text-stone-500">Ответы на самые частые вопросы о процедурах студии SOVA</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-stone-100 transition-colors text-left focus:outline-none"
                >
                  <span className="font-medium text-stone-800 pr-4">{faq.question}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-sky-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                  )}
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 py-5 bg-stone-50 text-stone-600 text-sm leading-relaxed border-t border-stone-100 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION / CONTACTS */}
      <section id="contacts" className="py-20 bg-sky-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Готовы к преображению?</h2>
          <p className="text-sky-100 mb-10 text-lg max-w-2xl mx-auto">
            Запишитесь на первый сеанс массажа или процедуру коррекции фигуры прямо сейчас. Мы подберем для вас оптимальное время.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-xl mx-auto border border-white/20">
            <div className="flex flex-col items-center justify-center mb-8 border-b border-white/10 pb-8">
              <div className="flex items-center justify-center space-x-2 text-sky-200 mb-1">
                <MapPin className="w-5 h-5" />
                <span className="uppercase tracking-wider text-sm">Наш адрес</span>
              </div>
              <span className="text-xl font-light text-white text-center">проспект Музрукова д.37 к.3</span>
            </div>

            <a href="tel:+79101258250" className="group flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-sky-500/50">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-sky-200 mb-2 uppercase tracking-wider">Телефон для записи</span>
              <span className="text-3xl md:text-4xl font-light text-white tracking-wide">+7 910-125-82-50</span>
            </a>
            <button onClick={() => openModal()} className="w-full bg-white text-sky-900 hover:bg-sky-50 font-medium py-3 rounded-full transition-colors">
              Записаться онлайн
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <h1 className="text-2xl font-light text-white tracking-[0.2em] mb-1">SOVA</h1>
            <p className="text-xs uppercase tracking-wider mb-4">Студия массажа и коррекции фигуры</p>
            
            <button 
              onClick={() => setCurrentView('adminLogin')} 
              className="text-[10px] uppercase tracking-widest text-stone-600 hover:text-sky-500 transition-colors flex items-center"
            >
              <Lock className="w-3 h-3 mr-1" /> Вход для администратора
            </button>
          </div>
          
          <div className="text-center md:text-right text-sm">
            <p className="mb-2">проспект Музрукова д.37 к.3</p>
            <p>© {new Date().getFullYear()} Студия «SOVA». Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* BOOKING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md relative animate-fade-in shadow-2xl">
            <button onClick={closeModal} className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors bg-stone-100 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-2">Заявка отправлена!</h3>
                <p className="text-stone-500 mb-6">Спасибо, {bookingData.name}! Мы свяжемся с вами в ближайшее время для подтверждения записи.</p>
                <button onClick={closeModal} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-serif text-stone-800 mb-2">Онлайн-запись</h3>
                <p className="text-sm text-stone-500 mb-6">Выберите удобное время, и мы подготовим все для вашего визита.</p>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Услуга</label>
                    <select 
                      className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-stone-50 text-stone-800 appearance-none"
                      value={selectedService}
                      onChange={e => setSelectedService(e.target.value)}
                    >
                      <option value="" disabled>Выберите услугу (необязательно)</option>
                      <optgroup label="Массаж">
                        {massageServices.flatMap(s => s.items?.map(i => `${s.title} (${i.name})`) || []).map((name, i) => <option key={`m-${i}`} value={name}>{name}</option>)}
                      </optgroup>
                      <optgroup label="Коррекция фигуры">
                        {bodyShapingServices.flatMap(cat => cat.items?.map(i => `${cat.category} - ${i.name}`) || []).map((name, i) => <option key={`b-${i}`} value={name}>{name}</option>)}
                      </optgroup>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Ваше имя</label>
                      <input required type="text" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Иван" value={bookingData.name} onChange={e => setBookingData({...bookingData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Телефон</label>
                      <input required type="tel" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none" placeholder="+7 (___) ___-__-__" value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Дата</label>
                      <input required type="date" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none text-stone-800" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Время</label>
                      <input required type="time" className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none text-stone-800" value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-medium py-3.5 rounded-xl mt-6 transition-all shadow-lg shadow-sky-500/30 flex justify-center items-center"
                  >
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