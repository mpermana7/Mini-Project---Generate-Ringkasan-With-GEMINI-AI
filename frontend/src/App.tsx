import React, { useState, useEffect } from 'react';

interface Document {
  id?: string;
  title: string;
  category: string;
  content: string;
  ai_summary?: string;
  created_at?: string;
}

export default function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [form, setForm] = useState({ title: '', category: 'S1 Teknik Komputer', content: '' });
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/internal/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error("Gagal mengambil data dokumen:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    setLoading(true);

    try {
      const res = await fetch('/internal/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: '', category: 'S1 Teknik Komputer', content: '' });
        await fetchDocuments();
      }
    } catch (err) {
      console.error("Gagal mengirim dokumen:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans p-6">
      {/* Top Header Card dengan visualisasi 3D Neumorphic border tipis */}
      <header className="mb-8 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.04)] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mochamad Permana Ash Shidiq</h1>
          <p className="text-sm text-slate-500 font-medium">Web Developer / Fullstack Web Developer</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.1)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          MongoDB Active
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sisi Kiri: Form Input Dokumen */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.04)] h-fit">
          <h2 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
            📝 Input Berkas Akademik
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">Judul Dokumen</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Bab 2 Desain Konsep Solusi"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">Program Studi</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium text-slate-700"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="S1 Teknik Komputer">S1 Teknik Komputer</option>
                <option value="S1 Teknik Elektro">S1 Teknik Elektro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">Konten / Ringkasan Awal</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Tulis abstraksi atau isi draft skripsi di sini..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 transition-all duration-150 text-sm"
            >
              {loading ? 'Memproses Engine AI...' : 'Simpan & Trigger AI'}
            </button>
          </form>
        </div>

        {/* Sisi Kanan: Live Feed Tracker Data */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            📁 Berkas Terdaftar & AI Insights
          </h2>
          {documents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400 font-medium">
              Belum ada dokumen di MongoDB. Silakan tambahkan melalui form kiri.
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <h3 className="font-bold text-slate-900 text-base">{doc.title}</h3>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200/60">
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">{doc.content}</p>
                  
                  {/* AI Output Container Element */}
<div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-950 font-medium flex gap-2 items-start">
  <span className="text-base leading-none">✨</span>
  <div className="whitespace-pre-wrap wrap-break-word w-full"> {/* Pastikan class ini ada */}
    <span className="font-bold text-indigo-700 block mb-1">AI Engine Output:</span>
    {doc.ai_summary}
  </div>
</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
