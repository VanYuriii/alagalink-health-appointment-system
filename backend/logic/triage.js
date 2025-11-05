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