document.getElementById('show-register').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.form-container')[0].classList.add('hidden');
    document.querySelectorAll('.form-container')[1].classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.form-container')[1].classList.add('hidden');
    document.querySelectorAll('.form-container')[0].classList.remove('hidden');
});

 // Disable Right-Click
 document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});


        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCE1Yr5qvk7s-fOZ3jOxrda9UQWaCffAmk",
            authDomain: "distributed-social-netwo-79a9b.firebaseapp.com",
            databaseURL: "https://distributed-social-netwo-79a9b-default-rtdb.firebaseio.com",
            projectId: "distributed-social-netwo-79a9b",
            storageBucket: "distributed-social-netwo-79a9b.appspot.com",
            messagingSenderId: "148805724549",
            appId: "1:148805724549:web:ac08d7c0bf82ce9ada7cec",
            measurementId: "G-M56NKN0LCF"
          };
        
                // Initialize Firebase
                firebase.initializeApp(firebaseConfig);
        
                // Get a reference to the auth service
                const auth = firebase.auth();
        
                // Switch between login and registration forms
                document.getElementById('show-register').addEventListener('click', function (event) {
                    event.preventDefault();
                    document.getElementById('login-container').classList.add('hidden');
                    document.getElementById('register-container').classList.remove('hidden');
                });
        
                document.getElementById('show-login').addEventListener('click', function (event) {
                    event.preventDefault();
                    document.getElementById('register-container').classList.add('hidden');
                    document.getElementById('login-container').classList.remove('hidden');
                });
        
                // Handle login form submission
                document.getElementById('login-form').addEventListener('submit', function (event) {
                    event.preventDefault();
                    const email = document.getElementById('login-email').value;
                    const password = document.getElementById('login-password').value;
        
                    auth.signInWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // Logged in successfully
                            alert('Login successful!');
                            localStorage.setItem('userEmail', email);
                            // Redirect to the newsfeed page or dashboard
                            window.location.href = 'newsfeed.html';
                        })
                        .catch((error) => {
                            alert('Error: ' + error.message);
                        });
                });
        
                // Handle registration form submission
                document.getElementById('register-form').addEventListener('submit', function (event) {
                    event.preventDefault();
                    const name = document.getElementById('register-name').value;
                    const email = document.getElementById('register-email').value;
                    const password = document.getElementById('register-password').value;
        
                    auth.createUserWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // Registered successfully
                            alert('Registration successful!');
                            // Optionally, you can add code here to update user profile with their name
                        })
                        .catch((error) => {
                            alert('Error: ' + error.message);
                        });
                });