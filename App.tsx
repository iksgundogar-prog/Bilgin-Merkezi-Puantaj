
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  LogIn, LogOut, LayoutDashboard, Users, MapPin, UserCheck,
  ClipboardList, Lock, Unlock, FileDown, FileText, Bell, Search, Menu, X
} from 'lucide-react';
import { Role, Location, Employee, User, AttendanceData, AuditLog, LockedPeriods, Page } from './types';
import { SEED_USERS, SEED_EMPLOYEES, LOCATIONS } from './constants';
import Dashboard from './components/Dashboard';
import PuantajPage from './components/PuantajPage';
import PersonelPage from './components/PersonelPage';
import LokasyonPage from './components/LokasyonPage';
import KullancPage from './components/KullancPage';
import DonemKilitPage from './components/DonemKilitPage';
import MikroExportPage from './components/MikroExportPage';
import AuditLogPage from './components/AuditLogPage';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Master Data
  const [locations, setLocations] = useState<Location[]>(LOCATIONS);
  const [employees, setEmployees] = useState<Employee[]>(SEED_EMPLOYEES);
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [attendance, setAttendance] = useState<AttendanceData>({});
  const [lockedPeriods, setLockedPeriods] = useState<LockedPeriods>({});
  const [auditLog, setAuditLog] = useState<AuditLog[]>([
    { id: 1, user: "Sistem", action: "INIT", detail: "Sistem başlatıldı", time: new Date().toLocaleString("tr") }
  ]);

  const addAudit = useCallback((action: string, detail: string) => {
    setAuditLog(prev => [
      {
        id: prev.length + 1,
        user: currentUser?.username || "Misafir",
        action,
        detail,
        time: new Date().toLocaleString("tr")
      },
      ...prev
    ]);
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    addAudit("LOGIN", "Sisteme giriş yapıldı");
  };

  const handleLogout = () => {
    addAudit("LOGOUT", "Sistemden çıkış yapıldı");
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  const NAV_ITEMS = [
    { key: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { key: 'puantaj', label: 'PUANTAJ FORMU', icon: ClipboardList },
    { key: 'personel', label: 'PERSONEL YÖNETİMİ', icon: UserCheck },
    ...(isAdmin ? [
      { key: 'lokasyon', label: 'LOKASYONLAR', icon: MapPin },
      { key: 'kullanici', label: 'KULLANICILAR', icon: Users },
      { key: 'donemkilit', label: 'DÖNEM KİLİTLEME', icon: Lock },
      { key: 'mikroexp', label: 'MİKRO EXPORT', icon: FileDown },
      { key: 'auditlog', label: 'SİSTEM LOGLARI', icon: FileText },
    ] : [])
  ] as { key: Page, label: string, icon: any }[];

  if (!currentUser) {
    return <LoginPage users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen text-[#252F9C] overflow-hidden bg-[#fdfdfd]">
      {/* Sidebar */}
      <aside 
        className={`flex-shrink-0 transition-all duration-500 flex flex-col z-50 ${sidebarOpen ? 'w-80' : 'w-24'}`}
        style={{ background: "linear-gradient(180deg, #252F9C 0%, #1a237e 100%)" }}
      >
        <div className="h-24 flex items-center px-8 border-b border-white/5 bg-black/10">
          <div className="bg-[#7C1034] p-2.5 rounded-2xl shadow-xl shadow-black/20">
            <ClipboardList className="text-white w-9 h-9" />
          </div>
          {sidebarOpen && (
            <div className="ml-5 flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-white italic leading-none">BİLGİN</span>
              <span className="text-[8px] font-bold text-[#CFE5FF]/60 uppercase tracking-[0.4em] mt-1">Puantaj Merkezi</span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-10 px-5 space-y-3 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full flex items-center px-5 py-4.5 rounded-[1.5rem] transition-all duration-500 group relative ${
                page === item.key 
                  ? 'bg-[#7C1034] text-white shadow-2xl shadow-[#7C1034]/40 scale-[1.02]' 
                  : 'text-white/40 hover:bg-white/5 hover:text-[#CFE5FF]'
              }`}
            >
              <item.icon className={`w-6 h-6 flex-shrink-0 transition-transform ${page === item.key ? 'text-white' : 'group-hover:scale-110'}`} />
              {sidebarOpen && <span className="ml-5 font-black text-xs tracking-widest uppercase">{item.label}</span>}
              {page === item.key && sidebarOpen && (
                <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 bg-black/15">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {sidebarOpen && (
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#CFE5FF] flex items-center justify-center text-lg font-black text-[#252F9C] shadow-lg">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-white truncate">{currentUser.fullName}</span>
                  <span className="text-[9px] text-[#CFE5FF]/50 uppercase font-black tracking-widest">{currentUser.role}</span>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout} 
              className="p-4 text-white/30 hover:text-white hover:bg-[#7C1034] rounded-2xl transition-all shadow-sm"
              title="Güvenli Çıkış"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white/70 backdrop-blur-md border-b border-[#CFE5FF] flex items-center justify-between px-12 flex-shrink-0 z-40">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-4 text-[#252F9C] bg-[#CFE5FF]/30 hover:bg-[#CFE5FF] rounded-[1.25rem] transition-all"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex flex-col">
              <h2 className="text-sm font-black text-[#252F9C] uppercase tracking-[0.3em] leading-none mb-2">Merkezi Kontrol Paneli</h2>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                   {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sistem Aktif</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
             <div className="hidden md:flex flex-col text-right pr-8 border-r border-[#CFE5FF]">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">GÜNCEL TARİH</span>
                <span className="text-base font-black text-[#252F9C] uppercase">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
             </div>
             <div className="relative group">
                <div className="p-4 bg-[#CFE5FF]/30 rounded-[1.25rem] group-hover:bg-[#252F9C] group-hover:text-white transition-all cursor-pointer shadow-sm">
                  <Bell className="w-6 h-6 text-[#252F9C] group-hover:text-white" />
                  <span className="absolute top-3 right-3 w-3 h-3 bg-[#7C1034] rounded-full border-2 border-white animate-bounce"></span>
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-12 bg-[#fdfdfd] custom-scrollbar">
          <div className="max-w-[1700px] mx-auto">
            {page === 'dashboard' && <Dashboard locations={locations} employees={employees} attendance={attendance} auditLog={auditLog} isAdmin={isAdmin} currentUser={currentUser} />}
            {page === 'puantaj' && <PuantajPage employees={employees} locations={locations} isAdmin={isAdmin} currentUser={currentUser} attendance={attendance} setAttendance={setAttendance} lockedPeriods={lockedPeriods} addAudit={addAudit} />}
            {page === 'personel' && <PersonelPage employees={employees} setEmployees={setEmployees} locations={locations} isAdmin={isAdmin} currentUser={currentUser} addAudit={addAudit} />}
            {page === 'lokasyon' && <LokasyonPage locations={locations} setLocations={setLocations} users={users} addAudit={addAudit} />}
            {page === 'kullanici' && <KullancPage users={users} setUsers={setUsers} locations={locations} addAudit={addAudit} />}
            {page === 'donemkilit' && <DonemKilitPage lockedPeriods={lockedPeriods} setLockedPeriods={setLockedPeriods} addAudit={addAudit} />}
            {page === 'mikroexp' && <MikroExportPage employees={employees} locations={locations} attendance={attendance} addAudit={addAudit} />}
            {page === 'auditlog' && <AuditLogPage auditLog={auditLog} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
