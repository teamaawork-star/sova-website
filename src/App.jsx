import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Sparkles, Wind, Droplets, X, CheckCircle, Lock, User, Trash2, LogOut, Edit, Plus, Save, ArrowLeft, ArrowRight, Loader2, ChevronDown, ChevronUp, ShieldCheck, Upload } from 'lucide-react';
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const IconMap = { Wind, Droplets, Sparkles };

// --- БАЗОВЫЕ ДАННЫЕ (Если база Firebase пуста) ---
const defaultHero = {
  badge: "Добро пожаловать в SOVA",
  title1: "Подарите себе",
  titleHighlight: "гармонию",
  title2: "и красоту",
  description: "Профессиональный массаж и современные аппаратные методики коррекции фигуры в уютной атмосфере нашей студии. Ваше тело скажет вам спасибо.",
  bgImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
};

const massageServicesData = [
  {
    title: "Массаж спины",
    description: "Снимает напряжение, мышечные боли и зажимы, улучшает осанку и кровообращение.",
    image: "https://images.unsplash.com/photo-1600334129128-68505dcecbfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "1 сеанс (40 минут)", price: "1500 руб." },
      { name: "Курс 10 сеансов", price: "13000 руб." }
    ]
  }
];

const bodyShapingServicesData = [
  {
    category: "Вакуумный массаж",
    description: "Аппаратное воздействие, которое ускоряет лимфоток, эффективно разбивает жировые отложения и борется с целлюлитом.",
    image: "https://images.unsplash.com/photo-1564551139785-5eb9c0a6b579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    iconName: "Wind",
    items: [
      { name: "Бедра и ягодицы", duration: "40 минут", price: "1400 руб." }
    ]
  }
];

const teamMembersData = [
  {
    name: "Екатерина Игнатова",
    role: "Владелица студии",
    description: "Основательница SOVA, эксперт по коррекции фигуры и массажным методикам.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const equipmentDefaultData = [
  {
    title: "Оборудование для LPG-массажа",
    description: "Передовая вакуумно-роликовая технология для глубокого лимфодренажа.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: "Безболезненно, Мощный лимфодренаж, Снятие отеков"
  }
];

const faqDefaultData = [
  {
    question: "Сколько процедур массажа или коррекции нужно для стойкого эффекта?",
    answer: "Для достижения выраженного и долгосрочного результата мы рекомендуем проходить процедуры курсом от 8 до 12 сеансов."
  }
];


export default function App() {
  const [currentView, setCurrentView] = useState('main');
  
  // Состояния данных
  const [heroData, setHeroData] = useState(defaultHero);
  const [massageServices, setMassageServices] = useState(massageServicesData);
  const [bodyShapingServices, setBodyShapingServices] = useState(bodyShapingServicesData);
  const [teamMembers, setTeamMembers] = useState(teamMembersData);
  const [equipmentData, setEquipmentData] = useState(equipmentDefaultData);
  const [faqData, setFaqData] = useState(faqDefaultData);
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
          if (doc.id === 'hero') setHeroData(doc.data());
          if (doc.id === 'massage') setMassageServices(doc.data().items);
          if (doc.id === 'body') setBodyShapingServices(doc.data().items);
          if (doc.id === 'team') setTeamMembers(doc.data().items);
          if (doc.id === 'equipment') setEquipmentData(doc.data().items);
          if (doc.id === 'faq') setFaqData(doc.data().items);
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

    // ССЫЛКА НА ВАШ ВЕБХУК ОТ MAKE.COM ИЛИ ALBATO:
    const WEBHOOK_URL = 'https://h.albato.ru/wh/38/1lfe1d5/tFKF5VOoV6uKRzCIoVGsXKbbiJC0r2s_3Viaz8Ef9oQ/';

    try {
      // 1. Сохраняем заявку в нашу базу Firebase (для админки)
      const docRef = await addDoc(collection(db, "bookings"), newBooking);
      setBookingsList([{ ...newBooking, id: docRef.id }, ...bookingsList]);
      setIsSubmitted(true);

      // 2. Отправляем радиосигнал для Google Календаря
      if (WEBHOOK_URL !== 'https://h.albato.ru/wh/38/1lfe1d5/tFKF5VOoV6uKRzCIoVGsXKbbiJC0r2s_3Viaz8Ef9oQ/') {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBooking)
        });
      }

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

  const toggleBookingStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'new' ? 'done' : 'new';
    try {
      await setDoc(doc(db, "bookings", id), { status: newStatus }, { merge: true });
      setBookingsList(bookingsList.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

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
    if (contentTab === 'hero') {
      setEditingItem(JSON.parse(JSON.stringify(heroData)));
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("Внимание! Размер фото больше 1 МБ. База данных может не сохранить файл. Рекомендуем сжать фото.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (contentTab === 'hero') {
           setEditingItem({ ...editingItem, bgImage: reader.result });
        } else {
           setEditingItem({ ...editingItem, image: reader.result });
        }
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
            <button onClick={() => handleEditClick(0)} className="bg-sky-500 text-white px-8 hover:bg-sky-600 font-medium py-3 rounded-xl transition-colors flex items-center justify-center">
              <Edit className="w-4 h-4 mr-2" /> Редактировать главный экран
            </button>
          </div>
        )
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataToRender.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="mb-4">
                {item.image && (
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 relative">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">
                  {item.title || item.category || item.name || item.question}
                </h3>
                <p className="text-sm text-stone-500 line-clamp-2">{item.description || item.answer || item.role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(idx)} className="flex-1 bg-sky-50 text-sky-600 hover:bg-sky-100 font-medium py-2 rounded-xl flex items-center justify-center text-sm">
                  <Edit className="w-4 h-4 mr-2" /> Изменить
                </button>
                <button onClick={() => handleDeleteItem(idx)} className="flex-none bg-white border border-stone-200 text-red-400 hover:bg-red-50 hover:text-red-500 font-medium px-3 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
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
            <a href="#" onClick={(e) => {e.preventDefault(); setCurrentView('main');}} className="text-sm text-stone-500 hover:text-sky-600">На сайт</a>
            <button onClick={() => setCurrentView('main')} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg transition-colors"><LogOut className="w-4 h-4" /> Выйти</button>
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
                <div><h2 className="text-3xl font-serif mb-2">Заявки с сайта</h2></div>
                <div className="text-sm bg-white border border-stone-200 px-4 py-2 rounded-lg shadow-sm">Всего заявок: <strong className="text-sky-600">{bookingsList.length}</strong></div>
              </div>
              {bookingsList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">Пока нет заявок.</div>
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
                          <span className="text-stone-800 font-medium">{booking.service}</span>
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
                {contentTab !== 'hero' && (
                  <button onClick={handleAddNewItem} className="bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Добавить элемент
                  </button>
                )}
              </div>

              {/* НАВИГАЦИЯ ПО РАЗДЕЛАМ САЙТА */}
              <div className="flex overflow-x-auto pb-2 border-b border-stone-200 mb-6 space-x-2 scrollbar-hide">
                {[
                  { id: 'hero', label: 'Главный экран' },
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
                    
                    {/* ЛЕВАЯ КОЛОНКА (Основные поля) */}
                    <div className="space-y-4">
                      {contentTab === 'hero' && (
                        <>
                          <div><label className="block text-sm font-medium mb-1">Бейдж (мелкий текст сверху)</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.badge} onChange={e => setEditingItem({...editingItem, badge: e.target.value})} /></div>
                          <div className="grid grid-cols-3 gap-2">
                            <div><label className="block text-sm font-medium mb-1">Заголовок 1</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.title1} onChange={e => setEditingItem({...editingItem, title1: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium text-sky-600 mb-1">Цветное слово</label><input type="text" className="w-full border border-sky-300 bg-sky-50 p-3 rounded-xl text-sm" value={editingItem.titleHighlight} onChange={e => setEditingItem({...editingItem, titleHighlight: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium mb-1">Заголовок 2</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.title2} onChange={e => setEditingItem({...editingItem, title2: e.target.value})} /></div>
                          </div>
                        </>
                      )}

                      {['massage', 'body', 'equipment'].includes(contentTab) && (
                        <div><label className="block text-sm font-medium mb-1">Заголовок / Название</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.title || editingItem.category || ''} onChange={e => setEditingItem(prev => prev.title !== undefined ? {...prev, title: e.target.value} : {...prev, category: e.target.value})} /></div>
                      )}

                      {contentTab === 'team' && (
                        <>
                          <div><label className="block text-sm font-medium mb-1">Имя сотрудника</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                          <div><label className="block text-sm font-medium mb-1">Должность</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.role} onChange={e => setEditingItem({...editingItem, role: e.target.value})} /></div>
                        </>
                      )}

                      {contentTab === 'faq' && (
                        <div><label className="block text-sm font-medium mb-1">Вопрос</label><input type="text" className="w-full border p-3 rounded-xl text-sm" value={editingItem.question} onChange={e => setEditingItem({...editingItem, question: e.target.value})} /></div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-1">{contentTab === 'faq' ? 'Ответ' : 'Описание'}</label>
                        <textarea className="w-full border p-3 rounded-xl text-sm min-h-[100px]" value={editingItem.description || editingItem.answer || ''} onChange={e => contentTab === 'faq' ? setEditingItem({...editingItem, answer: e.target.value}) : setEditingItem({...editingItem, description: e.target.value})} />
                      </div>

                      {contentTab === 'equipment' && (
                        <div><label className="block text-sm font-medium mb-1">Особенности (через запятую)</label><textarea className="w-full border p-3 rounded-xl text-sm" value={editingItem.features} placeholder="Детокс, Глубокое расслабление" onChange={e => setEditingItem({...editingItem, features: e.target.value})} /></div>
                      )}
                    </div>

                    {/* ПРАВАЯ КОЛОНКА (Фото или список подуслуг) */}
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

                      {/* Вложенные услуги (только для Массажа и Коррекции) */}
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
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-stone-600">
            <button onClick={() => scrollToSection('services')} className="hover:text-sky-500">Услуги и цены</button>
            <button onClick={() => scrollToSection('team')} className="hover:text-sky-500">Команда</button>
            <button onClick={() => scrollToSection('equipment')} className="hover:text-sky-500">Аппараты</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-sky-500">Вопрос-ответ</button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => openModal()} className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-medium"><Phone className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Записаться</span></button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative bg-stone-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroData.bgImage} alt="Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/80 to-transparent"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-6">{heroData.badge}</div>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6 leading-tight">
              {heroData.title1} <br/> <span className="text-sky-600">{heroData.titleHighlight}</span> {heroData.title2}
            </h2>
            <p className="text-lg text-stone-600 mb-10 leading-relaxed">{heroData.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollToSection('services')} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-full font-medium">Смотреть услуги</button>
              <button onClick={() => openModal()} className="bg-white border border-stone-200 px-8 py-3.5 rounded-full font-medium">Записаться на сеанс</button>
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
              <button onClick={() => setActiveTab('massage')} className={`px-8 py-3 rounded-full text-sm font-medium w-full sm:w-auto ${activeTab === 'massage' ? 'bg-white text-sky-600 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>Услуги массажа</button>
              <button onClick={() => setActiveTab('body')} className={`px-8 py-3 rounded-full text-sm font-medium w-full sm:w-auto mt-2 sm:mt-0 ${activeTab === 'body' ? 'bg-white text-sky-600 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>Коррекция фигуры</button>
            </div>
          </div>

          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'massage' ? massageServices : bodyShapingServices).map((item, idx) => {
               const IconComp = IconMap[item.iconName] || Sparkles;
               return (
                <div key={idx} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all flex flex-col group">
                  <div className="h-56 overflow-hidden relative">
                    <img src={item.image} alt={item.title || item.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent"></div>
                    {activeTab === 'massage' ? (
                      <h3 className="absolute bottom-4 left-6 right-6 text-white text-xl md:text-2xl font-serif leading-tight">{item.title}</h3>
                    ) : (
                      <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white"><IconComp className="w-6 h-6 text-white" /></div>
                        <h3 className="text-white text-xl md:text-2xl font-serif">{item.category}</h3>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-sm text-stone-500 mb-6 flex-1">{item.description}</p>
                    <ul className="space-y-4">
                      {item.items?.map((subItem, sIdx) => (
                        <li key={sIdx} className="flex flex-col border-t border-stone-100 pt-4 first:border-0 first:pt-0 gap-2">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <span className="text-sm font-medium text-stone-800 block">{subItem.name}</span>
                              {subItem.duration && <span className="text-stone-400 text-xs block mt-1"><Clock className="w-3.5 h-3.5 inline mr-1" />{subItem.duration}</span>}
                            </div>
                            <span className="text-sky-600 font-semibold whitespace-nowrap text-sm">{subItem.price}</span>
                          </div>
                          <button onClick={() => openModal(`${item.title || item.category} - ${subItem.name}`)} className="text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 py-2 px-4 rounded-xl w-fit">Записаться</button>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => openServiceDetails(item)} className="mt-6 w-full border border-sky-100 text-sky-600 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center">Подробнее <ArrowRight className="w-4 h-4 ml-1.5" /></button>
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
      <section id="contacts" className="py-20 bg-sky-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Готовы к преображению?</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-xl mx-auto border border-white/20">
            <div className="flex flex-col items-center justify-center mb-8 border-b border-white/10 pb-8">
              <div className="flex items-center justify-center space-x-2 text-sky-200 mb-1"><MapPin className="w-5 h-5" /><span className="uppercase tracking-wider text-sm">Наш адрес</span></div>
              <span className="text-xl font-light text-white text-center">проспект Музрукова д.37 к.3</span>
            </div>
            <a href="tel:+79101258250" className="group flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 shadow-lg"><Phone className="w-8 h-8 text-white" /></div>
              <span className="text-3xl md:text-4xl font-light text-white tracking-wide">+7 910-125-82-50</span>
            </a>
            <button onClick={() => openModal()} className="w-full bg-white text-sky-900 hover:bg-sky-50 font-medium py-3 rounded-full">Записаться онлайн</button>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <h1 className="text-2xl font-light text-white tracking-[0.2em] mb-1">SOVA</h1>
            <p className="text-xs uppercase tracking-wider mb-4">Студия массажа и коррекции фигуры</p>
            <button onClick={() => setCurrentView('adminLogin')} className="text-[10px] uppercase tracking-widest text-stone-600 hover:text-sky-500 flex items-center"><Lock className="w-3 h-3 mr-1" /> Вход для администратора</button>
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
                <form onSubmit={handleBookingSubmit} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Услуга</label>
                    <select className="w-full border p-3 rounded-xl text-sm bg-stone-50" value={selectedService} onChange={e => setSelectedService(e.target.value)}>
                      <option value="" disabled>Выберите услугу</option>
                      <optgroup label="Массаж">{massageServices.flatMap(s => s.items?.map(i => `${s.title} (${i.name})`) || []).map((n, i) => <option key={i} value={n}>{n}</option>)}</optgroup>
                      <optgroup label="Коррекция фигуры">{bodyShapingServices.flatMap(c => c.items?.map(i => `${c.category} - ${i.name}`) || []).map((n, i) => <option key={i} value={n}>{n}</option>)}</optgroup>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Имя</label><input required type="text" className="w-full border p-3 rounded-xl text-sm" value={bookingData.name} onChange={e => setBookingData({...bookingData, name: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Телефон</label><input required type="tel" className="w-full border p-3 rounded-xl text-sm" value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Дата</label><input required type="date" className="w-full border p-3 rounded-xl text-sm" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Время</label><input required type="time" className="w-full border p-3 rounded-xl text-sm" value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} /></div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3.5 rounded-xl mt-6 flex justify-center items-center">
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