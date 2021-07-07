const socket = io();

const $messageBox = document.querySelector('#messages');
const musTemplate = document.querySelector('#message-template').innerHTML;
const mapTemplate = document.querySelector('#map-template').innerHTML;
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;

//Query objects
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })




socket.on('message', (m) => {
    console.log(m.text);
    if(!m.username)
        m.username='Admin';


    const html = Mustache.render(musTemplate, {
        message: m.text,
        createdAt: moment(m.createdAt).format('h:mm a'),
        username: m.username
    });
    $messageBox.insertAdjacentHTML("beforeend", html);
})




document.querySelector('#send').addEventListener('click', () => {

    const $sendButton = document.querySelector('#send');
    const $chat = document.querySelector('#msg');

    //Disabling the send button 
    $sendButton.setAttribute('disabled', 'disabled');
    const chatInput = $chat;

    socket.emit('sendMessage', chatInput.value, (error) => {
        //Emptying the chatbox
        $chat.value = '';

        //Re-enabling the send button
        $sendButton.removeAttribute('disabled');

        //focussing on the chat box
        $chat.focus();
        if (error) {
            return console.log('Profanity not allowed');
        }

        console.log('Message delivered!');
    })

})




document.querySelector('.location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation is not supported in your browser');


    const $loc_button = document.querySelector('.location');
    //Disabling the location share button
    $loc_button.setAttribute('disabled', 'disabled');


    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            //Re enabling the location share button
            $loc_button.removeAttribute('disabled');
            console.log('Location shared!');
        });
    })
})





socket.on('locationMessage', (locationObject) => {
    console.log(locationObject.url);
    const html = Mustache.render(mapTemplate, {
        url: locationObject.url,
        createdAt: moment(locationObject.createdAt).format('h:mm a'),
        username: locationObject.username
    })
    $messageBox.insertAdjacentHTML("beforeend", html);
})




socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/'
    }
});

socket.on('roomData',({room,users})=>{
    console.log(users)
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html;
})