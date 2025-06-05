import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import type { Offense } from '../types';

export function CasePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [suspectName, setSuspectName] = useState('');
  const [suspectId, setSuspectId] = useState('');
  const [selectedOffenses, setSelectedOffenses] = useState<Record<string, number>>({});
  const [offenses, setOffenses] = useState<Offense[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const offenseDetails = Object.entries(selectedOffenses).map(([id, count]) => {
        const offense = offenses.find(o => o.id === id);
        return {
          id,
          name: offense?.name || '',
          time: offense?.time || 0,
          count
        };
      });

      const totalTime = offenseDetails.reduce((sum, o) => sum + (o.time * o.count), 0);

      await supabase.from('cases').insert({
        suspect_name: suspectName,
        suspect_id: suspectId,
        officer_id: user.id,
        offenses: offenseDetails,
        total_time: totalTime,
        status: 'pending'
      });

      navigate('/ho-so');
    } catch (error) {
      console.error('Lỗi khi tạo hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tạo hồ sơ mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ tên người vi phạm
            </label>
            <input
              type="text"
              required
              value={suspectName}
              onChange={(e) => setSuspectName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số CCCD
            </label>
            <input
              type="text"
              required
              value={suspectId}
              onChange={(e) => setSuspectId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/ho-so')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="w-5 h-5 mr-2" />
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu hồ sơ'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}