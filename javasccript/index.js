let candidates = []; //Global variables (works as our database)
let certificates = [];
let lastCandidateId = 3; // global variables used to have a storage of the latest ID (solves the problem user deletes every entry and we cant get the last added Id) - Auto Increment | Identity
let lastCertificateId = 3;

// Constructors
class Candidate {
    constructor(CNumber, FName, MName, LName, Gender, NLanguage, BDate, PhotoIDType, PhotoIDNumber, PhotoIDIssueDate, Email, Address, Address2, Residence, Province, City, PostalCode, LandlineNu, MobileNu) {
        this.CNumber = CNumber; // Primary Key
        this.FName = FName;
        this.MName = MName;
        this.LName = LName;
        this.Gender = Gender;
        this.NLanguage = NLanguage;
        this.BDate = BDate;
        this.PhotoIDType = PhotoIDType;
        this.PhotoIDNumber = PhotoIDNumber;
        this.PhotoIDIssueDate = PhotoIDIssueDate;
        this.Email = Email;
        this.Address = Address;
        this.Address2 = Address2;
        this.Residence = Residence;
        this.Province = Province;
        this.City = City;
        this.PostalCode = PostalCode;
        this.LandlineNu = LandlineNu;
        this.MobileNu = MobileNu;
    }
}

class Certificate {
    constructor(TittleCertificate, FName, MName, LName, CNumber, certificateId, AssessmentTCode, ExaminationDate, ScoreReportDate, CandidateScore, MaximumScore, PercentageScore, AssessmentResult, ArrayOfTopic = []) {
        this.TittleCertificate = TittleCertificate;
        this.FName = FName;
        this.MName = MName;
        this.LName = LName;
        this.CNumber = CNumber; // Foreign Key
        this.certificateId = certificateId; //added to control the row of each entry dynamically 
        //(we save memory/time by not creating a new array to have each candidate mapped with the certificate) - Id Works as Primary key(certificate) and CNumber is the Foreign Key (Candidate)
        this.AssessmentTCode = AssessmentTCode;
        this.ExaminationDate = ExaminationDate;
        this.ScoreReportDate = ScoreReportDate;
        this.CandidateScore = CandidateScore;
        this.MaximumScore = MaximumScore;
        this.PercentageScore = PercentageScore;
        this.AssessmentResult = AssessmentResult;
        // Array of topic
        this.ArrayOfTopic = ArrayOfTopic;
    }
}

// Initialization
function InitializeMainStuff() {
    // we fill the starting arrays with dummy data
    candidates = generateDummyData("Candidate");
    addMultipleDataToTable(candidates, 'listOfCandidates')
    certificates = generateDummyData("Certificate");
    addMultipleDataToTable(certificates, 'listOfCertificates')
}

function InitializeMainUI() {
    $(document).ready(function () {
        // Main View
        $("#infoCandidateDiv").hide();
        $("#infoCertificateFormDiv").hide();
        $("#candidateTab").show();
        $("#certificateTab").hide();

        // Toggle on Candidates / Certifications Tabs
        $("#CandidatesNavBtn").click(function () {
            $("#candidateTab").show();
            $("#certificateTab").hide();

            document.getElementById('CandidatesNavBtn').style.backgroundColor = "#3F72AF";
            document.getElementById('CandidatesNavBtn').style.color = "#F9F7F7";

            document.getElementById('CertificationsNavBtn').style.backgroundColor = "transparent";
            document.getElementById('CertificationsNavBtn').style.color = "#3F72AF";

            candidateListView();

            document.getElementById('candidateForm').reset();
        });
        $("#CertificationsNavBtn").click(function () {
            $("#candidateTab").hide();
            $("#certificateTab").show();

            document.getElementById('CandidatesNavBtn').style.backgroundColor = "transparent";
            document.getElementById('CandidatesNavBtn').style.color = "#3F72AF";

            document.getElementById('CertificationsNavBtn').style.backgroundColor = "#3F72AF";
            document.getElementById('CertificationsNavBtn').style.color = "#F9F7F7";

            certificateListView();

            document.getElementById('certificateForm').reset();
        });

        // Toggle Candidate List / Candidate Form views
        $("#listOfCandidatesBtn").click(function () {
            candidateListView();
        });
        $("#candidateInfoBtn").click(function () {
            candidateFormView();

            document.getElementById('candidateForm').reset();

            document.getElementById('submitCandidate').value = "Submit New Candidate";
            document.getElementById('submitCandidateHeader').innerHTML = "Adding new Candidate";

            // Initialize Candidate Number
            document.getElementById('candidate_id').value = lastCandidateId + 1;
            $("small").remove();
        });

        // Toggle Certificate List / Certificate Form views
        $("#listOfCertificatesBtn").click(function () {
            certificateListView();
        });
    });
}
InitializeMainStuff();
InitializeMainUI();

// Business Logic
// Step 1 Initial View with demo data
function addMultipleDataToTable(itemsToBeAdded, tableId) {
    // Step 1. Find on the table with id = tableId the id of the tbody (of the table)
    let tableBodyId = document.getElementById(tableId).getElementsByTagName("tbody")[0].id;

    // Step 2. For each item in array createTableRow
    let index = 0;
    for (item of itemsToBeAdded) {
        createTableRow(item, index, tableBodyId)
        index++;
    }
}

// Step 2 (Main functions)
function createTableRow(item, index, tableBodyId) {
    // Step 1. Create a new TR element (in browser's memory)
    let trElement = document.createElement('tr');

    // dynamically we add id to row so we get it later for the update
    if (document.getElementById(tableBodyId).parentElement.id == "listOfCandidates") {
        trElement.id = `candidateRowId${item.CNumber}`
    } else if (document.getElementById(tableBodyId).parentElement.id == "listOfCertificates") {
        trElement.id = `certificateRowId${item.certificateId}`
    }

    // Step 2. Generate the contents of the TR element
    let innerHTML = generateTRElement(item, index, document.getElementById(tableBodyId).parentElement.id);

    // Step 3. Store the contents of the TR to the actual TR Element
    trElement.innerHTML = innerHTML; // we insert the data given by the function to the inner html of the tr

    // Step 4. Append to the tbody the new TR
    appendTRToTableBody(trElement, tableBodyId);
}

// Step 3 (Save and Update)
function saveCandidate(event) {
    event.preventDefault();

    let candidateInputs = document.getElementById('candidateForm').getElementsByTagName('input');
    let candidateSelects = document.getElementById('candidateForm').getElementsByTagName('select');
    if (validateForm(candidateInputs)) {

        let candidateExists = false; // initialize with false and become true only in case we find a candidate
        for (i = 0; i <= candidates.length - 1; i++) {
            if (candidates[i] != null) { //case candidate was deleted (undefined entry)
                if (candidates[i].CNumber == document.getElementById('candidate_id').value) { // case user edits a candidate
                    candidateExists = true;
                    { break };
                }
            }
        }

        if (candidateExists) { //update candidate
            let index = document.getElementById('candidate_id').value - 1
            candidates[index].FName = candidateInputs[1].value;
            candidates[index].MName = candidateInputs[2].value;
            candidates[index].LName = candidateInputs[3].value;
            candidates[index].BDate = candidateInputs[4].value;
            candidates[index].Address = candidateInputs[5].value;
            candidates[index].Address2 = candidateInputs[6].value;
            candidates[index].Residence = candidateInputs[7].value;
            candidates[index].Province = candidateInputs[8].value;
            candidates[index].City = candidateInputs[9].value;
            candidates[index].PostalCode = candidateInputs[10].value;
            candidates[index].Email = candidateInputs[11].value;
            candidates[index].LandlineNu = candidateInputs[12].value;
            candidates[index].MobileNu = candidateInputs[13].value;
            candidates[index].PhotoIDNumber = candidateInputs[14].value;
            candidates[index].PhotoIDIssueDate = candidateInputs[15].value;
            candidates[index].Gender = candidateSelects[0].value;
            candidates[index].NLanguage = candidateSelects[1].value;
            candidates[index].PhotoIDType = candidateSelects[2].value;

            updateTableRow(candidates[index], index, 'listOfCandidates');
        } else { //add new candidate
            let candidate = new Candidate(
                lastCandidateId + 1, // CNumber - added dynamically (needs to be added like this, otherwise it is considered a string)
                candidateInputs[1].value, // Fname
                candidateInputs[2].value, // Mname
                candidateInputs[3].value, // Lname
                candidateSelects[0].value, // gender
                candidateSelects[1].value, // n language
                candidateInputs[4].value, // b date
                candidateSelects[2].value, // id type
                candidateInputs[14].value, // id number
                candidateInputs[15].value, // id issue date
                candidateInputs[11].value, // email
                candidateInputs[5].value, // add
                candidateInputs[6].value, // add 2
                candidateInputs[7].value, // residence
                candidateInputs[8].value, // province
                candidateInputs[9].value, // city
                candidateInputs[10].value, // p code
                candidateInputs[12].value, // landline
                candidateInputs[13].value); // mobile
            candidates.push(candidate);
            lastCandidateId++; //update new last ID inserted

            createTableRow(candidate, candidates.length - 1, document.getElementById('listOfCandidates').getElementsByTagName("tbody")[0].id);
        }

        // reset form
        candidateListView();

        document.getElementById('candidateForm').reset();
    }

    function validateForm(input) {
        let validationSuccess = true;
        // used to reset the elements in case they were displayed
        $("small").remove();

        if (input[1].value.length == 0) {
            $('#first_name').after('<small style="color: #D8000C;">Please provide candidate`s first name.</small>');
            validationSuccess = false;
        }
        if (input[3].value.length == 0) {
            $('#last_name').after('<small style="color: #D8000C;">Please provide candidate`s last name.</small>');
            validationSuccess = false;
        }
        if (input[5].value.length == 0) {
            $('#address').after('<small style="color: #D8000C;">Please provide an address.</small>');
            validationSuccess = false;
        }
        if (!phoneNumberValidate(input[13])) { //if not true
            $('#mobile_number').after('<small style="color: #D8000C;">Please provide a valid phone number.</small>');
            validationSuccess = false;
        }
        if (input[12].value.length != 0) { // only in case user provided one (not required)
            if (!phoneNumberValidate(input[12])) {
                $('#landline_number').after('<small style="color: #D8000C;">Please provide a valid landline number.</small>');
                validationSuccess = false;
            }
        }
        if (input[11].value.length != 0) { //not required
            if (!validateEmail(input[11])) {
                $('#email').after('<small style="color: #D8000C;">Please provide a valid email.</small>');
                validationSuccess = false;
            }
        }

        return validationSuccess
    }

    function phoneNumberValidate(phoneInput) {
        //custom phone number validation
        var phoneNumber = /^\+?([0-9]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{3})?[ ]?([0-9]{4})$/;
        if (phoneInput.value.match(phoneNumber)) {
            return true;
        }
        else {
            return false;
        }
    }

    function validateEmail(email) {
        var format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.value.match(format)) {
            return true;
        }
        else {
            return false;
        }
    }
}

function saveCertificate(event) {

    event.preventDefault();

    let certificateInputs = document.getElementById('certificateForm').getElementsByTagName('input');
    let certificateSelects = document.getElementById('certificateForm').getElementsByTagName('select');
    if (validateForm(certificateInputs)) {

        let certificateExists = false;
        for (i = 0; i <= certificates.length - 1; i++) {
            if (certificates[i] != null) {
                if (certificates[i].certificateId == document.getElementById('certificate_id').value) { // case user edits a certificate
                    certificateExists = true;
                    { break };
                }
            }
        }

        if (certificateExists) {
            //update certificate
            let index = document.getElementById('certificate_id').value - 1
            certificates[index].TittleCertificate = certificateInputs[0].value;
            certificates[index].FName = certificateInputs[1].value;
            certificates[index].MName = certificateInputs[2].value;
            certificates[index].LName = certificateInputs[3].value;
            certificates[index].CNumber = certificateInputs[4].value;
            certificates[index].certificateId = certificateInputs[5].value;
            certificates[index].AssessmentTCode = certificateSelects[0].value;
            certificates[index].ExaminationDate = certificateInputs[6].value;
            certificates[index].ScoreReportDate = certificateInputs[7].value;
            certificates[index].CandidateScore = certificateInputs[8].value;
            certificates[index].MaximumScore = certificateInputs[9].value;
            certificates[index].PercentageScore = certificateInputs[10].value;
            certificates[index].AssessmentResult = certificateSelects[1].value;
            certificates[index].ArrayOfTopic[0] = certificateInputs[11].value;
            certificates[index].ArrayOfTopic[1] = certificateInputs[12].value;
            certificates[index].ArrayOfTopic[2] = certificateInputs[13].value;

            updateTableRow(certificates[index], index, 'listOfCertificates');
        } else {
            //add new certificate
            let certificate = new Certificate(
                certificateInputs[0].value, // Title of certificate
                certificateInputs[1].value, // f name
                certificateInputs[2].value, // m name
                certificateInputs[3].value, // l name
                certificateInputs[4].value, // c number
                certificateInputs[5].value, // certificate id
                certificateSelects[0].value, // assessment test code
                certificateInputs[6].value, // examination date
                certificateInputs[7].value, // score report date
                certificateInputs[8].value, // candidate score
                certificateInputs[9].value, // maximum score
                certificateInputs[10].value, // percentage score
                certificateSelects[1].value, // assessment result label
                [certificateInputs[11].value, // topic desc
                certificateInputs[12].value, // awarded marks
                certificateInputs[13].value]); // possible marks
            certificates.push(certificate);
            lastCertificateId++; //update new last row Id inserted

            createTableRow(certificate, certificates.length - 1, document.getElementById('listOfCertificates').getElementsByTagName("tbody")[0].id);
        }

        // reset form
        certificateListView();

        document.getElementById('certificateForm').reset();
    }

    function validateForm(input) {
        let validationSuccess = true;
        // used to reset the elements in case they were displayed
        $("small").remove();

        if (input[0].value.length == 0) {
            $('#certificate_title').after('<small style="color: #D8000C;">Please provide the certificate`s Title.</small>');
            validationSuccess = false;
        }
        if (input[8].value.length == 0 || parseInt(input[8].value) > 100 || parseInt(input[8].value) < 0) {
            $('#candidate_score').after('<small style="color: #D8000C;">Please provide the candidate`s score (max 100).</small>');
            validationSuccess = false;
        }
        if (parseInt(input[9].value) > 100 || parseInt(input[9].value) < 0) {
            $('#maximum_score').after('<small style="color: #D8000C;">Please provide the maximum score (max 100).</small>');
            validationSuccess = false;
        }
        if (parseInt(input[10].value) > 100 || parseInt(input[10].value) < 0) {
            $('#percentage_score').after('<small style="color: #D8000C;">Please provide the percentage score (max 100).</small>');
            validationSuccess = false;
        }
        if (input[12].value.length == 0 || parseInt(input[12].value) > 100 || parseInt(input[12].value) < 0) {
            $('#awarded_marks').after('<small style="color: #D8000C;">Please provide the candidate`s awarded marks (max 100).</small>');
            validationSuccess = false;
        }
        if (parseInt(input[13].value) > 100 || parseInt(input[13].value) < 0) {
            $('#possible_marks').after('<small style="color: #D8000C;">Please provide the possible marks (max 100).</small>');
            validationSuccess = false;
        }

        return validationSuccess
    }
}

function updateTableRow(dataToBeUpdated, index, table) {
    // Check to see what table data we update (Candidate or Certificate)
    if (table == "listOfCandidates") {
        $(`#candidateRowId${dataToBeUpdated.CNumber}`).replaceWith(`
        <tr id="candidateRowId${dataToBeUpdated.CNumber}">
            <th scope="row">${dataToBeUpdated.CNumber}</th>
            <td>${dataToBeUpdated.FName}</td>
            <td>${dataToBeUpdated.LName}</td>
            <td>${dataToBeUpdated.Gender}</td>
            <td>${dataToBeUpdated.BDate}</td>
            <td>
                <button class="btn btn-info" type="button" onClick="addCertificateData('${index}')">Add Certificate</button>
                <button class="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#mainModal" onClick="showCertificateData('${index}')">Show Certificates</button>
                <button class="btn btn-primary" type="button" onClick="editCandidate('${index}')">Details</button>
                <button class="btn btn-danger" type="button" onClick="deleteEntry(${index}, this, candidates, 'listOfCandidates')">Delete</button>
            </td>
        </tr>`);

        for (i = 0; i <= certificates.length - 1; i++) {
            if (certificates[i].CNumber == dataToBeUpdated.CNumber) {
                // update the name middle name and last name of the certificates array (data storage)
                certificates[i].FName = dataToBeUpdated.FName;
                certificates[i].MName = dataToBeUpdated.MName;
                certificates[i].LName = dataToBeUpdated.LName;
            }
        }

        var table = document.getElementById("listOfCertificates");
        for (i = 0, row = 0; row = table.rows[i]; i++) {
            //table rows
            if (dataToBeUpdated.CNumber == row.cells[2].innerHTML) {
                // update the name and last name visible to the certificates list
                row.cells[1].innerHTML = dataToBeUpdated.FName + " " + dataToBeUpdated.LName;
            }
        }

    } else if (table == "listOfCertificates") {
        $(`#certificateRowId${dataToBeUpdated.certificateId}`).replaceWith(`
        <tr id="candidateRowId${dataToBeUpdated.certificateId}">
            <th scope="row">${dataToBeUpdated.TittleCertificate}</th>
            <td>${dataToBeUpdated.FName} ${dataToBeUpdated.LName}</td>
            <td>${dataToBeUpdated.CNumber}</td>
            <td>${dataToBeUpdated.CandidateScore}</td>
            <td>
                <button class="btn btn-primary" type="button" onClick="editCertificate('${index}')">Details</button>
                <button class="btn btn-danger" type="button" onClick="deleteEntry(${index}, this, certificates, 'listOfCertificates')">Delete</button>
            </td>
        </tr>`);
    }
}

// Step 4 (Read Data and load to form)
function editCandidate(index) {
    let candidate = candidates[index];

    // loading the data from the array to the form (ready to be edited)
    let candidateInputs = document.getElementById('candidateForm').getElementsByTagName('input');
    let candidateSelects = document.getElementById('candidateForm').getElementsByTagName('select');
    candidateInputs[0].value = candidate.CNumber; // CNumber
    candidateInputs[1].value = candidate.FName; // Fname
    candidateInputs[2].value = candidate.MName; // Mname
    candidateInputs[3].value = candidate.LName; // Lname
    candidateSelects[0].value = candidate.Gender; // gender
    candidateSelects[1].value = candidate.NLanguage; // n language
    candidateInputs[4].value = candidate.BDate; // b date
    candidateSelects[2].value = candidate.PhotoIDType; // id type
    candidateInputs[14].value = candidate.PhotoIDNumber; // id number
    candidateInputs[15].value = candidate.PhotoIDIssueDate; // id issue date
    candidateInputs[11].value = candidate.Email; // email
    candidateInputs[5].value = candidate.Address; // add
    candidateInputs[6].value = candidate.Address2; // add 2
    candidateInputs[7].value = candidate.Residence; // residence
    candidateInputs[8].value = candidate.Province; // province
    candidateInputs[9].value = candidate.City; // city
    candidateInputs[10].value = candidate.PostalCode; // p code
    candidateInputs[12].value = candidate.LandlineNu; // landline
    candidateInputs[13].value = candidate.MobileNu; // mobile

    // after loading all the data we display the form
    document.getElementById('submitCandidate').value = `Update ${candidate.FName} ${candidate.LName}`;
    document.getElementById('submitCandidateHeader').innerHTML = `Editing Candidate ${candidate.CNumber} "${candidate.FName} ${candidate.LName}"`;
    $("small").remove();
    candidateFormView();
}

function addCertificateData(index) {
    let candidate = candidates[index];

    // resets form before adding data
    document.getElementById('certificateForm').reset();

    // create the form with correct data from the selected candidate
    let certificateInputs = document.getElementById('certificateForm').getElementsByTagName('input');
    certificateInputs[1].value = candidate.FName;
    certificateInputs[2].value = candidate.MName;
    certificateInputs[3].value = candidate.LName;
    certificateInputs[4].value = candidate.CNumber;
    certificateInputs[5].value = lastCertificateId + 1;

    // after loading all the data we display the form
    document.getElementById('submitCertificate').value = `Add Certificate for ${candidate.FName} ${candidate.LName}`;
    document.getElementById('submitCertificateHeader').innerHTML = `Adding Certificate for ${candidate.CNumber} "${candidate.FName} ${candidate.LName}"`;
    $("small").remove();

    $("#candidateTab").hide();
    $("#certificateTab").show();

    document.getElementById('CandidatesNavBtn').style.backgroundColor = "transparent";
    document.getElementById('CandidatesNavBtn').style.color = "#3F72AF";

    document.getElementById('CertificationsNavBtn').style.backgroundColor = "#3F72AF";
    document.getElementById('CertificationsNavBtn').style.color = "#F9F7F7";

    certificateFormView();
}

function editCertificate(index) {
    let certificate = certificates[index];

    // loading the data from the array to the form (ready to be edited)
    let certificateInputs = document.getElementById('certificateForm').getElementsByTagName('input');
    let certificateSelects = document.getElementById('certificateForm').getElementsByTagName('select');
    certificateInputs[0].value = certificate.TittleCertificate; // Title of certificate
    certificateInputs[1].value = certificate.FName; // f name
    certificateInputs[2].value = certificate.MName; // m name
    certificateInputs[3].value = certificate.LName; // l name
    certificateInputs[4].value = certificate.CNumber; // c number
    certificateInputs[5].value = certificate.certificateId; // certificate Id
    certificateSelects[0].value = certificate.AssessmentTCode; // assessment test code
    certificateInputs[6].value = certificate.ExaminationDate; // examination date
    certificateInputs[7].value = certificate.ScoreReportDate; // score report date
    certificateInputs[8].value = certificate.CandidateScore; // candidate score
    certificateInputs[9].value = certificate.MaximumScore; // maximum score
    certificateInputs[10].value = certificate.PercentageScore; // percentage score
    certificateSelects[1].value = certificate.AssessmentResult; // assessment result label
    certificateInputs[11].value = certificate.ArrayOfTopic[0]; // topic desc
    certificateInputs[12].value = certificate.ArrayOfTopic[1]; // awarded marks
    certificateInputs[13].value = certificate.ArrayOfTopic[2]; // possible marks

    // after loading all the data we display the form
    document.getElementById('submitCertificate').value = `Editing Certificate for ${certificate.FName} ${certificate.LName}`;
    document.getElementById('submitCertificateHeader').innerHTML = `Updating Certificate for ${certificate.CNumber} "${certificate.FName} ${certificate.LName}"`;
    $("small").remove();
    certificateFormView();
}

// Step 5 (Delete)
function deleteEntry(index, row, item, tableId) {
    delete item[index]; // delete element at specified index (becomes undefined), frees memory but length of the array doesn't change
    //deletes the current row
    document.getElementById(tableId).deleteRow(row.parentNode.parentNode.rowIndex);
}

// Step 6 (Show Certificate Connection)
function showCertificateData(index) {
    let candidate = candidates[index];
    let text = "";

    document.getElementById('mainModalLabel').innerHTML = `Certificates for ${candidate.FName} ${candidate.LName}`;

    for (i = 0; i <= certificates.length - 1; i++) { //we check the Foreign key to the certificates and print based on that
        if (certificates[i].CNumber == candidate.CNumber) {
            text += `<strong style="color: #3F72AF"> ${certificates[i].TittleCertificate} </strong> <br> Score: ${certificates[i].CandidateScore} <br> Assessment Test Code: ${certificates[i].AssessmentTCode}
            <br> Awarded Marks: ${certificates[i].ArrayOfTopic[1]}`;        
            if (certificates[i].AssessmentResult == "Failed") { // red text for failed
                text += `<br> Assessment Result: <span style="color: red">${certificates[i].AssessmentResult}</span> <br><br>`
            } else { // green text for passed
                text += `<br> Assessment Result: <span style="color: green">${certificates[i].AssessmentResult}</span> <br><br>`
            }
        }
    }

    if (text == "") { // no certificates were found
        text = `No certificates for ${candidate.FName} ${candidate.LName}`;
    }

    document.getElementById('modalData').innerHTML = text;
}

// Complementary Functions
function generateTRElement(dataToBeAdded, index, table) {
    let innerHTML = "";

    // Check to see what table data we create (Candidate or Certificate)
    if (table == "listOfCandidates") {
        innerHTML += `<th scope="row">${dataToBeAdded.CNumber}</th>`;
        innerHTML += `<td>${dataToBeAdded.FName}</td>`;
        innerHTML += `<td>${dataToBeAdded.LName}</td>`;
        innerHTML += `<td>${dataToBeAdded.Gender}</td>`;
        innerHTML += `<td>${dataToBeAdded.BDate}</td>`;
        innerHTML += `<td>
                        <button class="btn btn-info" type="button" onClick="addCertificateData('${index}')">Add Certificates</button>
                        <button class="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#mainModal" onClick="showCertificateData('${index}')">Show Certificates</button>
                        <button class="btn btn-primary" type="button" onClick="editCandidate('${index}')">Details</button>
                        <button class="btn btn-danger" type="button" onClick="deleteEntry(${index}, this, candidates, 'listOfCandidates')">Delete</button>
                      </td>`;
    } else if (table == "listOfCertificates") {
        innerHTML += `<th scope="row">${dataToBeAdded.TittleCertificate}</th>`;
        innerHTML += `<td>${dataToBeAdded.FName} ${dataToBeAdded.LName}</td>`;
        innerHTML += `<td>${dataToBeAdded.CNumber}</td>`;
        innerHTML += `<td>${dataToBeAdded.CandidateScore}</td>`;
        innerHTML += `<td>
                        <button class="btn btn-primary" type="button" onClick="editCertificate('${index}')">Details</button>
                        <button class="btn btn-danger" type="button" onClick="deleteEntry(${index}, this, certificates, 'listOfCertificates')">Delete</button>
                      </td>`;
    }

    return innerHTML;
}

function appendTRToTableBody(element, tableBodyId) {
    let tableBody = document.getElementById(tableBodyId); // we get the table (by id)
    tableBody.appendChild(element); // we append the child tr to the main table
}

function generateDummyData(table) {
    let data = [];

    if (table == "Candidate") {
        data.push(new Candidate(1, "Vlasios", "", "Mavraganis", "Male", "Greek", "2012-09-10", "Passport", "12Kss", "2018-02-11", "vlasis@vmavraganis.gr", "taratatzoum", "tria poulakia", "Nea Ionia", "Attiki", "Athens", "13242", "+30 210 999 9999", "+30 697 777 7777"));
        data.push(new Candidate(2, "Ina", "", "Bogdani", "Female", "English", "2012-09-10", "Native tribal cards", "19jss2", "2018-02-11", "papaki@potamia.gr", "lolipop", "yolo street", "Nea Ionia P2", "Attiki P2", "Athens P2", "98734", "+30 210 123 1234", "+30 697 456 4567"));
        data.push(new Candidate(3, "Empty", "Certificates", "Candidate", "Female", "English", "2017-10-12", "Native tribal cards", "ASJ94H", "2022-01-08", "nocertificates@candidate.gr", "this street", "that street", "that area", "this area", "My City 4Ever", "13462", "+30 210 123 1234", "+30 697 456 4567"));
    } else if (table == "Certificate") {
        data.push(new Certificate("Coding Bootcamp", "Vlasios", "", "Mavraganis", 1, 1, "CB-17", "2018-10-10", "2018-02-11", 10, 100, 10, "Failed", ["C# MVC", 12, 100]));
        data.push(new Certificate("Nursing", "Ina", "", "Bogdani", 2, 2, "Nursing", "2015-04-06", "2016-09-10", 100, 100, 100, "Passed", ["Nursing <3", 100, 100]));
        data.push(new Certificate("Nursing Part 2", "Ina", "", "Bogdani", 2, 3, "Nursing 2", "2010-02-12", "2018-02-11", 99, 100, 99, "Passed", ["Nursing <3 Nu.2", 99, 100]));
    }

    return data;
}

// View of the page
function candidateListView() {
    $(document).ready(function () {
        $("#mainCandidateListDiv").show(300);
        $("#infoCandidateDiv").hide(300);
    });

    document.getElementById('listOfCandidatesBtn').style.backgroundColor = "#3F72AF";
    document.getElementById('listOfCandidatesBtn').style.color = "#F9F7F7";

    document.getElementById('candidateInfoBtn').style.backgroundColor = "transparent";
    document.getElementById('candidateInfoBtn').style.color = "#3F72AF";
}
function candidateFormView() {
    $(document).ready(function () {
        $("#mainCandidateListDiv").hide(300);
        $("#infoCandidateDiv").show(300);
    });

    document.getElementById('listOfCandidatesBtn').style.backgroundColor = "transparent";
    document.getElementById('listOfCandidatesBtn').style.color = "#3F72AF";

    document.getElementById('candidateInfoBtn').style.backgroundColor = "#3F72AF";
    document.getElementById('candidateInfoBtn').style.color = "#F9F7F7";
}

function certificateListView() {
    $(document).ready(function () {
        $("#mainCertificateListDiv").show(300);
        $("#infoCertificateFormDiv").hide(300);
    });

    document.getElementById('listOfCertificatesBtn').style.backgroundColor = "#3F72AF";
    document.getElementById('listOfCertificatesBtn').style.color = "#F9F7F7";

    document.getElementById('certificateInfoBtn').style.backgroundColor = "transparent";
    document.getElementById('certificateInfoBtn').style.color = "#3F72AF";
}
function certificateFormView() {
    $(document).ready(function () {
        $("#mainCertificateListDiv").hide(300);
        $("#infoCertificateFormDiv").show(300);
    });

    document.getElementById('listOfCertificatesBtn').style.backgroundColor = "transparent";
    document.getElementById('listOfCertificatesBtn').style.color = "#3F72AF";

    document.getElementById('certificateInfoBtn').style.backgroundColor = "#3F72AF";
    document.getElementById('certificateInfoBtn').style.color = "#F9F7F7";
}
