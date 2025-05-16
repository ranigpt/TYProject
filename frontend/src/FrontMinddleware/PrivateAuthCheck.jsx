
import React from 'react'

function PrivateAuthCheck({children}) {

    const token = localStorage.getItem('token');

    if(!token){
        return <div>
            <h1>You need to login</h1>
        </div>
    }
  
    return <>{children}</>
}

export default PrivateAuthCheck