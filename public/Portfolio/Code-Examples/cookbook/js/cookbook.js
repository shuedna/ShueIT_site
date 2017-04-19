var splash =  { 'start' : function () 
	{
		$('<div id="splash"></div>')
		.appendTo('body')
		$('<div><h1>CookBook</h1></div>')
		.appendTo('#splash')
		$('<img src="https://openclipart.org/download/240279/book_red.svg" />')	 	.appendTo('#splash')
	}, 'end': function () {
		$('#splash').fadeOut(600)
	}
}


var menu = { 'createMain': function (db) 
	{
		$('<div id="menu"></div>')
		.appendTo('body')
		db.info().then(function(doc){
			$('<p>').text(doc.db_name).appendTo('#menu')
			/*$('<p>').text(JSON.stringify(doc)).appendTo('#menu')*/
			$('<button>log Out</button>').on('click',function () {setdata(null)}).appendTo('#menu')
		})
	}, 
	'drop': function () {
		if ($('#menu').css('display')=='none') {
			$('#menu').css('display','block')
		}  else {
			$('#menu').css('display','none')
		}
	},
	'addItemButton': function (db, doc) {
		$('<div id="ItemMenuDiv">').appendTo('#menu')
		$('<button>Delete</button>').on('click',function (){
			deleteItem(db, doc)
		}).appendTo('#ItemMenuDiv')
	},
	'removeItemButton': function () {
		$('#ItemMenuDiv').remove()
	}
	
}

function baseui () {
	$('<div id="head"></div>')
	.appendTo('body')
	$('<div id="list"></div>')
	.appendTo('body')
}

function uiButton (db) {
	$('<div><button><h1>m</h1></button></div>')
	.css('flex','2')
	.appendTo('#head')
	$('<div><h1>CookBook</h1></div>')
	.css('flex','6')
	.appendTo('#head')
	$('<div><button><h1>+</h1></button></div>')
	.css('flex','2')
	.appendTo('#head')
	$('body > div :nth-child(1) > button').on('click', function () {
		menu.drop()
	})
	$('body > div :nth-child(3) > button').on('click', function () {
		if ($(this).text() == "+") {
			newItem(db)
		} else {
			back()
		}
	})
	menu.createMain(db)
}



function getConf () {
	var data = localStorage.getItem('cookbookData2')
	if ( data == null) {
		promptUserLogin()
	} else {
		var datajson = JSON.parse(data)
		if (validateEmail(datajson.email)) {
			console.log(datajson.email)
			logindb(datajson.email)
		} else {
			console.log(datajson.email)
			alert('invalid email')
			promptUserLogin()
		}
	}
}

function setdata (data) {
	var jsondata = {"email": data}
	localStorage.setItem('cookbookData2', JSON.stringify(jsondata))
}

function promptUserLogin () {
	$('<div id="promptuserloginbox"></div>')
	.appendTo('body')
	$('<p>Please enter your Email</p>')
	. appendTo('#promptuserloginbox')
	$('<input type="email"></input><br/>')
	.appendTo('#promptuserloginbox')
	$('<button>OK</button>')
	. appendTo('#promptuserloginbox')
	$('#promptuserloginbox >').css('font-size','1.3em').css('margin','5%')
	$('#promptuserloginbox > button').on('click', function () {
		if (validateEmail($('#promptuserloginbox > input').val())) {
			setdata($('#promptuserloginbox > input').val())
			logindb($('#promptuserloginbox > input').val())
			$('#promptuserloginbox').remove()
		} else {
			alert('invalid email')
		}
	})
}

function logindb (uid) {
	console.log(uid)
	var db = new PouchDB(uid)
	uiButton(db)
	loaditems(db)
}

function loaditems (db) {
	db.allDocs().then( function (doc) {
	console.log(JSON.stringify(doc))
	for ( var i = 0; i < doc.rows.length; i++) {
		$('<button></button>').text(doc.rows[i].id)
		.on('click',function () {
		console.log('iclick')
		loadentry(db, $(this).text())
		})
		.appendTo('#list')
		$('#list >  button :active').css('background-color','#212121')
	}
	})
	splash.end()
}

function refreshList (db) {
	$('#list >').remove()
	loaditems(db)
}

function deleteItem (db, doc) {
	db.remove(doc).then(function () {
		refreshList(db)
		back()
		menu.drop()
	})
	
}

function loadentry (db, entry) {
	console.log(entry)
	db.get(entry).then(function (doc)  {
		console.log(JSON.stringify(doc))
		displayItem (db, doc)
	})
}

function newItem (db) {
	console.log($('#new').length)
	if ($('#new').length == "") {
		$('<div id="new"></div>')
		.appendTo('body')
		$('<h3>New Recipe</h3>').appendTo('#new')
		$('<label>Name</label></br>').appendTo('#new')
		$('<input></input></br>').appendTo('#new')
		$('<button>Create</button><button>Cancel</button>').appendTo('#new')
		$('#new >').css('font-size','1.3em')
		$($('#new > button').get(0)).on('click',function () {
			var item = {"_id": $('#new > input').val(),
			"type":"recipe"}
			db.put(item).then(function () {
				db.get(item._id).then(function (doc) {
					console.log(JSON.stringify(doc))
					refreshList(db)
					$('#new').remove()
				})
			})
		})
		$($('#new > button').get(1)).on('click',function () {
		$('#new').remove()
		})
	}
}

function displayItem (db, doc) {
	$('<div id="dispItem">').appendTo('body')
	$('body > div :nth-child(3) > button > h1').text('<')
	/*$('<p>').text(JSON.stringify(doc)).appendTo('#dispItem')*/
	$('<h2>').text(doc._id).appendTo('#dispItem')
	/*temp type time*/
	$('<div id="temptypetime" class="dispItemDiv2">').css('display','flex').appendTo('#dispItem')
	$('<div><h4>Temp:</h4></div>').css('flex','3').appendTo('#temptypetime')
	$('<div><h4>Type:</h4></div>').css('flex','3').appendTo('#temptypetime')
	$('<div><h4>Time:</h4></div>').css('flex','3').appendTo('#temptypetime')
	if (doc.temp != null) {
		$('<a href="javascript:void(0)">').text(doc.temp).appendTo($('#temptypetime > div').get(0))
		$('<a href="javascript:void(0)">').text(doc.type).appendTo($('#temptypetime > div').get(1))
		$('<a href="javascript:void(0)">').text(doc.time).appendTo($('#temptypetime > div').get(2))
		
	} else {
		$('<a href="javascript:void(0)"  >Edit</a>').appendTo('#temptypetime > div')
	}
	$('#temptypetime > div > a').on('click',function () {
		enterTTT(db, doc)
	})
	/*ingredients*/
	$('<div id="ingr" class="dispItemDiv">').css('display','flex').appendTo('#dispItem')
	$('<div id="ingrData">').appendTo('#dispItem')
	$('<div><button><h2>+</h2></button></div>').css('flex','2').appendTo('#ingr')
	$('<div><h3>Ingredients</h3></div>').css('flex','6').appendTo('#ingr')
	$('<div><button><h2>-</h2></button></div>').css('flex','2').appendTo('#ingr')
	$('#ingr > :nth-child(1) > button').on('click',(function ()
	{
		addIngr(db, doc)
	})
	)
	if (doc.ingredients != null) {
		$('#ingr > :nth-child(3) > button').on('click',function () {
			removeIngr(db,doc)
		})
		/*alert(JSON.stringify(doc.ingredients))*/
		$('<table><thead><tr><td>Amount</td><td>Ingredient</td></tr></thead><tbody></tbody></table>').appendTo('#ingrData')
		for ( var i = 0; i < doc.ingredients.length; i++) {
			var id = ('ingr' + i)
			var tag = ('#' + id)
			$('<tr></tr>').attr('id',id).appendTo('#ingrData > table > tbody')
			$('<td></td>').text(doc.ingredients[i].amount).appendTo(tag)
			$('<td></td>').text(doc.ingredients[i].item).appendTo(tag)
		}
	} else {
		$('<p>No Ingredients<p>').appendTo('#ingrData')
		$('#ingr > :nth-child(3) > button').css('border-color','grey')
		$('#ingr > :nth-child(3) > button > h2').css('color','grey')
	}
	/*directions*/
	$('<div id="directions" class="dispItemDiv">').css('display','flex').appendTo('#dispItem')
	$('<div id="directionsData">').appendTo('#dispItem')
	$('<div><button><h2>+</h2></button></div>').css('flex','2').appendTo('#directions')
	$('<div><h3>Directions</h3></div>').css('flex','6').appendTo('#directions')
	$('<div><button><h2>-</h2></button></div>').css('flex','2').appendTo('#directions')
		if (doc.directions != null) {
		$('<p>list intgr</p>').appendTo('#directionsData')
	} else {
		$('<p>No Directions<p>').appendTo('#directionsData')
		$('#directions > :nth-child(3) > button').css('border-color','grey')
		$('#directions > :nth-child(3) > button > h2').css('color','grey')
	}
	/*add menu items for entry */
	menu.addItemButton(db, doc)	
}

function enterTTT (db, doc) {
	$('<div id="entryDiv">').appendTo('#dispItem')
	$('<h4>Temp:  <input></input></h4> \
	<h4>Type:  <input></input></h4> \
	<h4>Time:  <input></input></h4>').appendTo('#entryDiv')
	$('#entryDiv > h4 > input').css('width','6em')
	$('<button>Save</button><button>Cancel</button>').appendTo('#entryDiv')
	$($('#entryDiv > button').get(0)).on('click',function () {
		doc.temp = ($($('#entryDiv > h4 > input').get(0)).val())
		doc.type = ($($('#entryDiv > h4 > input').get(1)).val())
		doc.time = ($($('#entryDiv > h4 > input').get(2)).val())
		save(db, doc)
	})
	$($('#entryDiv > button').get(1)).on('click',function () {
		$('#entryDiv').remove()
	})
}

function addIngr (db, doc) {
	$('<div id="entryDiv">').appendTo('#dispItem')
	$('<h4>Amount:  <input></input></h4> \
	<h4>Ingredient:  <input></input></h4>').appendTo('#entryDiv')
	$('#entryDiv > h4 > input').css('width','6em')
	$('<button>Save</button><button>Save & Add Another</button><button>Cancel</button>').appendTo('#entryDiv')
	$($('#entryDiv > button').get(0)).on('click',function () {
		var ingredients = {}
		ingredients.amount = ($($('#entryDiv > h4 > input').get(0)).val())
		ingredients.item = ($($('#entryDiv > h4 > input').get(1)).val())
		if (doc.ingredients == null) {
			doc.ingredients = []
		}
		doc.ingredients.push(ingredients)
		save(db, doc)
	})
	$($('#entryDiv > button').get(2)).on('click',function () {
		$('#entryDiv').remove()
	})
	
}

function removeIngr (db,doc) {
	$('<div id="entryDiv">').appendTo('#dispItem')
	$('<h4>Select Ingredent to remove</h4>').appendTo('#entryDiv')
	$('<select id="selectbox" name="select"></select>').appendTo('#entryDiv')
	for ( var i = 0; i < doc.ingredients.length; i++) {
		var text = ( doc.ingredients[i].amount + ' ' + doc.ingredients[i].item)
		$('<option>').val(i).text(text).appendTo('#selectbox')
	}
	$('<button>Remove</button><button>Save & Remove Another</button><button>Cancel</button>').appendTo('#entryDiv')
	$($('#entryDiv > button').get(2)).css('margin-bottom','15px').on('click', function () {
		$('#entryDiv').remove()
	})
}

function save(db, doc) {
	db.put(doc).then(function () {
		$('#dispItem').remove()
		menu.removeItemButton()
		loadentry(db, doc._id)
	})
}

function back() {
	$('#dispItem').remove()
	menu.removeItemButton()
	$('body > div :nth-child(3) > button > h1').text('+')
}

function getScript () {
	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pouchdb/6.0.5/pouchdb.min.js").done(function () {
	getConf()
	}).fail(function (){
	console.log("Error")
	});
}

function validateEmail(email) { var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; return re.test(email); }

(function () {
	baseui()
	splash.start()
	getScript()
})()
