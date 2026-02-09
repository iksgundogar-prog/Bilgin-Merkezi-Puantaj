import { useState } from "react";
import { Role, User, AuditLog } from "./types";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import PuantajPage from "./components/PuantajPage";
import PersonelPage from "./components/PersonelPage";
import LokasyonPage from "./components/LokasyonPage";
import KullancPage from "./components/KullancPage";
import DonemKilitPage from "./components/DonemKilitPage";
import MikroExportPage from "./components/MikroExportPage";
import AuditLogPage from "./components/AuditLogPage";
import Sidebar from "./components/Sidebar";
import { LOCATIONS, USERS, INIT_EMPLOYEES } from "./data/seedData";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [locations, setLocations] = useState(LOCATIONS);
  const [employees, setEmployees] = useState(INIT_EMPLOYEES);
  const [users, setUsers] = useState(USERS);
  const [puantaj, setPuantaj] = useState({});
  const [lockedPeriods, setLockedPeriods] = useState<{ [key: string]: boolean }>({});
  const [auditLog, setAuditLog] = useState<AuditLog[]>([
    {
      id: 1,
      user: "sistem",
      action: "INIT",
      detail: "Sistem başlatıldı",
      time: new Date().toLocaleString("tr")
    }
  ]);
  const [page, setPage] = useState("dashboard");

  const addAudit = (action: string, detail: string) => {
    setAuditLog(prev => [
      {
        id: prev.length + 1,
        user: currentUser?.username || "sistem",
        action,
        detail,
        time: new Date().toLocaleString("tr")
      },
      ...prev
    ]);
  };

  const isAdmin = currentUser?.role === Role.ADMIN;
  const userLocationId = currentUser?.locationId;

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setPage("dashboard");
    addAudit("LOGIN", `${user.fullName} sisteme giriş yaptı`);
  };

  const handleLogout = () => {
    if (currentUser) {
      addAudit("LOGOUT", `${currentUser.fullName} sistemden çıkış yaptı`);
    }
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage users={users} onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        currentUser={currentUser}
        locations={locations}
        isAdmin={isAdmin}
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
      />
      <main style={{ flex: 1, padding: 28, overflowX: "auto", minWidth: 0, maxWidth: "100%" }}>
        {page === "dashboard" && (
          <Dashboard
            locations={locations}
            employees={isAdmin ? employees : employees.filter(e => e.locationId === userLocationId)}
            auditLog={auditLog}
            isAdmin={isAdmin}
            puantaj={puantaj}
            userLocationId={userLocationId}
          />
        )}
        {page === "puantaj" && (
          <PuantajPage
            employees={isAdmin ? employees : employees.filter(e => e.locationId === userLocationId)}
            locations={locations}
            isAdmin={isAdmin}
            puantaj={puantaj}
            setPuantaj={setPuantaj}
            lockedPeriods={lockedPeriods}
            addAudit={addAudit}
            userLocationId={userLocationId}
            currentUser={currentUser}
          />
        )}
        {page === "personel" && (
          <PersonelPage
            employees={employees}
            setEmployees={setEmployees}
            locations={locations}
            isAdmin={isAdmin}
            addAudit={addAudit}
            userLocationId={userLocationId}
          />
        )}
        {page === "lokasyon" && isAdmin && (
          <LokasyonPage locations={locations} setLocations={setLocations} addAudit={addAudit} />
        )}
        {page === "kullanici" && isAdmin && (
          <KullancPage users={users} setUsers={setUsers} locations={locations} addAudit={addAudit} />
        )}
        {page === "donemkilit" && isAdmin && (
          <DonemKilitPage lockedPeriods={lockedPeriods} setLockedPeriods={setLockedPeriods} addAudit={addAudit} />
        )}
        {page === "mikroexp" && isAdmin && (
          <MikroExportPage employees={employees} locations={locations} puantaj={puantaj} addAudit={addAudit} />
        )}
        {page === "auditlog" && isAdmin && <AuditLogPage auditLog={auditLog} />}
      </main>
    </div>
  );
}

export default App;
