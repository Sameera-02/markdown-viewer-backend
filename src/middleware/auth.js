import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import 'dotenv/config'

const auth = async (req, res, next) => {
    try {
        console.log(req.header('Authorization'));
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.SECRET)
        const user = await User.findOne({_id: decoded, 'tokens.token' : token})

        if(!user){
            throw new Error('User')
        }

        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error: 'please authenticate'})
    }
}

export default auth