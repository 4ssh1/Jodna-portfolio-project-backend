const jwt = require('jsonwebtoken')

const genAccessToken = (user)=>{
    return jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: "15m"
    }
)
}

const genRefreshToken = (user)=>{
    return jwt.sign({
        id: user_id,
        email: user.email
    }, process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: "7d"
    }
)
}

module.exports = {genAccessToken, genRefreshToken}

// write a function to regenerate token when it expires