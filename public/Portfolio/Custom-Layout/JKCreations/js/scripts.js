"use strict"

var cart = [];
const indv = {'id': 'indv','description':'Indvidual Scented Tarts', 'cost': 1,};
const clamshell = { 'id': 'clamshell','description':'Clamshell Scented Tarts', 'cost': 2.5,};

function set_obj(item, product) {
	if ( item == 'cart' ) {
		add_to_cart (
			document.getElementById(product.id + '_scent_btn').innerHTML, 
			document.getElementById(product.id + '_color_btn').innerHTML,
			document.getElementById(product.id + '_amount_btn').innerHTML,
			product
		)
	} else {
		document.getElementById(product + '_btn').innerHTML = item;
		dropdown (product + '_list');
	}
}


function add_to_cart (scent, color, amount, product) {
	//var item = {"scent": scent, "color" : color, "amount" : amount, "type" : type}
	//console.log(item)
	var total = product.cost * amount
	cart.push({"scent": scent, "color" : color, "amount" : amount, "total": total, 'product': product})
	console.log(cart)
	pop_cart()
}

function pop_cart (){
	var list = ""
	var subtotal = 0
	for ( var i=0; i < cart.length; i++) {
		list = (list + '<li> Item' + (i + 1) + '<button> Remove </button> </li>' )
		list = (list + '<ul><li>' + cart[i].product.description + '</li>') 
		list = (list + '<li> Scent: ' + cart[i].scent +'</li>')
		list = (list + '<li> Color: ' + cart[i].color + '</li>')
		list = (list + '<li> Amount:' + cart[i].amount + ' x ' + cart[i].product.cost + ' = ' + cart[i].total + '</li></ul>')
		subtotal = subtotal + cart[i].total
	}
	list = (list + '<li> Subtotal:  ' + subtotal + '</li>')
	document.getElementById('cart_ul').innerHTML = list
	
}

function pop_scents (scents, type) {
	var list = ''
	for ( var i=0; i < scents.length; i++) {
		var cmd_onclick = 'onclick=' + "'" + 'set_obj("' + scents[i] + '", "' + type + '")' + "'" 
		//console.log(cmd_onclick)
		list = (list + '<li><button ' + cmd_onclick + '>' + scents[i] + '</button></li>')
	}
	document.getElementById(type + '_list_ul').innerHTML = list
}

function dropdown (menu) {
	var menuElements = [{"element": "clamshell_scent_list", "par":"clamshell_scent_btn"}, 
	{"element": "clamshell_color_list", "par":"clamshell_color_btn"},
	{"element": "clamshell_amount_list", "par":"clamshell_amount_btn"},
	{"element": "indv_scent_list", "par":"indv_scent_btn"},
	{"element": "indv_color_list", "par":"indv_color_btn"},
	{"element": "indv_amount_list", "par":"indv_amount_btn"}
	]
	//console.log(document.getElementById(menu).style.display)
	if (document.getElementById(menu).style.display == '' || document.getElementById(menu).style.display == 'none') {
		for ( var i=0; i < menuElements.length; i++) {
			document.getElementById(menuElements[i].element).style.display = 'none'
		}
		document.getElementById(menu).style.display = 'block';

	} else {
		document.getElementById(menu).style.display = 'none';
	}
}

//set menu div positions 
function posi () {
	var menuElements = [{"element": "clamshell_scent_list", "par":"clamshell_scent_btn"}, 
		{"element": "clamshell_color_list", "par":"clamshell_color_btn"},
		{"element": "clamshell_amount_list", "par":"clamshell_amount_btn"},
		{"element": "indv_scent_list", "par":"indv_scent_btn"},
		{"element": "indv_color_list", "par":"indv_color_btn"},
		{"element": "indv_amount_list", "par":"indv_amount_btn"}
	]
	 for ( var i=0; i < menuElements.length; i++) {
		var el = document.querySelector("#" + menuElements[i].par);
		//console.log(el);
		var coords = getPosition(el);
		//console.log(coords);
		/*if (menuElements[i].element == 'clamshell_color_list' || menuElements[i].element == 'indv_color_list') {
			console.log('its a color')
			document.getElementById(menuElements[i].element).style.left = (coords.x - 150)
		} else {*/
			document.getElementById(menuElements[i].element).style.left = coords.x
		//}
	 	document.getElementById(menuElements[i].element).style.top = (coords.y + 50)
	 }
}



// This is not my code --located https://www.kirupa.com/html5/get_element_position_using_javascript.htm
// Helper function to get an element's exact position
function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      //xPos += (el.offsetLeft - xScroll + el.clientLeft);
      xPos += (el.offsetLeft + el.clientLeft);
      //yPos += (el.offsetTop - yScroll + el.clientTop);
      yPos += (el.offsetTop + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}
 
// deal with the page getting resized or scrolled
window.addEventListener("scroll", updatePosition, false);
window.addEventListener("resize", updatePosition, false);
 
function updatePosition() {
  // add your code to update the position when your browser
  // is resized or scrolled
  //console.log('update posi')
  //posi();
  
}

posi();