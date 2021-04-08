let production = true;
let BASE_URL;
/*
 * Do variables setup
 */
(function() {
    if (production) {
        /* For production when deployed to server */
        BASE_URL = 'https://petstonks.ml';
    } else {
        /* To ease local development */
        BASE_URL = 'https://petstonks.ml';
    }
})();


/*
 * createpost
 */
let cp = document.querySelector('#createpost');
cp.addEventListener('submit', createpost);
async function createpost(e) {
    e.preventDefault();

    let form = document.querySelector('#createpost');
    let body = new FormData(form);
    let url = BASE_URL + '/api/posts/create';
    let response = await fetch(url, {
        headers: { _token: localStorage._token },
        body,
        method: 'post'
    });
    let data = await response.json();

    if (!data.err) {
        $('#createpostmodal').modal('hide');
        Swal.fire({ icon: 'success', text: 'Success!' });
    } else {
        Swal.fire(data.msg);
    }
};


/*
 * Load the user profile
 */
let user;
async function loadUserProfile() {
    let url = BASE_URL + '/api/users/profile';

    let response = await fetch(url, { headers: { _token: localStorage._token } });
    let data = await response.json();

    if (!data.err) {
        user = data.user;

        let profileImgEl = document.querySelector('.user-pic img');
        let nameEl = document.querySelector('.user-name');
        let emailEl = document.querySelector('.user-email');
        if (user.profile_image_url != null) {
            profileImgEl.src = user.profile_image_url ? BASE_URL + user.profile_image_url : '/img/test-profile-img.jpg';
        } else {
            var newimg = '/img/icons/icon-user.jpg';
            profileImgEl.src = newimg;
        }
        nameEl.innerText = user.last_name ? user.first_name + ' ' + user.last_name : user.first_name;
        //emailEl.innerText = user.email;
        document.getElementById("firstnamechange").value = user.first_name;
        document.getElementById("lastnamechange").value = user.last_name;
        document.getElementById("biographychange").value = user.biography;

        /* User email verified status */
        let circle = document.querySelector('.sidebar-wrapper .sidebar-header .user-info .user-status i');
        let statusEl = document.querySelector('.user-status span');
        if (user.verified) {
            circle.style.color = '#5cb85c';
            statusEl.innerText = 'Verified';
        } else {
            circle.style.color = 'red';
            statusEl.innerText = 'Not verified';
        }
    } else {
        // Invalid token
        window.location.href = '/';
        localStorage.removeItem('_token');
    }
}

let upd = document.querySelector('#updateprofile');
upd.addEventListener('submit', updateprofile);
async function updateprofile(e) {
    e.preventDefault();

    let form = document.querySelector('#updateprofile');
    let body = new FormData(form);
    let url = BASE_URL + '/api/users/updateProfile';
    let response = await fetch(url, {
        headers: { _token: localStorage._token },
        body,
        method: 'post'
    });
    let data = await response.json();

    if (!data.err) {
        $('#myModal').modal('hide');
        Swal.fire({
            icon: 'success',
            text: 'Success!'
        });
    } else {
        document.getElementById("upderror").innerHTML = data.msg;
        Swal.fire(data.msg);
    }
};

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

        let count = data.retrieved_count;
        let posts = data.posts;
        nextPostToRequest += count;

        if (count == 0) {
            isNewsFeedEnd = true;
            return;
        }

        // Form the HTML and add to container
        for (let post of posts) {
            // console.log(post);
            let html = `
            <div class="post" data-post-id="${post.id}" data-user-id="${post.user_id}">
            ${post.user_id == user.id ? '<button class="img-btn"><img src="/img/icons/icon-trash.png"></button>' : ''}
            <img src="${getUserProfileImage(post.user)}" class="post-profile-image" width="100px">
            <a href="javascript:void(0)" class="post-profile-username">${post.user.last_name ? post.user.first_name + ' ' + post.user.last_name : post.user.first_name}</a>
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
        let i = (nextPostToRequest - postsPerRequest) < 0 ? 0 : (nextPostToRequest - postsPerRequest);
        for (; i < postElements.length; i++) {
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
        i = (nextPostToRequest - postsPerRequest) < 0 ? 0 : (nextPostToRequest - postsPerRequest);
        for (; i < likeButtons.length; i++) {

            let likeButton = likeButtons[i];
            likeButton.addEventListener('click', likeButtonListener);
        }

        const deleteButtonListener = async e => {
            let button = e.target;
            let postContainer = button.parentNode;
            while (!postContainer.classList.contains('post')) {
                postContainer = postContainer.parentNode;
            }
            let postId = postContainer.dataset.postId;
            let url = BASE_URL + '/api/posts/delete?id=' + postId;
            let response = await fetch(url, {
                method: 'DELETE',
                headers: { _token: localStorage._token }
            });
            let data = await response.json();

            // Success?
            if (data.err) {
                Swal.fire({
                    icon: 'error',
                    text: data.msg
                });
            } else {
                console.log('test');
                console.log(postContainer);
                let $postContainer = $(postContainer);
                $postContainer.animate({
                    height: 0,
                    opacity: 0
                }, 500, function() {
                    postContainer.parentNode.removeChild(postContainer);
                });
            }
        };
        /* Attach the event listeners */
        let deleteButtons = document.querySelectorAll('.post .img-btn');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', deleteButtonListener);
        }

        isLoading = false;
    };

    // Attach onscroll event to the container
    const scrollListener = async function(e) {
        if (isNewsFeedEnd) {
            container.removeEventListener('scroll', scrollListener);
        }
        // Load more posts if the scroll has hit the bottom, with some leeway
        const leeway = 200;
        if (container.scrollTop >= (container.scrollHeight - container.offsetHeight - leeway) && !isLoading) {
            loadImages();
        }
    };

    container.addEventListener('scroll', scrollListener);

    // Initial posts load
    loadImages();
}

// News feed initialization is done in login function
(async function() {
    let _ = await loadUserProfile();
    var checkpost = document.getElementById("posts");
    if(checkpost  != null){
    _ = await initializeNewsFeed('#posts'); /* COMMENT THIS OUT DURING HTML TESTING SO THE CONTENT DOESN'T GET ERASED */
    } else {
        initializefollow()
    }

})();
async function initializefollow() {
        let url = '/api/users';
        let followUrl = '/api/users/follow';
        let listener = async function(e) {
                let button = e.target;
                let userToFollow = button.dataset.userId;
                let formData = new FormData();
                formData.append('user_to_follow', userToFollow);
                let response = await fetch(followUrl, {
                    method: 'POST',
                    headers: {_token: localStorage._token},
                    body: formData
                });
                let data = await response.json();
                if(data.err) {
                    window.alert('Not logged in');
                } else {
                    window.alert('Followed');
                }
        };
            (async function() {
                let response = await fetch(url);
                let users = await response.json();
                let ul = document.querySelector('#followall');
                for (let user of users) {
                    if (user.profile_image_url ==null){
                        var imgfile= `${BASE_URL}/img/default-profile-image.png`;
                    } else{
                        var imgfile= `${BASE_URL}${user.profile_image_url}`;
                    }
                    let html = `
                    <div class="user"  data-user-id="${user.user_id}">
                    <img src="${imgfile}" class="post-profile-image" width="100px">
                    <a href="javascript:void(0)" class="post-profile-username">${user.last_name ? user.first_name + ' ' + user.last_name : user.first_name}</a>
                        <br>
                            BIO: ${user.biography}
                        <br>
                        <div>
                            <button class="btn-like" id="follow" data-user-id="${user.id}">Follow</button>
                        </div>
                    </div>
                    `;
                    ul.innerHTML += html;
                }
                let buttons = document.querySelectorAll('button');
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].addEventListener('click', listener);
                }
            })();
        }

jQuery(function($) {

    $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#close-sidebar").click(function() {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function() {
        $(".page-wrapper").addClass("toggled");
    });

});

/* Event listener for logout button */
let btnLogout = document.getElementById('btn-logout');
btnLogout.addEventListener('click', async function(e) {
    e.preventDefault();

    let url = BASE_URL + '/api/users/logout';
    let _ = await fetch(url, {
        method: 'POST',
        headers: { _token: localStorage._token }
    });
    localStorage.removeItem('_token');
    window.location.href = '/';
});

/* Profile image upload preview */
function previewImage(input, id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $(id).attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

$("#file").change(function() {
    $('#preview').css('display', 'block').attr('src', '/img/loading.gif');
    previewImage(this, "#preview");
});

$("#post_image").change(function() {
    $('#postpreview').css('display', 'block').attr('src', '/img/loading.gif');
    previewImage(this, "#postpreview");
});

/* Profile image upload */
$('#changeimg').submit(async function(e) {
    e.preventDefault();
    let form = this;
    let input = $('#file')[0];
    if (!input.files) {
        Swal.fire('Please select a file.');
    } else {
        console.log(this);
        let formData = new FormData(this);
        let url = BASE_URL + '/api/users/update/profile-image';
        let response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: { _token: localStorage._token }
        });
        let data = await response.json();
        if (data.err) {
            Swal.fire(data.msg);
        } else {
            /* Change the profile image on main page */
            let img = document.getElementById('profile-image-main');
            let reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
            $('#uploadModal').modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Your profile image has been changed.'
            });
        }
    }
});