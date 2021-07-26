const cfg = {
  //  Título que aparece na capa
  //  imagem de fundo da capa vem de oed/img/capa.png
  capa: {
    title: 'Contagens e cálculos',
    titlePosition: {x: '580px', y: '270px', marginLeft: '0px'},
    showPlay: true,
    titleAlign: 'right',
    txtColor: '#292f54',
    btnColor: '#5f7798',
    blobColor: '#88bc24',
    blobShadowColor: '#5c7c18',
    background: 'res/img/capa_fundamental.png',
  },
  barra: {
    fundamentalMode: false,
    fundamentalContentOnly: true,
    background: '#0095d4',
    btnFillColor: '#fff',
    btnOverFillColor: '#026182',
    soundBarBg: '#91def9'
  },

  // mostra ou não os botoes na barra de controles
  // caso todos sejam falsos a barra é escondida
  controls: {
    restart: true,
    sound: true,
    zoom: true,
    invert: true,
    credits: true,
    videoBack: true,
  },

  // pre carrega assets e deixas videos e audios no controle do framework
  // lida com api do vimeo e com videos no DOM
  // id, src - required
  load: {
    loadingImgPath: 'res/img/loader/loading',
    finishedLoadPath: 'res/img/loader/loaded',
    videos: [
      // {id: "vid1", class:"vid", src: "https://player.vimeo.com/video/518246867", fullscreen: true}, // video testes locais
      // {id: "vid2", class:"vid", src: "https://player.vimeo.com/video/518248512", fullscreen: true}, // video testes locais
      // {id: "vid3", class:"vid", src: "https://player.vimeo.com/video/518250665", fullscreen: true}, // video testes locais
      {id: "vid1", class:"vid", src: "res/video/video01.mp4"},
      {id: "vid2", class:"vid", src: "res/video/video02.mp4"},
      {id: "vid3", class:"vid", src: "res/video/video03.mp4"},
      {id: "vid4", class:"vid", src: "res/video/video04.mp4"},
      // {id: "vid5", class:"vid", src: "res/video/video05.mp4"},
      // {id: "vid6", class:"vid", src: "res/video/video06.mp4"},
      // {id: "vid7", class:"vid", src: "res/video/video07.mp4"},
      // {id: "vid8", class:"vid", src: "res/video/video08.mp4"},
      // {id: "vid9", class:"vid", src: "res/video/video09.mp4"},
      // {id: "vid10", class:"vid", src: "res/video/video10.mp4"},
    ],
    audios: [
      {id: "trilha", class:"", src: "res/audio/trilha.mp3", isBgTrack: true},
      {id: "click", src: "res/audio/click.mp3"},
      {id: 'fbp', src: 'res/audio/feedback_correto.mp3'},
      {id: 'fbn', src: 'res/audio/feedback_incorreto.mp3'},
      {id: 'loc1_3', src: 'res/audio/loc01_TELA_3.mp3'},
      {id: 'loc2_3', src: 'res/audio/loc02_TELA_3.mp3'},
      {id: 'loc3_6', src: 'res/audio/loc03_TELA_6.mp3'},
      {id: 'loc4_11', src: 'res/audio/loc04_TELA_11.mp3'},
      {id: 'loc5_15', src: 'res/audio/loc05_TELA_15.mp3'},
      {id: 'loc6_16', src: 'res/audio/loc06_TELA_16.mp3'},
    ],
    images: [
      'res/img/b1.png',
      'res/img/b2.png',
      'res/img/b3.png',
      'res/img/b4.png',
      'res/img/b5.png',
      'res/img/b6.png',
      'res/img/back.png',
      'res/img/bg_modal_max.png',
      'res/img/bg_modal_min.png',
      'res/img/bg_restart.png',
      'res/img/bg1.png',
      'res/img/bg2.png',
      'res/img/bg3.png',
      'res/img/bg4.png',
      'res/img/bg5.png',
      'res/img/bg6.png',
      'res/img/bq-lb.png',
      'res/img/bq-or.png',
      'res/img/bq-pk.png',
      'res/img/bq-pl.png',
      'res/img/bq-yw.png',
      'res/img/btn_back.png',
      'res/img/bx_field.png',
      'res/img/bx_n.png',
      'res/img/capa_fundamental.png',
      'res/img/fw_close.png',
      'res/img/logo.png',
    ]
  },

  // ["Título", "Conteúdo"]
  // [] - pular linha
  creditos: {
    title: 'Créditos',
    logo: 'res/img/logo.png',
    content: [
      ["Vice-presidência de Educação Básica:"," Juliano de Melo Costa"],
      ["Direção editorial de Educação Básica e Universidades:"," Alexandre Ferreira Mattioli"],
      ["Gerência de produtos editoriais:"," Matheus Caldeira Sisdeli"],
      ["Gerência de design:"," Cleber Figueira Carvalho"],
      ["Coordenação de produtos editoriais:"," Felipe A. Ribeiro"],
      ["Coordenação de conteúdos digitais:"," Fábio Geraldo Romano"],
      ["Coordenação de produtos digitais:"," Alberto Rodrigues"],
      [],
      ["Roteiro do objeto:"," Thalita Andrade da Silva"],
      [],
      ["Editoria 'responsável/","/Erika Akime Tawada Boldrin"],
      ["Designer Instrucional:"," Carolina Plumari"],
      ["Editoria de produção multimídia:"," Felipe Labiapari"],
      [],
      ["Controle de produção editorial:"," Lidiane Alves Ribeiro de Almeida"],
      ["Organização de originais:"," Marisa Aparecida dos Santos e Silva"],
      [],
      ["Ilustrações:"," Kayna Mello Heleno"],
      ["imagens:"," Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras laoreet aliquet sem. Nulla aliquet ligula eget arcu dapibus, vitae maximus nulla facilisis. Integer porttitor congue egestas. Maecenas consectetur massa hendrerit, iaculis turpis vel, malesuada diam. Integer ac massa id urna posuere varius at ut tortor. Etiam faucibus porttitor purus. Nunc ut enim eu neque tincidunt scelerisque. Curabitur eu faucibus orci. Donec elementum pretium viverra. Quisque tempus ex leo, a venenatis massa consectetur a. Suspendisse lacinia sed nisi et porttitor. Nunc ligula turpis, lobortis at purus sit amet, tristique ultrices ligula. Etiam vel neque odio. Integer condimentum ligula vel tortor mattis, sit amet consectetur risus pharetra. Duis ultrices tellus lacus, vitae facilisis odio mollis eget. Donec elit massa, blandit in enim ut, pharetra rhoncus sem."],
      ["Áudio:"," Stick Around / Adrian Walther/soundstripe.com"],
      ["Locuções:"," Batuki"],
      [],
      ["Produtora:"," BUGBITE"],
    ]
  }
}