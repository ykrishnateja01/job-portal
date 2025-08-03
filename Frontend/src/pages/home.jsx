import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl">
        <h1 className="text-5xl font-bold mb-6">
          The Future of Job Hunting is Here
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Connect with opportunities using AI-powered matching and Web3 payments. 
          Join the next generation job portal.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/jobs" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Find Jobs
          </Link>
          <Link 
            to="/post-job" 
            className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Post Job
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-4">AI-Powered Matching</h3>
          <p className="text-gray-600">
            Our advanced AI analyzes your skills and matches you with the perfect opportunities.
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-green-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-4">Web3 Integration</h3>
          <p className="text-gray-600">
            Secure blockchain payments and decentralized job posting with minimal fees.
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-purple-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-4">Professional Network</h3>
          <p className="text-gray-600">
            Build connections, share insights, and grow your professional network.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white py-16 rounded-2xl">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-gray-300">Active Jobs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">5K+</div>
            <div className="text-gray-300">Companies</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-gray-300">Job Seekers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">95%</div>
            <div className="text-gray-300">Success Rate</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
