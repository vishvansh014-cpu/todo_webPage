import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-between bg-blue-600 text-white py-2'>
        <div className='logo'>
            <span className='font-semibold text-2xl mx-8'>Task-X-Manager</span>
        </div>
        <ul className='flex gap-8 mx-8'>
            <li className='cursor-pointer hover:font-bold transition-all'>Home</li>
            <li className='cursor-pointer hover:font-bold transition-all'>today task</li>
        </ul>
    </nav>
  )
}

export default Navbar
