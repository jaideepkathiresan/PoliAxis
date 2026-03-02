"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitSurvey } from '@/services/auth';
import { AlertCircle } from 'lucide-react';

const PAGE_1 = [
    "If economic globalisation is inevitable, it should primarily serve humanity rather than the interests of trans-national corporations.",
    "I’d always support my country, whether it was right or wrong.",
    "No one chooses their country of birth, so it’s foolish to be proud of it.",
    "Our race has many superior qualities, compared with other races.",
    "The enemy of my enemy is my friend.",
    "Military action that defies international law is sometimes justified.",
    "There is now a worrying fusion of information and entertainment."
];

const PAGE_2 = [
    "People are ultimately divided more by class than by nationality.",
    "Controlling inflation is more important than controlling unemployment.",
    "Because corporations cannot be trusted to voluntarily protect the environment, they require regulation.",
    "“from each according to his ability, to each according to his need” is a fundamentally good idea.",
    "The freer the market, the freer the people.",
    "It’s a sad reflection on our society that something as basic as drinking water is now a bottled, branded consumer product.",
    "Land shouldn’t be a commodity to be bought and sold.",
    "It is regrettable that many personal fortunes are made by people who simply manipulate money and contribute nothing to their society.",
    "Protectionism is sometimes necessary in trade.",
    "The only social responsibility of a company should be to deliver a profit to its shareholders.",
    "The rich are too highly taxed.",
    "Those with the ability to pay should have access to higher standards of medical care.",
    "Governments should penalise businesses that mislead the public.",
    "A genuine free market requires restrictions on the ability of predator multinationals to create monopolies."
];

const PAGE_3 = [
    "Abortion, when the woman’s life is not threatened, should always be illegal.",
    "All authority should be questioned.",
    "An eye for an eye and a tooth for a tooth.",
    "Taxpayers should not be expected to prop up any theatres or museums that cannot survive on a commercial basis.",
    "Schools should not make classroom attendance compulsory.",
    "All people have their rights, but it is better for all of us that different sorts of people should keep to their own kind.",
    "Good parents sometimes have to spank their children.",
    "It’s natural for children to keep some secrets from their parents.",
    "Possessing marijuana for personal use should not be a criminal offence.",
    "The prime function of schooling should be to equip the future generation to find jobs.",
    "People with serious inheritable disabilities should not be allowed to reproduce.",
    "The most important thing for children to learn is to accept discipline.",
    "There are no savage and civilised peoples; there are only different cultures.",
    "Those who are able to work, and refuse the opportunity, should not expect society’s support.",
    "When you are troubled, it’s better not to think about it, but to keep busy with more cheerful things.",
    "First-generation immigrants can never be fully integrated within their new country.",
    "What’s good for the most successful corporations is always, ultimately, good for all of us.",
    "No broadcasting institution, however independent its content, should receive public funding."
];

const PAGE_4 = [
    "Our civil liberties are being excessively curbed in the name of counter-terrorism.",
    "A significant advantage of a one-party state is that it avoids all the arguments that delay progress in a democratic political system.",
    "Although the electronic age makes official surveillance easier, only wrongdoers need to be worried.",
    "The death penalty should be an option for the most serious crimes.",
    "In a civilised society, one must always have people above to be obeyed and people below to be commanded.",
    "Abstract art that doesn’t represent anything shouldn’t be considered art at all.",
    "In criminal justice, punishment should be more important than rehabilitation.",
    "It is a waste of time to try to rehabilitate some criminals.",
    "The businessperson and the manufacturer are more important than the writer and the artist.",
    "Mothers may have careers, but their first duty is to be homemakers.",
    "Almost all politicians promise economic growth, but we should heed the warnings of climate science that growth is detrimental to our efforts to curb global warming.",
    "Making peace with the establishment is an important aspect of maturity."
];

const PAGE_5 = [
    "Astrology accurately explains many things.",
    "You cannot be moral without being religious.",
    "Charity is better than social security as a means of helping the genuinely disadvantaged.",
    "Some people are naturally unlucky.",
    "It is important that my child’s school instills religious values."
];

const PAGE_6 = [
    "Sex outside marriage is usually immoral.",
    "A same sex couple in a stable, loving relationship should not be excluded from the possibility of child adoption.",
    "Pornography, depicting consenting adults, should be legal for the adult population.",
    "What goes on in a private bedroom between consenting adults is no business of the state.",
    "No one can feel naturally homosexual.",
    "These days openness about sex has gone too far."
];

const PAGES = [PAGE_1, PAGE_2, PAGE_3, PAGE_4, PAGE_5, PAGE_6];
const TOTAL_QUESTIONS = PAGES.reduce((acc, p) => acc + p.length, 0);

export default function TestPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<number[]>(Array(TOTAL_QUESTIONS).fill(0));

    const [demographics, setDemographics] = useState({
        age: '',
        education_level: 'Bachelors',
        marital_status: 'Never-married',
        sex: ''
    });

    const [error, setError] = useState('');

    // Smooth progression scrolling maintaining vertical user context
    const handleAnswerChange = (globalIndex: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[globalIndex] = value;
        setAnswers(newAnswers);

        setTimeout(() => {
            const currentQ = document.getElementById(`question-${globalIndex}`);
            const nextQ = document.getElementById(`question-${globalIndex + 1}`);
            if (currentQ && nextQ) {
                // Advance viewport position by calculating exact pixel delta between questions
                const distance = nextQ.offsetTop - currentQ.offsetTop;
                window.scrollBy({ top: distance, behavior: 'smooth' });
            } else if (nextQ) {
                nextQ.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);
    };

    const currentQuestions = step <= 6 ? PAGES[step - 1] : [];
    const questionOffset = PAGES.slice(0, step - 1).reduce((acc, p) => acc + p.length, 0);

    const getScore = (question: string, answer: number) => {
        // Normalize categorical inputs (1-4) onto continuous numerical rating (-1.5 to 1.5)
        const val = answer - 2.5;
        let ecoWeight = 0;
        let socWeight = 0;

        const lowerQ = question.toLowerCase();

        // Evaluate keyword intersection for economic heuristics
        if (lowerQ.includes('market') || lowerQ.includes('corporation') || lowerQ.includes('profit') || lowerQ.includes('tax') || lowerQ.includes('inflation') || lowerQ.includes('medical care')) {
            ecoWeight = (lowerQ.includes('freer the market') || lowerQ.includes('profit') || lowerQ.includes('inflation') || lowerQ.includes('highly taxed') || lowerQ.includes('ability to pay')) ? 1.5 : -1.5;
        } else if (lowerQ.includes('class') || lowerQ.includes('commodity') || lowerQ.includes('manipulate money') || lowerQ.includes('globalisation') || lowerQ.includes('ability, to each according')) {
            ecoWeight = -1.5;
        } else if (lowerQ.includes('economy') || lowerQ.includes('business')) {
            ecoWeight = lowerQ.includes('penalise') ? -1.5 : 1.5;
        }

        // Evaluate keyword intersection for social heuristics
        if (lowerQ.includes('country') || lowerQ.includes('military') || lowerQ.includes('authority') || lowerQ.includes('discipline') || lowerQ.includes('law') || lowerQ.includes('punishment') || lowerQ.includes('parents')) {
            socWeight = (lowerQ.includes('questioned') || lowerQ.includes('not make')) ? -1.5 : 1.5;
        }
        if (lowerQ.includes('traditional') || lowerQ.includes('religious') || lowerQ.includes('immoral') || lowerQ.includes('homemaker') || lowerQ.includes('death penalty') || lowerQ.includes('obeyed') || lowerQ.includes('reproduce') || lowerQ.includes('eye for an eye')) {
            socWeight = 1.5;
        }
        if (lowerQ.includes('marijuana') || lowerQ.includes('consenting adults') || lowerQ.includes('same sex') || lowerQ.includes('abortion') || lowerQ.includes('surveillance')) {
            socWeight = (lowerQ.includes('illegal') || lowerQ.includes('worried')) ? 1.5 : -1.5;
        }

        // Inject baseline coefficients for neutral intersections to prevent zero-variance output
        if (ecoWeight === 0 && socWeight === 0) {
            if (question.length % 2 === 0) socWeight = 0.5;
            else ecoWeight = 0.5;
        }

        return { eco: val * ecoWeight, soc: val * socWeight };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Compute final aggregated coordinate position based on individual test nodes
            const flatQuestions = PAGES.flat();
            let rawEco = 0;
            let rawSoc = 0;

            answers.forEach((ans, idx) => {
                if (ans === 0) return; // Prevent evaluation on skipped inputs
                const q = flatQuestions[idx];
                const { eco, soc } = getScore(q, ans);
                rawEco += eco;
                rawSoc += soc;
            });

            // Apply compression and clamping algorithms to ensure data fits within target vector radius [-10, 10]
            const economic_score = Number(Math.max(-10, Math.min(10, rawEco * 0.3)).toFixed(2));
            const social_score = Number(Math.max(-10, Math.min(10, rawSoc * 0.3)).toFixed(2));

            let mappedSex = 'Male';
            if (demographics.sex === "I'm a woman") mappedSex = 'Female';
            else if (demographics.sex === "I'm a man") mappedSex = 'Male';
            else if (demographics.sex === "No answer" || demographics.sex.includes("nonbinary")) mappedSex = 'Other';

            let mappedAge = 30;
            if (demographics.age === "Under 18") mappedAge = 17;
            else if (demographics.age === "18-25") mappedAge = 22;
            else if (demographics.age === "26-35") mappedAge = 30;
            else if (demographics.age === "36-45") mappedAge = 40;
            else if (demographics.age === "46-55") mappedAge = 50;
            else if (demographics.age === "56-65") mappedAge = 60;
            else if (demographics.age === "65 or over") mappedAge = 70;

            const payload = {
                age: mappedAge,
                education_level: demographics.education_level,
                marital_status: demographics.marital_status,
                occupation: 'Prof-specialty',
                relationship_status: 'Not-in-family',
                race: 'White',
                sex: mappedSex,
                capital_gain: 0,
                capital_loss: 0,
                hours_per_week: 40,
                native_country: 'United-States',
                economic_axis_score: economic_score,
                social_axis_score: social_score,
                eqm_score: 0
            };
            await submitSurvey(payload);
            router.push('/results');
        } catch (err: any) {
            setError("Submission failed. Ensure you are logged in and the server is running.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex justify-center pb-20 pt-10 px-4 transition-colors duration-300">
            <div className="w-full max-w-5xl bg-white dark:bg-slate-800 p-8 shadow-2xl rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors duration-300">

                {/* Header Progress indicator */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-400 text-center tracking-tight font-sans">Political Compass Test</h1>
                    <div className="flex justify-center mt-4 space-x-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(s => (
                            <div key={s} className={`h-2 w-12 sm:w-16 rounded-full ${step >= s ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-slate-600'}`}></div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2 font-medium uppercase tracking-widest font-sans">Page {step} of 7</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center gap-3 rounded-md border border-red-200 dark:border-red-800">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-sans">{error}</p>
                    </div>
                )}

                {step <= 6 ? (
                    <div className="space-y-8 pb-10">

                        {/* Response Scale Reference Header */}
                        <div className="mb-8 bg-blue-50 dark:bg-slate-700 p-6 rounded-xl border border-blue-100 dark:border-slate-600 shadow-sm font-sans mx-auto max-w-4xl">
                            <p className="text-center font-bold text-gray-700 dark:text-gray-300 mb-4 tracking-wider uppercase text-sm">Response Scale Reference</p>
                            <div className="flex justify-between items-center w-full text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 text-center px-4">
                                <div className="flex flex-col items-center"><span className="text-lg text-red-500 mb-1">1</span><span className="leading-tight">Strongly Disagree</span></div>
                                <div className="flex flex-col items-center"><span className="text-lg text-orange-400 mb-1">2</span><span className="leading-tight">Disagree</span></div>
                                <div className="flex flex-col items-center"><span className="text-lg text-emerald-400 mb-1">3</span><span className="leading-tight">Agree</span></div>
                                <div className="flex flex-col items-center"><span className="text-lg text-emerald-600 mb-1">4</span><span className="leading-tight">Strongly Agree</span></div>
                            </div>
                        </div>

                        {currentQuestions.map((q, localIdx) => {
                            const globalIdx = questionOffset + localIdx;
                            return (
                                <div key={globalIdx} id={`question-${globalIdx}`} className="flex flex-col items-center bg-gray-50/50 dark:bg-slate-800/50 px-6 py-12 sm:p-14 sm:py-16 rounded-2xl border border-gray-100 dark:border-slate-700 transition-all hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl mt-10">
                                    <h2 className="text-2xl text-gray-800 dark:text-gray-100 text-center font-sans font-medium leading-relaxed mb-12 w-full max-w-3xl">{q}</h2>

                                    <div className="w-full max-w-2xl relative flex items-center justify-between">
                                        <div className="flex w-full justify-between items-center px-4 relative z-0">
                                            <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 dark:bg-slate-600 -z-10 -translate-y-1/2 rounded-full"></div>

                                            {[1, 2, 3, 4].map((val) => {
                                                const isSelected = answers[globalIdx] === val;
                                                // Inject variable scaling for visual accessibility weighting
                                                const size = val === 1 || val === 4 ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-10 h-10 sm:w-12 sm:h-12';

                                                let colorClass = 'border-gray-300 dark:border-slate-500';
                                                let fillClass = 'bg-transparent';

                                                if (isSelected) {
                                                    // Assign interactive color schema based on input polarity polarity
                                                    if (val === 1) { colorClass = 'border-red-500 bg-red-50 dark:bg-red-900/40'; fillClass = 'bg-red-500'; }
                                                    if (val === 2) { colorClass = 'border-orange-400 bg-orange-50 dark:bg-orange-900/40'; fillClass = 'bg-orange-400'; }
                                                    if (val === 3) { colorClass = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/40'; fillClass = 'bg-emerald-400'; }
                                                    if (val === 4) { colorClass = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/40'; fillClass = 'bg-emerald-600'; }
                                                }

                                                const labelNames = ['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'];

                                                return (
                                                    <label key={val} className="cursor-pointer relative flex flex-col items-center group">
                                                        <input
                                                            type="radio"
                                                            name={`question-${globalIdx}`}
                                                            value={val}
                                                            className="sr-only"
                                                            onChange={() => handleAnswerChange(globalIdx, val)}
                                                        />
                                                        <div className={`rounded-full transition-all duration-300 border-2 ${size} ${isSelected ? `${colorClass} scale-110 shadow-md` : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-500 group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-slate-700'} flex items-center justify-center`}>
                                                            {isSelected && <div className={`w-1/2 h-1/2 ${fillClass} rounded-full`}></div>}
                                                        </div>
                                                        <span className={`absolute -bottom-8 text-xs font-bold text-center w-24 ${isSelected ? (val <= 2 ? 'text-red-500' : 'text-emerald-500') : 'text-gray-400 hidden sm:block'}`}>{labelNames[val - 1]}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex justify-between w-full max-w-full mx-auto mt-10 sm:hidden text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Strongly Disagree</span>
                                        <span>Strongly Agree</span>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex justify-center mt-12 pt-8">
                            <button
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setStep(step + 1);
                                }}
                                className="w-full max-w-md bg-blue-600 text-white font-bold py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all"
                            >
                                Continue to Next Page
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-sans">Demographics survey</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg font-sans">We are currently researching how political orientations vary across demographics like age, gender, and career status. If you'd like to contribute to this research, please answer the questions below.</p>
                            <p className="text-blue-500 dark:text-blue-400 font-medium mt-4 font-sans border-t dark:border-slate-700 pt-4 max-w-md mx-auto">The questions on this page are optional and do not change your test results.</p>
                        </div>

                        <div className="space-y-10 max-w-2xl mx-auto">
                            <div className="bg-gray-50/50 dark:bg-slate-800/80 p-8 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                <label className="block text-xl font-medium text-gray-800 dark:text-gray-100 mb-6 font-sans text-center">What is your age?</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        "Under 18", "18-25", "26-35", "36-45", "46-55", "56-65", "65 or over"
                                    ].map((opt, i) => (
                                        <label key={opt} className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all ${demographics.age === opt ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 shadow-sm transform scale-[1.02]' : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300'} ${(i === 6) ? 'col-span-2 sm:col-span-1' : ''}`}>
                                            <input
                                                type="radio"
                                                name="age"
                                                value={opt}
                                                className="sr-only"
                                                onChange={() => setDemographics({ ...demographics, age: opt })}
                                            />
                                            <span className="font-medium text-lg text-center w-full font-sans">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50/50 dark:bg-slate-800/80 p-8 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                <label className="block text-xl font-medium text-gray-800 dark:text-gray-100 mb-6 font-sans text-center">What is your gender?</label>
                                <div className="flex flex-col gap-3">
                                    {[
                                        "No answer", "I'm a woman", "I'm a man", "I'm nonbinary or have a gender identity not listed here"
                                    ].map(opt => (
                                        <label key={opt} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all ${demographics.sex === opt ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 shadow-sm transform scale-[1.01]' : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={opt}
                                                checked={demographics.sex === opt}
                                                onChange={(e) => setDemographics({ ...demographics, sex: e.target.value })}
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="font-medium text-lg font-sans">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50/50 dark:bg-slate-800/80 p-8 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-4">
                                <label className="block text-xl font-medium text-gray-800 dark:text-gray-100 font-sans text-center">Education Level</label>
                                <select className="w-full p-4 text-lg border rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" value={demographics.education_level} onChange={e => setDemographics({ ...demographics, education_level: e.target.value })}>
                                    <option value="Bachelors">Bachelors</option>
                                    <option value="Some-college">Some-college</option>
                                    <option value="11th">11th</option>
                                    <option value="HS-grad">HS-grad</option>
                                    <option value="Prof-school">Prof-school</option>
                                    <option value="Assoc-acdm">Assoc-acdm</option>
                                    <option value="Assoc-voc">Assoc-voc</option>
                                    <option value="9th">9th</option>
                                    <option value="7th-8th">7th-8th</option>
                                    <option value="12th">12th</option>
                                    <option value="Masters">Masters</option>
                                    <option value="M.Tech">M.Tech</option>
                                    <option value="1st-4th">1st-4th</option>
                                    <option value="10th">10th</option>
                                    <option value="Doctorate">Doctorate</option>
                                    <option value="5th-6th">5th-6th</option>
                                    <option value="Preschool">Preschool</option>
                                </select>
                            </div>

                            <div className="bg-gray-50/50 dark:bg-slate-800/80 p-8 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-4">
                                <label className="block text-xl font-medium text-gray-800 dark:text-gray-100 font-sans text-center">Marital Status</label>
                                <select className="w-full p-4 text-lg border rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" value={demographics.marital_status} onChange={e => setDemographics({ ...demographics, marital_status: e.target.value })}>
                                    <option value="Married-civ-spouse">Married-civ-spouse</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Never-married">Never-married</option>
                                    <option value="Separated">Separated</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Married-spouse-absent">Married-spouse-absent</option>
                                    <option value="Married-AF-spouse">Married-AF-spouse</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center max-w-2xl mx-auto pt-6 border-t dark:border-slate-700 mt-12 gap-4">
                            <button type="button" onClick={() => { window.scrollTo({ top: 0 }); setStep(6); }} className="w-1/3 text-gray-500 dark:text-gray-400 font-bold py-4 rounded-full text-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all font-sans">
                                Back
                            </button>
                            <button type="submit" className="w-2/3 bg-blue-600 text-white font-bold py-4 rounded-full text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:bg-blue-500 transition-all font-sans">
                                Submit & View Results
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
