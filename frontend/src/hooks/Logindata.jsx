import React from "react";

export const GoogleSignIn = ()=>{

    const getUser = async()=>{
        try{
            const response = await axios.get('http://localhost:3000/auth/sucess' , {withCredentials:true});
            console.log("user data",response);
        }catch(err){
            console.log("Error in fetching user data",err);
        }
    }
    
 
}

