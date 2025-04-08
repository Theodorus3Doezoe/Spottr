const User = require('../models/user')
const { hashPassword, comparePassword, capitalizeFirstLetter } = require ('../helpers/auth')
const jwt = require('jsonwebtoken')
const { differenceInYears, parseISO, isValid } = require('date-fns');
const validator = require('validator')


// Register endpoint
const registerUser = async (req, res) => {

    const MINIMUM_AGE = 18; // Stel hier de minimumleeftijd in

    try {
        const {name, surname, email, password, passwordConfirm, birthdate} = req.body

        if (!name || !email || !password || !birthdate) {
            return res.json({ error: 'All fields must be filled in' });
        }

        // Check email
        const exist = await User.findOne({email})
        if(exist) {
            return res.json ({
                error: 'Email is already taken'
            })
        }

        if(!validator.isEmail(email)) {
            return res.json({ error: 'Enter a valid Email' })
        }

        // Check password
        if (password != passwordConfirm) {
            return res.json({ error: 'Passwords dont match'})
        }

        if (!validator.isStrongPassword(password, {
            minLength: 6,              
            minUppercase: 1,       
            minNumbers: 0,         
            minSymbols: 1          
        })) {
            return res.json({ error: 'Password must be atleast 6 characters long and contain an uppercase letter and symbol'})
        }


        // Check age
        let age;
        try {
            // Probeer de ontvangen 'YYYY-MM-DD' string om te zetten naar een Date object
            const birthDateObj = parseISO(birthdate);
    
            // Controleer of de omgezette datum geldig is
            if (!isValid(birthDateObj)) {
                return res.json({ error: 'Invalid date of birth format or invalid date' })
            }
    
            // Bereken de leeftijd
            const today = new Date();
            age = differenceInYears(today, birthDateObj);
    
            // Controleer de leeftijd
            if (age < MINIMUM_AGE) {
                // Te jong: stuur een duidelijke foutmelding
                return res.json({ error: 'You have to be atleast 18 to register' })
            }
    
        } catch (parseError) {
            // Fout tijdens het parsen van de datum string (zou niet snel moeten gebeuren met type="date")
            console.error("Error parsing birthdate on backend registration:", parseError);
            return res.json({ error: 'Kon geboortedatum niet verwerken.' })
        }

        const formattedName = capitalizeFirstLetter(name);
        const formattedSurname = capitalizeFirstLetter(surname);

        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name: formattedName,
            surname: formattedSurname,
            email,
            password: hashedPassword,
            birthdate,
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password) {
            return res.json({ error: 'All fields must be filled in' })
        }

        // Check if user exists
        const user = await User.findOne({email})

        if(!validator.isEmail(email)) {
            return res.json({ error: 'Enter a valid Email' })
        }

        if(!user) {
            return res.json({
                error: 'No user found'
            })
        }

        // Check if passwords match
        const match = await comparePassword(password, user.password)

        if(match) {
            jwt.sign({id: user._id}, process.env.JWT_SECRET, {}, (err, token) => {
                if(err) throw err
                res.cookie('token', token).json({token: token})
            })
        }
        if(!match) {
            res.json({
                error: 'Passwords do not match'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const getProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedPayload) => { // Hernoemd naar decodedPayload voor duidelijkheid
        if (err) {
           console.error("JWT Verification Error:", err);
           return res.status(401).json({ error: 'Token invalid or expired' }); // Stuur een error status
        }
        try {
          // Gebruik het ID uit de token payload om de gebruiker in de DB te zoeken
          const fullUser = await User.findById(decodedPayload.id).select('-password'); // Exclusief wachtwoord
          if (!fullUser) {
            return res.status(404).json({ error: 'User not found' });
          }
            // --- Start Leeftijd Berekening ---
        let age = null; // Initialiseer leeftijd (bv. als null als het niet berekend kan worden)

        if (fullUser.birthdate) { // Check 1: Bestaat de geboortedatum in het gebruikersobject?
          try {
            // Probeer de geboortedatum te parsen.
            // Controleer of het een string is (voor parseISO) of al een Date object.
            const birthDateObj = (typeof fullUser.birthdate === 'string')
                                ? parseISO(fullUser.birthdate)
                                : (fullUser.birthdate instanceof Date ? fullUser.birthdate : null);

            if (birthDateObj && isValid(birthDateObj)) { // Check 2: Is het een geldige Date na parsen/checken?
              const today = new Date();
              const calculatedAge = differenceInYears(today, birthDateObj);
              age = calculatedAge; // Zet de berekende leeftijd
            } else {
              // Optioneel: Log als de geboortedatum ongeldig is
              console.log(`Invalid or unparseable birthdate for user ${fullUser._id}:`, fullUser.birthdate);
            }
          } catch (parseError) {
            // Optioneel: Log als er een fout optreedt tijdens het parsen
            console.error(`Error parsing birthdate for user ${fullUser._id}:`, parseError);
          }
        }
        const userObject = fullUser.toObject();

        // Voeg de berekende leeftijd toe aan het object dat wordt teruggestuurd
        userObject.age = age;

        // Stuur het volledige gebruikersobject INCLUSIEF de berekende leeftijd
        res.json(userObject)
        } catch (dbError) {
          console.error("Database lookup error:", dbError);
          res.status(500).json({ error: 'Could not retrieve profile' });
        }
      });
    } else {
      res.json(null); // Of stuur res.status(401).json({ error: 'No token provided' });
    }
  };

const logoutUser = (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({error: 'Failed to logout'})
            } else {
                res.clearCookie('token', {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                })
                res.status(200).json("Logout successfull")
            }
        })
    } else {
        res.status(400).json({error: 'No session found'})
    }
}

const updateProfile = (req, res) => {
    // 1. Haal token op uit cookies
    const { token } = req.cookies;

    // 2. Check of token bestaat
    if (token) {
        // 3. Verifieer het token
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedPayload) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                // Stuur duidelijke error terug bij ongeldig/verlopen token
                return res.status(401).json({ error: 'Authenticatie mislukt (token ongeldig/verlopen)' });
            }

            // Token is geldig, haal gebruikers ID eruit
            const userId = decodedPayload.id;

            // 4. Haal de te updaten data uit de request body
            const { bio, gender, lookingFor, sportLabels, personalLabels /*, photos */ } = req.body;

            // 5. Bouw het update-object alleen met de velden die zijn meegegeven
            const updateData = {};
            if (bio !== undefined) updateData.bio = bio;
            if (gender !== undefined) updateData.gender = gender;
            if (lookingFor !== undefined) updateData.lookingFor = lookingFor;
            if (sportLabels !== undefined) updateData.sportLabels = sportLabels;
            if (personalLabels !== undefined) updateData.personalLabels = personalLabels;
            // if (photos !== undefined) updateData.photos = photos; // Voor later

            updateData.profileSetup = true;
            // Check of er data is om te updaten
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'Geen profielgegevens meegegeven om bij te werken.' });
            }

            // 6. Probeer de gebruiker te vinden en bij te werken in de database
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    updateData,
                    {
                        new: true,           // Geef het *bijgewerkte* document terug
                        runValidators: true, // ESSENTIEEL: Voer schema validaties uit!
                        context: 'query'
                    }
                ).select('-password'); // Zorg dat wachtwoord nooit wordt teruggestuurd

                // Check of de gebruiker wel gevonden werd tijdens de update
                if (!updatedUser) {
                    // Dit kan gebeuren als de user ID uit het token geldig was,
                    // maar de gebruiker intussen is verwijderd.
                    return res.status(404).json({ error: 'Gebruiker niet gevonden tijdens update.' });
                }

                // 7. Stuur succesbericht en bijgewerkte gebruiker terug
                res.status(200).json({
                    message: 'Profiel succesvol bijgewerkt.',
                    user: updatedUser // Frontend kan hiermee state bijwerken
                });

            } catch (dbError) {
                // 8. Handel database/validatie fouten af
                console.error("Error updating profile in DB:", dbError);

                if (dbError instanceof mongoose.Error.ValidationError) {
                    // Specifieke validatiefouten
                    const errors = Object.values(dbError.errors).map(el => el.message);
                    return res.status(400).json({ error: 'Validatiefout bij opslaan profiel.', details: errors });
                }

                // Algemene server/database fout
                res.status(500).json({ error: 'Kon profiel niet bijwerken in de database.' });
            }
        });
    } else {
        // 9. Geen token gevonden in cookies
        return res.status(401).json({ error: 'Authenticatie mislukt (geen token gevonden)' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    updateProfile,
}