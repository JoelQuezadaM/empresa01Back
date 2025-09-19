import jwt from "jsonwebtoken"

export const generarJWT = (id)=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn: "90m",
    })
}