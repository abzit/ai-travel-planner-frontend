import { Plane, Home, Utensils, Ticket } from 'lucide-react';

export default function BudgetSummary({ budget, currencySymbol = '$' }) {
  if (!budget) return null;

  const items = [
    { label: 'Flights', value: budget.flights, icon: Plane, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Accommodation', value: budget.accommodation, icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Food & Dining', value: budget.food, icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Activities', value: budget.activities, icon: Ticket, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        Estimated Budget
      </h2>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${item.bg} ${item.color} mr-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">{item.label}</span>
              </div>
              <span className="font-bold text-slate-900">{currencySymbol}{item.value?.toLocaleString() || 0}</span>
            </div>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-slate-200">
          <div className="flex justify-between items-center bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <span className="text-lg font-bold text-indigo-900">Total Estimated Cost</span>
            <span className="text-2xl font-black text-indigo-600">{currencySymbol}{budget.total?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
