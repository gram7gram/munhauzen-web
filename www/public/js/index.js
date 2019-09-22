(function () {

  var progressBar;
  var currentAudio;
  var isAudioEnabled = true;
  var isCarouselEnabled = false;
  var isOrientationLandscape = true;
  var isAndroid;
  var screenHeight;
  var screenWidth;
  var xs, sm, md, lg, xl

  function startLoading() {
    progressBar = new ProgressBar.Line('#loading-bar', {
      easing: 'easeInOut',
      duration: 1500,
      strokeWidth: 1,
      color: '#29230C',
      trailWidth: 1,
      trailColor: '#AE9C68',
      svgStyle: {width: '100%', height: '100%', 'stroke-linecap': "round"}
    });

    progressBar.animate(0.25);
  }

  function startLoadingGif() {
    console.log('startLoadingGif');

    progressBar.animate(0.75);

    setTimeout(function () {
      var loading = $('#loading')

      loading.find('div').addClass('move-left-and-fade-out')

      setTimeout(function () {

        loading.remove()

        stopLoading()

      }, 1500)

      startReveal()

    }, 1500)
  }

  window.onLoadingGifLoadedCallback = startLoadingGif

  function stopLoading() {

    if (!progressBar) return

    progressBar.destroy()
    progressBar = null
  }

  function startLoadingAnimation() {
    var img = $('#loading-gif')

    img.attr('src', img.attr('data-animation'))
  }

  function startWauAnimation() {
    var img = $('#wau-animation')

    if (img.is(':visible')) {
      img.attr('src', img.attr('data-animation'))
    }
  }

  function startReveal() {
    try {

      Reveal.addEventListener('slidechanged', function (e) {
        var index = Reveal.getSlides().indexOf(e.currentSlide)

        console.log('slidechanged', index)

        switch (index) {
          case 3:
            startCarousel();
            break;
          case 5:
            startWauAnimation();
            break;
        }

      });

      Reveal.addEventListener('ready', function () {

        progressBar.animate(1);

        $(document.body).toggleClass('body-bg-light body-bg-dark')
      });

      Reveal.initialize({
        center: false,
        fragments: false,
        controls: true,
        transition: 'slide',
        backgroundTransition: 'none',
        controlsTutorial: true,
        overview: false,
        help: true,
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

    if (isCarouselEnabled) return

    console.log('startCarousel')

    try {
      var volumeBtn = $('#navigation-volume');
      var carousel = $('#actors-carousel');
      var slides = carousel.find('.slide')

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

          console.log('playAudioForSlide', url);

          currentAudio = new Audio(url)
          var playPromise = currentAudio.play();
          if (playPromise !== null) {
            playPromise.catch(() => {
              currentAudio.play();
            })
          }
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


      var timeoutId = 0

      function onChange(e, index) {

        console.log('carousel', index)

        var isAnimation = true

        for (var i = 0; i < slides.length; i++) {
          var img = $(slides[i]).find('img')

          img.attr('src', img.attr('data-first-frame'))
        }

        var currentImg = $(slides[index]).find('img')

        currentImg.attr('src', currentImg.attr('data-animation'))


        //Play audio
        var audio = currentImg.attr('data-audio').split(',')
        var randomIndex = Math.floor(Math.random() * audio.length);

        playAudioForSlide(audio[randomIndex])


        //Start animation changer
        var duration = parseInt(currentImg.attr('data-animation-duration'));

        function toggleImage() {

          isAnimation = false

          currentImg.attr('src', currentImg.attr('data-first-frame'))

          clearTimeout(timeoutId)
          timeoutId = setTimeout(toggleAnimation, 5000)
        }

        function toggleAnimation() {
          isAnimation = true

          currentImg.attr('src', currentImg.attr('data-animation'))

          clearTimeout(timeoutId)
          timeoutId = setTimeout(toggleImage, duration)
        }

        toggleAnimation()
      }

      carousel.on('select', onChange);

      onChange(null, 0)

      isCarouselEnabled = true

    } catch (e) {
      console.error(e)

      isCarouselEnabled = false
    }
  }

  function setLinksBasedOnPlatform() {

    var os = getMobileOperatingSystem()

    isAndroid = os === 'Android'

    var links = $('.mobile-link')

    for (var i = 0; i < links.length; i++) {
      var link = $(links[i])

      link.attr('href', isAndroid
        ? link.attr('data-appstore')
        : link.attr('data-googleplay'))
    }
  }

  function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }

    return "unknown";
  }

  $(function () {

    startLoadingAnimation();

    setLinksBasedOnPlatform();

    configureSlides()

    startLoading();
  })

  function configureSlides() {
    console.log('configureSlides')

    screenHeight = $(window).height();
    screenWidth = $(window).width();
    isOrientationLandscape = screenHeight < screenWidth

    xs = screenWidth <= 576
    sm = 577 <= screenWidth && screenWidth <= 768
    md = 769 <= screenWidth && screenWidth <= 992
    lg = 993 <= screenWidth && screenWidth <= 1200
    xl = 1201 <= screenWidth

    configureSlide1()
    configureSlide2()
    configureSlide3()
    configureSlide5()
    configureSlide6()
  }

  function configureSlide1() {

    var slide1 = $('.reveal-slide-1')

    if (isOrientationLandscape) {
      slide1.attr('data-background-video', slide1.attr('data-background-video-land'))
    } else {
      slide1.attr('data-background-video', slide1.attr('data-background-video-port'))
    }
  }

  function configureSlide2() {

    var imgMobile = $('#slide-2-img-mobile')
    var imgDesktop = $('#slide-2-img-desktop')

    imgMobile.css('max-height', screenHeight / 2 - 20)
    imgDesktop.css('max-height', screenHeight * 0.75)

  }

  function configureSlide3() {

    var img1Mobile = $('#slide-3-img-1-mobile')
    var img1Desktop = $('#slide-3-img-1-desktop')

    var img2Mobile = $('#slide-3-img-2-mobile')
    var img2Desktop = $('#slide-3-img-2-desktop')

    var img3Desktop = $('#slide-3-img-3-desktop')

    img1Mobile.css('max-height', screenHeight * 0.35 - 20)
    img1Desktop.css('max-height', screenHeight * 0.4)

    img2Mobile.css('max-height', screenHeight * 0.35 - 20)
    img2Desktop.css('max-height', screenHeight * 0.4)

    img3Desktop.css('max-height', screenHeight * 0.4)

  }

  function configureSlide5() {

    var img1Mobile = $('#slide-5-img-1-mobile')
    var img1Desktop = $('#slide-5-img-1-desktop')

    var img2Mobile = $('#slide-5-img-2-mobile')
    var img2Desktop = $('#slide-5-img-2-desktop')

    var img3Desktop = $('#slide-5-img-3-desktop')

    img1Mobile.css('max-height', screenHeight * 0.35 - 20)
    img1Desktop.css('max-height', screenHeight * 0.4)

    img2Mobile.css('max-height', screenHeight * 0.35 - 20)
    img2Desktop.css('max-height', screenHeight * 0.4)

    img3Desktop.css('max-height', screenHeight * 0.3)

  }

  function configureSlide6() {
    var wau = $('#wau-animation')
    var container = $('#wau-container')

    var width
    if (screenWidth < 400) {
      width = screenWidth * 1.5
    } else if (xs) {
      width = screenWidth * 1.25
    } else if (sm) {
      width = screenWidth * 0.75
    } else if (md) {
      width = screenWidth * 0.6
    } else if (lg) {
      width = screenWidth * 0.4
    } else {
      width = screenWidth * 0.4
    }

    var height = width / 1.642

    wau.css({
      width: width,
      height: height,
      left: (screenWidth - width) / 2
    })

    container.css({width: screenWidth, height: screenHeight})
  }

  window.addEventListener('resize', configureSlides)
})()