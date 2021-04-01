/*
 * @param className String name of class to activate modal-openable images on
 * @param customOptions Object that has overlayColor, closeButtonColor and overlayClosable as customizable options. If any values are not provided,
 *                      the values from defaultModalOptions object will be used.
 */
function enableModalImage(imgEl, customOptions = {})
{
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
        if(options.useAltAsCaption)
        {
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
        if(options.overlayClosable)
        {
            modal.addEventListener('click', function(e) {

                let clicked = e.target;

                // If the overlay was clicked, close the modal
                if(clicked === this)
                {
                    closeImageModal();
                }
            });
        }
    });
}