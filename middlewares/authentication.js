
const {validateToken} = require("../services/authentication")
function validateCookie(cookieName){  
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) { return next();}
        else {
        try {
            const payload = validateToken(tokenCookieValue);
            req.user = payload;
        } catch (error) {
            //console.log("Validate cookie toek failed", error);
        }
        return next();
        }
    }
}

module.exports = {validateCookie};