const users = [];

//Returns the username and room in an object
// if there is an error then returns an error message
const addUser = ({ id, username, room }) => {
    //cleaning the data
    // username = username.trim();
    // room = room.trim();

    //validating the data
    if (!username || !room)
        return {
            error: 'Username and room name required',
            user: undefined
        }

    //Cheching with existing users
    let check = false;
    users.forEach((user) => {
        if (user.username === username)
            check = true;
    })

    if (check === true)
        return {
            error: 'Username already taken',
            user: undefined
        };

    //Adding user to the users array;
    const user = { id:id,
         username:username,
          room:room };

    users.push(user);
    return {
        error: undefined,
        user: user
    };

}

//Removes a user with a given id and returns that user
const removeUser = (id) => {
    const index = users.findIndex((obj) => {
        return obj.id === id
    })

   const user=users[index];
    users.splice(index,1);
    return user;
}

//Finds users with a specific id
const getUser = (id) => {
    const user = users.find((obj) => obj.id === id)
    return user;
}

//Finds users in a specific room
const getUsersInRoom = (room) => {
    const inRoom = users.filter((user) => {
        return user.room === room;
    })

    return inRoom;
}






module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}