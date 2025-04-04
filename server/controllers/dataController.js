const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Zorg dat het pad klopt

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Haal token uit header
            token = req.headers.authorization.split(' ')[1];

            // Verifieer token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Haal gebruiker op basis van ID uit token payload
            // BELANGRIJK: .select('-password') om te zorgen dat het wachtwoord nooit meekomt
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
               // Gebruiker hoort bij token, maar bestaat niet (meer) in DB
               return res.status(401).json({ message: 'Niet geautoriseerd, gebruiker niet gevonden' });
            }

            next(); // Token is geldig, gebruiker gevonden -> ga door naar de route handler

        } catch (error) {
            // Token is ongeldig (verlopen, verkeerde secret, etc.)
            console.error('Token verificatie fout:', error.message);
            res.status(401).json({ message: 'Niet geautoriseerd, token ongeldig' });
        }
    }

    if (!token) {
        // Geen 'Authorization: Bearer ...' header gevonden
        res.status(401).json({ message: 'Niet geautoriseerd, geen token meegegeven' });
    }
};

const getUserData = async (req, res) => {
    // De 'protect' middleware heeft zijn werk al gedaan en req.user ingesteld.
    // We hoeven alleen de gegevens terug te sturen.
    try {
       // req.user bevat nu de gebruikersgegevens (zonder wachtwoord)
       // Als req.user bestaat (wat zou moeten na succesvolle 'protect' middleware)
       if (req.user) {
          // Stuur de gebruikersgegevens terug
          res.status(200).json(req.user); // Stuurt bv. { _id: ..., name: ..., email: ... }
       } else {
           // Dit zou eigenlijk niet moeten gebeuren als 'protect' goed werkt
           res.status(404).json({ message: "Gebruikersgegevens niet gevonden na authenticatie."});
       }
    } catch(error) {
       console.error("Fout bij ophalen gebruikersdata in controller:", error);
       res.status(500).json({ message: "Server fout bij opvragen gegevens." });
    }
  }

module.exports = {
    protect,
    getUserData
}