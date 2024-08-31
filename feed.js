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
const db = firebase.firestore();
const auth = firebase.auth();

// Retrieve the user's email from localStorage
const userEmail = localStorage.getItem('userEmail');

// Display the user's email
document.getElementById('user-email').textContent = userEmail || 'Guest';

// Handle tweet submission
document.querySelector('.tweet-box .btn').addEventListener('click', async function () {
    const tweetText = document.querySelector('.tweet-box textarea').value;
    if (tweetText.trim()) {
        const tweetData = {
            author: userEmail || 'User Name',
            content: tweetText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0,
            likedBy: [] // Track who has liked the tweet
        };

        // Add tweet to Firestore
        await db.collection('tweets').add(tweetData);

        // Clear the textarea
        document.querySelector('.tweet-box textarea').value = '';

        // Reload tweets from Firestore
        loadTweets();
    }
});
// Load tweets from Firestore in real-time
function loadTweets() {
    const tweetsContainer = document.getElementById('tweets');
    tweetsContainer.innerHTML = ''; // Clear existing tweets

    db.collection('tweets').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        tweetsContainer.innerHTML = ''; // Clear the container to avoid duplicate tweets
        snapshot.forEach(doc => {
            const tweet = doc.data();
            const tweetContainer = document.createElement('div');
            tweetContainer.classList.add('tweet');
            tweetContainer.innerHTML = `
                <div class="tweet-header">
                    <img src="https://e7.pngegg.com/pngimages/126/16/png-clipart-discord-computer-icons-social-media-gamer-social-media-blue-computer-wallpaper-thumbnail.png" alt="Profile Picture">
                    <span class="tweet-author">${tweet.author}</span>
                </div>
                <div class="tweet-content">${tweet.content}</div>
                <div class="actions">
                    <button class="like-btn">
                        <span class="like-count">${tweet.likes} Likes</span>
                        ❤️
                    </button>
                    <button class="comment-btn">💬 Comment</button>
                </div>
                <div class="comments">
                    <textarea placeholder="Add a comment..."></textarea>
                </div>
            `;

            tweetsContainer.appendChild(tweetContainer);

            // Fetch and display comments
            db.collection('tweets').doc(doc.id).collection('comments').orderBy('timestamp', 'asc').get().then(commentsSnapshot => {
                commentsSnapshot.forEach(commentDoc => {
                    const comment = commentDoc.data();
                    const commentContainer = document.createElement('div');
                    commentContainer.classList.add('comment');
                    commentContainer.innerHTML = `
                        <span class="comment-author">${comment.author}</span>: 
                        <span class="comment-text">${comment.content}</span>
                    `;
                    tweetContainer.querySelector('.comments').appendChild(commentContainer);
                });
            });

            // Add event listeners for like and comment buttons
            tweetContainer.querySelector('.like-btn').addEventListener('click', async function () {
                const likeCountElement = this.querySelector('.like-count');
                let likeCount = parseInt(likeCountElement.textContent.split(' ')[0]);
                const userHasLiked = tweet.likedBy.includes(userEmail);

                if (userHasLiked) {
                    // Unlike the tweet
                    likeCount -= 1;
                    tweet.likedBy = tweet.likedBy.filter(email => email !== userEmail);
                } else {
                    // Like the tweet
                    likeCount += 1;
                    tweet.likedBy.push(userEmail);
                }

                // Update like count in Firestore
                await db.collection('tweets').doc(doc.id).update({
                    likes: likeCount,
                    likedBy: tweet.likedBy
                });

                // Update the like count display
                likeCountElement.textContent = `${likeCount} Likes`;

                // Toggle the like icon based on whether the user has liked the tweet
                this.querySelector('svg').classList.toggle('liked');
            });

            tweetContainer.querySelector('.comment-btn').addEventListener('click', async function () {
                const commentTextarea = this.parentElement.nextElementSibling.querySelector('textarea');
                const commentText = commentTextarea.value;
                if (commentText.trim()) {
                    const comment = {
                        author: userEmail || 'User Name',
                        content: commentText,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    // Add comment to Firestore
                    await db.collection('tweets').doc(doc.id).collection('comments').add(comment);

                    // Add the new comment to the tweet
                    const commentContainer = document.createElement('div');
                    commentContainer.classList.add('comment');
                    commentContainer.innerHTML = `
                        <span class="comment-author">${comment.author}</span>: 
                        <span class="comment-text">${comment.content}</span>
                    `;

                    this.parentElement.nextElementSibling.appendChild(commentContainer);
                    commentTextarea.value = '';
                }
            });
        });
    });
}

// Load tweets on page load
loadTweets();


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
