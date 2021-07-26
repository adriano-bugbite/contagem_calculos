// get framework api
var oed = window.parent.oed

// for development enviroment 
oed.development()
// for production comment line above

oed.beforeStart = _ => {
  try {
    oed.SetValue('cmi.core.lesson_status', 'incomplete')
  } catch (err) {}
  
  oed.play(oed.trilha)
  oed.play(oed.videos[0], function(){
    $(this).fadeOut(1000, _ => {
      $('#direct').fadeIn(1000, _ => {
        oed.play('#loc1_3')
      })
    })
  })
}

if(oed.isTouchDevice()) {
  document.body.classList.add('touch')
} else {
  document.body.classList.add('no-touch')
}


const content = [
  {ref: 'e2t3', fields: ['Gatos', 'Cachorros'], a:{gatos: 2, cachorros: 3}, q: 'Quantos animais?', baloon: 'E nessa figura, quantos<br>animais há de cada tipo?'},
  {ref: 'e3t6', fields: ['Pintinhos'], a:{pintinhos: 4}, q: 'Quantos pintinhos?', baloon: 'Quem sabe quantos pintinhos<br>temos nessa imagem?'},
  {ref: 'e4t11', fields: ['Notas'], a:{notas: 10}, q: '', baloon: 'Vamos lá crianças, digam-me:<br>quantas notas de 10 reais<br>precisamos para formar<br>a quantia de 100 reais?'},
  {ref: 'e5t15', fields: ['Rodas'], a:{rodas: 2}, q: 'Quantas rodas?', baloon: 'No total das rodas de um veículo...<br>Respondam: quantas rodas<br>temos em um patinete?'},
  {ref: 'e6t16', fields: ['Triângulo', 'Losango', 'Quadrado', 'Círculo'], a:{triangulo: 2, losango: 6, quadrado: 6, circulo: 3}, q: '', baloon: 'Atenção! Um desafio a vocês. Na primeira coluna,<br>estão operações de adição, subtração, multiplicação, divisão<br>e ideias de dobro e terça parte. Cada figura esconde um número.<br>Dica: figuras iguais têm o mesmo número.'},
]
var idx = 0
var trys = 0
var inputs = {}
var field = null

function normalizeFields(field) { return field.toLowerCase().replace('â', 'a').replace('í', 'i') }

function makeWithFields(cb = _ => {}) {
  let c = content[idx]

  let fieldsHtml = c.fields.map(f => `<div class="field" data-field="${normalizeFields(f)}"><span class="label">${f}:</span><span class="n">0</span></div>`)

  trys = 0
  inputs = {}
  field = null

  $('#with_fields').css('pointer-events', '')
  $('#with_fields').find('.balao p').html(c.baloon)
  $('#with_fields').find('.question').html(`${c.q != '' ? `<h2>${c.q}</h2>` : ''} ${fieldsHtml.join('')}`)
  $('.number, .back').addClass('disabled')

  $('#with_fields')[0].className = `fullscreen ${c.ref}`
  
  $('#with_fields').fadeIn(1000, cb)
}

function modalError(ref) {
  $('#error')[0].className = `modal fullscreen ${ref}`
  $('#error').fadeIn(1000, _ => {
    $('#error, #direct').delay(3000).fadeOut(1000, _ => {
      makeWithFields(_ => {
        console.log('poop')
      })
    })
  })
}

$('.opt').on('click', function(){
  oed.play('#click')

  trys++

  oed.stop(oed.playing)

  if (this.innerHTML == 14) {
    oed.play('#fbp')
    $('#direct').css('pointer-events', 'none')
    $('#direct').delay(1000).fadeOut(1000, _ => {
      oed.play(oed.videos[1], function() {
        $(this).fadeOut(1000, _ => {
          makeWithFields(_ => {
            oed.play('#loc2_3')
          })
        })
      })
    })
  } else {
    oed.play('#fbn')

    if (trys <= 1) {
      $('#try_again').fadeIn(1000, _ => {
        $('#try_again').delay(3000).fadeOut(1000)
      })
    } else {
      modalError('e1t3')
    }
  }
})

$('#with_fields').on('click', '.field', function() {
  oed.play('#click')

  $('.field').removeClass('selected')
  $(this).addClass('selected')

  field = this.dataset.field

  if (!inputs[field]) inputs[field] = ''

  if (inputs[field].length == 2) {
    $('.number').addClass('disabled')
    $('.back').removeClass('disabled')
  } else if (inputs[field].length == 1 && parseInt(inputs[field]) > 0) {
    $('.number').removeClass('disabled')
    $('.back').removeClass('disabled')
  } else {
    $('.number').removeClass('disabled')
    $('.back').removeClass('disabled')
  }
})

$('.number').on('click', function(){
  if (field != null && inputs[field].length < 2) {
    oed.play('#click')

    inputs[field] += this.innerHTML
    $('.selected .n').html(inputs[field])

    if (inputs[field].length == 2) {
      $('.number').addClass('disabled')
      $('.back').removeClass('disabled')
    }

    if (idx != 2 || idx == 2 && inputs[field].length > 1) {
      let r = []
      let c = content[idx]

      if (Object.keys(inputs).length == Object.keys(c.a).length) {
        c.fields.forEach(f => {
          let normalizedF = normalizeFields(f)
          r.push(parseInt(inputs[normalizedF]) == c.a[normalizedF])
        })
  
        trys++
      }
  
      if (r.length > 0 && r.indexOf(false) == -1) {
        oed.play('#fbp')
  
        idx++
  
        $('#with_fields').css('pointer-events', 'none')
        if (idx < content.length) {
          let c = content[idx]
          let audioId = c.ref.replace('e', '#loc').replace('t', '_')

          switch (idx) {
            case 1:
            case 3:
              // pintinhos e rodas
              $('#with_fields').delay(1000).fadeOut(1000, _ => {
                makeWithFields(_ => {
                  oed.play(audioId)
                })
              })
            break;
            case 2:
              // notas
              $('#with_fields').fadeOut(1000)
              oed.play(oed.videos[2], function(){
                $(this).fadeOut(1000, _ => {
                  makeWithFields(_ => {
                    oed.play(audioId)
                  })
                })
              })
            break;
            case 4: 
              // formas
              $('#with_fields').fadeOut(1000)
              oed.play(oed.videos[3], function(){
                $(this).fadeOut(1000, _ => {
                  makeWithFields(_ => {
                    oed.play(audioId)
                  })
                })
              })
            break;
          }
        } else {
          $('#final').fadeIn(1000)
          try {
            oed.SetValue('cmi.core.lesson_status', 'complete')
          } catch (err) {}
        }
        
      } else if (r.length > 0) {
        oed.play('#fbn')
  
        if (trys <= 1) {
          $('#try_again').fadeIn(1000, _ => {
            $('#try_again').delay(3000).fadeOut(1000)
          })
        } else {
          modalError(c.ref)
        }
      }
    }
  }
})

$('.back').on('click', _ => {
  if (field != null && inputs[field].length > 1) {
    oed.play('#click')

    inputs[field] = inputs[field].slice(0, -1)

    $('.selected .n').html(inputs[field])
    $('.number').removeClass('disabled')
  } else {
    inputs[field] = ''
    $('.selected .n').html(0)
    $('.back').addClass('disabled')
  }
})

$('.restart').on('click', _ => {
  oed.play('#click')
  oed.restartButton.trigger('click')
})

$('#direct, #with_fields, .modal').hide()