import React from 'react'
import { FiSettings, FiCamera, FiStar, FiEdit } from 'react-icons/fi';


function UserRating() {
  return (
    <div>  
        <div className="w-40 bg-blue-950 text-white h-auto m-3 p-1 rounded-md shadow-md flex flex-col items-center">
              <img
                src='https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
                alt="Profile"
                className="rounded-sm w-20 h-22 mt-2"
              />
              <div className="flex flex-row text-yellow-500 m-2 mt-3">
                <FiStar />
                <FiStar />
                <FiStar />
                <FiStar />
                <FiStar />
              </div>
            </div>
            </div>
  )
}

export default UserRating