import {React, useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserContext } from "../../context/userContext"

// Voorbeeld lijst van beschikbare PERSOONLIJKE label categorieën
const PERSONAL_LABEL_CATEGORIES = [
    "Favorite Meal", "Fitness Level", "Preferred Workout Time", "Favorite Exercise", "Workout Goal", "Music Preference", "Dietary Preference"
];

// Andere lijsten
const LOOKING_FOR_OPTIONS = ['Friends', 'Workout Partner', 'Relationship', 'Networking'];

export default function ProfileSetup() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [data, setData] = useState({
        bio: '',
        gender: '',
        lookingFor: LOOKING_FOR_OPTIONS[0],
        sportLabels: [], // Max 2, user input
        personalLabels: [], // Max 4, [{label: 'Category', value: 'User input'}]
    });

    // State voor input velden
    const [currentSportLabelInput, setCurrentSportLabelInput] = useState('');
    const [currentPersonalLabelCategory, setCurrentPersonalLabelCategory] = useState('');
    const [currentPersonalLabelValue, setCurrentPersonalLabelValue] = useState('');

    // --- Standaard onChange voor bio, lookingFor ---
    const onChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    // --- Functies voor Sport Labels (Max 2, User Input) ---
    const handleAddSportLabel = () => {
        const trimmedLabel = currentSportLabelInput.trim();
        // Check of input leeg is
        if (!trimmedLabel) {
            toast.error('Voer een sportlabel in.');
            return;
        }
        // Check of limiet bereikt is
        if (data.sportLabels.length >= 2) {
            toast.error('Je mag maximaal 2 sportlabels toevoegen.');
            return;
        }
        // Check of label al bestaat (case-insensitive)
        if (data.sportLabels.some(label => label.toLowerCase() === trimmedLabel.toLowerCase())) {
            toast.error(`"${trimmedLabel}" is al toegevoegd.`);
            return;
        }

        // Voeg toe aan state
        setData(prevData => ({
            ...prevData,
            sportLabels: [...prevData.sportLabels, trimmedLabel] // Voeg getrimde waarde toe
        }));
        setCurrentSportLabelInput(''); // Reset input veld
    };

    const handleRemoveSportLabel = (labelToRemove) => {
        setData(prevData => ({
            ...prevData,
            sportLabels: prevData.sportLabels.filter(label => label !== labelToRemove)
        }));
    };

    // --- Functies voor Personal Labels (Max 4, Category + User Input) ---
    const handleAddPersonalLabel = () => {
        const trimmedValue = currentPersonalLabelValue.trim();
        // Check of categorie en waarde zijn ingevuld
        if (!currentPersonalLabelCategory) {
            toast.error('Kies eerst een categorie voor het persoonlijke label.');
            return;
        }
        if (!trimmedValue) {
            toast.error('Voer een waarde in voor het persoonlijke label.');
            return;
        }
        // Check of limiet bereikt is
        if (data.personalLabels.length >= 4) {
            toast.error('Je mag maximaal 4 persoonlijke labels toevoegen.');
            return;
        }
        // Check of de categorie al bestaat
        if (data.personalLabels.some(pl => pl.label === currentPersonalLabelCategory)) {
             toast.error(`De categorie "${currentPersonalLabelCategory}" is al toegevoegd.`);
             return;
        }

        // Voeg toe aan state
        setData(prevData => ({
            ...prevData,
            personalLabels: [...prevData.personalLabels, { label: currentPersonalLabelCategory, value: trimmedValue }]
        }));

        // Reset de invoervelden
        setCurrentPersonalLabelCategory('');
        setCurrentPersonalLabelValue('');
    };

    const handleRemovePersonalLabel = (labelCategoryToRemove) => {
        setData(prevData => ({
            ...prevData,
            personalLabels: prevData.personalLabels.filter(pl => pl.label !== labelCategoryToRemove)
        }));
    };

    // --- Profiel opslaan ---
    const setupProfile = async (e) => {
        e.preventDefault();
        // Stuur de huidige staat van `data`
        const { bio, gender, lookingFor, sportLabels, personalLabels } = data;

        if (!bio.trim()) {
           return toast.error('Bio mag niet leeg zijn.');
        }
        // Voeg eventueel meer frontend validatie toe

        try {
            // !! VERVANG '/api/profile/setup' MET JE ECHTE BACKEND ENDPOINT !!
            const response = await axios.put('updateProfile', {
                bio,
                gender,
                lookingFor,
                sportLabels,
                personalLabels // Stuur de array van objecten mee
            }
            // , { withCredentials: true } // Indien nodig voor auth
            );

            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                setUser(response.data.user);
                toast.success('Profiel succesvol opgeslagen!');
                navigate('/'); // Of een andere relevante pagina
            }
        } catch (error) {
            console.error("Profile setup error:", error);
            const message = error.response?.data?.message || error.message || 'Er is iets misgegaan bij het opslaan.';
            toast.error(message);
        }
    };

    // --- Render JSX ---
    return (
        <div>
            <h2>Profiel Bewerken/Instellen</h2>
            <form onSubmit={setupProfile}>
                {/* Bio */}
                <div>
                    <label htmlFor="bio">Bio</label><br/>
                    <textarea id="bio" name="bio" value={data.bio} onChange={onChange} placeholder="Vertel iets over jezelf..." maxLength={500} />
                </div>

                <label htmlFor="gender"></label>
                <select name="gender" value={data.gender} onChange={onChange}id="">
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                </select>

                {/* Looking For */}
                <div>
                    <label htmlFor="lookingFor">Looking for</label><br/>
                    <select id="lookingFor" name="lookingFor" value={data.lookingFor} onChange={onChange}>
                        {LOOKING_FOR_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>

                {/* Sport Labels (Max 2, User Input) */}
                <div style={{ marginTop: '20px' }}>
                    <label>Sport labels (max 2)</label><br/>
                    {/* Weergave van toegevoegde sport labels */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                        {data.sportLabels.map(label => (
                            <span key={label} style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: '10px', cursor: 'pointer' }} onClick={() => handleRemoveSportLabel(label)} title="Klik om te verwijderen">
                                {label} &times;
                            </span>
                        ))}
                    </div>
                    {/* Input om nieuw sport label toe te voegen */}
                    {data.sportLabels.length < 2 && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={currentSportLabelInput}
                                onChange={(e) => setCurrentSportLabelInput(e.target.value)}
                                placeholder="Typ een sportlabel..."
                                maxLength={30} // Optionele max lengte per label
                                disabled={data.sportLabels.length >= 2}
                            />
                            <button type="button" onClick={handleAddSportLabel} disabled={data.sportLabels.length >= 2 || !currentSportLabelInput.trim()}>
                                Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Personal Labels (Max 4, Category + User Input) */}
                <div style={{ marginTop: '20px' }}>
                     <label>Persoonlijke labels (max 4)</label><br/>
                     {/* Weergave van toegevoegde persoonlijke labels */}
                     <div style={{ marginBottom: '10px' }}>
                         {data.personalLabels.map(pl => (
                             <div key={pl.label} style={{ background: '#f0f0f0', padding: '5px 8px', borderRadius: '5px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <span><strong>{pl.label}:</strong> {pl.value}</span>
                                 <button type="button" onClick={() => handleRemovePersonalLabel(pl.label)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.1em' }} title="Verwijder dit label">&times;</button>
                             </div>
                         ))}
                     </div>
                     {/* Inputs om nieuw persoonlijk label toe te voegen */}
                     {data.personalLabels.length < 4 && (
                         <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                             <select
                                 value={currentPersonalLabelCategory}
                                 onChange={(e) => setCurrentPersonalLabelCategory(e.target.value)}
                                 disabled={data.personalLabels.length >= 4}
                             >
                                 <option value="">Kies categorie...</option>
                                 {PERSONAL_LABEL_CATEGORIES
                                     // Filter opties die al gebruikt zijn
                                     .filter(cat => !data.personalLabels.some(pl => pl.label === cat))
                                     .map(category => (
                                         <option key={category} value={category}>{category}</option>
                                 ))}
                             </select>
                             <input
                                 type="text"
                                 value={currentPersonalLabelValue}
                                 onChange={(e) => setCurrentPersonalLabelValue(e.target.value)}
                                 placeholder="Typ de waarde..."
                                 maxLength={100} // Optioneel
                                 disabled={data.personalLabels.length >= 4 || !currentPersonalLabelCategory} // Disable als geen categorie gekozen
                             />
                             <button
                                 type="button"
                                 onClick={handleAddPersonalLabel}
                                 disabled={data.personalLabels.length >= 4 || !currentPersonalLabelCategory || !currentPersonalLabelValue.trim()}
                             >
                                 Add Personal Label
                             </button>
                         </div>
                     )}
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: '30px' }}>
                    <button type="submit">Save changes</button>
                </div>
            </form>
        </div>
    );
}