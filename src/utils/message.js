const sendMessage = (username, message) => {
    return {
        text: message,
        createdAt: new Date().getTime(),
        username
    }
}

const sendLocation = function (username, locus) {
    return {
        url: `https://google.com/maps?q=${locus.latitude},${locus.longitude} `,
        createdAt: new Date().getTime(),
        username: username
    }
}

module.exports = {
    sendMessage: sendMessage,
    sendLocation: sendLocation
}

