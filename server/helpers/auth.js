const bcrypt = require('bcrypt')


const hashPassword = (password) => {
    return new Promise ((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if(err) {
                reject(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

module.exports = {
    hashPassword,
    comparePassword,
    capitalizeFirstLetter,
}