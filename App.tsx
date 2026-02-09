import React, { useState, useCallback } from 'react';
import {
  LogOut, LayoutDashboard, Users, MapPin, UserCheck,
  ClipboardList, Lock, FileDown, FileText, Bell, Menu, X
} from 'lucide-react';
import { Location, Employee, User, AttendanceData, AuditLog, LockedPeriods, Page } from './types';
import { SEED_USERS, SEED_EMPLOYEES, LOCATIONS } from './constants';

// Vercel/Linux Build Hatasını Çözmek İçin Import Yolları Küçük Harfe Revize Edildi
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
  const [auditLog, setAuditLog] = useState<AuditLog[]>([]);

  const addAudit = useCallback((action: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: currentUser?.name || 'Sistem',
      action,
      details
    };
    setAuditLog(prev => [newLog, ...prev]);
  }, [currentUser]);

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} users={users} />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar ve Navigation */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#252f3c] text-white transition-all duration-300 flex flex-col shadow-xl`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-700/50">
          {sidebarOpen && <span className="font-bold text-xl tracking-tight text-blue-400">BİLGİN GRID</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-gray-700 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          <button onClick={() => setPage('dashboard')} className={`w-full flex items-center p-3 rounded-xl transition-all ${page === 'dashboard' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800'}`}>
            <LayoutDashboard size={20} className={page === 'dashboard' ? 'text-white' : 'text-gray-400'} />
            {sidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
          </button>
          
          <button onClick={() => setPage('puantaj')} className={`w-full flex items-center p-3 rounded-xl transition-all ${page === 'puantaj' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800'}`}>
            <ClipboardList size={20} className={page === 'puantaj' ? 'text-white' : 'text-gray-400'} />
            {sidebarOpen && <span className="ml-3 font-medium">Puantaj Matrisi</span>}
          </button>

          {isAdmin && (
            <>
              <button onClick={() => setPage('personel')} className={`w-full flex items-center p-3 rounded-xl transition-all ${page === 'personel' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800'}`}>
                <Users size={20} className={page === 'personel' ? 'text-white' : 'text-gray-400'} />
                {sidebarOpen && <span className="ml-3 font-medium">Personel Yönetimi</span>}
              </button>
              <button onClick={() => setPage('lokasyon')} className={`w-full flex items-center p-3 rounded-xl transition-all ${page === 'lokasyon' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800'}`}>
                <MapPin size={20} className={page === 'lokasyon' ? 'text-white' : 'text-gray-400'} />
                {sidebarOpen && <span className="ml-3 font-medium">Lokasyonlar</span>}
              </button>
              <button onClick={() => setPage('donemkilit')} className={`w-full flex items-center p-3 rounded-xl transition-all ${page === 'donemkilit' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800'}`}>
                <Lock size={20} className={page === 'donemkilit' ? 'text-white' : 'text-gray-400'} />
                {sidebarOpen && <span className="ml-3 font-medium">Dönem Kilidi</span>}
              </button>
            </>
          )}

          <button onClick={() => setPage('mikroexp')} className={`w-full flex items-center p-3 rounded-xl transition-all ${page === 'mikroexp' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800'}`}>
            <FileDown size={20} className={page === 'mikroexp' ? 'text-white' : 'text-gray-400'} />
            {sidebarOpen && <span className="ml-3 font-medium">Dışa Aktar</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <button onClick={() => setCurrentUser(null)} className="w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-all">
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3 font-medium">Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {currentUser.name[0]}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-none">{currentUser.name}</h1>
              <p className="text-sm text-gray-500 mt-1 capitalize">{currentUser.role} Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-[#fdfdfd]">
          <div className="max-w-[1700px] mx-auto">
            {page === 'dashboard' && <Dashboard locations={locations} employees={employees} attendance={attendance} auditLog={auditLog} isAdmin={isAdmin} currentUser={currentUser} />}
            {page === 'puantaj' && <PuantajPage employees={employees} locations={locations} isAdmin={isAdmin} currentUser={currentUser} attendance={attendance} setAttendance={setAttendance} lockedPeriods={lockedPeriods} addAudit={addAudit} />}
            {page === 'personel' && <PersonelPage employees={employees} setEmployees={setEmployees} locations={locations} isAdmin={isAdmin} currentUser={currentUser} addAudit={addAudit} />}
            {page === 'lokasyon' && <LokasyonPage locations={locations} setLocations={setLocations} users={users} addAudit={addAudit} />}
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