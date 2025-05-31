import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield, LogOut, User, FileText } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function Layout() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8" />
              <h1 className="text-2xl font-bold">HỆ THỐNG QUẢN LÝ ÁN PHẠT</h1>
            </div>
            
            {user && (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/ho-so" 
                  className="flex items-center space-x-2 hover:text-blue-200"
                >
                  <FileText className="w-5 h-5" />
                  <span>Hồ Sơ</span>
                </Link>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/quan-ly" 
                    className="flex items-center space-x-2 hover:text-blue-200"
                  >
                    <User className="w-5 h-5" />
                    <span>Quản Lý</span>
                  </Link>
                )}
                
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 hover:text-blue-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Được phát triển bởi Văn Phòng Thống Đốc nhằm hỗ trợ công tác xử án</p>
        </div>
      </footer>
    </div>
  );
}