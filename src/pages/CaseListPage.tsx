import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Case } from '../types';

export function CaseListPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      const { data } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      setCases(data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCases = cases.filter(
    (c) =>
      c.suspect_name.toLowerCase().includes(search.toLowerCase()) ||
      c.suspect_id.includes(search)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách hồ sơ</h1>
        <Link
          to="/ho-so/moi"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo hồ sơ mới
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc CCCD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCases.map((case_) => (
              <li key={case_.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {case_.suspect_name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">CCCD: {case_.suspect_id}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        case_.status === 'reviewed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {case_.status === 'reviewed' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(case_.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}