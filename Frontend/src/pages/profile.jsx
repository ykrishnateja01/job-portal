// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Component/auth.jsx';
import { useWeb3 } from '../Component/web3.jsx'; // or ../Component/Web3Provider.jsx if that's your filename

const Profile = () => {
  const { user, updateUser } = useAuth();
  const {
    account,
    walletType,
    isConnected,
    connectMetaMask,
    connectPhantom,
    disconnect
  } = useWeb3();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    linkedinUrl: user?.linkedinUrl || '',
    walletAddress: user?.walletAddress || '',
    skills: user?.skills?.map(s => s.name).join(', ') || ''
  });
  const [loading, setLoading] = useState(false);

  // When wallet is connected during editing, update walletAddress field
  useEffect(() => {
    if (editing && isConnected && account) {
      setFormData(prev => ({
        ...prev,
        walletAddress: account
      }));
    }
  }, [isConnected, account, editing]);

  // When user prop changes (login, update), sync form fields
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      linkedinUrl: user?.linkedinUrl || '',
      walletAddress: user?.walletAddress || '',
      skills: user?.skills?.map(s => s.name).join(', ') || ''
    });
  }, [user]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => ({
          name: skill.trim(),
          level: 'Intermediate'
        }))
        .filter(s => s.name.length > 0);

      const payload = {
        name: formData.name,
        bio: formData.bio,
        linkedinUrl: formData.linkedinUrl,
        walletAddress: formData.walletAddress,
        walletType: walletType || user?.walletType || '',
        skills: skillsArray
      };

      const res = await axios.put('http://localhost:3000/api/users/me', payload);
      updateUser(res.data);
      alert('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  // ----- Card View -----
  if (!editing) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-6 bg-white rounded shadow-lg">
        <h1 className="text-3xl font-semibold mb-6">Your Profile</h1>
        <div className="space-y-6 text-gray-800">
          <div>
            <span className="font-medium">Full Name:</span>
            <span className="ml-2">{user?.name}</span>
          </div>
          <div>
            <span className="font-medium">Bio:</span>
            <span className="ml-2">{user?.bio || '—'}</span>
          </div>
          <div>
            <span className="font-medium">LinkedIn:</span>
            <a
              href={user?.linkedinUrl}
              className="ml-2 text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {user?.linkedinUrl || '—'}
            </a>
          </div>
          <div>
            <span className="font-medium">Skills:</span>
            <span className="ml-2">
              {(user?.skills && user.skills.length)
                ? user.skills.map(s => s.name).join(', ')
                : '—'}
            </span>
          </div>
          <div>
            <span className="font-medium">Wallet Address:</span>
            <span className="ml-2">
              {user?.walletAddress || '—'}
              {user?.walletType && user.walletAddress && (
                <span className="ml-2 text-xs text-gray-500">
                  ({user.walletType.charAt(0).toUpperCase() + user.walletType.slice(1)})
                </span>
              )}
            </span>
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="mt-8 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    );
  }

  // ----- Edit Form View -----
  return (
    <div className="max-w-2xl mx-auto py-10 px-6 bg-white rounded shadow-lg">
      <h1 className="text-3xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">LinkedIn URL</label>
          <input
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Skills (comma separated)</label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            type="text"
            placeholder="JavaScript, React, Node.js"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Wallet Address</label>
          <input
            name="walletAddress"
            value={formData.walletAddress}
            readOnly
            placeholder="Connect your MetaMask / Phantom wallet"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 flex space-x-2">
            {!isConnected ? (
              <>
                <button
                  type="button"
                  onClick={connectMetaMask}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Connect MetaMask
                </button>
                <button
                  type="button"
                  onClick={connectPhantom}
                  className="bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Connect Phantom
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={disconnect}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Disconnect Wallet
              </button>
            )}
            {isConnected && (
              <span className="text-green-700 text-sm ml-2">
                Connected {walletType}: {account}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="bg-gray-300 text-gray-800 py-2 px-6 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
