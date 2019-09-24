var progressBar;
var currentAudio;
var isAudioEnabled = true;
var isCarouselEnabled = false;
var isOrientationLandscape = true;
var screenHeight;
var screenWidth;
var xs, sm, md, lg, xl

function playMedia(media) {
  var playPromise = media.play();
  if (playPromise !== null) {
    playPromise.catch(() => {
      media.play();
    })
  }
}

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

function stopLoading() {

  if (!progressBar) return

  progressBar.destroy()
  progressBar = null
}

function startWauAnimation() {
  var img = $('#wau-animation')

  if (img.is(':visible')) {
    img.attr('src', img.attr('data-animation'))
  }
}

function startReveal() {
  try {

    var onSlideChanged = function (index) {
      console.log('onSlideChanged', index)

      startWauAnimation();

      switch (index) {
        case 0:
          startVideo();
          break;
        case 3:
          startCarousel();
          break;
      }

      Reveal.configure({
        controls: !((xs || sm) && Reveal.isLastSlide())
      })
    }

    Reveal.addEventListener('slidechanged', function (e) {
      var index = Reveal.getSlides().indexOf(e.currentSlide)

      onSlideChanged(index)

    });

    Reveal.addEventListener('ready', function () {

      progressBar.animate(1);

      $(document.body).toggleClass('body-bg-light body-bg-dark')

      var index = Reveal.getSlides().indexOf(Reveal.getCurrentSlide())

      onSlideChanged(index)
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
        playMedia(currentAudio)
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
      var url = window.location.protocol + "//" + window.location.host + audio[randomIndex]

      playAudioForSlide(url)


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

  var isAndroid = os === 'Android'

  var links = $('.mobile-link')

  for (var i = 0; i < links.length; i++) {
    var link = $(links[i])

    link.attr('href', !isAndroid
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

var videoTimeoutId

function startVideo() {

  console.log('video part 1');

  var video1 = $('#slide-1-video')
  var video2 = $('#slide-2-video')
  var video3 = $('#slide-3-video')

  video1.removeClass('d-none')

  var duration = parseInt(video1.attr('data-duration'))

  var nativeVideo1 = video1[0]
  var nativeVideo2 = video2[0]

  nativeVideo1.load()
  nativeVideo2.load()

  nativeVideo1.oncanplay = function () {

    console.log('video part 1 oncanplay');

    clearTimeout(videoTimeoutId)
    videoTimeoutId = setTimeout(function () {

      console.log('video part 2');

      video3.removeClass('d-none')
      video1.addClass('d-none')

    }, duration)

  }

  playMedia(nativeVideo1)
  playMedia(nativeVideo2)
}

$(function () {

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
  configureSlide4()
  configureSlide5()
  configureSlide6()
}

function configureSlide1() {

  var video1 = $('#slide-1-video')
  var video2 = $('#slide-2-video')
  var video3 = $('#slide-3-video')
  var source1 = video1.find('source');
  var source2 = video2.find('source');

  source1.each(function (i, e) {
    var source = $(e)
    if (isOrientationLandscape) {
      source.attr('src', source.attr('data-src-land'))
    } else {
      source.attr('src', source.attr('data-src-port'))
    }
  })

  source2.each(function (i, e) {
    var source = $(e)
    if (isOrientationLandscape) {
      source.attr('src', source.attr('data-src-land'))
    } else {
      source.attr('src', source.attr('data-src-port'))
    }
  })

  var height1, width1, top1

  if (isOrientationLandscape) {
    width1 = screenWidth
    height1 = Math.ceil(width1 / 1.777)
    top1 = Math.ceil((screenHeight - height1) / 2)
  } else {
    width1 = screenWidth
    height1 = Math.ceil(width1 * 1.777)
    top1 = 0
  }

  video1.css({
    width: width1,
    height: height1,
    top: top1
  })

  video1.attr('width', width1)
  video1.attr('height', height1)

  var height2, width2, top2

  if (isOrientationLandscape) {
    width2 = screenWidth
    height2 = Math.ceil(width2 / 1.777)
    top2 = Math.ceil((screenHeight - height2) / 2)
  } else {
    width2 = screenWidth
    height2 = Math.ceil(width2 * 1.777)
    top2 = 0
  }

  video2.css({
    width: width2,
    height: height2,
    top: top2
  })

  video2.attr('width', width2)
  video2.attr('height', height2)

  var height3, width3, x, y, percentBounds

  if (!isOrientationLandscape) {
    percentBounds = [80, 25.5, 10, 13.8]
  } else {
    percentBounds = [23.6, 23.8, 38.2, 24.2]
  }

  width3 = Math.ceil(width2 * percentBounds[0] / 100)
  height3 = Math.ceil(height2 * percentBounds[1] / 100)
  x = Math.ceil(width2 * percentBounds[2] / 100)
  y = top2 + Math.ceil(height2 * percentBounds[3] / 100)


  video3.css({
    width: width3,
    height: height3,
    top: y,
    left: x,
  })

  video3.attr('width', width3)
  video3.attr('height', height3)
}

function configureSlide2() {

  var imgMobile = $('#slide-2-img-mobile')
  var imgDesktop = $('#slide-2-img-desktop')

  imgMobile.css('max-height', Math.ceil(screenHeight * 0.4 - 20))
  imgDesktop.css('max-height', Math.ceil(screenHeight * 0.75))

}

function configureSlide3() {

  var img1Mobile = $('#slide-3-img-1-mobile')
  var img1Desktop = $('#slide-3-img-1-desktop')

  var img2Mobile = $('#slide-3-img-2-mobile')
  var img2Desktop = $('#slide-3-img-2-desktop')

  var img3Desktop = $('#slide-3-img-3-desktop')

  img1Mobile.css('max-height', Math.ceil(screenHeight * 0.35 - 20))
  img1Desktop.css('max-height', Math.ceil(screenHeight * 0.4))

  img2Mobile.css('max-height', Math.ceil(screenHeight * 0.35 - 20))
  img2Desktop.css('max-height', Math.ceil(screenHeight * 0.4))

  img3Desktop.css('max-height', Math.ceil(screenHeight * 0.4))

}

function configureSlide4() {

  var carousel = $('#slide-4-carousel')

  var height, width
  if (xs) {
    width = screenWidth * 0.9
    height = width / 2
  } else if (sm) {
    width = screenWidth * 0.9
    height = width / 2
  } else if (lg) {
    height = Math.ceil(screenHeight * 0.35)
    width = Math.ceil(height * 2)
  } else {
    height = Math.ceil(screenWidth * 0.25)
    width = Math.ceil(height * 2)
  }

  carousel.css({
    width: width,
    height: height,
  })

}

function configureSlide5() {

  var img1Mobile = $('#slide-5-img-1-mobile')
  var img1Desktop = $('#slide-5-img-1-desktop')

  var img2Mobile = $('#slide-5-img-2-mobile')
  var img2Desktop = $('#slide-5-img-2-desktop')

  var img3Desktop = $('#slide-5-img-3-desktop')

  var width1 = Math.ceil(screenHeight * 0.35 - 20)
  var width2 = Math.ceil(screenHeight * 0.4)

  img1Mobile.css('max-height', width1)
  img1Desktop.css('max-height', width2)

  img2Mobile.css('max-height', width1)
  img2Desktop.css('max-height', width2)

  img3Desktop.css('max-height', Math.ceil(screenHeight * 0.3))

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

  if ((xs || sm || md) && isOrientationLandscape) {
    width = screenWidth * 0.4
  }

  width = Math.ceil(width)
  var height = Math.ceil(width / 1.642)

  wau.css({
    width: width,
    height: height,
    left: Math.ceil((screenWidth - width) / 2)
  })

  container.css({width: screenWidth, height: screenHeight})
}

window.addEventListener('resize', configureSlides)

setTimeout(startLoadingGif, 500)