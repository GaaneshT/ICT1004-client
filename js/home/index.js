let production = false;
let BASE_URL;
/*
 * Do variables setup
 */
(function() {
    if (production) {
        /* For production when deployed to server */
        BASE_URL = 'http://localhost';
    } else {
        /* To ease local development */
        BASE_URL = 'https://petstonks.ml';
    }
})();

/*tinymce.init({
    selector: '#content',
    theme: 'modern',
    add_form_submit_trigger : false,
    mobile: {
      theme: 'mobile',
      plugins: [ 'autosave', 'lists', 'autolink' ],
      toolbar: [ 'undo', 'bold', 'italic', 'styleselect' ]
    }
  }); */
  
/*
 * createpost
 */
let cp = document.querySelector('#createpost');
cp.addEventListener('submit', createpost);
async function createpost(e) {
    e.preventDefault();

    let form = document.querySelector('#createpost');
    console.log(form);
    let body = new FormData(form);
    let url = BASE_URL + '/api/posts/create';
    let response = await fetch(url, {
        headers: { _token: localStorage._token },
        body,
        method: 'post'
    });
    let data = await response.json();

    if (!data.err) {
        console.log(data);
        document.getElementById("posterror").innerHTML = "Success";
    } else {
        Swal.fire(data.msg);
    }
};


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
            profileImgEl.src = user.profile_image_url ? BASE_URL + user.profile_image_url : '/img/test-profile-img.jpg';
        } else {
            var newimg = '/img/icons/icon-user.jpg';
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
        document.getElementById("upderror").innerHTML = "Success";
        Swal.fire(data.msg);
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
            let html = `
            <div class="post" data-post-id="${post.id}">
            <div class="post-profile-image-wrapper">
                <img src="${getUserProfileImage(post.user)}" class="post-profile-image">
            </div>
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
initializeNewsFeed('#posts'); /* COMMENT THIS OUT DURING HTML TESTING SO THE CONTENT DOESN'T GET ERASED */

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
function previewImage(input , id) {
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