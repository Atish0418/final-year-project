import { Outlet, ScrollRestoration, Navigate, NavLink } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ShieldCheck, LogOut, Layers, Workflow, Briefcase, HelpCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const AdminLayout = () => {
  const auth = useAuthStore();
  if (!auth.user) {
    return <Navigate to="/admin/login" replace />;
  }
  if (auth.user.email?.toLowerCase() !== "admin@career.com") {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen bg-[#D5D3C8] text-gray-800">
      <header className="border-b border-gray-200 bg-gray-50/80 backdrop-blur-xl">
      <div className="page-container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">FuturePath 3D</div>
              <div className="text-xs text-gray-500">Admin Console</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Button variant="ghost" className="h-9 px-3" onClick={() => auth.signOut()}>
              <LogOut size={16} className="mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="grid lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-gray-200 bg-white/80 backdrop-blur p-4 hidden lg:block">
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50 ${isActive ? "bg-gray-100 text-gray-900" : ""}`
              }
            >
              <ShieldCheck size={16} />
              Overview
            </NavLink>
            <NavLink
              to="/admin/streams"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50 ${isActive ? "bg-gray-100 text-gray-900" : ""}`
              }
            >
              <Layers size={16} />
              Streams
            </NavLink>
            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50 ${isActive ? "bg-gray-100 text-gray-900" : ""}`
              }
            >
              <Workflow size={16} />
              Departments
            </NavLink>
            <NavLink
              to="/admin/jobs"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50 ${isActive ? "bg-gray-100 text-gray-900" : ""}`
              }
            >
              <Briefcase size={16} />
              Jobs
            </NavLink>
            <NavLink
              to="/admin/quiz"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50 ${isActive ? "bg-gray-100 text-gray-900" : ""}`
              }
            >
              <HelpCircle size={16} />
              Quiz
            </NavLink>
          </div>
        </aside>
        <main className="p-4 lg:p-8">
          {/* Mobile nav */}
          <div className="lg:hidden mb-4 grid grid-cols-2 gap-2 text-xs">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 border border-gray-200 text-center ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"}`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/admin/streams"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 border border-gray-200 text-center ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"}`
              }
            >
              Streams
            </NavLink>
            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 border border-gray-200 text-center ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"}`
              }
            >
              Departments
            </NavLink>
            <NavLink
              to="/admin/jobs"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 border border-gray-200 text-center ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"}`
              }
            >
              Jobs
            </NavLink>
            <NavLink
              to="/admin/quiz"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 border border-gray-200 text-center ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"}`
              }
            >
              Quiz
            </NavLink>
          </div>
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </div>
  );
};

export default AdminLayout;
