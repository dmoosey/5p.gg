const fs = require('fs');

const addUser = async (msg, user) => {
    try {
        const DATABASE = JSON.parse(fs.readFileSync('./data/DATABASE.json', 'utf8'));
        // Convert DATABASE data to an object
        const usersExist = Object.keys(DATABASE).includes("users");

        if (!usersExist) DATABASE.users = {};

        const users = Object.keys(DATABASE.users);

        // If the user already has a profile return
        if (users.some(e => e == user.id)) return `${user} You already have a 5p.gg profile.`

        // Add new data, checking if user already has a profile
        if (!users.includes(user.id)) {
            DATABASE["users"][user.id] = {
                aliases: [user.username],
                permissions: {},
                pool: {}
            }
        };

        console.log(DATABASE);

        // Convert back to JSON
        const updated = JSON.stringify(DATABASE);

        // Write updated obj
        fs.writeFileSync('./data/DATABASE.json', updated, 'utf8');

        return `Profile initalized for user ${user.username} (${user}).`

    } catch (err) {
        console.log(err)
        return err.message
    }


};

module.exports = { addUser };