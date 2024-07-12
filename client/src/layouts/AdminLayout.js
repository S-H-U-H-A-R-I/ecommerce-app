import React from'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className='flex h-screen bg-custom-gray text-white'>
        {/* Sidebar */}
        <div className='w-64 bg-opacity-50 backdrop-blur-lg overflow-y-auto'>
            <div className='p-4'>
                <h1 className='text-2xl font-bold mb-4 text-center'>Admin Dashboard</h1>
                <nav>
                    <ul>
                        <li className='mb-2'>
                            <Link to="/admin" className='block p-2 hover:bg-custom-gray-2 rounded'>Dashboard</Link>
                        </li>
                        <li className='mb-2'>
                            <Link to="/admin/products" className='block p-2 hover:bg-custom-gray-2 rounded'>Products</Link>
                        </li>
                        {/* Add more links here */}
                    </ul>
                </nav>
            </div>
        </div>
        {/* Main Content */}
        <div className='flex-1 flex flex-col h-screen'>
            {/* header */}
            <header className=' bg-opacity-50 backdrop-blur-lg p-4'>
                <div className='flex justify-end'>
                    <div className='flex items-center'>
                        <span className='mr-2'>Admin</span>
                        <img src="/profile.png" alt="profile" className='w-8 h-8 rounded-full'></img>
                    </div>
                </div>
            </header>
            {/* Page Content */}
            <main className='flex-1 p-6 overflow-y-auto border-t border-l border-custom-gray-2 rounded-tl-2xl bg-custom-black'>
                {children}
            </main>
        </div>
    </div>
  );
};

export default AdminLayout;