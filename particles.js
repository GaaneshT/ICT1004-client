<script
  src="https://cdnjs.cloudflare.com/ajax/libs/tsparticles/1.18.1/tsparticles.min.js"
  integrity="sha512-PYHWDEuXOTJ9MZ+/QHqkbgiEYZ+LImQv3i/9NyYOABFvK37e4q4Wg7aQDN1JpoGiEu1TYZh6JMrZluZox2gbDA=="
  crossorigin="anonymous"></script>

<script>
        const particles = {
          "fpsLimit": 60,
          "particles": {
            "number": {
              "value": 80,
              "density": {
                "enable": true,
                "value_area": 800
              }
            },
            "color": {
              "value": "#ff0000",
              "animation": {
                "enable": true,
                "speed": 20,
                "sync": true
              }
            },
            "shape": {
              "type": "star",
              "stroke": {
                "width": 0
              },
              "polygon": {
                "nb_sides": 5
              },
            },
            "opacity": {
              "value": 0.5,
              "random": false,
              "anim": {
                "enable": false,
                "speed": 3,
                "opacity_min": 0.1,
                "sync": false
              }
            },
            "size": {
              "value": 3,
              "random": true,
              "anim": {
                "enable": false,
                "speed": 20,
                "size_min": 0.1,
                "sync": false
              }
            },
            "links": {
              "enable": true,
              "distance": 100,
              "color": "#ffffff",
              "opacity": 0.4,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 6,
              "direction": "none",
              "random": false,
              "straight": false,
              "out_mode": "out",
              "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
              }
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": true,
                "mode": "grab"
              },
              "onclick": {
                "enable": true,
                "mode": "push"
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 200,
                "line_linked": {
                  "opacity": 1
                }
              },
              "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 0.8
              },
              "repulse": {
                "distance": 200
              },
              "push": {
                "particles_nb": 4
              },
              "remove": {
                "particles_nb": 2
              }
            }
          },
          "retina_detect": true,
          "background": {
            "color": "#white",
            "image": "",
            "position": "100% 100%",
            "repeat": "no-repeat",
            "size": "cover"
          }
        };

        tsParticles.load('tsparticles',particles);
      </script>