var isLoggedIn = localStorage.getItem('isLoggedIn') == 'true' ? true : false;
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');
const registerBtn = document.getElementById('register');
const userNameText = document.getElementById('userName');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const mainContent = document.getElementById('mainContent');


loginBtn.addEventListener('click', function(){
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    mainContent.style.display = 'none';
});

logoutBtn.addEventListener('click', function(){
    logout();
});

registerBtn.addEventListener('click', function(){
    registerForm.style.display = '';
    loginForm.style.display = 'none';
    mainContent.style.display = 'none';
});


registerForm.addEventListener('submit', function(e){
    e.preventDefault();
    register();
});

loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    login();
});



var userName = 'No name';

if(isLoggedIn){
    userName = localStorage.getItem('userName');
    fetch('userdata.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        
        var userData = data.users;
        //console.log(userData);

        var found = false;
        
        for(var i = 0; i < userData.length; i++){
            if(userData[i].username == userName){
                found = true;
                break;
            }
        }

        if(!found){
            isLoggedIn = false;
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('userName', '');
        }
        init();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

init();


var isPaused = false;

var squareX = 10;
var squareY = 10;

var color = 'red';

var squareSpeed = 10;

squareX = localStorage.getItem('squareX') ? parseInt(localStorage.getItem('squareX')) : 10;
squareY = localStorage.getItem('squareY') ? parseInt(localStorage.getItem('squareY')) : 10;
color = localStorage.getItem('color') ? localStorage.getItem('color') : 'red';
squareSpeed = localStorage.getItem('squareSpeed') ? parseInt(localStorage.getItem('squareSpeed')) : 10;

canv();


//If we click on the canvas, pause the game and use stopPropagation to prevent the event from bubbling up
document.getElementById('canv').addEventListener('click', function(event){
    isPaused = !isPaused;
    event.stopPropagation();
});

//If we click on the div with the id 'mainContent', change its background color to a random color and use getComputedStyle
document.getElementById('mainContent').addEventListener('click', function(event){
    event.currentTarget.style.backgroundColor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
    console.log(getComputedStyle(event.currentTarget).backgroundColor);
});


//When pressing the arrow keys, move the red square
document.addEventListener('keydown', function(event){

    if(isPaused){
        return;
    }

    var canvas = document.getElementById('canv');
    var ctx = canvas.getContext('2d');

    if(event.key == 'ArrowUp'){
        squareY -= squareSpeed;
    }else if(event.key == 'ArrowDown'){
        squareY += squareSpeed;
    }
    if(event.key == 'ArrowLeft'){
        squareX -= squareSpeed;
    }
    else if(event.key == 'ArrowRight'){
        squareX += squareSpeed;
    }

    //if we pressed space, reset the position of the square
    if(event.key == ' '){
        squareX = 10;
        squareY = 10;
    }
    
    //if we press c, give the square a random color
    if(event.key == 'c'){
        var prevColorsList = document.getElementById('prevColors');

        //Create a new div element and color it with the current color
        var newDiv = document.createElement('div');
        newDiv.style.width = '20px';
        newDiv.style.height = '20px';
        newDiv.style.backgroundColor = color;
        newDiv.style.margin = '5px';
        prevColorsList.appendChild(newDiv);

        color = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(squareX, squareY, 10, 10);

    localStorage.setItem('squareX', squareX);
    localStorage.setItem('squareY', squareY);
    localStorage.setItem('color', color);
});


//Every second change the speed to a random value between 1 and 20
setInterval(function(){
    if(isPaused){
        return;
    }
    squareSpeed = Math.floor(Math.random() * 20) + 1;
    localStorage.setItem('squareSpeed', squareSpeed);
    console.log(squareSpeed);
}, 1000);


function init(){
    console.log('init');
    if(isLoggedIn){
        loginBtn.style.display = 'none';
        logoutBtn.style.display = '';
        registerBtn.style.display = 'none';
        userNameText.innerHTML = 'Hello, ' + userName;

        mainContent.style.display = '';
        registerForm.style.display = 'none';
        loginForm.style.display = 'none';
    }else{
        loginBtn.style.display = '';
        logoutBtn.style.display = 'none';
        registerBtn.style.display = '';
        userNameText.innerHTML = 'You are not logged in!';

        mainContent.style.display = 'none';
        registerForm.style.display = 'none';
        loginForm.style.display = 'none';
    }
}

function login(){
    //Get the username and password from the form
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    fetch('userdata.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        
        var userData = data.users;
        //console.log(userData);
        
        for(var i = 0; i < userData.length; i++){
            if(userData[i].username == username && userData[i].password == password){
                isLoggedIn = true;
                userName = username;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', userName);
                init();
                return;
            }
        }
        window.location.href = '404page.html';
        alert('Invalid username or password!');
    })
    .catch(error => {
        console.error('Error:', error);

        //Load the 404page.html
        window.location.href = '404page.html';
    });
}

function logout(){
    console.log('logout');
    isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('userName', '');
    init();
}

function register(){
    var username = document.getElementById('registerUsername').value;
    var password = document.getElementById('registerPassword').value;
    var email = document.getElementById('registerEmail').value;
    var phone = document.getElementById('registerPhoneNumber').value;
    var name = document.getElementById('registerName').value;
    var surname = document.getElementById('registerSurname').value;


    fetch('userdata.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        
        var userData = data.users;
        //console.log(userData);
        
        for(var i = 0; i < userData.length; i++){
            if(userData[i].username == username){
                alert('Username already exists!');
                return;
            }
            if(userData[i].email == email){
                alert('Email already exists!');
                return;
            }
        }

        var newUser = {
            "username": username,
            "password": password,
            "email": email,
            "phoneNumber": phone,
            "name": name,
            "surname": surname
        };

        userData.push(newUser);

        var newData = {
            "users": userData
        };

        fetch('userdata.json', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            if (data) {
                data = JSON.parse(data);
                console.log('Success:', data);
            }
        
            isLoggedIn = true;
            userName = username;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', userName);
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
            //Load the 404page.html
            window.location.href = '404page.html';
        });


    })
    .catch(error => {
        console.error('Error:', error);

        //Load the 404page.html
        window.location.href = '404page.html';
    });
}




function canv(){
    // Get a reference to the canvas element
    var canvas = document.getElementById('canv');

    // Get the 2D rendering context
    var ctx = canvas.getContext('2d');

    // Set the fill color to red
    ctx.fillStyle = color;

    // Draw a filled rectangle
    ctx.fillRect(squareX, squareY, 10, 10);
}