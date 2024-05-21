const sessionIdToUser = new Map();

function setUser(id, user){
    sessionIdToUser.set(id, user);
}

function getUser(id){
    sessionIdToUser.get(id);
}

module.exports ={
    setUser,
    getUser
};