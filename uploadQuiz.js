// ==========================================
// SmartQuiz AI
// uploadQuiz.js
// Part 1
// ==========================================

// Upload Controls
const studyFileInput = document.getElementById("studyFile");
const uploadDifficulty = document.getElementById("uploadDifficulty");
const uploadQuestionCount = document.getElementById("uploadQuestionCount");
const generateUploadButton = document.getElementById("generateUpload");

// Maximum file size (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
];

// Selected file
let uploadedFile = null;


// ==========================================
// File Selection
// ==========================================

studyFileInput.addEventListener("change", () => {

    if (!studyFileInput.files.length) {
        uploadedFile = null;
        return;
    }

    const file = studyFileInput.files[0];

    // File Size Validation
    if (file.size > MAX_FILE_SIZE) {

        alert("Maximum file size is 10 MB.");

        studyFileInput.value = "";

        uploadedFile = null;

        return;
    }

    // File Type Validation

    if (!ALLOWED_TYPES.includes(file.type)) {

        alert("Only PDF, DOCX and TXT files are supported.");

        studyFileInput.value = "";

        uploadedFile = null;

        return;
    }

    uploadedFile = file;
	console.log("Selected file:", file.name);
	console.log("Size:", file.size);
	console.log("Type:", file.type);

});


// ==========================================
// Generate Quiz Button
// ==========================================

generateUploadButton.addEventListener("click", async () => {
	generateUploadButton.disabled = true;

    if (!uploadedFile) {
		generateUploadButton.disabled = false;

        alert("Please choose a PDF, DOCX or TXT file.");

        return;

    }

    showLoading("Reading your study document...");

    try {

        // This function will be built in Part 2

        const extractedText = await extractTextFromFile(uploadedFile);
		showLoading("Preparing study material...");

        if (!extractedText || extractedText.trim().length < 100) {

            throw new Error(
                "Not enough readable text found in the document."
            );

        }

        // Clean extracted text
	const cleanedText = prepareStudyMaterial(extractedText);
	showLoading("Generating quiz using AI...");

	const questions = await generateQuestionsWithAI({

    sourceText: cleanedText,

    difficulty: uploadDifficulty.value,

    count: Number(uploadQuestionCount.value)

	});
	
	// Reset upload form
// Save filename before clearing
const fileName = uploadedFile.name;

// Reset upload form
studyFileInput.value = "";
uploadedFile = null;
generateUploadButton.disabled = false;

// Start quiz
startQuiz({
    title: fileName,
    source: "Upload",
    questions
});

}
catch(error){

    generateUploadButton.disabled = false;

    console.error(error);

    alert(
        "Quiz generation failed.\n\n" +
        error.message
    );

    showHome();

}

});






// ==========================================
// Text Extraction
// Part 2
// ==========================================

async function extractTextFromFile(file) {

    const extension = file.name
        .split(".")
        .pop()
        .toLowerCase();

    switch (extension) {

        case "txt":
            return await readTxtFile(file);

        case "docx":
            return await readDocxFile(file);

        case "pdf":
            return await readPdfFile(file);

        default:
            throw new Error("Unsupported file format.");

    }

}


// ==========================================
// TXT Reader
// ==========================================

function readTxtFile(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            resolve(reader.result);

        };

        reader.onerror = () => {

            reject(new Error("Unable to read TXT file."));

        };

        reader.readAsText(file);

    });

}


// ==========================================
// DOCX Reader
// ==========================================

async function readDocxFile(file) {

    try {

        const arrayBuffer = await file.arrayBuffer();

        const result = await mammoth.extractRawText({

            arrayBuffer: arrayBuffer

        });

        return result.value;

    }
    catch {

        throw new Error("Unable to read DOCX document.");

    }

}


// ==========================================
// PDF Reader
// ==========================================

async function readPdfFile(file) {

    try {

        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({

            data: arrayBuffer

        }).promise;

        let fullText = "";

        for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {

            const page = await pdf.getPage(pageNo);

            const content = await page.getTextContent();

            const pageText = content.items
                .map(item => item.str)
                .join(" ");

            fullText += pageText + "\n\n";

        }

        return fullText;

    }
    catch {

        throw new Error("Unable to read PDF document.");

    }

}

// ==========================================
// Prepare Study Material
// ==========================================

function prepareStudyMaterial(text) {

    if (!text) {
        throw new Error("No readable text found.");
    }

    // Remove extra spaces
    text = text.replace(/\s+/g, " ").trim();
	if(text.length===0){

    throw new Error("The uploaded document is empty.");

}

    // Remove very short text
    if (text.length < 300) {

        throw new Error(
            "The uploaded file does not contain enough readable study material."
        );

    }

    // Limit very large files
    const MAX_CHARACTERS = 12000;

    if (text.length > MAX_CHARACTERS) {

        text = text.substring(0, MAX_CHARACTERS);

    }

    return text;

}

