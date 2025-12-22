import { useState } from 'react';

// Simple fallback styles if you haven't copied Profile.css yet
interface ProfileProps {
  user: any;
}

export default function Profile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("I love my virtual pet! 🌱");

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-purple-400 to-blue-400"></div>

        <div className="px-8 pb-8">
          {/* Avatar Area */}
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                <div className="h-full w-full rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                  {user?.username?.charAt(0).toUpperCase() || '👤'}
                </div>
              </div>
              <div className="mb-1">
                <h2 className="text-2xl font-bold text-gray-800">{user?.username || 'User Name'}</h2>
                <p className="text-gray-500 text-sm">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Bio Section */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-6">
            <h3 className="font-bold text-gray-700 mb-2">About Me</h3>
            {isEditing ? (
              <div className="space-y-3">
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 outline-none"
                  rows={3}
                />
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed">{bio}</p>
            )}
          </div>

          {/* Stats/Achievements Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-xs text-blue-400 font-bold uppercase">Days Streak</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-xs text-green-400 font-bold uppercase">Moods Logged</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-600">Lvl 3</p>
              <p className="text-xs text-purple-400 font-bold uppercase">Friendship</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}