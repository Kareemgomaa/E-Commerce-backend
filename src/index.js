console.log("DEBUG: Frontend script initialized.");

const socket = io("http://localhost:3001");
const messagesContainer = document.getElementById('messagesContainer');
const authStatus = document.getElementById('authStatus');

socket.on("connect", () => {
    console.log("DEBUG: Connected to server. Socket ID:", socket.id);
    authStatus.innerText = "Connected to Server (Wait for Auth)";
});

socket.on("disconnect", () => {
    console.warn("DEBUG: Disconnected from server.");
});

socket.on("connect_error", (err) => {
    console.error("DEBUG: Connection error:", err.message);
});

function authenticate() {
    const token = document.getElementById('tokenInput').value;
    if (!token) return alert("Please enter a token");
    
    socket.emit("authenticate", token);
}

socket.on("authenticated", (data) => {
    console.log("DEBUG: Authentication successful:", data.message);
    authStatus.innerText = data.message;
    authStatus.classList.replace('text-muted', 'text-success');
});

socket.on("error", (msg) => {
    alert("Socket Error: " + msg);
});

socket.on("user:receive-offer", (data) => {
    console.log("DEBUG: Received a new broadcast offer:", data);
    const card = document.createElement('div');
    card.className = 'card shadow-sm border-primary';
    card.innerHTML = `
        <div class="card-header d-flex justify-content-between">
            <span class="badge bg-primary">${data.type.toUpperCase()}</span>
            <small class="text-muted">${new Date(data.createdAt).toLocaleTimeString()}</small>
        </div>
        <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.message}</p>
            ${data.discountCode ? `
                <div class="alert alert-warning py-2">
                    Use Code: <strong>${data.discountCode}</strong>
                </div>
            ` : ''}
        </div>
    `;
    messagesContainer.prepend(card);
});