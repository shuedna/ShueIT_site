(function () {

"use strict"

var cart = [];
var scents = [];
var products = [];
var colors = [];
var amounts = [];


	window.onload = function() {

		//load data JSON
		$.getJSON("js/data.json", function(json) {
			scents = json.scents
			//console.log(scents)
			products = json.products
			colors = json.colors
			build_menu()
			build_cart()
			build_main_page()

		})
		
		//cart button listener
		var cart_btn = document.getElementById('cart_btn')
		cart_btn.addEventListener('click', function() {
			//console.log('cart click')
			dropdown('cart')
		})
		
		//menu button listener
		var menu_btn = document.getElementById('menu_btn')
		menu_btn.addEventListener('click', function() {
			dropdown('menu')
		})

	}

	//build main
	function build_main_page () {
		$('#content').remove();
		$('<div></div>').attr('id', 'content').attr('class', 'fbox3').appendTo('section')
		$('<div></div>').attr('id', 'f1').attr('class', 'fbox full').appendTo('#content')
		$('<table></table>').appendTo('#f1')
		$('<thead></thead>').attr('id', 'thead').appendTo('#f1 > table')
		$('<tbody></tbody>').attr('id', 'tbody').appendTo('#f1 > table')
		$('<tr></tr>').attr('id', 'thead_tr').appendTo('#thead')
		$('<tr></tr>').attr('id', 'tbody_tr').appendTo('#tbody')
		for (var i=0; i < products.length; i++) {
			$('<td><h3><a href="#" id="'+ products[i].id + '_link" value="' + i + '">' + products[i].description + '</a></h3></td').appendTo('#thead_tr')
			$('<td><a href="#" id="'+ products[i].id + '_img_link" value="' + i + '"><img class="full_img"src="'+ products[i].image+ '"></a></td').appendTo('#tbody_tr')
			var a = document.getElementById(products[i].id + '_link')
			var a_img = document.getElementById(products[i].id + '_img_link')
			a.addEventListener('click', function() {
				change_page($(this).attr('value'))
			})
			a_img.addEventListener('click', function() {
				change_page($(this).attr('value'))
			})
		}
	}

	//build my menu
	function build_menu () {
		$('<div></div>').attr('id', 'menu').appendTo('.header1')
		$('<a></a>').attr('id', 'menu_btn_Home').attr('href', '#').attr('class', 'menu_item').text('Home').appendTo('#menu')
		var a = document.getElementById('menu_btn_Home' )
		a.addEventListener('click', function() {
				dropdown('menu')
				build_main_page()
		})
		$('<p></p>').text('Products').appendTo('#menu')
		$('<hr/>').appendTo('#menu')
		//console.log(products)
		//console.log(products.length)		
		for (var i=0; i < products.length; i++) {
			$('<a></a>').attr('id', 'menu_btn_' + products[i].id).attr('href', '#').attr('class', 'menu_item').attr('value', i).text(products[i].description).appendTo('#menu')
			var a = document.getElementById('menu_btn_' + products[i].id)
			a.addEventListener('click', function() {
				dropdown('menu')
				change_page($(this).attr('value'))
			})
		}
		$('<hr/>').appendTo('#menu')
		$('<a></a>').attr('id', 'menu_btn_About').attr('href', '#').attr('class', 'menu_item').text('Credits').appendTo('#menu')

	}

	//build cart
	function build_cart () {
		$('#cart').remove()
		$('<div></div>').attr('id', 'cart').appendTo('.header3')
		$('<p></p>').text('Cart').appendTo('#cart')
		$('<hr/>').appendTo('#cart')
		if (cart.length != 0) {
			for (var i = 0; i < cart.length; i ++) {
				var this_id = 'div_item_' + i
				//console.log(this_id)
				var item_num = i + 1 
				$('<p></p>').text('Item '+ item_num + " - " + cart[i].item.description).appendTo('#cart')
				$('<p></p>').text(' Scent: ' +cart[i].scent + " Color: " + cart[i].color).appendTo('#cart')
				$('<p></p>').text("Amount: " + cart[i].amount).appendTo('#cart')
				$('<button>Remove</button>').attr('id','remove_'+ i).attr('value', i).appendTo('#cart')
				$('<hr/>').appendTo('#cart')
				$('#remove_'+ i).on('click', function () {
					var this_val = $(this).val()
					cart.splice(this_val, 1)
					build_cart()
				})
			}
			$('<button>CheckOut</button>').attr('id','checkOut').appendTo('#cart')
			$('#checkOut').on('click', function () {
				checkOut()
			})
		}
	}

	//change page 	
	function change_page (i) {
		//console.log('change_page' + i)
		$('#content').remove();
		$('<div></div>').attr('id', 'content').attr('class', 'flex3').appendTo('section')
		$('<div></div>').attr('id', 'f1').attr('class', 'fbox').appendTo('#content')
		$('<h3></h3>').text(products[i].description).appendTo('#f1')
		$('<img></img>').attr('src', products[i].image).appendTo('#f1')
		$('<p></p>').text(products[i].text).appendTo('#f1')
		$('<div></div>').attr('id', 'f2').attr('class', 'fbox2').appendTo('#content')
		$('<h3></h3>').text('Buy ' + products[i].description).appendTo('#f2')
		$('<select></select>').attr('id', 'scent_list').appendTo('#f2')
		$('<select></select>').attr('id', 'color_list').appendTo('#f2')
		$('<div></div>').attr('id','amount_div').appendTo('#f2')
		$('<button>-</button>').attr('id','amount_minus').attr('class','amount_btn').appendTo('#amount_div')
		$('<input value="' + products[i].min + '"></input>').attr('id', 'amount_list').attr('class','amount_btn').appendTo('#amount_div')
		$('<button>+</button>').attr('id','amount_plus').attr('class','amount_btn').appendTo('#amount_div')
		$('<button></button>').attr('id', 'add_cart').attr('value', i ).text('Add To Cart').appendTo('#f2')
		$('#add_cart').on('click', function() {
			add_to_cart()
		})
		$('#amount_minus').on('click', function() {
			if ($('#amount_list').val() == products[i].min) {
				console.log('Its At MIN!!')
			} else {
				$('#amount_list').val(parseInt($('#amount_list').val())	- parseInt(products[i].min))
			}
		})
		$('#amount_plus').on('click', function() {
			$('#amount_list').val(parseInt($('#amount_list').val())	+ parseInt(products[i].min))
		})
		show_selects()
	}

	//populate select elements
	function show_selects () {
		$('select').each(function() {
			//console.log(this);
			//this.style.display = 'block';
			if ($(this).is('#scent_list')) {
				pop_select(this.id, scents)	
			} else if ($(this).is('#color_list')) {
				pop_select(this.id, colors)
			} else if ($(this).is('#amount_list')) {
				amounts = [];
				var p = $('#add_cart').attr('value')
				var f = products[p].min
				for (var i=1; i < 10; i++) {
					amounts.push(i * f)
				}
				pop_select(this.id, amounts)
			}
		})
	}

	//create select options 
	function pop_select (element, array) {
		var e = $('#'+ element)
		for (var i=0; i < array.length; i++) {
			$('<option></option>').attr('value', array[i]).text(array[i]).appendTo(e) 
		}
	}
	
	//show drop down menus 
	function dropdown (menu) {
		if (document.getElementById(menu).style.display == '' || document.getElementById(menu).style.display == 'none') {
			document.getElementById(menu).style.display = 'block';
		} else {
			document.getElementById(menu).style.display = 'none';
		}
	}

	//on click of add cart button
	function add_to_cart () {
		var i = $('#add_cart').attr('value')
		//console.log(i)
		var item = products[i]
		//console.log(item)
		var scent = $('#scent_list').val()
		var color = $('#color_list').val()
		var amount = $('#amount_list').val()
		//console.log(scent)
		//console.log(color)
		//console.log(amount)
		cart.push({'item': item, 'scent': scent, 'color': color, 'amount': amount })
		//console.log(cart)
		build_cart()
	}
     
	//check out 
	function checkOut () {
		dropdown('cart')
		$('<div></div>').attr('id','checkOut_div').appendTo('.header1')
		$('<h2></h2>').text('Check Out').appendTo('#checkOut_div')
		$('<div></div>').attr('class','flex2').appendTo('#checkOut_div')
		$('<div></div>').attr('id','checkout_cart_div').appendTo('#checkOut_div > .flex2')
		$('<div></div>').attr('id','checkout_addr_div').appendTo('#checkOut_div > .flex2')
		$('<h3></h3>').text('Order').appendTo('#checkout_cart_div')
		$('<h3></h3>').text('Shipping Info').appendTo('#checkout_addr_div')
		var item_subtotal = 0
		var subtotal = 0
			for (var i = 0; i < cart.length; i ++) {
				var this_id = 'div_item_' + i
				$('<div></div>').attr('id',this_id).attr('class','flex').appendTo('#checkout_cart_div')
				$('<div></div>').attr('class','checkout_cart_flex1').appendTo('#' + this_id)
				$('<div></div>').attr('class','checkout_cart_flex2').appendTo('#' + this_id)
				//console.log(this_id)
				var item_num = i + 1 
				$('<p></p>').text( item_num + ". " + cart[i].item.description ).appendTo('#' + this_id +' > .checkout_cart_flex1')
				$('<p></p>').text(cart[i].scent + " Color: " + cart[i].color ).appendTo('#' + this_id +' > .checkout_cart_flex1')
				$('<p></p>').text("Amount: " + cart[i].amount + " X cost:" + cart[i].item.cost ).appendTo('#' + this_id +' > .checkout_cart_flex2')
				item_subtotal = (cart[i].amount * cart[i].item.cost).toFixed(2)
				subtotal = parseFloat(subtotal) + parseFloat(item_subtotal)
				console.log(subtotal.toFixed(2))
				$('<p></p>').text('$' + item_subtotal).appendTo('#' + this_id +' > .checkout_cart_flex2')
				//$('<button>Remove</button>').attr('id','remove_'+ i).attr('value', i).appendTo('#checkout_cart_div')
				//$('<hr/>').appendTo('#checkout_cart_div')
				/*$('#remove_'+ i).on('click', function () {
					var this_val = $(this).val()
					cart.splice(this_val, 1)
					build_cart()
				})*/
				
			}
		$('<hr/>').appendTo('#checkout_cart_div')
		$('<div></div>').attr('id','checkout_sub').attr('class','flex').appendTo('#checkout_cart_div')
		$('<div></div>').attr('class','checkout_cart_flex1').appendTo('#checkout_sub')
		$('<div></div>').attr('class','checkout_cart_flex2').appendTo('#checkout_sub')
		$('<p></p>').text('Subtotal').appendTo('#checkout_sub > .checkout_cart_flex1')
		$('<p></p>').text('$'+ (subtotal).toFixed(2)).appendTo('#checkout_sub > .checkout_cart_flex2')
		$('<p></p>').text('NY Tax  .08').appendTo('#checkout_sub > .checkout_cart_flex1')
		var tax = subtotal.toFixed(2) * 0.08
		$('<p></p>').text('$'+ (tax).toFixed(2)).appendTo('#checkout_sub > .checkout_cart_flex2')
		$('<p></p>').text('Total').appendTo('#checkout_sub > .checkout_cart_flex1')
		var total = parseFloat(subtotal) + parseFloat(tax)
		$('<p></p>').text('$'+ total.toFixed(2)).appendTo('#checkout_sub > .checkout_cart_flex2')
		//Check out Address fields 
		$('<label></label>').text('Name : ').appendTo('#checkout_addr_div')
		$('<input></input title="Please, provide your Name name="name">').attr('id','name').appendTo('#checkout_addr_div')
		$('<label></label>').text('E-Mail : ').appendTo('#checkout_addr_div')
		$('<input type="email" title="Please, provide an e-mail" x-moz-errormessage="This is not a valid e-mail">').attr('id','email').appendTo('#checkout_addr_div')
	}

})();