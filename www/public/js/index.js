function startReveal() {
  try {
    Reveal.addEventListener('ready', function () {
      $('#loading').addClass('d-none')
      $('#navigation').removeClass('d-none')
    });
  } catch (e) {
    console.log(e)
  }

  try {
    Reveal.initialize({
      center: false,
      fragments: false,
      controls: false,
      transition: 'slide',
      controlsTutorial: false,
      overview: false,
      help: false,
      history: true,
      mouseWheel: true,

      width: "100%",
      height: "100%",
      margin: 0,
      minScale: 1,
      maxScale: 1

    });
  } catch (e) {
    console.error(e)
  }
}

function startCarousel() {
  try {
    var volumeBtn = $('#navigation-volume');
    var carousel = $('#actors-carousel');
    var slides = carousel.find('.slide')
    var currentAudio

    var isAudioEnabled = true

    volumeBtn.on('click', function (e) {
      e.preventDefault();

      isAudioEnabled = !isAudioEnabled

      if (!isAudioEnabled) {
        if (currentAudio) {
          currentAudio.pause()
          currentAudio = null
        }
      }

      volumeBtn.attr('src', isAudioEnabled
        ? volumeBtn.attr('data-on')
        : volumeBtn.attr('data-off')
      )

    })

    function playAudioForSlide(url) {

      try {

        if (currentAudio) {
          currentAudio.pause()
          currentAudio = null
        }

        if (!url) {
          throw 'Missing url'
        }

        if (!isAudioEnabled) return

        currentAudio = new Audio(url)
        currentAudio.play()
      } catch (e) {
        console.error(e)
      }
    }

    $('#actors-carousel-prev').on('click', function () {
      carousel.Carousel3d('prev')
    })

    $('#actors-carousel-next').on('click', function () {
      carousel.Carousel3d('next')
    })

    carousel.on('select', function (e, index) {


      for (var i = 0; i < slides.length; i++) {
        var img = $(slides[i]).find('img')

        img.attr('src', img.attr('data-first-frame'))
      }

      var currentImg = $(slides[index]).find('img')

      currentImg.attr('src', currentImg.attr('data-animation'))

      var audio = currentImg.attr('data-audio').split(',')

      var randomIndex = Math.floor(Math.random() * audio.length);

      playAudioForSlide(audio[randomIndex])
    });
  } catch (e) {
    console.error(e)
  }
}

$(function () {

  startReveal();

  startCarousel();

})