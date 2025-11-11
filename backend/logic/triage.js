/**
 * Knowledge base containing symptom rules and combinations for medical triage.
 * 
 * @constant {Object} knowledgeBase
 * @property {Object} symptoms - Individual symptom definitions with urgency levels
 * @property {Array<Object>} combos - Symptom combinations that suggest specific checkups
 */

const knowledgeBase = {
    symptoms: {
        fever: { urgency: "Medium" },
        cough: { urgency: "Low" },
        headache: { urgency: "Low" },
        stomach_pain: { urgency: "Medium" },
        nausea: { urgency: "Low" },
        difficulty_breathing: {
            urgency: "High",
            checkup: "URGENT Respiratory",
        },
        chest_pain: {
            urgency: "High",
            checkup: "URGENT Cardiac",
        },
    },
    combos: [
        {
            symptoms: ["fever", "cough"],
            checkup: "Respiratory Checkup",
        },
        {
            symptoms: ["fever", "headache"],
            checkup: "General Checkup",
        },
        {
            symptoms: ["stomach_pain", "nausea"],
            checkup: "Gastro Checkup",
        },
    ],
};

/**
 * Analyzes a list of symptoms and determines the urgency level and recommended checkup type.
 * 
 * The function evaluates symptoms based on a rule-based system:
 * 1. Determines the highest urgency level from all symptoms (High > Medium > Low)
 * 2. Checks for high-urgency symptoms with specific checkup recommendations
 * 3. Matches symptom combinations to suggest specialized checkups
 * 
 * @function runTriage
 * @param {string[]} symptoms - Array of symptom identifiers (e.g., ["fever", "cough"])
 * @returns {Object} Triage results
 * @returns {string} returns.urgency - Urgency level: "High", "Medium", or "Low"
 * @returns {string} returns.suggestedCheckup - Recommended type of medical checkup
 * 
 * @example
 * // High urgency case
 * runTriage(["chest_pain", "fever"]);
 * // Returns: { urgency: "High", suggestedCheckup: "URGENT Cardiac" }
 * 
 * @example
 * // Symptom combination match
 * runTriage(["fever", "cough"]);
 * // Returns: { urgency: "Medium", suggestedCheckup: "Respiratory Checkup" }
 * 
 * @example
 * // Low urgency case
 * runTriage(["headache"]);
 * // Returns: { urgency: "Low", suggestedCheckup: "General Checkup" }
 */

const runTriage = (symptoms) => {
    let finalUrgency = "Low";
    let suggestedCheckup = "General Checkup";

    for (const symptom of symptoms) {
        const rule = knowledgeBase.symptoms[symptom];
        if (rule) {
            if (rule.urgency === "High") {
                finalUrgency = "High";
            } else if (rule.urgency === "Medium" && finalUrgency !== "High") {
                finalUrgency = "Medium";
            }
        }
    }

    for (const symptom of symptoms) {
        const rule = knowledgeBase.symptoms[symptom];
        if (rule && rule.urgency === "High" && rule.checkup) {
            suggestedCheckup = rule.checkup;
            break;
        }
    }

    if (suggestedCheckup === "General Checkup") {
        const sortedSymptoms = [...symptoms].sort();

        for (const combo of knowledgeBase.combos) {
            const sortedCombo = [...combo.symptoms].sort();
            if (JSON.stringify(sortedSymptoms) === JSON.stringify(sortedCombo)) {
                suggestedCheckup = combo.checkup;
                break;
            }
        }
    }

    return {
        urgency: finalUrgency,
        suggestedCheckup: suggestedCheckup,
    };
};

module.exports = { runTriage };