const BASE_URL = 'http://34.193.147.252';

/*
 * Load the user profile
 */
async function loadUserProfile() {
    let url = BASE_URL + '/api/users/profile';

    let response = await fetch(url, { headers: { _token: localStorage._token } });
    let data = await response.json();

    if (!data.err) {
        let user = data.user;

        let profileImgEl = document.querySelector('.user-pic img');
        let nameEl = document.querySelector('.user-name');
        let emailEl = document.querySelector('.user-email');
        if (user.profile_image_url != null) {
          profileImgEl.src = user.profile_image_url ? user.profile_image_url : '/img/test-profile-img.jpg';
        } else {
          var newimg ="https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg"
          profileImgEl.src = newimg;
        }
        nameEl.innerText = user.first_name;
        //emailEl.innerText = user.email;
        document.getElementById("firstnamechange").value = user.first_name;
        document.getElementById("lastnamechange").value = user.last_name;
        document.getElementById("biographychange").value = user.biography;
    } else {
        Swal.fire(data.msg);
    }
}

/*
 * Requires bootstrap CSS.
 *
 * @param elementSelector CSS selector to get the HTML element to initialize 
 */
async function initializeNewsFeed(elementSelector) {
    // Number of posts to load at once
    let postsPerRequest = 10;

    // Request base url
    let baseUrl = BASE_URL + '/api/news-feed';

    // Helper function to form the full request URL
    const makeUrl = postNum => {
        return baseUrl + `?start=${postNum}&end=${postNum+postsPerRequest-1}`;
    };

    // Find the container to insert the posts and empty it first
    let container = document.querySelector(elementSelector);
    container.innerHTML = '';

    // Add styles
    container.style.display = 'block';

    // Add loading gif at bottom of container, hide it first
    const showPostsLoading = _ => {
        let gif = document.createElement('img');
        gif.id = 'news-feed-spinner';
        gif.src = `${BASE_URL}/img/loading.gif`;
        gif.style = 'display:block;margin:0 auto;';
        gif.height = 80;
        container.append(gif);

        // Scroll to bottom of container to make sure the loading gif is seen
        container.scrollTop = container.scrollHeight;
    };

    const hidePostsLoading = _ => {
        let gif = document.getElementById('news-feed-spinner');
        if (gif) {
            gif.parentNode.removeChild(gif);
        }
    };

    const getLikeIconSrc = is_liked => {
        if (parseInt(is_liked)) {
            return `${BASE_URL}/img/icon-heart-filled.png`;
        }
        return `${BASE_URL}/img/icon-heart-unfilled.png`;
    };

    /* The profile image may not be set. If there is no URL, return a default image link */
    const getUserProfileImage = user => {
        if (user.profile_image_url) {
            return `${BASE_URL}${user.profile_image_url}`;
        }
        return `${BASE_URL}/img/default-profile-image.png`;
    };

    const insertImages = post => {
        let html = '';
        for (let image of post.images) {
            html += `
            <div class="col-sm-6">
                <img class="post-image" src="${BASE_URL}${image.post_image_url}">
                </div>
                `;
        }
        return html;
    };

    // Counters to track the latest post number
    let nextPostToRequest = 0;

    // Stop sending requests when no more posts are returned
    let isNewsFeedEnd = false;

    let isLoading = false;
    const loadImages = async _ => {
        isLoading = true;
        showPostsLoading();
        let url = makeUrl(nextPostToRequest);
        let response = await fetch(url, {
            headers: { '_token': localStorage._token },
        });
        let data = await response.json();
        hidePostsLoading();

        console.log(data);
        let count = data.retrieved_count;
        let posts = data.posts;
        nextPostToRequest += count;

        if (count == 0) {
            isNewsFeedEnd = true;
            return;
        }

        // Form the HTML and add to container
        for (let post of posts) {
            let html = `
            <div class="post" data-post-id="${post.id}">
            <img src="${getUserProfileImage(post.user)}" class="post-profile-image" width="100px">
            <a href="javascript:void(0)" class="post-profile-username">${post.user.first_name + ' ' + post.user.last_name}</a>
            <br>
            Category: ${post.category}
            <br>
            <p class="post-content">${post.content}</p>
            <div class="post-images-container row">
                ${insertImages(post)}
            </div>
            <div>
                <button class="btn-like" data-post-id="${post.id}" data-liked="${post.is_liked}"><img src="${getLikeIconSrc(post.is_liked)}" alt="Heart"></button> <span class="num-likes">${post.num_likes}</span>
            </div>
            <p>Posted on ${post.created_at}</p>
            </div>
            `;
            container.innerHTML += html;
        }

        // Make images expandable - The function is in util.js
        let postElements = document.getElementsByClassName('post');
        for (let i = nextPostToRequest - postsPerRequest + 1; i < postElements.length; i++) {
            let post = postElements[i];
            let images = post.getElementsByClassName('post-image');
            for (let j = 0; j < images.length; j++) {
                let image = images[j];
                enableModalImage(image);
            }
        }

        const likeButtonListener = async function(e) {
            let button = this;
            let numLikesEl = button.parentNode.getElementsByClassName('num-likes')[0];
            let numLikes = parseInt(numLikesEl.innerText);
            let liked = parseInt(button.dataset.liked);
            let postId = button.dataset.postId;

            let url = BASE_URL + `/api/posts/like?post_id=${postId}`;
            /* If liked, click it to unlike */
            if (liked) {
                /* Dont need to wait for response from server, just update the client side */
                fetch(url, {
                    method: 'DELETE',
                    headers: { _token: localStorage._token }
                });
                numLikesEl.innerText = --numLikes;
            } else {
                /* Dont need to wait for response from server, just update the client side */
                fetch(url, {
                    method: 'POST',
                    headers: { _token: localStorage._token }
                });
                numLikesEl.innerText = ++numLikes;
            }
            // Toggle data-liked attribute
            button.setAttribute('data-liked', button.dataset.liked == 0 ? 1 : 0);

            // Change the img src within the button
            let img = button.childNodes[0];
            img.src = getLikeIconSrc(button.dataset.liked);
        };

        // Attach click event listener to the like button
        let likeButtons = document.getElementsByClassName('btn-like');
        for (let i = 0; i < likeButtons.length; i++) {
            let likeButton = likeButtons[i];
            likeButton.addEventListener('click', likeButtonListener);
        }

        console.log('nextPostToRequest: ' + nextPostToRequest);
        isLoading = false;
    };

    // Attach onscroll event to the container
    const scrollListener = async function(e) {
        if (isNewsFeedEnd) {
            container.removeEventListener('scroll', scrollListener);
        }
        // Load more posts if the scroll has hit the bottom
        if (container.scrollTop >= (container.scrollHeight - container.offsetHeight) && !isLoading) {
            loadImages();
        }
    };

    container.addEventListener('scroll', scrollListener);

    // Initial posts load
    loadImages();
}

// News feed initialization is done in login function
loadUserProfile();
// initializeNewsFeed('#posts'); /* COMMENT THIS OUT DURING HTML TESTING SO THE CONTENT DOESN'T GET ERASED */
