const registerValidationSchema = {
    password: {
        isLength: {
            options: {
                min: 6,
                max: 32,
            },
            errorMessage: 'Password must be atleast 6 characters and max 32.'
        }
    }
}

module.exports = {
    registerValidationSchema,
}
