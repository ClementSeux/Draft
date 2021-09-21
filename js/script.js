//choisir le deck ici:
//deck 1 = Tarots
//deck 2 = Deck Of Many Things
myDeck = 1;
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

//function closePicking () {
  //console.log('closing draft');
  //$('.card').each(function(index) {
    //console.log($(this).css('transform'));
    //if($(this).css('transform') !== "rotateY(180deg)") {
      //console.log('foo');
      //$(this).hide();
    //};
  //});
//} 


function switchDeck(event, desiredDeck) {
  if (myDeck !== desiredDeck) {
    myDeck = desiredDeck;
    $('.card').removeClass('animated');
    location.reload();
  }
  
}


function flip(event) {
  console.log('flip !');
  var element = event.currentTarget;
  const regex = new RegExp('card');
  
  if (regex.test(element.className)) {

    //obtenir l'index de l'élément cliqué
    var children = element.childNodes;
    var lastChild = children[children.length-2];
    var index = lastChild.id;
    index = index.slice(5, index.length);

    if(element.style.transform == "rotateY(180deg)") {
      element.style.transform = "rotateY(0deg)";
      $('#card-container-' + index).css('width', '100px');
      $('#card-container-' + index).css('height', '160px');
      $('#carte' + index).css('background-size', '100px 160px');
      $('#carte' + index).siblings('div').css('background-size', '100px 160px');
      --turnedCard;
    }
    else {
      element.style.transform = "rotateY(180deg)";
      $('#card-container-' + index).css('width', '200px');
      $('#card-container-' + index).css('height', '300px');
      $('#carte' + index).css('background-size', '200px 300px');
      $('#carte' + index).siblings('div').css('background-size', '200px 300px');
      ++turnedCard;     
    }
  }

  //if (turnedCard == 3) { closePicking()};

};


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

  //event listener fin d'animation => retire la class animated, déclenche le mélange
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
