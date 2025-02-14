import { db } from "./firebaseConfig.mjs";
import { collection, addDoc, doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

console.log("XLSX library loaded", XLSX);

const openUploadModal = document.getElementById('openUploadModal');
const uploadModal = document.getElementById('uploadModal');
const fileInput = document.getElementById('excelFile');
const uploadButton = document.getElementById('uploadButton');
const closeUploadModal = document.getElementById('closeUploadModal');

const messageModal = document.getElementById('messageModal');
const messageContent = document.getElementById('messageContent');
const closeMessageModal = document.getElementById('closeMessageModal');

openUploadModal.addEventListener('click', () => {
    document.body.classList.add('modal-active');
    uploadModal.style.display = 'block';
});

closeUploadModal.addEventListener('click', () => {
    document.body.classList.remove('modal-active'); 
    uploadModal.style.display = 'none'; 
});

closeMessageModal.addEventListener('click', () => {
    messageModal.style.display = 'none';
});

uploadButton.addEventListener('click', async () => {
    const file = fileInput.files[0];

    if (!file || (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv'))) {
        showMessageModal('Please upload a valid Excel or CSV file!', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showMessageModal('File size exceeds 10MB!', 'error');
        return;
    }

    try {
        console.log("inside xlsx", XLSX.utils); 
        console.log("inside xlsx methods", Object.keys(XLSX));  


        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        console.log("jsonData ka trainees:", jsonData); 

        const trainees = processTraineeData(sheet, jsonData);

        console.log("processtrainee eventlistner ka trainees:", trainees);

        const validationResult = validateData(trainees);

        console.log("validationResult ka trainees:", validationResult); 

        if (validationResult.isValid) {
            const trainees = processTraineeData(sheet, jsonData);
            const collectionName = getCollectionName(trainees[0].month);
            await uploadDataToFirestore(collectionName, trainees);
            await updateMetaCollection(collectionName);
            showMessageModal('File was successfully uploaded!', 'success');
        } else {
            showMessageModal(validationResult.errorMessage, 'error');
        }

    } catch (err) {
        console.error('Error processing file:', err);
        showMessageModal('Error uploading data. Please try again.', 'error');
    }
});

function showMessageModal(message, type) {
    messageContent.textContent = message;
    messageContent.className = type;
    messageModal.style.display = 'block';
}

function getCollectionName(month) {
    const year = new Date().getFullYear();
    return `${month.toLowerCase()}-${year}`;
}

function validateData(trainees) {
    const requiredHeaders = [
        'traineeName', 'batchName', 'numberOfSessionsTillDate', 'numberOfSessionsMonth',
        'batchDurationTillDate', 'batchDurationMonth', 'certificationLevel', 'month',
        'du', 'avgAttendance', 'evaluations'
    ];

    const validScores = ['A', 'B', 'C', 'D', 'F', 'Absent', 'N/A'];
    const validEvaluationNumbers = /^E\d+$/;
    const validBatchNamePattern = /^Batch \d+$/;

    const keys = Object.keys(trainees[0] || {});
    for (const header of requiredHeaders) {
        if (!keys.includes(header)) {
            return { isValid: false, errorMessage: `Missing header: ${header}` };
        }
    }

    for (const trainee of trainees) {

        if (!trainee.batchName || !validBatchNamePattern.test(trainee.batchName)) {
            return { isValid: false, errorMessage: `Batch Name is required and must follow the format 'Batch X' where X is a number. Invalid Batch Name: '${trainee.batchName}' for trainee: ${trainee.traineeName}.` };
        }

        if (trainee.traineeName) {
            for (const field of requiredHeaders) {
                if (!trainee[field] && field !== 'evaluations' && field !== 'avgAttendance') {
                    return { isValid: false, errorMessage: `Field ${field} cannot be empty for trainee: ${trainee.traineeName}` };
                }
            }
        }

        for (const evaluation of trainee.evaluations || []) {
            if (!validEvaluationNumbers.test(evaluation.evaluationNo)) {
                return { isValid: false, errorMessage: `Invalid Evaluation Number '${evaluation.evaluationNo}' for trainee: ${trainee.traineeName}. Expected format: E1, E2, ...` };
            }

            if (evaluation.evaluationName && (!evaluation.evaluationScore || !validScores.includes(evaluation.evaluationScore))) {
                return { isValid: false, errorMessage: `Invalid or missing score for Evaluation Name: '${evaluation.evaluationName}' of trainee: ${trainee.traineeName}. Expected scores: ${validScores.join(", ")}.` };
            }

            if (!evaluation.evaluationName && evaluation.evaluationScore) {
                return { isValid: false, errorMessage: `Evaluation Score provided without an Evaluation Name for trainee: ${trainee.traineeName}.` };
            }
        }

        if (!/^(N[1-5])$/.test(trainee.certificationLevel)) {
            return { isValid: false, errorMessage: `Invalid Certification Level: '${trainee.certificationLevel}'. Expected values: N1, N2, N3, N4, N5.` };
        }

        if (trainee.month && !['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].includes(trainee.month)) {
            return { isValid: false, errorMessage: `Invalid Month: '${trainee.month}'. Expected a valid month name.` };
        }

        if (!/^(Executive Management|Administration|Human Resources|Strategic Hiring|Talent Pool|System Facility Management|Legal|Audits and Compliance|Global PMO|Internal Systems|Finance and Accounts|Learning and Development|PitStop|Business Solutions|Japan Delivery|Testing Practice|BFSI Practice|Australia Delivery|Global Marketing|Partnerships and Alliances|Business Development Australia|Business Development UK|Business Development Japan|Business Development USA|Executive Office|DU[1-8]|FinForge)$/.test(trainee.du)) { 
            return { isValid: false, errorMessage: `Invalid DU format: '${trainee.du}'. Expected one of the predefined values.` };
        }
                      

        if (trainee.avgAttendance == null || trainee.avgAttendance < 0 || trainee.avgAttendance > 100) {
            return { isValid: false, errorMessage: `Avg Attendance Percentage must be between 1 and 100.` };
        }

        if (trainee.batchDurationTillDate < trainee.batchDurationMonth) {
            return { isValid: false, errorMessage: `Batch Duration Till Date should be greater than or equal to Batch Duration (Month) for trainee: ${trainee.traineeName}.` };
        }

        if (trainee.numberOfSessionsTillDate < trainee.numberOfSessionsMonth) {
            return { isValid: false, errorMessage: `Number of Sessions Till Date should be greater than or equal to Number of Sessions (Month) for trainee: ${trainee.traineeName}.` };
        }

        if (!Number.isInteger(trainee.numberOfSessionsMonth) || !Number.isInteger(trainee.numberOfSessionsTillDate)) {
            return { isValid: false, errorMessage: `Number of Sessions fields should be integers for trainee: ${trainee.traineeName}.` };
        }

        if (trainee.numberOfSessionsMonth <= 0 || trainee.numberOfSessionsTillDate <= 0 || trainee.batchDurationMonth <= 0 || trainee.batchDurationTillDate <= 0) {
            return { isValid: false, errorMessage: `Number of Sessions and Batch Duration fields cannot be 0 or empty for trainee: ${trainee.traineeName}.` };
        }
    }

    const monthValue = trainees[0]?.month;
    for (const trainee of trainees) {
        if (trainee.month !== monthValue) {
            return { isValid: false, errorMessage: `All trainees must have the same 'Month' value.` };
        }
    }

    return { isValid: true };
}

function processTraineeData(sheet, data) {
    const trainees = [];
    let currentBatch = "", certLevel = "", month = "", trainerNames = [],
        nOfSessionsTillDate = "", nOfSessionsMonth = "", batchDurTillDate = "", batchDurMonth = "";

    let { evalNumbers, evalNames } = locateEvaluationRows(data);

    evalNumbers = Array.isArray(evalNumbers) ? evalNumbers : Object.values(evalNumbers || {});
    evalNames = Array.isArray(evalNames) ? evalNames : Object.values(evalNames || {});

    data.forEach((row) => {
        if (row["Batch Name"]) currentBatch = row["Batch Name"];
        if (row["Certification Level"]) certLevel = row["Certification Level"];
        if (row["Month"]) month = row["Month"];
        if (row["Trainer Name"]) {
            trainerNames = row["Trainer Name"].split(",").map(name => name.trim());
        }
        if (row["Number of Sessions Till Date"]) nOfSessionsTillDate = row["Number of Sessions Till Date"];
        if (row["Number of Sessions (Month)"]) nOfSessionsMonth = row["Number of Sessions (Month)"];
        if (row["Batch Duration Till Date"]) batchDurTillDate = row["Batch Duration Till Date"];
        if (row["Batch Duration (Month)"]) batchDurMonth = row["Batch Duration (Month)"];
        if (!row["Trainee Name"]) return;

        const trainee = {
            traineeName: row["Trainee Name"] || "",
            batchName: currentBatch || "",
            certificationLevel: certLevel || "",
            month: month || "",
            du: row["Department"] || "",
            avgAttendance: row["Avg Attendance Percentage"] || 0,
            trainerName: trainerNames || "",
            numberOfSessionsTillDate: parseInt(nOfSessionsTillDate) || 0,
            numberOfSessionsMonth: parseInt(nOfSessionsMonth) || 0,
            batchDurationTillDate: parseFloat(batchDurTillDate) || 0,
            batchDurationMonth: parseFloat(batchDurMonth) || 0,
            evaluations: extractEvaluations(row, evalNumbers, evalNames)
        };

        trainees.push(trainee);
    });

    console.log("processTraineeData ka trainees:", trainees);

    return trainees;
}

function locateEvaluationRows(data) {
    let evalNumbers, evalNames;

    data.forEach((row, index) => {
        const rowValues = Object.values(row)
            .map(val => val.toString().trim().toLowerCase());

        if (rowValues.some(val => val.includes("evaluation no"))) {
            evalNumbers = row;
        }
        else if (rowValues.some(val => val.includes("evaluation name"))) {
            evalNames = row;
        }
    });

    if (!evalNumbers || !evalNames) {
        console.warn("Some evaluation rows could not be located. Check the sheet format.");
        return {
            evalNumbers: evalNumbers || {},
            evalNames: evalNames || {},
        };
    }

    return { evalNumbers, evalNames };
}

function extractEvaluations(row, evalNumbers, evalNames) {
    const evaluations = [];

    const evaluationKeys = Object.keys(row).filter(key => key.startsWith('__EMPTY'));

    const validEvalNumbers = evalNumbers
        .filter(num => typeof num === 'string' && num.trim() !== '' && !num.toLowerCase().includes("evaluation no"))
        .map(num => num.trim());

    const validEvalNames = evalNames
        .filter(num => typeof num === 'string' && num.trim() !== '' && !num.toLowerCase().includes("evaluation name"))
        .map(num => num.trim());

    evaluationKeys.forEach((key, index) => {
        const evalNo = validEvalNumbers[index] || `Evaluation ${index + 1}`;
        const score = row[key] !== undefined ? row[key].toString().trim() : "Empty";
        const evaluationName = validEvalNames[index];

        evaluations.push({
            evaluationNo: evalNo || "",
            evaluationName: evaluationName || "",
            evaluationScore: score || ""
        });
        console.log('---Evaluation:', {
            evaluationNo: evalNo,
            evaluationName: evalNames[index],
            evaluationScore: score
        });
    });

    return evaluations;
}

async function uploadDataToFirestore(collectionName, trainees) {
    const colRef = collection(db, collectionName);

    const existingDocsSnapshot = await getDocs(colRef);
    const existingDocs = existingDocsSnapshot.docs.map(doc => doc.data());

    const newData = JSON.stringify(trainees);
    const existingData = JSON.stringify(existingDocs);

    if (existingDocs.length > 0) {
        if (newData === existingData) {
            console.log("No changes detected, skipping upload.");
            return;
        } else {
            for (const docSnapshot of existingDocsSnapshot.docs) {
                await deleteDoc(docSnapshot.ref);
            }
            console.log("Replaced existing documents in the collection.");
            showMessageModal('Replaced existing documents in the collection.', 'success');
        }
    }

    for (const trainee of trainees) {
        try {
            const docName = `${trainee.batchName.replace(/\s+/g, "-").toLowerCase()}-${trainee.traineeName.replace(/\s+/g, "-").toLowerCase()}`;
            const docRef = doc(colRef, docName);
            await setDoc(docRef, trainee);
            console.log(`Uploaded ${trainee.traineeName} to Firestore.`);
        } catch (err) {
            console.error(`Error uploading ${trainee.traineeName}:`, err);
        }
    }
}
async function updateMetaCollection(collectionName) {
    const metaDocRef = doc(db, 'meta', 'collections');
    const metaDoc = await getDoc(metaDocRef);

    if (metaDoc.exists()) {
        await updateDoc(metaDocRef, {
            names: arrayUnion(collectionName) 
        });
    } else {
        await setDoc(metaDocRef, {
            names: [collectionName]
        });
    }
}

async function deleteCollectionAndMeta(collectionName) {
    const colRef = collection(db, collectionName);
    const existingDocsSnapshot = await getDocs(colRef);

    for (const docSnapshot of existingDocsSnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
    }
    const metaDocRef = doc(db, 'meta', 'collections');
    await updateDoc(metaDocRef, {
        names: arrayRemove(collectionName)
    });
    console.log(`Deleted collection: ${collectionName} and removed from meta.`);
}