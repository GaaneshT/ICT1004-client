'use strict';

// -------------------- Custom utility functions for this project only  -------------------------


// ------------------------------- General Purpose Javascript ------------------------------------

/*
 * Converts Javascript object into FormData.
 * Use this to send multipart/form-data to the server.
 *
 */
function toFormData(object, formData = null) {
    if (!formData) {
        formData = new FormData();
    }
    for (let key in object) {
        if (Array.isArray(object[key])) {
            for (let array_item of object[key]) {
                formData.append(key, array_item);
            }
        } else {
            formData.append(key, object[key]);
        }
    }
    return formData;
}

/*
 * @param array The array to do sorting on
 * @param reverse Boolean value to indicate whether array should be sorted in ascending or descending order
 * @param sortKey If the array contains objects which all have an identical structure, it is possible to specify a key to sort by.
 * 
 * @return The sorted array.
 */
function sortArray(array, reverse = false, sortKey = null) {
    // If an object key to sort by is specified, provide a comparison function to the array sort method.
    if (sortKey) {
        array.sort(function(a, b) {

            let aValue = a[sortKey];
            let bValue = b[sortKey];

            // Ignore care sensitivity if the item values are strings
            if (typeof aValue === 'string') aValue.toLowerCase();
            if (typeof bValue === 'string') bValue.toLowerCase();

            if (aValue < bValue) return -1;

            if (aValue > bValue) return 1;

            // Values must be equal.
            return 0;
        });
    } else {
        // perform normal sort for an array of strings or numbers
        array.sort();
    }

    // If reverse === true, call reverse method on the array.
    if (reverse) {
        array.reverse();
    }

    return array;
}

/*
 * @param min Integer to define minimum value for random number to be generated
 * @param max Integer to define maximum value for random number to be generated
 * 
 * @return Random integer
 */
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ------------------------------------- Browser-specific Javascript -----------------------------------------------

// ------------------------------------- Enlargable Images ---------------------------------------------------------


/*
 * @param className String name of class to activate modal-openable images on
 * @param customOptions Object that has overlayColor, closeButtonColor and overlayClosable as customizable options. If any values are not provided,
 *                      the values from defaultModalOptions object will be used.
 */
function enableModalImages(className, customOptions = {}) {
    // Modal options
    let defaultModalOptions = {

        "overlayColor": "rgba(0,0,0,0.6)",
        "closeButtonColor": "rgb(255,255,255)",
        "overlayClosable": true,
        "useAltAsCaption": true
    };

    // options in parameter take priority, so assign defaultModalOptions object to options
    let options = Object.assign({}, defaultModalOptions, customOptions);

    let imgs = document.querySelectorAll('.' + className);

    // Attach onclick listener for all images
    for (let i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener('click', function(e) {

            let img = e.target;

            let modalHtml = `<div style="background:` + options.overlayColor + `;width:100%;height:100vh;display:flex;position:fixed;top:0;left:0;z-index:2;" id="image-modal">
                                <span onclick="closeImageModal()" style="color:` + options.closeButtonColor + `;position:absolute;top:2%;right:2%;z-index:3;font-weight:bold;font-size:40px;user-select:none;font-family:Arial;cursor:pointer;">X</span>
                                <div class="geo-modal-image-container" style="margin:0 auto;align-self:center;max-height:100vh;position:relative;">
                                    <img src="` + img.src + `" alt="Image" style="object-fit:contain;max-width:100%;max-height:100vh;margin:0 auto;display:block;position:relative;">
                                </div>
                            </div>`;

            let docBody = document.body;

            docBody.insertAdjacentHTML('afterbegin', modalHtml);

            let modal = document.getElementById('image-modal');

            // If modal image is specified to use the alt text as caption for the image
            if (options.useAltAsCaption) {
                let imageContainer = modal.querySelector('.geo-modal-image-container');
                let modalImg = modal.querySelector('img');
                // get width of the image, attach a translucent overlay over bottom part of image
                let imgWidth = modalImg.clientWidth;
                let imgHeight = modalImg.clientHeight;
                let overlay = document.createElement('p');
                overlay.style.margin = "0";
                overlay.style.padding = "5px";
                overlay.style.background = "rgba(0,0,0,0.6)";
                overlay.style.color = "white";
                // Insert content and get height
                overlay.style.position = "absolute";
                overlay.innerText = img.alt;
                overlay.style.width = "100%";
                imageContainer.append(overlay);
            }

            // If modal is specified to be able to be closed from clicking the overlay, attach the onclick event listener for closing it
            if (options.overlayClosable) {
                modal.addEventListener('click', function(e) {

                    let clicked = e.target;

                    // If the overlay was clicked, close the modal
                    if (clicked === this) {
                        closeImageModal();
                    }
                });
            }

        });
    }
}

/*
 * Same as enableModalImages, but for a single HTML element.
 *
 * @param className String name of class to activate modal-openable images on
 * @param customOptions Object that has overlayColor, closeButtonColor and overlayClosable as customizable options. If any values are not provided,
 *                      the values from defaultModalOptions object will be used.
 */
function enableModalImage(imgEl, customOptions = {}) {
    // Modal options
    let defaultModalOptions = {

        "overlayColor": "rgba(0,0,0,0.6)",
        "closeButtonColor": "rgb(255,255,255)",
        "overlayClosable": true,
        "useAltAsCaption": true
    };

    // options in parameter take priority, so assign defaultModalOptions object to options
    let options = Object.assign({}, defaultModalOptions, customOptions);

    imgEl.addEventListener('click', function(e) {
        let img = e.target;

        let modalHtml = `<div style="background:` + options.overlayColor + `;width:100%;height:100vh;display:flex;position:fixed;top:0;left:0;z-index:2;" id="image-modal">
                            <span onclick="closeImageModal()" style="color:` + options.closeButtonColor + `;position:absolute;top:2%;right:2%;z-index:3;font-weight:bold;font-size:40px;user-select:none;font-family:Arial;cursor:pointer;">X</span>
                            <div class="geo-modal-image-container" style="margin:0 auto;align-self:center;max-height:100vh;position:relative;">
                                <img src="` + img.src + `" alt="Image" style="object-fit:contain;max-width:100%;max-height:100vh;margin:0 auto;display:block;position:relative;">
                            </div>
                        </div>`;

        let docBody = document.body;

        docBody.insertAdjacentHTML('afterbegin', modalHtml);

        let modal = document.getElementById('image-modal');

        // If modal image is specified to use the alt text as caption for the image
        if (options.useAltAsCaption) {
            let imageContainer = modal.querySelector('.geo-modal-image-container');
            let modalImg = modal.querySelector('img');
            // get width of the image, attach a translucent overlay over bottom part of image
            let imgWidth = modalImg.clientWidth;
            let imgHeight = modalImg.clientHeight;
            let overlay = document.createElement('p');
            overlay.style.margin = "0";
            overlay.style.padding = "5px";
            overlay.style.background = "rgba(0,0,0,0.6)";
            overlay.style.color = "white";
            // Insert content and get height
            overlay.style.position = "absolute";
            overlay.innerText = img.alt;
            overlay.style.width = "100%";
            imageContainer.append(overlay);
        }

        // If modal is specified to be able to be closed from clicking the overlay, attach the onclick event listener for closing it
        if (options.overlayClosable) {
            modal.addEventListener('click', function(e) {

                let clicked = e.target;

                // If the overlay was clicked, close the modal
                if (clicked === this) {
                    closeImageModal();
                }
            });
        }
    });
}

function closeImageModal() {
    let modal = document.getElementById('image-modal');
    modal.parentNode.removeChild(modal);

    window.removeEventListener("click", imageModalOverlayClickedListener);
}

function imageModalOverlayClickedListener(e) {
    let clickedEl = e.target;

    let modal = document.getElementById('image-modal');

    if (clickedEl === modal) closeImageModal();
}


// -------------------------------------------- Store objects in sessionStorage -----------------------------------------------

/*
 * Insert an item into array in localStorage as a JSON format string and retrieves them using JSON.parse
 *
 * @param arrayName String name of the array to store in sessionStorage
 * @param object Object item to store in specified array
 * 
 * @return Array the array after inserting the item
 * 
 * Helper function to store objects in array that can be accessed from all webpages for the current browser session
 */

function storeInSession(arrayName, object) {
    // Intialize empty array if the array does not already exist.
    if (!sessionStorage.getItem(arrayName)) {
        sessionStorage.setItem(arrayName, '[]');
    }

    // convert to javascript array
    let array = JSON.parse(sessionStorage.getItem(arrayName));

    // insert object
    array.push(object);

    // put back into sessionStorage
    sessionStorage.setItem(arrayName, JSON.stringify(array));

    return array;
}

/*
 * Insert an array of items into array in localStorage as a JSON format string and retrieves them using JSON.parse
 *
 * @param arrayName String name of the array to store in sessionStorage
 * @param array Array of objects to store in the specified array
 * 
 * @return Array the array after inserting the items
 */
function storeMultipleInSession(arrayName, inputArray) {
    // Intialize empty array if the array does not already exist.
    if (!sessionStorage.getItem(arrayName)) {
        sessionStorage.setItem(arrayName, '[]');
    }

    // convert to javascript array
    let array = JSON.parse(sessionStorage.getItem(arrayName));

    inputArray.forEach(function(item, index) {

        array.push(item);
    });

    // put back into sessionStorage
    sessionStorage.setItem(arrayName, JSON.stringify(array));

    return array;
}


/*
 * @param arrayName String name of the array to retrieve from sessionStorage
 * 
 * @return array from sessionStorage with the specified array name
 * 
 * Helper function to get back array with the specified array name.
 * Ensures that at least an empty array is returned even if the item does not exist
 */
function getArrayFromSession(arrayName) {
    // Intialize empty array if the array does not already exist.
    if (!sessionStorage.getItem(arrayName)) {
        sessionStorage.setItem(arrayName, '[]');
    }

    return JSON.parse(sessionStorage.getItem(arrayName));
}

/*
 * @param arrayName String name of array in sessionStorage to clear name
 * 
 * @return Array an empty array
 */
function emptySessionArray(arrayName) {
    sessionStorage.setItem(arrayName, '[]');

    return [];
}