const {expressjwt : expressJwt}= require('express-jwt');

function jwtBlock() {
    const secret = process.env.secret;
    return expressJwt({
        secret,
        algorithms:['HS256'],
        // isRevoked:adminUsers
        getToken: function fromHeaderOrQuerystring(req) {
            if (
              req.headers.authorization &&
              req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
              return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
              return req.query.token;
            }
            return null;
        },
        isRevoked:adminUsers
    }).unless({
        path:[
            {url:/\/public\/uploads(.*)/, methods:['GET','OPTIONS']},
            {url:/\/yyan\/api\/items(.*)/, methods:['GET','OPTIONS']},
            {url:/\/yyan\/api\/categories(.*)/, methods:['GET','OPTIONS']},
            '/yyan/api/users/login',
            '/yyan/api/users/register'
        ]
    })
}

async function adminUsers(req, token){
    console.log('AdminUsers check');
    if(!token.isAdmin){
        console.log('This user is not an adminUser');
        return false;
    }
    console.log("This user is  adminUser");
    return true;
    
}
module.exports = jwtBlock;