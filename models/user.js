class User {
    constructor({ id, name, avatar, streak = 0, avgHours = 0, rank = 0, trend = "up", badges = [], isCurrentUser = false }) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.streak = streak;
        this.avgHours = avgHours;
        this.rank = rank;
        this.trend = trend;
        this.badges = badges;
        this.isCurrentUser = isCurrentUser;
    }
}

class UserModel {
    constructor(initialUsers = []) {
        this.users = initialUsers.map(u => new User(u));
    }

    getAllUsers() {
        return [...this.users];
    }

    addUser(userData) {
        const newUser = new User(userData);
        this.users.push(newUser);
        this.updateRanks();
        return newUser;
    }

    deleteUser(userId) {
        this.users = this.users.filter(u => u.id !== userId);
        this.updateRanks();
    }

    getUserById(userId) {
        return this.users.find(u => u.id === userId);
    }

    updateRanks() {
        // Sort by streak as example ranking
        this.users.sort((a, b) => b.streak - a.streak);
        this.users.forEach((u, i) => u.rank = i + 1);
    }
}
