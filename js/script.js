//deck 1 = Tarots
//deck 2 = Deck Of Many Things
myDeck = 1;
index_draw_card = 1;
let turnedCard = 0;

console.log("le script s'execute");

function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function processRequest() {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    return temp;
}

function switchDeck(event, desiredDeck) {
  if (myDeck !== desiredDeck) {
    myDeck = desiredDeck;
    $('.card').removeClass('animated');
    location.reload();
  }  
}

function draw_in_hand_animation() {
  draftedCard = document.getElementById('card-container-' + index_draw_card);
  draftedCardJQ =  $('#card-container-' + index_draw_card);
  //déclenche l'animation css de draft
  draftedCardJQ.addClass('draft_animation');

  //affecte les attributs event hover sur la carte piochée (zoom et dézoom)
  draftedCardChild = $('#card-container-' + index_draw_card).children();
  draftedCardChild.attr('onmouseover', "zoom(event)");
  draftedCardChild.attr('onmouseout', "dezoom(event)");

  //quand l'animation css se termine...
  draftedCard.addEventListener('animationend', function() {
    //réordonnancement pour conserver l'ordre de la main
    var nbCard = $('.draft_animation').length;
      $('#card-container-' + index_draw_card).css('order', 79 + nbCard); 
    //paramètre largeur de la main
    var margin = 10 + 50 / nbCard;
    var cardWidth = 100;
    var handWidth = nbCard * cardWidth + (nbCard - 1) * margin;
    var angle = 90 / (nbCard + 1);
    //boucle for-each sur les cartes tirées pour les replacer dans la main
    $('.draft_animation').each(function() {
      var indexHand = $( this ).css('order') - 80;
      var posX = -(handWidth / 2) + indexHand * (cardWidth + margin) + cardWidth / 2;
      var angleOfThis = -45 + angle * (indexHand +1);
      console.log(angleOfThis * 0.0174533);
      var posY =  Math.ceil(1-(Math.cos(angleOfThis * 0.0174533) * Math.cos(angleOfThis * 0.0174533) - 0.5) * 200) + 350;
      $( this ).css('transform', 
        'translateX(' + posX + 'px)'+ 
        'translateY(' + posY + 'px)'+ 
        'rotate(' + angleOfThis +'deg)'
        );
      $( this ).css('z-index', 800);
    });
  });
}


function flip(event) {
  console.log('flip !');
  var element = event.currentTarget;
  const regex_is_a_card = new RegExp('card');
  const regex_animation_running = new RegExp('animated');
  if (regex_is_a_card.test(element.className) && !(regex_animation_running.test(element.className))) {

    //obtenir l'index de l'élément cliqué
    var children = element.childNodes;
    var lastChild = children[children.length-2];
    var index = lastChild.id;
    index_draw_card = index.slice(5, index.length);

    //remettre un carte de dos
    if(element.style.transform == "rotateY(180deg)") {
      //element.style.transform = "rotateY(0deg)";
      //$('#card-container-' + index).css('width', '100px');
      //$('#card-container-' + index).css('height', '160px');
      //$('#carte' + index).css('background-size', '100px 160px');
      //$('#carte' + index).siblings('div').css('background-size', '100px 160px');
      //--turnedCard;
    }
    else { //dévoiller une nouvelle carte
      element.style.transform = "rotateY(180deg)";
      //$('#card-container-' + index).css('width', '200px');
      //$('#card-container-' + index).css('height', '300px');
      //$('#carte' + index).css('background-size', '200px 300px');
      //$('#carte' + index).siblings('div').css('background-size', '200px 300px');
      ++turnedCard;
      draw_in_hand_animation();
    }
  }
  //if (turnedCard == 3) { closePicking()};

};

function zoom(event) { //zoom des cartes dans la main
  var elementParent = event.currentTarget.parentNode;
  var index = elementParent.id;
  index = index.slice(15, index.length);
  $('#card-container-' + index).css('z-index', '900');
  $('#card-container-' + index).css('width', '200px');
  $('#card-container-' + index).css('height', '300px');
  $('#carte' + index).css('background-size', '200px 300px');
  $('#carte' + index).siblings('div').css('background-size', '200px 300px');
}

function dezoom(event) { //dézoom des cartes dans la main
  var elementParent = event.currentTarget.parentNode;
  var index = elementParent.id;
  index = index.slice(15, index.length);
  $('#card-container-' + index).css('z-index', '800');
  $('#card-container-' + index).css('width', '100px');
  $('#card-container-' + index).css('height', '160px');
  $('#carte' + index).css('background-size', '100px 160px');
  $('#carte' + index).siblings('div').css('background-size', '100px 160px');
}

function melanger() {
  console.log("mélange en cours");
  var nbChildren = 78;
  for (var i = 0; i <200; i++) {
    let pointedElement = getRandomArbitrary(0, nbChildren);
    let newPos = getRandomArbitrary(0, nbChildren);
    $("#card-container-" + pointedElement).css('order', newPos);
  }
  console.log('mélange terminé');
};


function initialize(myDeck) {
  //calcul taille du deck choisi
  myDeck = parseInt(myDeck);
  var decksLenght = new Map();
  decksLenght.set(1, 78);
  decksLenght.set(2, 22);
  myDeckLenght = decksLenght.get(myDeck);

  //attribuer les faces aux cartes
  console.log(myDeckLenght);
  for (var i = 1; i < 79; i++) {
    if (i > myDeckLenght) {
      console.log('carte'+i+'dit être masquée');
      $('#carte' + i).parent().parent().remove();
    } else {
      var str1 = 'url(img/';
      var str2 = myDeck;
      var str3 = '/';
      var str4 = i - 1;
      var str5 = '.jpg)';
      var url = str1 + str2 + str3 + str4 + str5;
      console.log(url);
      urlBack = str1 + str2 + str3 + 'back' + str5;
      var elementX = document.getElementById("carte" + i);
      elementX.style.backgroundImage = url; 
      $("#carte" + i).css('background-size', '100px 160px;');
      $("#carte" + i).siblings().css('background-image' , urlBack);
    }
  };

  //déclencher l'animation
  $('.card').addClass('animated');

  //event listener fin d'animation => retirer la class animated, déclencher le mélange
  var card1 = document.getElementById("testing-one");
  card1.addEventListener('animationend', function() {
    $('.card').removeClass('animated');
    melanger();
  });
}

//main
$(document).ready(function()
{
  urlDeck = processRequest();
  if (urlDeck[0] === "") {
    var loadingDeck = 1;
  } else {
    loadingDeck = urlDeck[0];
  }
  console.log(urlDeck[0]);
  console.log('loading with deck ' + urlDeck[0]); 
  initialize(loadingDeck);
  
});
