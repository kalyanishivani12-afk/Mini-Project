/* =====================================
   Support Ticket System
   script.js - Part 1
===================================== */

// -------------------------------
// Local Storage Keys
// -------------------------------

const USERS_KEY = "sts_users";
const TICKETS_KEY = "sts_tickets";
const SESSION_KEY = "sts_session";
const HISTORY_KEY = "sts_login_history";

// -------------------------------
// Initialize Demo Data
// -------------------------------

function initializeSystem() {

    if (!localStorage.getItem(USERS_KEY)) {

        const users = [

            {
                id: 1,
                name: "Administrator",
                email: "admin@example.com",
                password: "admin123",
                role: "admin"
            },

            {
                id: 2,
                name: "Support Agent",
                email: "agent@example.com",
                password: "agent123",
                role: "agent"
            },

            {
                id: 3,
                name: "John User",
                email: "user@example.com",
                password: "user123",
                role: "user"
            }

        ];

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    }

    if (!localStorage.getItem(TICKETS_KEY)) {

        localStorage.setItem(
            TICKETS_KEY,
            JSON.stringify([])
        );

    }

    if (!localStorage.getItem(HISTORY_KEY)) {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify([])
        );

    }

}

initializeSystem();

// -------------------------------
// Utility Functions
// -------------------------------

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY));
}

function saveUsers(users) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}

function getTickets() {
    return JSON.parse(localStorage.getItem(TICKETS_KEY));
}

function saveTickets(tickets) {
    localStorage.setItem(
        TICKETS_KEY,
        JSON.stringify(tickets)
    );
}

function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem(SESSION_KEY)
    );
}

function saveSession(user) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );

}

function logout() {

    localStorage.removeItem(SESSION_KEY);

    location.reload();

}

function showPage(id) {

    document.querySelectorAll(".page").forEach(page => {

        page.classList.add("hidden");

    });

    document.getElementById(id).classList.remove("hidden");

}

// -------------------------------
// Register
// -------------------------------

const registerForm = document.getElementById("registerForm");

if (registerForm) {

registerForm.addEventListener("submit", function(e){

    e.preventDefault();

    const name =
    document.getElementById("regName").value;

    const email =
    document.getElementById("regEmail").value;

    const password =
    document.getElementById("regPassword").value;

    const role =
    document.getElementById("regRole").value;

    let users = getUsers();

    const exists = users.find(u => u.email === email);

    if(exists){

        alert("Email already exists");

        return;

    }

    users.push({

        id: Date.now(),

        name,

        email,

        password,

        role

    });

    saveUsers(users);

    alert("Registration Successful");

    document.getElementById("registerForm").reset();

    showPage("loginPage");

});

}

// -------------------------------
// Login
// -------------------------------

const loginForm = document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",function(e){

    e.preventDefault();

    const email =
    document.getElementById("loginEmail").value;

    const password =
    document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(u=>{

        return u.email===email &&
               u.password===password;

    });

    if(!user){

        alert("Invalid Login");

        return;

    }

    saveSession(user);

    let history = JSON.parse(
        localStorage.getItem(HISTORY_KEY)
    );

    history.push({

        name:user.name,

        role:user.role,

        login:new Date().toLocaleString()

    });

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

    location.reload();

});

}

// -------------------------------
// Navigation
// -------------------------------

const showRegister =
document.getElementById("showRegister");

if(showRegister){

showRegister.onclick=function(){

showPage("registerPage");

};

}

const showLogin =
document.getElementById("showLogin");

if(showLogin){

showLogin.onclick=function(){

showPage("loginPage");

};

}

// -------------------------------
// Dashboard Loader
// -------------------------------

const currentUser = getCurrentUser();

if(currentUser){

    if(currentUser.role==="admin"){

        showPage("adminPage");

    }

    else if(currentUser.role==="agent"){

        showPage("agentPage");

    }

    else{

        showPage("userPage");

    }

}
else{

    showPage("loginPage");

}

// -------------------------------
// Logout Buttons
// -------------------------------

const logoutAdmin =
document.getElementById("logoutAdmin");

if(logoutAdmin){

logoutAdmin.onclick=logout;

}

const logoutAgent =
document.getElementById("logoutAgent");

if(logoutAgent){

logoutAgent.onclick=logout;

}

const logoutUser =
document.getElementById("logoutUser");

if(logoutUser){

logoutUser.onclick=logout;

}
/* =====================================
   script.js - Part 2
   User Dashboard
===================================== */

function generateTicketId() {
    return "TKT-" + Math.floor(Math.random() * 900000 + 100000);
}

function loadUserTickets() {

    if (!currentUser || currentUser.role !== "user") return;

    const container = document.getElementById("userTickets");

    if (!container) return;

    const tickets = getTickets();

    const myTickets = tickets.filter(ticket => ticket.createdBy === currentUser.email);

    container.innerHTML = "";

    if (myTickets.length === 0) {
        container.innerHTML = "<p>No tickets found.</p>";
        return;
    }

    myTickets.forEach(ticket => {

        const card = document.createElement("div");
        card.className = "ticket-card";

        card.innerHTML = `
            <h3>${ticket.subject}</h3>

            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>

            <p><strong>Status:</strong>
                <span class="status ${ticket.status.toLowerCase()}">
                    ${ticket.status}
                </span>
            </p>

            <p><strong>Priority:</strong> ${ticket.priority}</p>

            <p>${ticket.description}</p>

            <button onclick="viewTicket('${ticket.ticketId}')">
                View Details
            </button>
        `;

        container.appendChild(card);

    });

}

const ticketForm = document.getElementById("ticketForm");

if (ticketForm) {

ticketForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let tickets = getTickets();

    const ticket = {

        ticketId: generateTicketId(),

        subject: document.getElementById("ticketSubject").value,

        description: document.getElementById("ticketDescription").value,

        priority: document.getElementById("ticketPriority").value,

        status: "Open",

        assignedTo: "",

        createdBy: currentUser.email,

        createdName: currentUser.name,

        createdDate: new Date().toLocaleString(),

        comments: []

    };

    tickets.push(ticket);

    saveTickets(tickets);

    alert("Ticket Created Successfully.");

    ticketForm.reset();

    loadUserTickets();

});

}

function viewTicket(ticketId) {

    showPage("ticketPage");

    const tickets = getTickets();

    const ticket = tickets.find(t => t.ticketId === ticketId);

    const details = document.getElementById("ticketDetails");

    details.innerHTML = `

        <h3>${ticket.subject}</h3>

        <p><b>ID:</b> ${ticket.ticketId}</p>

        <p><b>Status:</b> ${ticket.status}</p>

        <p><b>Priority:</b> ${ticket.priority}</p>

        <p><b>Description:</b></p>

        <p>${ticket.description}</p>

        <p><b>Assigned Agent:</b> ${ticket.assignedTo || "Not Assigned"}</p>

        <p><b>Created:</b> ${ticket.createdDate}</p>

    `;

    loadComments(ticketId);

    const replyForm = document.getElementById("replyForm");

    replyForm.onsubmit = function (e) {

        e.preventDefault();

        const text = document.getElementById("replyText").value.trim();

        if (text === "") return;

        ticket.comments.push({

            sender: currentUser.name,

            role: currentUser.role,

            message: text,

            date: new Date().toLocaleString()

        });

        saveTickets(tickets);

        document.getElementById("replyText").value = "";

        loadComments(ticketId);

    };

}

function loadComments(ticketId) {

    const tickets = getTickets();

    const ticket = tickets.find(t => t.ticketId === ticketId);

    const container = document.getElementById("ticketComments");

    container.innerHTML = "";

    ticket.comments.forEach(comment => {

        const div = document.createElement("div");

        div.className = "comment";

        div.innerHTML = `
            <strong>${comment.sender}</strong>
            (${comment.role})

            <br>

            ${comment.message}

            <br>

            <small>${comment.date}</small>
        `;

        container.appendChild(div);

    });

}

const backButton = document.getElementById("backButton");

if (backButton) {

backButton.onclick = function () {

    if (currentUser.role === "user") {

        showPage("userPage");

        loadUserTickets();

    }

};

}

loadUserTickets();
/* =====================================
   script.js - Part 3
   Agent Dashboard
===================================== */

function loadAgentTickets() {

    if (!currentUser || currentUser.role !== "agent") return;

    const container = document.getElementById("agentTickets");

    if (!container) return;

    const tickets = getTickets();

    const myTickets = tickets.filter(ticket =>

        ticket.assignedTo === currentUser.email

    );

    container.innerHTML = "";

    if (myTickets.length === 0) {

        container.innerHTML = "<h3>No Assigned Tickets</h3>";

        return;

    }

    myTickets.forEach(ticket => {

        const card = document.createElement("div");

        card.className = "ticket-card";

        card.innerHTML = `

            <h3>${ticket.subject}</h3>

            <p><strong>ID:</strong> ${ticket.ticketId}</p>

            <p><strong>Created By:</strong> ${ticket.createdName}</p>

            <p><strong>Priority:</strong> ${ticket.priority}</p>

            <p><strong>Status:</strong>

                <span class="status ${ticket.status.toLowerCase()}">

                    ${ticket.status}

                </span>

            </p>

            <button onclick="openAgentTicket('${ticket.ticketId}')">

                Open Ticket

            </button>

        `;

        container.appendChild(card);

    });

}

function openAgentTicket(ticketId){

    showPage("ticketPage");

    const tickets = getTickets();

    const ticket = tickets.find(t => t.ticketId === ticketId);

    const details = document.getElementById("ticketDetails");

    details.innerHTML = `

        <h2>${ticket.subject}</h2>

        <p><strong>Ticket:</strong> ${ticket.ticketId}</p>

        <p><strong>User:</strong> ${ticket.createdName}</p>

        <p><strong>Description:</strong></p>

        <p>${ticket.description}</p>

        <br>

        <label>Status</label>

        <select id="statusSelect">

            <option value="Open">Open</option>

            <option value="Progress">Progress</option>

            <option value="Closed">Closed</option>

        </select>

        <br><br>

        <button onclick="saveStatus('${ticket.ticketId}')">

            Update Status

        </button>

    `;

    document.getElementById("statusSelect").value = ticket.status;

    loadComments(ticketId);

    const replyForm = document.getElementById("replyForm");

    replyForm.onsubmit = function(e){

        e.preventDefault();

        const message = document.getElementById("replyText").value.trim();

        if(message==="") return;

        ticket.comments.push({

            sender: currentUser.name,

            role: "agent",

            message: message,

            date: new Date().toLocaleString()

        });

        saveTickets(tickets);

        document.getElementById("replyText").value="";

        loadComments(ticketId);

    };

}

function saveStatus(ticketId){

    let tickets = getTickets();

    const ticket = tickets.find(t => t.ticketId === ticketId);

    ticket.status = document.getElementById("statusSelect").value;

    saveTickets(tickets);

    alert("Ticket Status Updated");

    loadAgentTickets();

}

if(backButton){

backButton.onclick = function(){

    if(currentUser.role==="agent"){

        showPage("agentPage");

        loadAgentTickets();

    }

    else if(currentUser.role==="user"){

        showPage("userPage");

        loadUserTickets();

    }

};

}

loadAgentTickets();
/* =====================================
   script.js - Part 4
   Admin Dashboard
===================================== */

function loadAdminDashboard() {

    if (!currentUser || currentUser.role !== "admin") return;

    loadAllTickets();

    loadAgents();

    loadTicketDropdown();

    loadLoginHistory();

    loadStatistics();

}

// =====================================
// Dashboard Statistics
// =====================================

function loadStatistics() {

    const tickets = getTickets();

    const users = getUsers();

    const open = tickets.filter(t => t.status === "Open").length;
    const progress = tickets.filter(t => t.status === "Progress").length;
    const closed = tickets.filter(t => t.status === "Closed").length;

    let stats = document.getElementById("adminStats");

    if (!stats) return;

    stats.innerHTML = `
        <div class="box">
            <h2>${tickets.length}</h2>
            <p>Total Tickets</p>
        </div>

        <div class="box">
            <h2>${open}</h2>
            <p>Open</p>
        </div>

        <div class="box">
            <h2>${progress}</h2>
            <p>In Progress</p>
        </div>

        <div class="box">
            <h2>${closed}</h2>
            <p>Closed</p>
        </div>

        <div class="box">
            <h2>${users.length}</h2>
            <p>Total Users</p>
        </div>
    `;

}

// =====================================
// Display All Tickets
// =====================================

function loadAllTickets() {

    const container = document.getElementById("adminTickets");

    if (!container) return;

    const tickets = getTickets();

    container.innerHTML = "";

    if (tickets.length === 0) {

        container.innerHTML = "<h3>No Tickets Found</h3>";

        return;

    }

    tickets.forEach(ticket => {

        const card = document.createElement("div");

        card.className = "ticket-card";

        card.innerHTML = `
            <h3>${ticket.subject}</h3>

            <p><strong>ID:</strong> ${ticket.ticketId}</p>

            <p><strong>User:</strong> ${ticket.createdName}</p>

            <p><strong>Status:</strong> ${ticket.status}</p>

            <p><strong>Priority:</strong> ${ticket.priority}</p>

            <p><strong>Assigned:</strong>
                ${ticket.assignedTo || "Not Assigned"}
            </p>

            <button onclick="viewAdminTicket('${ticket.ticketId}')">
                View Ticket
            </button>
        `;

        container.appendChild(card);

    });

}

// =====================================
// Ticket Details
// =====================================

function viewAdminTicket(ticketId){

    showPage("ticketPage");

    const ticket = getTickets().find(t=>t.ticketId===ticketId);

    const details = document.getElementById("ticketDetails");

    details.innerHTML=`

        <h2>${ticket.subject}</h2>

        <p><strong>ID:</strong> ${ticket.ticketId}</p>

        <p><strong>User:</strong> ${ticket.createdName}</p>

        <p><strong>Status:</strong> ${ticket.status}</p>

        <p><strong>Priority:</strong> ${ticket.priority}</p>

        <p>${ticket.description}</p>

    `;

    loadComments(ticketId);

}

// =====================================
// Agent Dropdown
// =====================================

function loadAgents(){

    const select=document.getElementById("assignAgent");

    if(!select) return;

    select.innerHTML="";

    const users=getUsers();

    users.filter(user=>user.role==="agent")
         .forEach(agent=>{

        const option=document.createElement("option");

        option.value=agent.email;

        option.textContent=agent.name;

        select.appendChild(option);

    });

}

// =====================================
// Ticket Dropdown
// =====================================

function loadTicketDropdown(){

    const select=document.getElementById("assignTicket");

    if(!select) return;

    select.innerHTML="";

    getTickets().forEach(ticket=>{

        const option=document.createElement("option");

        option.value=ticket.ticketId;

        option.textContent=ticket.ticketId+" - "+ticket.subject;

        select.appendChild(option);

    });

}

// =====================================
// Assign Ticket
// =====================================

const assignForm=document.getElementById("assignForm");

if(assignForm){

assignForm.addEventListener("submit",function(e){

    e.preventDefault();

    const ticketId=document.getElementById("assignTicket").value;

    const agent=document.getElementById("assignAgent").value;

    let tickets=getTickets();

    const ticket=tickets.find(t=>t.ticketId===ticketId);

    if(ticket){

        ticket.assignedTo=agent;

        ticket.status="Progress";

    }

    saveTickets(tickets);

    alert("Ticket Assigned Successfully.");

    loadAllTickets();

});

}

// =====================================
// Login History
// =====================================

function loadLoginHistory(){

    const historyBox=document.getElementById("loginHistory");

    if(!historyBox) return;

    const history=JSON.parse(localStorage.getItem(HISTORY_KEY));

    historyBox.innerHTML="";

    history.forEach(item=>{

        const div=document.createElement("div");

        div.className="comment";

        div.innerHTML=`

            <strong>${item.name}</strong>

            (${item.role})

            <br>

            ${item.login}

        `;

        historyBox.appendChild(div);

    });

}

// =====================================
// Load Admin
// =====================================

loadAdminDashboard();
/* =====================================
   script.js - Part 5
   Final Features
===================================== */

// ===============================
// Search Tickets
// ===============================

function searchTickets(keyword){

    keyword = keyword.toLowerCase();

    const cards = document.querySelectorAll(".ticket-card");

    cards.forEach(card=>{

        const text = card.innerText.toLowerCase();

        if(text.includes(keyword)){

            card.style.display="block";

        }else{

            card.style.display="none";

        }

    });

}

// ===============================
// Filter by Status
// ===============================

function filterTickets(status){

    const tickets=document.querySelectorAll(".ticket-card");

    tickets.forEach(card=>{

        if(status==="All"){

            card.style.display="block";

            return;

        }

        if(card.innerText.includes(status)){

            card.style.display="block";

        }else{

            card.style.display="none";

        }

    });

}

// ===============================
// Delete Ticket (Admin)
// ===============================

function deleteTicket(ticketId){

    if(!confirm("Delete this ticket?")) return;

    let tickets=getTickets();

    tickets=tickets.filter(ticket=>ticket.ticketId!==ticketId);

    saveTickets(tickets);

    loadAllTickets();

    loadUserTickets();

    loadAgentTickets();

    showToast("Ticket Deleted");

}

// ===============================
// Export CSV
// ===============================

function exportTickets(){

    const tickets=getTickets();

    if(tickets.length===0){

        alert("No Tickets");

        return;

    }

    let csv="Ticket ID,Subject,Status,Priority,User,Agent\n";

    tickets.forEach(ticket=>{

        csv+=`${ticket.ticketId},${ticket.subject},${ticket.status},${ticket.priority},${ticket.createdName},${ticket.assignedTo}\n`;

    });

    const blob=new Blob([csv],{

        type:"text/csv"

    });

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="tickets.csv";

    a.click();

    URL.revokeObjectURL(url);

}

// ===============================
// Toast Notification
// ===============================

function showToast(message){

    const toast=document.getElementById("toast");

    if(!toast){

        alert(message);

        return;

    }

    toast.innerHTML=message;

    toast.style.display="block";

    toast.style.opacity="1";

    setTimeout(()=>{

        toast.style.opacity="0";

        setTimeout(()=>{

            toast.style.display="none";

        },500);

    },2500);

}

// ===============================
// Dark Mode
// ===============================

function toggleDarkMode(){

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "darkMode",

        document.body.classList.contains("dark")

    );

}

if(localStorage.getItem("darkMode")==="true"){

    document.body.classList.add("dark");

}

// ===============================
// Statistics Refresh
// ===============================

function refreshAll(){

    if(currentUser){

        if(currentUser.role==="admin"){

            loadAdminDashboard();

        }

        if(currentUser.role==="agent"){

            loadAgentTickets();

        }

        if(currentUser.role==="user"){

            loadUserTickets();

        }

    }

}

// ===============================
// Auto Refresh Every Minute
// ===============================

setInterval(refreshAll,60000);

// ===============================
// Final Startup
// ===============================

document.addEventListener("DOMContentLoaded",()=>{

    refreshAll();

    console.log("Support Ticket System Loaded");

});