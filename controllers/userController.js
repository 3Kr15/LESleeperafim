class UserController {
    constructor(model) {
        this.model = model;

        // DOM elements
        this.userList = document.getElementById('userList'); // container to show users
        this.toast = document.getElementById('toast');

        this.renderUsers();
    }

    renderUsers() {
        const users = this.model.getAllUsers();
        this.userList.innerHTML = '';

        users.forEach(user => {
            this.userList.innerHTML += this.createUserCard(user);
        });
    }

    createUserCard(user) {
        return `
            <div class="user-card" data-user-id="${user.id}">
                <div class="avatar">${user.avatar}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-rank">#${user.rank}</div>
                </div>
                <div class="user-actions">
                    <button onclick="controller.deleteUser(${user.id})">🗑 Delete</button>
                </div>
            </div>
        `;
    }

    addUser(userData) {
        const newUser = this.model.addUser(userData);
        this.showToast(`${newUser.name} added successfully!`);
        this.renderUsers();
    }

    deleteUser(userId) {
        const user = this.model.getUserById(userId);
        if (!user) return;
        this.model.deleteUser(userId);
        this.showToast(`${user.name} deleted successfully!`);
        this.renderUsers();
    }

    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        setTimeout(() => this.toast.classList.remove('show'), 3000);
    }
}

// Initialize with some data
const initialUsers = [
    { id: 1, name: "Elissa", avatar: "E", streak: 9 },
    { id: 2, name: "Nicole", avatar: "N", streak: 5 }
];

const controller = new UserController(new UserModel(initialUsers));
