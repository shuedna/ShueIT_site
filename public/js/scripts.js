"use strict";(function(){var timedChangeContent=setInterval(function(){changeContent('right')},8000);function setContentNum(){var l=($('#spinContent > div').length)
for(var i=0;l>i;i++){var it=$('#spinContent > div')[i]
$(it).val(i)}var width=100/l+'%';$('#progress').css('width',width)}function changeContent(direction){var l=($('#spinContent > div').length)
var currentActive=0
var newActive=''
for(var i=0;l>i;i++){var it=$('#spinContent > div')[i]
if($(it).hasClass('active')){currentActive=$(it).val()}}if(direction=='right'){if(currentActive==(l-1)){newActive=0}else{newActive=parseInt(currentActive)+1}}else if(direction=='left'){if(currentActive==0){newActive=l-1}else{newActive=currentActive-1}}it=$('#spinContent > div')[currentActive]
$(it).removeClass('active').addClass('hide')
it=$('#spinContent > div')[newActive]
$(it).removeClass('hide').addClass('active')
var margin=100/l*newActive+'%'
$('#progress').css('margin-left',margin)}$('#menubtn').on('click',function(){if($('#menuBody').val()=="none"||$('#menuBody').val()==""){$('#menuBody').val('flex').addClass('open')}else if($('#menuBody').val()=="flex"){$('#menuBody').val('none').removeClass('open')}})
$('#leftbtn').on('click',function(){clearInterval(timedChangeContent)
changeContent('left')})
$('#rightbtn').on('click',function(){clearInterval(timedChangeContent)
changeContent('right')})
$('#listbtn').on('click',function(){$('#body > div').removeClass('row')
$('#body > div > div > div').addClass('row')
$('#body > div > div > div > img').addClass('column-10').addClass('blogimgListSize')
$('#body > div > div > div > p').addClass('column')})
$('#gridbtn').on('click',function(){$('#body > div').addClass('row')
$('#body > div > div > div').removeClass('row')
$('#body > div > div > div > img').removeClass('column-10').removeClass('blogimgListSize')
$('#body > div > div > div > p').removeClass('column')})
$('.email').on('click',function(){$('<div>').addClass('dim').attr('id','dim').css('height',window.innerHeight).appendTo('body')
$('#dim').on('click',function(){$('#dim').remove()
$('#messageBox').addClass('hide')})
$('#messageBox').removeClass('hide')})
$('.xbtn').on('click',function(){$('#dim').remove()
$('#messageBox').addClass('hide')})
console.log('script')
setContentNum()})();