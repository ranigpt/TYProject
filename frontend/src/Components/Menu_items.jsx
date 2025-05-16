import React from 'react'
import { MdDynamicFeed } from 'react-icons/md';
import { FiSettings, FiCamera, FiStar, FiEdit } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';


function Menu_items() {
  return (

    <>
 {/* Menu Items */}
        <div className="mt-4">
          <div className="m-2 w-44 flex items-center bg-base-100 hover:bg-blue-950 p-2 rounded-md hover:text-white">
            <MdDynamicFeed className="mr-2" />
            <h3>New Feed</h3>
          </div>
          <div className="m-2 w-44 flex items-center bg-base-100 hover:bg-blue-950 p-2 rounded-md hover:text-white">
            <FiCamera className="mr-2" />
            <h3>Media</h3>
          </div>
          <div className="m-2 w-44 flex items-center bg-base-100 hover:bg-blue-950 p-2 rounded-md hover:text-white">
            <FaEye className="mr-2" />
            <h3>Viewers</h3>
          </div>
          <div className="m-2 w-44 flex items-center bg-base-100 hover:bg-blue-950 p-2 rounded-md hover:text-white">
            <FiSettings className="mr-2" />
            <h3>Settings</h3>
          </div>
        </div>

        </>
  )
}

export default Menu_items