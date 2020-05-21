const users =[];

//join user to chat
function userJoin(id, username, room){
    // this.id = id;
    // this.username =username,
    // this.room =room
    const user ={id,username,room};
    users.push(user);

    return user;
}

// get current user
function getCurrentUser(id){
    return users.find(user => user.id = id);
}

//User leaves 
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    console.log(index)
    // delete user leave
    if(index !== -1){
        console.log("user leave:");
        const userL = users.splice(index,1);
        console.log(userL);
        console.log("users sau do:");
        console.log(users);
        return userL[0];
    }
}

//get users from Room
function getUsersRoom (room){
    return users.filter(user=> user.room===room);
}

module.exports = {
   // users,
    userJoin,
    getCurrentUser,
    userLeave,
    getUsersRoom
}