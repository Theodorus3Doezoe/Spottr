const User = require('../models/user')
const { hashPassword, comparePassword, capitalizeFirstLetter } = require ('../helpers/auth')
const jwt = require('jsonwebtoken')
const { subYears, startOfDay, endOfDay, differenceInYears, isValid, parseISO } = require('date-fns');
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
            const { bio, gender, lookingFor, sportLabels, personalLabels, maxDistance, minAge, maxAge, showMePreference } = req.body;

            // 5. Bouw het update-object alleen met de velden die zijn meegegeven
            const updateData = {};
            if (bio !== undefined) updateData.bio = bio;
            if (gender !== undefined) updateData.gender = gender;
            if (lookingFor !== undefined) updateData.lookingFor = lookingFor;
            if (sportLabels !== undefined) updateData.sportLabels = sportLabels;
            if (personalLabels !== undefined) updateData.personalLabels = personalLabels;
            if (maxDistance !== undefined) updateData.maxDistance = maxDistance;
            if (minAge !== undefined) updateData.minAge = minAge;
            if (maxAge !== undefined) updateData.maxAge = maxAge;
            if (showMePreference !== undefined) updateData.showMePreference = showMePreference;
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

const MATCH_LIMIT = 20;

const getPotentialMatches = async (req, res) => {
    // --- START AUTH CHECK (Cookie-based, zoals je eerder gebruikte) ---
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Authenticatie mislukt (geen token gevonden)' });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedPayload) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return res.status(401).json({ error: 'Authenticatie mislukt (token ongeldig/verlopen)' });
        }

        const userId = decodedPayload.id;
        // --- EINDE AUTH CHECK ---

        try {
            // 1. Haal currentUser op (SELECTEER ALLE BENODIGDE VELDEN!)
            const currentUser = await User.findById(userId)
                .select(
                    'name surname email birthdate gender profileSetup ' + // Basis & Check velden
                    'likedUserIds dislikedUserIds ' + // Voor swiped check
                    'showMePreference minAge maxAge maxDistance' // <<< Directe voorkeursvelden HIER SELECTEREN
                );

            if (!currentUser) { return res.status(401).json({ error: 'Authenticatie mislukt (gebruiker niet gevonden).' }); }
            if (!currentUser.profileSetup) { return res.status(400).json({ message: 'Maak eerst je profiel compleet.' }); }


            // 2. Haal voorkeuren DIRECT van currentUser op
            const {
                showMePreference, // = currentUser.showMePreference
                minAge,           // = currentUser.minAge
                maxAge,           // = currentUser.maxAge
                maxDistance,      // = currentUser.maxDistance
                gender: currentUserGender // = currentUser.gender
            } = currentUser; // Haal direct uit currentUser, niet uit .preferences

             // Check of voorkeuren zijn ingesteld (voeg evt maxDistance check toe)
            if (showMePreference === undefined || minAge === undefined || maxAge === undefined /*|| maxDistance === undefined*/) {
                return res.status(400).json({ message: 'Noodzakelijke matching voorkeuren zijn niet ingesteld.' });
            }

            // 3. Bereken geboortedatum range
            const today = new Date();
            const minAgePref = parseInt(minAge, 10) || 18;
            const maxAgePref = parseInt(maxAge, 10) || 99;
            const latestBirthDate = endOfDay(subYears(today, minAgePref));
            const earliestBirthDate = startOfDay(subYears(today, maxAgePref + 1));

            // 4. Haal geswipede IDs op
            const swipedUserIds = [
                ...(currentUser.likedUserIds || []),
                ...(currentUser.dislikedUserIds || [])
            ];

            // 5. Bouw de MongoDB Query
            const query = {
                _id: { $ne: userId, $nin: swipedUserIds },
                birthdate: { $gte: earliestBirthDate.toISOString(), $lte: latestBirthDate.toISOString() },
                profileSetup: true // Gebruik de juiste veldnaam
            };

            // 6. Gender Filter (huidige gebruiker zoekt specifiek gender)
            if (showMePreference && showMePreference !== 'Everyone') {
                query.gender = showMePreference.toLowerCase() === 'women' ? 'female' : 'male';
            }

            // --- Wederzijdse Gender Check (AANGEPAST!) ---
            // Check nu direct het 'showMePreference' veld van de andere gebruiker
            const genderMatchConditions = [];
            if (currentUserGender === 'male') {
                 // Zoek anderen wiens directe 'showMePreference' veld 'Men' of 'Everyone' is
                 genderMatchConditions.push({ showMePreference: { $in: ['Men', 'Everyone'] } });
            } else if (currentUserGender === 'female') {
                 // Zoek anderen wiens directe 'showMePreference' veld 'Women' of 'Everyone' is
                genderMatchConditions.push({ showMePreference: { $in: ['Women', 'Everyone'] } });
            }

            if (query.gender && genderMatchConditions.length > 0) {
                 query.$and = [{ gender: query.gender }, ...genderMatchConditions];
                 delete query.gender;
            } else if (genderMatchConditions.length > 0){
                  query.$and = genderMatchConditions;
            }
            // ---------------------------------------------

            // 7. Afstandsfilter (weggelaten zoals eerder gevraagd, anders hier toevoegen met currentUser.maxDistance)
            // if (currentUser.location && currentUser.location.coordinates && maxDistance !== undefined) { ... }

            console.log("DEBUG: Final MongoDB Query (direct fields):", JSON.stringify(query, null, 2));

            // 8. Voer query uit
            const potentialMatches = await User.find(query)
                .limit(MATCH_LIMIT)
                .select('name surname bio birthdate gender photos sportLabels personalLabels') // Selecteer publieke velden
                .lean();

            // 9. Bereken leeftijd
            const matchesWithAge = potentialMatches.map(match => {
                let age = null;
                if (match.birthdate) {
                    try {
                        const birthDateObj = typeof match.birthdate === 'string' ? parseISO(match.birthdate) : match.birthdate;
                        if (isValid(birthDateObj)) {
                             age = differenceInYears(today, birthDateObj);
                        }
                    } catch { /* ignore */ }
                }
                return { ...match, age };
            });


            console.log(`DEBUG: Found ${matchesWithAge.length} potential matches.`);
            res.status(200).json({ matches: matchesWithAge });

        } catch (error) {
            console.error("Error fetching potential matches (after auth):", error);
            res.status(500).json({ message: 'Serverfout bij ophalen van matches.' });
        }
    }); // Einde jwt.verify callback
};

const matchAction = async (req, res) => {
    // --- START AUTH CHECK (Cookie-based) ---
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Authenticatie mislukt (geen token gevonden)' });
    }

    // Verifieer het token
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedPayload) => {
        // Callback is async omdat we database calls doen
        if (err) {
            console.error("JWT Verification Error in Swipe Action:", err);
            return res.status(401).json({ error: 'Authenticatie mislukt (token ongeldig/verlopen)' });
        }

        // Token is geldig, we hebben de user ID (van de swiper)
        const swiperId = decodedPayload.id; // <<< Gebruik ID uit token payload
        // --- EINDE AUTH CHECK ---

        // --- START SWIPE LOGIC (binnen de verify callback) ---
        try {
            // Haal data uit de request body
            const { targetUserId, action } = req.body;

            // Validatie van de input data
            if (!targetUserId || !action || !['like', 'dislike'].includes(action)) {
                return res.status(400).json({ message: 'Ongeldige input: targetUserId en action (like/dislike) zijn verplicht.' });
            }
            // Voorkom dat gebruiker zichzelf swipet
            if (swiperId === targetUserId) {
                return res.status(400).json({ message: 'Je kunt niet op jezelf swipen.' });
            }

            // 1. Update de lijsten van de swiper (huidige gebruiker)
            let updateSwiperData;
            if (action === 'like') {
                updateSwiperData = {
                    $addToSet: { likedUserIds: targetUserId }, // Voeg toe aan likes
                    $pull: { dislikedUserIds: targetUserId }    // Verwijder uit dislikes
                };
            } else { // action === 'dislike'
                updateSwiperData = {
                    $addToSet: { dislikedUserIds: targetUserId }, // Voeg toe aan dislikes
                    $pull: { likedUserIds: targetUserId }      // Verwijder uit likes
                };
            }

            // Voer de update uit op de swiper
            const updatedSelf = await User.findByIdAndUpdate(swiperId, updateSwiperData, { new: true }); // new: true is optioneel hier
            if (!updatedSelf) {
                // Dit zou niet vaak moeten gebeuren als het token net geldig was
                console.error(`Swipe Action: Swiper user ${swiperId} niet gevonden voor update.`);
                // Misschien toch doorgaan met de response? Anders blijft frontend hangen.
            }
             console.log(`Swipe Action: ${action} from ${swiperId} to ${targetUserId} recorded on swiper.`);


            // 2. Check op wederzijdse match (alleen nodig bij een 'like')
            let mutualMatch = false;
            if (action === 'like') {
                // Zoek de target user op en kijk alleen naar zijn/haar likedUserIds
                const targetUser = await User.findById(targetUserId).select('likedUserIds');

                // Check of de swiperId in de likedUserIds van de targetUser staat
                // Gebruik optional chaining (?.) voor het geval targetUser niet gevonden wordt
                if (targetUser?.likedUserIds?.includes(swiperId)) {
                    mutualMatch = true;
                    console.log(`MATCH! ${swiperId} and ${targetUserId}`);
                    try {
                        console.log(`Recording match in both user documents...`);
                        // Voeg target toe aan swiper's match lijst
                        await User.findByIdAndUpdate(swiperId, {
                            $addToSet: { matchedUserIds: targetUserId }
                        });
                        // Voeg swiper toe aan target's match lijst
                        await User.findByIdAndUpdate(targetUserId, {
                            $addToSet: { matchedUserIds: swiperId }
                        });
                        console.log(`Match recorded successfully.`);
                        // HIER IS OOK EEN GOED MOMENT VOOR REAL-TIME NOTIFICATIES (bv. WebSockets)
                    } catch (matchSaveError) {
                        // Fout bij het opslaan van de match zelf, maar de swipe is wel verwerkt.
                        // Log de fout, maar laat de request niet per se falen.
                        console.error("Error saving mutual match to user documents:", matchSaveError);
                    }
                }
            }

            // 3. Stuur succes response terug naar frontend
            res.status(200).json({ success: true, mutualMatch: mutualMatch });

        } catch (error) { // Vang fouten binnen de try block (database errors etc.)
            console.error("Error processing swipe action:", error);
            res.status(500).json({ message: 'Serverfout bij verwerken van swipe.' });
        }
        // --- EINDE SWIPE LOGIC ---
    }); // Einde jwt.verify callback
}; // Einde recordSwipeAction functie


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    updateProfile,
    getPotentialMatches,
    matchAction,
}