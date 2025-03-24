import './App.css'
import { Onboardly } from 'onboardly';
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Fake data for our dashboard
  const stats = [
    { id: 1, name: 'Total Users', value: '12,456', change: '+14%' },
    { id: 2, name: 'Active Sessions', value: '2,344', change: '+7.4%' },
    { id: 3, name: 'Conversion Rate', value: '24.5%', change: '+2.3%' },
    { id: 4, name: 'Avg. Time on Site', value: '3m 12s', change: '-0.5%' },
  ];
  
  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'completed onboarding', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'signed up', time: '15 minutes ago' },
    { id: 3, user: 'Robert Johnson', action: 'upgraded plan', time: '1 hour ago' },
    { id: 4, user: 'Emily Davis', action: 'submitted feedback', time: '3 hours ago' },
    { id: 5, user: 'Michael Wilson', action: 'invited team member', time: '5 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 1. Header with navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-xl font-bold text-indigo-600">Onboardly Dashboard</div>
              <Onboardly className="ml-2 text-gray-500 text-sm" />
            </div>
            <nav className="flex space-x-8">
              {['dashboard', 'analytics', 'settings', 'help'].map((tab) => (
                <button
                  key={tab}
                  className={`px-1 py-2 text-sm font-medium ${
                    activeTab === tab 
                      ? 'border-b-2 border-indigo-500 text-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 2. Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 truncate">{stat.name}</div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</div>
                  </div>
                  <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Chart Visualization (mocked with colored bars) */}
        <div className="bg-white p-6 shadow rounded-lg mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly User Engagement</h2>
          <div className="h-64 flex items-end space-x-2">
            {[40, 65, 50, 80, 75, 90, 60].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-indigo-500 rounded-t" 
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Recent Activity Feed */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <p className="mt-1 text-sm text-gray-500">Latest actions from your users</p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-indigo-800 text-sm font-bold">
                          {activity.user.split(' ').map(name => name[0]).join('')}
                        </span>
                      </div>
                      <p className="ml-3 text-sm font-medium text-gray-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">{activity.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. Footer */}
        <footer className="bg-white shadow rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-500">© 2023 Onboardly. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Support</span>
                <span className="text-sm">Support</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Contact</span>
                <span className="text-sm">Contact</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy</span>
                <span className="text-sm">Privacy</span>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
