var oed = { audios: [], videos: [], paused: [], currentVolume: 1, playing: null, cfg: cfg, container: null }

function init() {
  var fw = {}

  oed.exitFullScreen = _ => {
    if (window.fullscreen && document.exitFullscreen || document.fullscreenElement && document.exitFullscreen ) {
      document.exitFullscreen();
    } else if (window.fullscreen && document.mozCancelFullScreen || document.fullscreenElement && document.mozCancelFullScreen ) { 
      document.mozCancelFullScreen();
    } else if (window.fullscreen && document.webkitExitFullscreen || document.fullscreenElement && document.webkitExitFullscreen ) {
      document.webkitExitFullscreen();
    } else if (window.fullscreen && document.msExitFullscreen || document.fullscreenElement && document.msExitFullscreen ) { 
      document.msExitFullscreen();
    }
  }

  oed.openFullscreen = elem => {
    if (oed.isTouchDevice()) {
      if (!!elem.element) {

      } else {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      }
    }
  }

  oed.play = (_e, cb, showBackBtn) => {
    let e = typeof _e === 'string' ? document.querySelector(_e) : _e

    e.play()
    oed.playing = e

    if (showBackBtn) oed.showVideoBack()

    if (e.tagName == 'VIDEO' || e.tagName == 'AUDIO') {
      if (e.tagName == 'VIDEO') {
        $(e).fadeIn(1000, function(){
          if(oed.isTouchDevice) {
            oed.openFullscreen(e)
          }
        })
      }

      e.addEventListener('ended', function _listener() {
        if(!!cb) cb.call(e)
        if (e.tagName == 'VIDEO') $('.fw_video_back').hide()
        oed.exitFullScreen()
        e.removeEventListener('ended', _listener)
      })
    } else {
      $(e.element).fadeIn(1000, _ => {
        if(oed.isTouchDevice()) {
          e.requestFullscreen()
        }
      })

      e.on('ended', _ => {
        if(!!cb) cb.call(e.element, e)
        $('.fw_video_back').hide()
        oed.exitFullScreen()
        e.exitFullscreen()
        oed.playing = null

        e.off('ended')
      })
    }
    
    return !!e.element ? e.element : e
  }

  oed.pause = (e, cb) => {

    if (!!e.element) {
      e.pause().then(_ => {
        oed.paused.push(e)
        if(!!cb) cb(e)
      })
    } else {
      e.pause()
      oed.paused.push(e)
      if(!!cb) cb(e)
    }

    return !!e.element ? e.element : e
  }

  oed.stop = (e, cb) => {
    let mpn = []

    oed.pause(e, e => {
      if (!!e.element) {
        e.setCurrentTime(0)
      } else {
        e.currentTime = 0
      }

      oed.paused.forEach(m => { 
        if (m != e) mpn.push(m) 
      })

      oed.paused = mpn

      if(!!cb) cb.call(e)
    })

    return !!e.element ? e.element : e
  }

  oed.pauseAll = _ => {
    oed.audios.forEach(a => {
      if (!a.paused) {
        a.pause()
        oed.paused.push(a)
      }
    })
    oed.videos.forEach(v => {
      if (!!v.element) {
        v.getPaused().then(paused => {
          if (!paused) {
            v.pause()
            oed.paused.push(v)
          }
        })
      } else {
        if (!v.paused) {
          v.pause()
          oed.paused.push(v)
        }
      }
    })
    if (!!oed.trilha && !oed.trilha.paused) {
      oed.trilha.pause()
      oed.paused.push(oed.trilha)
    }
  }

  oed.stopAll = _ => {
    oed.audios.forEach(a => {
      if (!a.paused) {
        a.pause()
        a.currentTime = 0
      }
    })
    oed.videos.forEach(v => {
      if (!!v.element) {
        v.pause()
        v.setCurrentTime(0)
      } else {
        v.pause()
        v.currentTime = 0
      }
    })

    if (!!oed.trilha) {
      oed.trilha.pause()
      oed.trilha.currentTime = 0
      oed.paused = []
    }
  
  }

  oed.resume = _ => {
    if (oed.paused.length > 0) {
      for (let i =0; i < oed.paused.length; i++) {
        oed.paused[i].play()
      }
      oed.paused = []
    } 
  }

  oed.setVolume = (n) => {
    oed.audios.forEach(a => a.volume = n)
    oed.videos.forEach(v => {
      if (!!v.element) {
        v.setVolume(n)
      } else {
        v.volume = n
      }
    })
    if (!!oed.trilha) oed.trilha.volume = n
    if (n > 0) oed.currentVolume = n
  }

  oed.SetValue = (name, value) => {
    let api = fw.getAPIHandle()
    return api.LMSSetValue(name, value)
  }

  oed.GetValue = (name) => {
    let api = fw.getAPIHandle()
    return api.LMSGetValue(name)
  }

  oed.development = _ => {
    API = {}

    API.LMSInitialize = function() {
      console.log('Fake scorm api started')
    }
    
    API.LMSSetValue = function(name, value) {
      return window.localStorage.setItem(name, value)
    }
    
    API.LMSGetValue = function(name) {
      return window.localStorage.getItem(name)
    }

    API.LMSInitialize()
  }

  oed.isTouchDevice = _ => {  
    try {  
      document.createEvent("TouchEvent");  
      return true;  
    } catch (e) {  
      return false;  
    }  
  }

  oed.showVideoBack = _ => {
    $('.fw_video_back').fadeIn(500)
  }

  oed.hideVideoBack = _ => {
    $('.fw_video_back').fadeOut(300)
  }

  fw.apiHandle = null

  fw.getAPIHandle = _ => {
    if (fw.apiHandle == null) {
      fw.apiHandle = fw.getAPI()
    }
    return fw.apiHandle
  }

  fw.getAPI = () => {
    let theAPI = fw.findAPI(window);

    if (theAPI == null && window.opener != null && typeof window.opener != 'undefined') {
      theAPI = fw.findAPI(window.opener)
    }

    if (theAPI == null) {
      alert('API adapter not found!')
    }

    return theAPI
  }

  fw.findAPI = (win) => {
    var findAPITries = 0

    while(win.API == null && win.parent != null && win.parent != win) {
      findAPITries++

      if (findAPITries > 10) {
        alert('Error API is too deeply nested!')
        return null
      }

      win = win.parent
    }

    return win.API
  }

  fw.navigation = _ => {
    let style = `
    <style>
      .fw_nav svg {
        fill: ${cfg.barra.btnFillColor}
      }
      .no-touch .fw_nav svg:hover {
        fill: ${cfg.barra.btnOverFillColor}
      }
      .fw_bar {
        background: ${cfg.barra.soundBarBg}
      }
      .fw_bar_position,
      .fw_bar_knob {
        background: ${cfg.barra.btnFillColor}
      }
    </style>
    `
    $('.fw_nav').css('background', cfg.barra.background)
    $('.fw_nav').append(style)

    if (cfg.barra.fundamentalMode) {
      $('body').addClass('fw_fundamental')
    }

    if (cfg.barra.fundamentalContentOnly) {
      $('body').addClass('fw_fundamental_content_only')
    }

    if(!cfg.controls.restart) $('.fw_restart').hide()
    if(!cfg.controls.sound) $('.fw_volume').hide()
    if(!cfg.controls.zoom) $('.fw_zoom').hide()
    if(!cfg.controls.invert) $('.fw_invert').hide()
    if(!cfg.controls.credits) $('.fw_credits').hide()
    if(!cfg.controls.videoBack) $('.fw_video_back').hide()
  }

  fw.capa = _ => {
    $('.fw_capa').css('background-image', `url(${cfg.capa.background})`)

    gsap.set('.fw_enter', {
      height: '204px', 
      top: cfg.capa.titlePosition.y, 
      left: cfg.capa.titlePosition.x, 
      right: '',
      marginTop: 0
    })

    gsap.set('.fw_h1', {
      top: '50%', 
      marginLeft: cfg.capa.titlePosition.marginLeft,
      position: 'absolute',
      y: '-50%'
    })

    $('.fw_h1').css({ 'text-align': cfg.capa.titleAlign, 'color': cfg.capa.txtColor})
    $('.fw_h1').html(cfg.capa.title)

    $('.fw_blob_play').css('fill', cfg.capa.blobColor)
    $('.fw_sombra_play').css('fill', cfg.capa.blobShadowColor)
    $('.fw_play_fundamental').css('fill', cfg.capa.btnColor)

    $('.fw_capa_play').css('fill', cfg.capa.btnColor)

    if (!cfg.capa.showPlay) {
      $('.fw_capa_play, .fw_capa_play_fundamental').hide()
    }
  }

  fw.creditos = _ => {
    let strHtml = ''

    cfg.creditos.content.forEach(content => {
      if (content.length > 0) {
        strHtml += `<p><span class="fw_creditos_title">${content[0]} </span><span class="fw_creditos_content">${content[1]}</span><p>`
      } else {
        strHtml += '<br>'
      }
    });

    $('.fw_logo').attr('src', cfg.creditos.logo)
    $('.fw_h3').html(cfg.creditos.title)
    $('.fw_frame article').html(strHtml)

    gsap.set('.fw_creditos', {y: 720, display: 'none'})
  }

  fw.load = _ => {
    $('.fw_loader').show()

    // video
    const vContainer = document.getElementsByClassName('fw_videos')[0]
    var videoCounter = 0
    var videoReady = false

    cfg.load.videos.forEach(v => {

      if (!!v.src.match('vimeo')) {
        let iframe = document.createElement('iframe')
        iframe.id = v.id
        iframe.src = `${v.src}?quality=720p&controls=1`
        iframe.width = 1280
        iframe.height = cfg.barra.fundamentalMode ? 720 : 720
        iframe.style.border = 0
        iframe.allow = 'autoplay; fullscreen'
        iframe.allowFullscreen = v.fullscreen
        iframe.dataset.ready = 'true'
        iframe.className = !!v.class ? v.class : ''
        iframe.style.display = 'none'
        iframe.controls = "true"

        let player = new Vimeo.Player(iframe)
        player.on('volumechange', function(e){
          fw.volumeKnob(e.volume*110, null, true)
        })

        player.on('timeupdate', function(e){
          if (e.duration - e.seconds < 0.4 && e.duration - e.seconds > 0) {
            player.setCurrentTime(e.duration)
          }
        })

        oed.videos.push(player)

        vContainer.appendChild(iframe)
        videoCounter++

        videoReady = videoCounter >= cfg.load.videos.length
        allReady()
      } else {
        let video = document.createElement('video')
        video.id = v.id
        video.preload = 'auto'
        video.width = 1280
        video.height = cfg.barra.fundamentalMode ? 720 : 720
        video.controls = true
        video.className = !!v.class ? v.class : ''
        video.style.display = 'none'

        let source = document.createElement('source')
        source.src = v.src
        source.type = 'video/mp4'

        let track = document.createElement('track')
        track.label = 'Português'
        track.kind = 'subtitles'
        track.srclang = 'pt'
        track.src = v.src.replace('.mp4', '.vtt')
        track.default = true

        video.appendChild(source)
        video.appendChild(track)

        oed.videos.push(video)

        video.onloadedmetadata = function(){
          videoCounter++
          videoReady = videoCounter >= cfg.load.videos.length
          allReady()
        }

        function vCanPlay() {
          video.removeEventListener('canplaythrough', vCanPlay, false)
          video.removeEventListener('load', vCanPlay, false)
          
          videoCounter++
          videoReady = videoCounter >= cfg.load.videos.length
          allReady()
        }
        
        video.volume = 0
        video.play()

        if (video.readyState !== 4) {
          video.addEventListener('canplaythrough', vCanPlay, false) 
          video.addEventListener('load', vCanPlay, false)

          setTimeout(function(){
            video.pause()
            video.volume = 1
          }, 1)
        } else {
          setTimeout(function(){
            video.pause()
            video.volume = 1
          }, 1)
        }

        video.onvolumechange = _ => { fw.volumeKnob(video.volume*110, null, true) }

        vContainer.appendChild(video)
      }
    })

    // audios
    const aContainer = document.getElementsByClassName('fw_audios')[0]
    var audioCounter = 0
    var audioReady = false

    cfg.load.audios.forEach(a => {
      let audio = document.createElement('audio')
      audio.id = a.id
      audio.preload = 'auto'
      audio.src = a.src
      audio.className = !!a.class ? a.class : ''

      // if trilha
      if (!!a.isBgTrack){
        audio.classList.add('trilha')
        oed.trilha = audio
        audio.onended = _ => oed.trilha.play()
      } else {
        oed.audios.push(audio)
      }

      aContainer.appendChild(audio)

      function aCanPlay() {
        audio.removeEventListener('canplaythrough', aCanPlay, false)
        audio.removeEventListener('load', aCanPlay, false)

        audioCounter++
        audioReady = audioCounter >= cfg.load.audios.length
        allReady()
      }

      audio.volume = 0
      audio.play()

      if (audio.readyState !== 4) {
        audio.addEventListener('canplaythrough', aCanPlay, false) 
        audio.addEventListener('load', aCanPlay, false)

        setTimeout(function(){
          audio.pause()
          audio.volume = 1
        }, 1)
      } else {
        //  ready
        setTimeout(function(){
          audio.pause()
          audio.volume = 1
        }, 1)
      }
      
    })

    // images
    const iContainer = document.getElementsByClassName('fw_images')[0]
    var imgCounter = 0
    var imgReady = false

    cfg.load.images.forEach(i => {
      let image = new Image()

      image.src = i
      image.onload = _ => {
        imgCounter++
        imgReady = imgCounter >= cfg.load.images.length
        allReady()
      }

      iContainer.appendChild(image)
    })

    if (cfg.load.videos.length == 0) {
      videoReady = true
      allReady()
    } 
    if (cfg.load.audios.length == 0) {
      audioReady = true
      allReady()
    }
    if (cfg.load.images.length == 0) {
      imgReady = true
      allReady()
    }

    // loading animation
    const imageLoader = document.querySelector('.fw_loader img')
    const fps = 50
    const loadingMaxFrames = 63
    const loadedMaxFrames = 49
    let animationIdx = 1
    let animation = null
    var endAnimation = false
    let loadedAnimation = false
    var minTime = 3*fps
    var time = 0
    
    animation = gsap.to(imageLoader, 1/fps, {opacity: 1, onComplete: function(){
      time++
      if (endAnimation && animationIdx == 1 && time > minTime || loadedAnimation) {
        loadedAnimation = true
        if (animationIdx >= loadedMaxFrames) {
          $('.fw_loader').fadeOut(1000)
          $('.fw_content').fadeIn(1000)
          fw.iframeContent = document.getElementById('fw_oed').contentWindow.document.getElementById('view')
          return false
        } else {
          animationIdx++
          imageLoader.src = `${cfg.load.finishedLoadPath}/${animationIdx}.png`
        }
      } else {
        animationIdx = animationIdx >= loadingMaxFrames ? 1 : animationIdx + 1
        imageLoader.src = `${cfg.load.loadingImgPath}/${animationIdx}.png`
      }
      animation.restart()
    }}).pause()

    function allReady() { endAnimation = imgReady && videoReady && audioReady }

    animation.play()
  }

  fw.resize = _ => {
    const pfwCenterBlock = $('.fw_center')[0]
    const content = $('.fw_content')[0]
    const barHeight = cfg.barra.fundamentalMode ? 90 : 65
    const maxWidth = cfg.barra.fundamentalMode ? 1920 : 1920
    const maxHeight = 1080
    const currentWidth = window.innerWidth
    const currentHeight = window.innerHeight
    const baseHeight = cfg.barra.fundamentalMode ? 720 : 720
    const ratioNeeded = maxWidth / maxHeight
    const currentRatio = currentWidth / currentHeight

    let width = null
    let height = null

    if (ratioNeeded < currentRatio || ratioNeeded - currentRatio < 0.01) {
      // use height as base
      height = currentHeight < maxHeight ? currentHeight : maxHeight
      width = ratioNeeded * (height-barHeight)
    } else {
      // use width as base
      width = currentWidth < maxWidth ? currentWidth : maxWidth
      height =  (width / ratioNeeded) + barHeight
    }

    let scale = (height-barHeight)/baseHeight
    oed.scale = scale

    content.style.transform = `scale(${scale})`

    pfwCenterBlock.style.width = `${width}px`
    pfwCenterBlock.style.height = `${height}px`
    pfwCenterBlock.style.top = `${(currentHeight / 2 - height/2)}px`
    pfwCenterBlock.style.left = `${(currentWidth / 2 - width/2)}px`

  }

  fw.isRestarting = false

  fw.restart = _ => {
    oed.stopAll()

    fw.isRestarting = true

    $('.fw_zoomable').fadeOut(1000, function() {
      if (!!oed.restart) oed.restart()

      $('#fw_oed').attr('src', '')
      setTimeout(function(){ $('#fw_oed').attr('src', 'res/main.html') }, 100)

      $('.fw_videos > *').hide()
      gsap.set('.fw_zoomable, .fw_capa, .fw_creditos, .fw_videos', {scale: 1, x: 0, y: 0})
      oed.scale = 1
      $('.fw_capa').show()

      $(this).fadeIn(1000, function(){
        fw.isRestarting = false
        fw.iframeContent = document.getElementById('fw_oed').contentWindow.document.getElementById('view')
      })
    })
  }

  fw.onBack = function() {
    $(this).fadeOut(500)
    oed.stop(oed.playing, _ => {
      let elem = !!oed.playing.element ? oed.playing.element : oed.playing
      $(elem).fadeOut(1000, function() {
        oed.playing = null
        if (!!oed.onvideoback) oed.onvideoback.call(elem)
      })
    })
  }

  fw.volumeKnob = (dx, time, onlyknob) => {
    dx = dx > 110 ? 110 : dx
    dx = dx < 0 ? 0 : dx
    time = time != undefined ? time : 0.15

    gsap.to('.fw_bar_knob', time, {x: dx})
    gsap.to('.fw_bar_position', time, {width: `${dx}px`})
    
    if (!onlyknob)
      oed.setVolume(dx / 110)

    if (dx == 0) {
      document.getElementsByClassName('fw_sound_on')[0].style.display = 'none'
      document.getElementsByClassName('fw_sound_off')[0].style.display = 'block'
    } else {
      document.getElementsByClassName('fw_sound_on')[0].style.display = 'block'
      document.getElementsByClassName('fw_sound_off')[0].style.display = 'none'
    }
  }

  fw.zoomPosition = (e) => {
    const scrollable = $('.fw_scrollable')[0]
    const fwLeft = gsap.getProperty('.fw_center', 'left')
    const fwTop = gsap.getProperty('.fw_center', 'top')
    const fwWidth = $('.fw_content')[0].getBoundingClientRect().width
    const fwHeight = $('.fw_content')[0].getBoundingClientRect().height
    const mx =  !!e.targetTouches ? e.targetTouches[0].clientX : e.clientX
    const my =  !!e.targetTouches ? e.targetTouches[0].clientY : e.clientY
    const maxScrollTop = scrollable.scrollHeight - scrollable.clientHeight
    const maxScrollLeft = scrollable.scrollWidth - scrollable.clientWidth
    
    const mouseX = mx - fwLeft
    const mouseY = my - fwTop

    return {
      x: mouseX * maxScrollLeft / fwWidth, 
      y: mouseY * maxScrollTop / fwHeight
    }
  }

  fw.zoomScale = (type) => {
    let scale = type === 'in' ? 
            gsap.getProperty('.fw_zoomable', 'scaleX') == 1 ? 1.6 : 2 :
            gsap.getProperty('.fw_zoomable', 'scaleX') == 2 ? 1.6 : 1
    
    return scale
  }

  // events

  // restart
  $('.fw_restart').on('click', fw.restart)

  // volume
  $('.fw_nav').on('mouseleave', _ => { $('.fw_volume').removeClass('open') })

  let fwVolumeIsOver = false
  $('.fw_volume').on('mouseenter', function() {
    let _this = this
    fwVolumeIsOver = true
    setTimeout(function(){
      if (fwVolumeIsOver)
        _this.classList.add('open') 
    }, 400)
  }).on('mouseleave', _ => {
    fwVolumeIsOver = false
  })

  $('.fw_sound').on('click', _ => {
    if ($('.fw_sound_on').css('display') == 'none') {
      $('.fw_sound_on').css('display', 'block')
      $('.fw_sound_off').css('display', 'none')

      fw.volumeKnob( oed.currentVolume * 110 )
    } else if (!oed.isTouchDevice() || $('.fw_volume').hasClass('open')) {
      $('.fw_sound_on').css('display', 'none')
      $('.fw_sound_off').css('display', 'block')

      fw.volumeKnob(0)
    }
  })

  $('.fw_bar').on('click', function(e){
    let dx = e.clientX - this.getBoundingClientRect().x
    fw.volumeKnob(dx)
  }).on('mousewheel', function(e){
    const knobPosX = gsap.getProperty('.fw_bar_knob', 'x')
    let dx = e.originalEvent.deltaY > 0 ? knobPosX + 11 : knobPosX - 11
    fw.volumeKnob(dx)
  })

  Draggable.create(".fw_bar_knob", {
    type:"x",
    edgeResistance:1, 
    bounds:".fw_bar",
    inertia:false,
    onDrag: function() {
      let dx = this.x == 107 ? 110 : this.x == 5 ? 0 : this.x
      fw.volumeKnob(dx, 0)
    }
  });
  
  // zoom
  if (oed.isTouchDevice()) {
    $('.fw_zoom_in').on('click', _ => {
      let s = fw.zoomScale('in')
      $('.fw_content').addClass('fw_action_zoomed')
      gsap.to('.fw_zoomable', 0.3, {scale: s})
    })

    $('.fw_zoom_out').on('click', _ => {
      let s = fw.zoomScale('out')
      gsap.to('.fw_zoomable', 0.3, {scale: s, onComplete: _ => {
        if (s === 1) {
          $('.fw_content').removeClass('fw_action_zoomed')
          const scrollable = document.querySelector('.fw_scrollable')
          scrollable.scrollLeft = 0
          scrollable.scrollTop = 0
        }
      }})
    })

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.classList.add('ios')
    }

    document.body.classList.add('touch')

  } else {

    document.body.classList.add('no-touch')

    $('.fw_zoom').on('click', _ => {
      if ($('.fw_zoom_in').css('display') === 'none') {
        $('.fw_zoom_in').show()
        $('.fw_zoom_out').hide()
        $('.fw_content').addClass('fw_action_zoom_out').removeClass('fw_action_zoom_in')
      } else {
        $('.fw_zoom_in').hide()
        $('.fw_zoom_out').show()
        $('.fw_content').addClass('fw_action_zoom_in').removeClass('fw_action_zoom_out')
      }
      $('iframe, video').each( (i, e) => { e.style.pointerEvents = 'none' })
    })

    const scrollable = document.querySelector('.fw_scrollable')

    $('.fw_content').on('click', function(e){
      let ev = e.originalEvent

      if ($(this).hasClass('fw_action_zoom_in')) {
        let scale = fw.zoomScale('in')
        
        if (scale === 2) {
          $(this).removeClass('fw_action_zoom_in').addClass('fw_action_zoom_out')
        }
  
        $(this).addClass('fw_action_zoomed')

        gsap.to('.fw_zoomable', 0.2, {scale: scale, rotation: 0.01, onUpdate: function(){
          let pos = fw.zoomPosition(ev)
          scrollable.scrollLeft = pos.x
          scrollable.scrollTop = pos.y
        }, onComplete: function(){
          gsap.set('.fw_zoomable', {rotation: 0})
        }})
        
      } else if ($(this).hasClass('fw_action_zoom_out')) {
        let scale = fw.zoomScale('out')
  
        if (scale === 1) {
          $('.fw_zoom_in').css('display', 'block')
          $('.fw_zoom_out').css('display', 'none')
        }
        
        gsap.to('.fw_zoomable', 0.2, {scale: scale, rotation: 0.01, onUpdate: function(){
          let pos = fw.zoomPosition(ev)
          scrollable.scrollLeft = pos.x
          scrollable.scrollTop = pos.y
        },  onComplete: function(){
          gsap.set('.fw_zoomable', {rotation: 0})
          if (scale == 1) {
            $('iframe, video').each( (i, e) => { e.style.pointerEvents = '' })
            $('.fw_content').removeClass('fw_action_zoom_out').removeClass('fw_action_zoomed')
          }
        }})
      }
    }).on('mousemove', function(e) {
      if($(this).hasClass('fw_action_zoomed') ) {
        let pos = fw.zoomPosition(e.originalEvent)
        console.log(pos)
        scrollable.scrollLeft = pos.x
        scrollable.scrollTop = pos.y
      }
    })
  }

  // invert
  $('.fw_invert').on('click', _ => $('.fw_center').toggleClass('fw_action_invert'))

  // creditos
  $('.fw_credits').on('click', function(){
    if(gsap.getProperty('.fw_creditos', 'y') < 600) {
      // close
      gsap.to('.fw_creditos', 1, {y: 720, display:'none', onComplete: _=>{
        fw.isCreditsOpen = false
        oed.resume()
      }})
    } else {
      // open
      gsap.set('.fw_creditos', {y: 720, display:'none'})

      oed.pauseAll()

      fw.isCreditsOpen = true

      // scroll train correct height
      setTimeout(function(){
        const fwFrameHeight = $('.fw_frame')[0].offsetHeight
        const fwCreditsArticleHeight = $('.fw_frame article')[0].scrollHeight

        let newHeight = fwFrameHeight * fwFrameHeight / fwCreditsArticleHeight
        
        gsap.to('.fw_scroll_train', 0.1, {height: `${newHeight}px`})
      }, 100)

      gsap.to('.fw_creditos', 1, {display: 'block', y: 0})
    }
  })

  $('.fw_frame article').on('scroll', function() {
    const railHeight = $('.fw_scroll_rail')[0].offsetHeight
    const thisHeight = this.scrollHeight
    const thisY = this.scrollTop

    let dy = thisY * railHeight / thisHeight

    gsap.to('.fw_scroll_train', 0.1, {y: dy})
  })

  $('.fw_close').on('click', _ => {
    gsap.to('.fw_creditos', 1, {y: 720, display: 'none', onComplete: _ => {
      fw.isCreditsOpen = false
      oed.resume()
    }})
  })

  Draggable.create(".fw_scroll_train", {
    type:"y",
    edgeResistance:1, 
    bounds:".fw_scroll_rail",
    inertia:false,
    onDrag: function() {
      const fwFrameHeight = document.getElementsByClassName('fw_frame')[0].offsetHeight
      const fwCreditsArticleHeight = $('.fw_frame article')[0].scrollHeight
      const fwTrainHeight = gsap.getProperty('.fw_scroll_train', 'height')
      const maxDy = fwFrameHeight - fwTrainHeight
      const maxScroll = fwCreditsArticleHeight - fwFrameHeight

      let newScrollY = this.y * maxScroll / maxDy

      $('.fw_frame article')[0].scrollTop = newScrollY
    }
  });

  // capa
  $('.fw_enter').on('click', _ => {
    if(oed.beforeStart) oed.beforeStart()
    $('.fw_capa').fadeOut(1000, oed.onStart)
  })

  // video back
  $('.fw_video_back').on('click', fw.onBack)

  // resize
  window.onresize = fw.resize

  // calls
  document.title = cfg.capa.title.replace(/<br>/g, ' ')
  fw.volumeKnob(110)
  fw.resize()
  fw.capa()
  fw.navigation()
  fw.creditos()
  fw.load()
  
  oed.restartButton = $('.fw_restart')
  $('#fw_oed')[0].src = "res/main.html"
}

init()