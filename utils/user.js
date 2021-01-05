const fs = require('fs');

const addUser = async (input) => {
    try {
        const DATABASE = JSON.parse(fs.readFileSync('./data/DATABASE.json', 'utf8'));
        const userId = input.user.id;
        // Convert DATABASE data to an object
        const usersExist = Object.keys(DATABASE).includes("users");

        if (!usersExist) DATABASE.users = {};

        const users = Object.keys(DATABASE.users);

        // If the user already has a profile return
        if (users.some(e => e == userId)) return `${user} You already have a 5p.gg profile.`

        // Add new data, checking if user already has a profile
        if (!users.includes(userId)) {
            DATABASE["users"][userId] = {
                aliases: [input.user.username],
                permissions: {},
                pool: {}
            }
        };

        console.log(DATABASE);

        // Convert back to JSON
        const updated = JSON.stringify(DATABASE);

        // Write updated obj
        fs.writeFileSync('./data/DATABASE.json', updated, 'utf8');

        return `Profile initalized for user (${input.user.username}).`

    } catch (err) {
        console.log(err)
        return err.message
    }


};

module.exports = { addUser };