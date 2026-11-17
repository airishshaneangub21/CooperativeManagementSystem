
// Check if user is logged in
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// NAVIGATION
const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

navLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        const pageName = this.dataset.page;

        
        if (pageName === "logout") {
        const confirmLogout = confirm("Are you sure you want to logout?");

        if (confirmLogout) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");

             window.location.href = "login.html";
    }

    return;
}


        pages.forEach(page => page.hidden = true);

        const selectedPage = document.getElementById(pageName);

        if (selectedPage) {
            selectedPage.hidden = false;
        }

        navLinks.forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");
    });
});


// MEMBERS MANAGEMENT

const memberForm = document.getElementById("memberForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const contact = document.getElementById("contact");
const email = document.getElementById("email");
const address = document.getElementById("address");

const memberTableBody = document.getElementById("memberTableBody");
const searchMember = document.getElementById("searchMember");
const memberCount = document.getElementById("memberCount");

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const totalMembers = document.getElementById("totalMembers");

let members = JSON.parse(localStorage.getItem("coopMembers")) || [];
let editingId = null;


// SAVE MEMBERS
function saveMembers() {
    localStorage.setItem("coopMembers", JSON.stringify(members));
}


// DISPLAY MEMBERS
function displayMembers(data = members) {

    memberTableBody.innerHTML = "";

    data.forEach(member => {

        const row = document.createElement("tr");

        const values = [
            `MEM-${String(member.id).slice(-6)}`,
            member.firstName,
            member.lastName,
            member.contact,
            member.email,
            member.address
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "action-btn edit-btn";
        editButton.addEventListener("click", () => editMember(member.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "action-btn delete-btn";
        deleteButton.addEventListener("click", () => deleteMember(member.id));

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        memberTableBody.appendChild(row);
    });

    memberCount.textContent = `Total Members: ${members.length}`;
    totalMembers.textContent = members.length;
}


// ADD AND UPDATE MEMBER
memberForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const memberData = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        contact: contact.value.trim(),
        email: email.value.trim(),
        address: address.value.trim()
    };

    if (Object.values(memberData).some(value => !value)) {
        alert("Please complete all fields.");
        return;
    }

    if (editingId !== null) {

        members = members.map(member =>
            member.id === editingId
                ? { ...member, ...memberData }
                : member
        );

        alert("Member updated successfully!");

    } else {

        const newMember = {
            id: Date.now(),
            ...memberData
        };

        members.push(newMember);

        alert("Member added successfully!");
    }

    saveMembers();
    displayMembers();
    resetForm();
});


// EDIT MEMBER
function editMember(id) {

    const member = members.find(member => member.id === id);

    if (!member) return;

    firstName.value = member.firstName;
    lastName.value = member.lastName;
    contact.value = member.contact;
    email.value = member.email;
    address.value = member.address;

    editingId = id;

    formTitle.textContent = "Edit Member";
    saveBtn.textContent = "Update Member";
    cancelBtn.hidden = false;

    document.getElementById("members").scrollIntoView({
        behavior: "smooth"
    });
}


// DELETE MEMBER
function deleteMember(id) {

    if (confirm("Are you sure you want to delete this member?")) {

        members = members.filter(member => member.id !== id);

        saveMembers();
        displayMembers();

        if (editingId === id) {
            resetForm();
        }

        alert("Member deleted successfully!");
    }
}


// CANCEL EDIT / RESET FORM
function resetForm() {

    memberForm.reset();
    editingId = null;

    formTitle.textContent = "Add New Member";
    saveBtn.textContent = "Add Member";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);


// SEARCH MEMBERS
searchMember.addEventListener("input", function() {

    const searchText = this.value.toLowerCase();

    const filteredMembers = members.filter(member => {

        return (
            member.firstName.toLowerCase().includes(searchText) ||
            member.lastName.toLowerCase().includes(searchText) ||
            member.contact.toLowerCase().includes(searchText) ||
            member.email.toLowerCase().includes(searchText)
        );
    });

    displayMembers(filteredMembers);
});


// INITIAL DISPLAY
displayMembers();

console.log("Cooperative Management System is ready!");

// ================================
// SAVINGS MANAGEMENT
// ================================

const savingsForm = document.getElementById("savingsForm");
const savingsMember = document.getElementById("savingsMember");
const transactionType = document.getElementById("transactionType");
const savingsAmount = document.getElementById("savingsAmount");
const savingsDate = document.getElementById("savingsDate");
const savingsRemarks = document.getElementById("savingsRemarks");

const savingsTableBody = document.getElementById("savingsTableBody");
const searchSavings = document.getElementById("searchSavings");
const savingsCount = document.getElementById("savingsCount");

const savingsBalance = document.getElementById("savingsBalance");
const totalDeposits = document.getElementById("totalDeposits");
const totalWithdrawals = document.getElementById("totalWithdrawals");

let savings = JSON.parse(localStorage.getItem("coopSavings")) || [];


// FORMAT CURRENCY
function formatMoney(amount) {
    return Number(amount).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP"
    });
}


// SAVE SAVINGS
function saveSavings() {
    localStorage.setItem("coopSavings", JSON.stringify(savings));
}


// LOAD MEMBERS INTO DROPDOWN
function loadSavingsMembers() {

    const selectedValue = savingsMember.value;

    savingsMember.innerHTML =
        '<option value="">Select Member</option>';

    const currentMembers =
        JSON.parse(localStorage.getItem("coopMembers")) || [];

    currentMembers.forEach(member => {

        const option = document.createElement("option");

        option.value = member.id;
        option.textContent =
            member.firstName + " " + member.lastName;

        savingsMember.appendChild(option);
    });

    if (currentMembers.some(member =>
        String(member.id) === selectedValue
    )) {
        savingsMember.value = selectedValue;
    }
}


// GET MEMBER NAME
function getMemberName(memberId) {

    const currentMembers =
        JSON.parse(localStorage.getItem("coopMembers")) || [];

    const member = currentMembers.find(
        item => String(item.id) === String(memberId)
    );

    return member
        ? member.firstName + " " + member.lastName
        : "Deleted Member";
}


// GET MEMBER BALANCE
function getMemberBalance(memberId) {

    return savings.reduce((balance, transaction) => {

        if (String(transaction.memberId) !== String(memberId)) {
            return balance;
        }

        if (transaction.type === "Deposit") {
            return balance + Number(transaction.amount);
        }

        return balance - Number(transaction.amount);

    }, 0);
}


// UPDATE SAVINGS SUMMARY
function updateSavingsSummary() {

    const deposits = savings
        .filter(item => item.type === "Deposit")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const withdrawals = savings
        .filter(item => item.type === "Withdrawal")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const balance = deposits - withdrawals;

    savingsBalance.textContent = formatMoney(balance);
    totalDeposits.textContent = formatMoney(deposits);
    totalWithdrawals.textContent = formatMoney(withdrawals);

    // Update dashboard
    const dashboardSavings = document.getElementById("totalSavings");

    if (dashboardSavings) {
        dashboardSavings.textContent = formatMoney(balance);
    }
}


// DISPLAY SAVINGS TRANSACTIONS
function displaySavings(data = savings) {

    savingsTableBody.innerHTML = "";

    data.forEach(transaction => {

        const row = document.createElement("tr");

        const values = [
            transaction.id,
            getMemberName(transaction.memberId),
            transaction.type,
            formatMoney(transaction.amount),
            transaction.date,
            transaction.remarks || "-"
        ];

        values.forEach((value, index) => {

            const cell = document.createElement("td");

            cell.textContent = value;

            if (index === 2) {
                cell.className = transaction.type === "Deposit"
                    ? "deposit-label"
                    : "withdrawal-label";
            }

            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "action-btn delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteSavings(transaction.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        savingsTableBody.appendChild(row);
    });

    savingsCount.textContent =
        `Total Transactions: ${savings.length}`;

    updateSavingsSummary();
}


// ADD SAVINGS TRANSACTION
savingsForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const memberId = savingsMember.value;
    const type = transactionType.value;
    const amount = Number(savingsAmount.value);

    if (!memberId) {
        alert("Please select a member.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (type === "Withdrawal" &&
        amount > getMemberBalance(memberId)) {

        alert("Insufficient savings balance!");
        return;
    }

    const newTransaction = {
        id: "SAV-" + Date.now(),
        memberId: memberId,
        type: type,
        amount: amount,
        date: savingsDate.value,
        remarks: savingsRemarks.value.trim()
    };

    savings.push(newTransaction);

    saveSavings();
    displaySavings();

    savingsForm.reset();
    setTodayDate();

    alert("Savings transaction saved successfully!");
});


// DELETE SAVINGS TRANSACTION
function deleteSavings(id) {

    const transaction = savings.find(item => item.id === id);

    if (!transaction) return;

    if (!confirm("Are you sure you want to delete this transaction?")) {
        return;
    }

    savings = savings.filter(item => item.id !== id);

    saveSavings();
    displaySavings();

    alert("Transaction deleted successfully!");
}


// SEARCH SAVINGS
searchSavings.addEventListener("input", function() {

    const keyword = this.value.toLowerCase();

    const filtered = savings.filter(transaction => {

        const memberName = getMemberName(transaction.memberId);

        return (
            transaction.id.toLowerCase().includes(keyword) ||
            memberName.toLowerCase().includes(keyword) ||
            transaction.type.toLowerCase().includes(keyword) ||
            transaction.date.includes(keyword)
        );
    });

    displaySavings(filtered);
});


// SET TODAY'S DATE
function setTodayDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    savingsDate.value = `${year}-${month}-${day}`;
}


// INITIALIZE SAVINGS
loadSavingsMembers();
setTodayDate();
displaySavings();


// REFRESH MEMBER DROPDOWN WHEN OPENING SAVINGS
const savingsNav = document.querySelector(
    '[data-page="savings"]'
);

if (savingsNav) {
    savingsNav.addEventListener("click", loadSavingsMembers);
}

console.log("Savings Management is ready!");

// ==================================
// LOANS MANAGEMENT
// ==================================

const loanForm = document.getElementById("loanForm");
const loanMember = document.getElementById("loanMember");
const loanAmount = document.getElementById("loanAmount");
const interestRate = document.getElementById("interestRate");
const loanTerm = document.getElementById("loanTerm");
const loanDate = document.getElementById("loanDate");
const loanStatus = document.getElementById("loanStatus");
const loanPurpose = document.getElementById("loanPurpose");

const loanTableBody = document.getElementById("loanTableBody");
const searchLoan = document.getElementById("searchLoan");
const loanCount = document.getElementById("loanCount");

const totalLoanApplications =
    document.getElementById("totalLoanApplications");

const approvedLoans =
    document.getElementById("paymentLoan");

const pendingLoans =
    document.getElementById("pendingLoans");

const loanSaveBtn = document.getElementById("loanSaveBtn");
const loanCancelBtn = document.getElementById("loanCancelBtn");
const loanFormTitle = document.getElementById("loanFormTitle");

let loans = JSON.parse(localStorage.getItem("coopLoans")) || [];
let editingLoanId = null;


// SAVE LOANS
function saveLoans() {
    localStorage.setItem("coopLoans", JSON.stringify(loans));
}


// FORMAT CURRENCY
function formatLoanMoney(amount) {
    return Number(amount).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP"
    });
}


// LOAD MEMBERS INTO DROPDOWN
function loadLoanMembers() {

    const currentValue = loanMember.value;

    const currentMembers =
        JSON.parse(localStorage.getItem("coopMembers")) || [];

    loanMember.innerHTML =
        '<option value="">Select Member</option>';

    currentMembers.forEach(member => {

        const option = document.createElement("option");

        option.value = member.id;
        option.textContent =
            member.firstName + " " + member.lastName;

        loanMember.appendChild(option);
    });

    if (currentMembers.some(member =>
        String(member.id) === currentValue
    )) {
        loanMember.value = currentValue;
    }
}


// GET MEMBER NAME
function getLoanMemberName(memberId) {

    const currentMembers =
        JSON.parse(localStorage.getItem("coopMembers")) || [];

    const member = currentMembers.find(
        item => String(item.id) === String(memberId)
    );

    return member
        ? member.firstName + " " + member.lastName
        : "Deleted Member";
}


// COMPUTE MONTHLY PAYMENT
function calculateMonthlyPayment(amount, rate, months) {

    const totalInterest =
        amount * (rate / 100) * (months / 12);

    const totalPayable = amount + totalInterest;

    return totalPayable / months;
}


// UPDATE LOAN SUMMARY
function updateLoanSummary() {

    const approved = loans.filter(
        loan => loan.status === "Approved"
    ).length;

    const pending = loans.filter(
        loan => loan.status === "Pending"
    ).length;

    totalLoanApplications.textContent = loans.length;
    approvedLoans.textContent = approved;
    pendingLoans.textContent = pending;

    // Update Dashboard Active Loans
    const dashboardLoans =
        document.getElementById("totalActiveLoans");

    if (dashboardLoans) {
        dashboardLoans.textContent = approved;
    }
}


// DISPLAY LOANS
function displayLoans(data = loans) {

    loanTableBody.innerHTML = "";

    data.forEach(loan => {

        const row = document.createElement("tr");

        const monthlyPayment = calculateMonthlyPayment(
            Number(loan.amount),
            Number(loan.interest),
            Number(loan.term)
        );

        const values = [
            loan.id,
            getLoanMemberName(loan.memberId),
            formatLoanMoney(loan.amount),
            loan.interest + "%",
            loan.term + " months",
            formatLoanMoney(monthlyPayment),
            loan.date
        ];

        values.forEach(value => {

            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // STATUS
        const statusCell = document.createElement("td");
        statusCell.textContent = loan.status;

        if (loan.status === "Approved") {
            statusCell.className = "loan-approved";
        } else if (loan.status === "Rejected") {
            statusCell.className = "loan-rejected";
        } else {
            statusCell.className = "loan-pending";
        }

        row.appendChild(statusCell);

        // PURPOSE
        const purposeCell = document.createElement("td");
        purposeCell.textContent = loan.purpose;
        row.appendChild(purposeCell);

        // ACTIONS
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "action-btn edit-btn";

        editButton.addEventListener("click", () => {
            editLoan(loan.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "action-btn delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteLoan(loan.id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        loanTableBody.appendChild(row);
    });

    loanCount.textContent =
        `Total Applications: ${loans.length}`;

    updateLoanSummary();
}


// ADD OR UPDATE LOAN
loanForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const memberId = loanMember.value;
    const amount = Number(loanAmount.value);
    const interest = Number(interestRate.value);
    const term = Number(loanTerm.value);

    if (!memberId) {
        alert("Please select a cooperative member.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid loan amount.");
        return;
    }

    if (!Number.isFinite(interest) ||
        interest < 0 || interest > 100) {
        alert("Interest rate must be between 0 and 100.");
        return;
    }

    if (!Number.isInteger(term) || term < 1 || term > 600) {
        alert("Loan term must be between 1 and 600 months.");
        return;
    }

    const loanData = {
        memberId: memberId,
        amount: amount,
        interest: interest,
        term: term,
        date: loanDate.value,
        status: loanStatus.value,
        purpose: loanPurpose.value.trim()
    };

    if (editingLoanId !== null) {

        loans = loans.map(loan =>
            loan.id === editingLoanId
                ? { ...loan, ...loanData }
                : loan
        );

        alert("Loan application updated successfully!");

    } else {

        const newLoan = {
            id: "LOAN-" + Date.now(),
            ...loanData
        };

        loans.push(newLoan);

        alert("Loan application added successfully!");
    }

    saveLoans();
    displayLoans();
    resetLoanForm();
});


// EDIT LOAN
function editLoan(id) {

    const loan = loans.find(item => item.id === id);

    if (!loan) return;

    loanMember.value = loan.memberId;
    loanAmount.value = loan.amount;
    interestRate.value = loan.interest;
    loanTerm.value = loan.term;
    loanDate.value = loan.date;
    loanStatus.value = loan.status;
    loanPurpose.value = loan.purpose;

    editingLoanId = id;

    loanFormTitle.textContent = "Update Loan Application";
    loanSaveBtn.textContent = "Update Loan";
    loanCancelBtn.hidden = false;

    document.getElementById("loans").scrollIntoView({
        behavior: "smooth"
    });
}


// DELETE LOAN
function deleteLoan(id) {

    if (!confirm("Are you sure you want to delete this loan?")) {
        return;
    }

    loans = loans.filter(loan => loan.id !== id);

    saveLoans();
    displayLoans();

    if (editingLoanId === id) {
        resetLoanForm();
    }

    alert("Loan deleted successfully!");
}


// RESET LOAN FORM
function resetLoanForm() {

    loanForm.reset();
    editingLoanId = null;

    loanFormTitle.textContent = "New Loan Application";
    loanSaveBtn.textContent = "Submit Application";
    loanCancelBtn.hidden = true;

    setLoanTodayDate();
}

loanCancelBtn.addEventListener("click", resetLoanForm);


// SEARCH LOANS
searchLoan.addEventListener("input", function() {

    const keyword = this.value.toLowerCase();

    const filteredLoans = loans.filter(loan => {

        const memberName = getLoanMemberName(loan.memberId);

        return (
            loan.id.toLowerCase().includes(keyword) ||
            memberName.toLowerCase().includes(keyword) ||
            loan.status.toLowerCase().includes(keyword) ||
            loan.purpose.toLowerCase().includes(keyword)
        );
    });

    displayLoans(filteredLoans);
});


// SET TODAY'S DATE
function setLoanTodayDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    loanDate.value = `${year}-${month}-${day}`;
}


// INITIALIZE LOANS
loadLoanMembers();
setLoanTodayDate();
displayLoans();


// REFRESH MEMBER LIST WHEN OPENING LOANS
const loanNav = document.querySelector('[data-page="loans"]');

if (loanNav) {
    loanNav.addEventListener("click", loadLoanMembers);
}

console.log("Loans Management is ready!");

// ==================================
// PAYMENTS MANAGEMENT
// ==================================

const paymentForm = document.getElementById("paymentForm");

const paymentMember = document.getElementById("paymentMember");
const paymentLoan = document.getElementById("paymentLoan");
const paymentBalance = document.getElementById("paymentBalance");
const paymentAmount = document.getElementById("paymentAmount");
const paymentDate = document.getElementById("paymentDate");
const paymentMethod = document.getElementById("paymentMethod");
const paymentRemarks = document.getElementById("paymentRemarks");

const paymentTableBody = document.getElementById("paymentTableBody");
const searchPayment = document.getElementById("searchPayment");

const paymentTotal = document.getElementById("paymentTotal");
const paymentTransactions = document.getElementById("paymentTransactions");
const fullyPaidLoans = document.getElementById("fullyPaidLoans");
const paymentCount = document.getElementById("paymentCount");

let payments = JSON.parse(localStorage.getItem("coopPayments")) || [];


// FORMAT MONEY
function formatPaymentMoney(amount) {
    return Number(amount).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP"
    });
}


// GET LOANS
function getSavedLoans() {
    return JSON.parse(localStorage.getItem("coopLoans")) || [];
}


// GET MEMBERS
function getSavedMembers() {
    return JSON.parse(localStorage.getItem("coopMembers")) || [];
}


// SAVE PAYMENTS
function savePayments() {
    localStorage.setItem("coopPayments", JSON.stringify(payments));
}


// COMPUTE TOTAL LOAN PAYABLE
function getLoanPayable(loan) {

    const amount = Number(loan.amount);
    const interest = Number(loan.interest);
    const term = Number(loan.term);

    const totalInterest = amount * (interest / 100) * (term / 12);

    return amount + totalInterest;
}


// GET TOTAL PAYMENTS FOR A LOAN
function getLoanPayments(loanId) {

    return payments
        .filter(payment => payment.loanId === loanId)
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
}


// GET REMAINING BALANCE
function getRemainingBalance(loan) {

    const payable = getLoanPayable(loan);
    const paid = getLoanPayments(loan.id);

    return Math.max(0, payable - paid);
}


// LOAD MEMBERS
function loadPaymentMembers() {

    const members = getSavedMembers();

    paymentMember.innerHTML =
        '<option value="">Select Member</option>';

    members.forEach(member => {

        const option = document.createElement("option");

        option.value = member.id;
        option.textContent =
            member.firstName + " " + member.lastName;

        paymentMember.appendChild(option);
    });

    loadPaymentLoans();
}


// LOAD APPROVED LOANS
function loadPaymentLoans() {

    const selectedMember = paymentMember.value;
    const loans = getSavedLoans();

    paymentLoan.innerHTML =
        '<option value="">Select Loan</option>';

    const approvedMemberLoans = loans.filter(loan =>
        String(loan.memberId) === String(selectedMember) &&
        loan.status === "Approved" &&
        getRemainingBalance(loan) > 0
    );

    approvedMemberLoans.forEach(loan => {

        const option = document.createElement("option");

        option.value = loan.id;
        option.textContent =
            loan.id + " - " + formatPaymentMoney(loan.amount);

        paymentLoan.appendChild(option);
    });

    updatePaymentBalance();
}


// UPDATE BALANCE FIELD
function updatePaymentBalance() {

    const loanId = paymentLoan.value;
    const loan = getSavedLoans().find(item => item.id === loanId);

    paymentBalance.value = loan
        ? formatPaymentMoney(getRemainingBalance(loan))
        : "";
}


// MEMBER CHANGE
paymentMember.addEventListener("change", function() {
    loadPaymentLoans();
});


// LOAN CHANGE
paymentLoan.addEventListener("change", updatePaymentBalance);


// RECORD PAYMENT
paymentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const loanId = paymentLoan.value;
    const loan = getSavedLoans().find(item => item.id === loanId);

    if (!loan || loan.status !== "Approved") {
        alert("Please select a valid approved loan.");
        return;
    }

    const amount = Number(paymentAmount.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid payment amount.");
        return;
    }

    const remaining = getRemainingBalance(loan);

    if (amount > remaining + 0.001) {
        alert("Payment cannot exceed the remaining balance.");
        return;
    }

    const newPayment = {
        id: "PAY-" + Date.now(),
        loanId: loan.id,
        memberId: loan.memberId,
        amount: amount,
        date: paymentDate.value,
        method: paymentMethod.value,
        remarks: paymentRemarks.value.trim()
    };

    payments.push(newPayment);

    savePayments();
    displayPayments();

    paymentForm.reset();
    setPaymentDate();
    loadPaymentMembers();

    alert("Payment recorded successfully!");
});


// DISPLAY PAYMENT HISTORY
function displayPayments(data = payments) {

    paymentTableBody.innerHTML = "";

    data.forEach(payment => {

        const member = getSavedMembers().find(
            item => String(item.id) === String(payment.memberId)
        );

        const memberName = member
            ? member.firstName + " " + member.lastName
            : "Deleted Member";

        const values = [
            payment.id,
            memberName,
            payment.loanId,
            formatPaymentMoney(payment.amount),
            payment.date,
            payment.method,
            payment.remarks || "-"
        ];

        const row = document.createElement("tr");

        values.forEach(value => {

            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "action-btn delete-btn";

        deleteButton.addEventListener("click", () => {
            deletePayment(payment.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        paymentTableBody.appendChild(row);
    });

    updatePaymentSummary();

    paymentCount.textContent =
        `Total Payments: ${payments.length}`;
}


// UPDATE PAYMENT SUMMARY
function updatePaymentSummary() {

    const total = payments.reduce(
        (sum, payment) => sum + Number(payment.amount), 0
    );

    const loans = getSavedLoans();

    const paidLoans = loans.filter(loan =>
        loan.status === "Approved" &&
        getRemainingBalance(loan) <= 0.001
    ).length;

    paymentTotal.textContent = formatPaymentMoney(total);
    paymentTransactions.textContent = payments.length;
    fullyPaidLoans.textContent = paidLoans;
}


// DELETE PAYMENT
function deletePayment(id) {

    if (!confirm("Are you sure you want to delete this payment?")) {
        return;
    }

    payments = payments.filter(payment => payment.id !== id);

    savePayments();
    displayPayments();
    loadPaymentLoans();

    alert("Payment deleted successfully!");
}


// SEARCH PAYMENT
searchPayment.addEventListener("input", function() {

    const keyword = this.value.toLowerCase();

    const filtered = payments.filter(payment => {

        const member = getSavedMembers().find(
            item => String(item.id) === String(payment.memberId)
        );

        const memberName = member
            ? member.firstName + " " + member.lastName
            : "Deleted Member";

        return (
            payment.id.toLowerCase().includes(keyword) ||
            payment.loanId.toLowerCase().includes(keyword) ||
            memberName.toLowerCase().includes(keyword) ||
            payment.method.toLowerCase().includes(keyword)
        );
    });

    displayPayments(filtered);
});


// SET PAYMENT DATE
function setPaymentDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    paymentDate.value = `${year}-${month}-${day}`;
}


// INITIALIZE PAYMENTS
loadPaymentMembers();
setPaymentDate();
displayPayments();


// REFRESH WHEN OPENING PAYMENTS
const paymentNav = document.querySelector('[data-page="payments"]');

if (paymentNav) {
    paymentNav.addEventListener("click", function() {
        loadPaymentMembers();
        displayPayments();
    });
}

console.log("Payments Management is ready!");

// ==================================
// REPORTS MANAGEMENT
// ==================================

const reportType = document.getElementById("reportType");
const reportSearch = document.getElementById("reportSearch");
const reportTableHead = document.getElementById("reportTableHead");
const reportTableBody = document.getElementById("reportTableBody");
const reportTitle = document.getElementById("reportTitle");

function reportGetData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}

function reportMoney(value) {
    return "₱" + Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function reportEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function reportMemberName(memberId, members) {
    const member = members.find(item =>
        String(item.id) === String(memberId)
    );

    return member
        ? `${member.firstName || ""} ${member.lastName || ""}`.trim()
        : "Unknown Member";
}

function updateReportSummary() {
    const members = reportGetData("coopMembers");
    const savings = reportGetData("coopSavings");
    const loans = reportGetData("coopLoans");
    const payments = reportGetData("coopPayments");

    const savingsBalance = savings.reduce((total, item) => {
        const amount = Number(item.amount) || 0;
        const type = String(item.type || "").toLowerCase();

        return total + (
            type === "withdrawal" ? -amount : amount
        );
    }, 0);

    const loanTotal = loans.reduce((total, item) =>
        total + (Number(item.amount) || 0), 0
    );

    const paymentTotal = payments.reduce((total, item) =>
        total + (Number(item.amount) || 0), 0
    );

    document.getElementById("reportMemberTotal").textContent =
        members.length;

    document.getElementById("reportSavingsTotal").textContent =
        reportMoney(savingsBalance);

    document.getElementById("reportLoanTotal").textContent =
        reportMoney(loanTotal);

    document.getElementById("reportPaymentTotal").textContent =
        reportMoney(paymentTotal);
}

function renderReports() {
    const selectedReport = reportType.value;
    const searchText = reportSearch.value.toLowerCase().trim();

    const members = reportGetData("coopMembers");
    const savings = reportGetData("coopSavings");
    const loans = reportGetData("coopLoans");
    const payments = reportGetData("coopPayments");

    let headers = [];
    let rows = [];
    let title = "";

    if (selectedReport === "members") {
        title = "Members Report";
        headers = ["Member ID", "First Name", "Last Name", "Contact", "Email"];

        rows = members.map(member => [
            member.id,
            member.firstName,
            member.lastName,
            member.contact,
            member.email
        ]);
    }

    else if (selectedReport === "savings") {
        title = "Savings Report";
        headers = ["Transaction ID", "Member", "Type", "Amount", "Date"];

        rows = savings.map(item => [
            item.id,
            reportMemberName(item.memberId, members),
            item.type,
            reportMoney(item.amount),
            item.date
        ]);
    }

    else if (selectedReport === "loans") {
        title = "Loans Report";
        headers = ["Loan ID", "Member", "Amount", "Interest", "Term", "Status"];

        rows = loans.map(item => [
            item.id,
            reportMemberName(item.memberId, members),
            reportMoney(item.amount),
            (item.interestRate || 0) + "%",
            (item.term || 0) + " months",
            item.status
        ]);
    }

    else if (selectedReport === "payments") {
        title = "Payments Report";
        headers = ["Payment ID", "Member", "Loan ID", "Amount", "Date", "Method"];

        rows = payments.map(item => [
            item.id,
            reportMemberName(item.memberId, members),
            item.loanId,
            reportMoney(item.amount),
            item.date,
            item.method
        ]);
    }

    reportTitle.textContent = title;

    reportTableHead.innerHTML = `
        <tr>
            ${headers.map(header =>
                `<th>${reportEscape(header)}</th>`
            ).join("")}
        </tr>
    `;

    const filteredRows = rows.filter(row =>
        row.some(value =>
            String(value ?? "").toLowerCase().includes(searchText)
        )
    );

    if (filteredRows.length === 0) {
        reportTableBody.innerHTML = `
            <tr>
                <td colspan="${headers.length}" style="text-align:center;">
                    No records found.
                </td>
            </tr>
        `;
    } else {
        reportTableBody.innerHTML = filteredRows.map(row => `
            <tr>
                ${row.map(value =>
                    `<td>${reportEscape(value)}</td>`
                ).join("")}
            </tr>
        `).join("");
    }

    updateReportSummary();
}

// Change report type
reportType.addEventListener("change", renderReports);

// Search report records
reportSearch.addEventListener("input", renderReports);

// Print report
document.getElementById("printReportBtn").addEventListener("click", function() {
    renderReports();
    window.print();
});

// Refresh reports when opening the Reports page
const reportNavLink = document.querySelector('[data-page="reports"]');

if (reportNavLink) {
    reportNavLink.addEventListener("click", function() {
        reportSearch.value = "";
        renderReports();
    });
}

// Initial display
renderReports();
