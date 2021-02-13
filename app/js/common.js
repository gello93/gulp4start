//========== Load svg sprite >> =============
//SVG sprite load for local htm template
var svg_sprite_object = document.createElement('object');
		svg_sprite_object.setAttribute("id", "svg-object");
		svg_sprite_object.setAttribute("data", "svg/sprite/sprite.svg");
		svg_sprite_object.setAttribute("type", "image/svg+xml");
document.body.append(svg_sprite_object);

var mySVG = document.getElementById("svg-object");
var svgDoc;
mySVG.addEventListener("load",function() {
	svgDoc = mySVG.contentDocument;
	mySVG.remove();
	if(svgDoc != null){
		if(document.getElementById("svg-content") != null){
			document.getElementById("svg-content").remove();
		}
		var div = document.createElement('div');
		div.className = "d-none";
		div.innerHTML = new XMLSerializer().serializeToString(svgDoc);
		document.body.append(div);
	}
}, false);
//========== >> Load svg sprite =============

jQuery(document).ready(function($) {
	init_lazy();
	
	init(); //В этой функции прописываем все что должно произойти после загрузки страницы

	//Ниже прописываем все события

	//Подгрузка контента при клике на кнопку назад
	// Вызывается также при клике по ссылке с #
	// window.onpopstate = function( e ) {
	// 	if($('#content').length > 0 && $('#content').hasClass('ajax-nav')){ // && !is_admin
	// 		load_overlay(true);
	// 		load_page_content(location.href, true, true);
	// 	}
	// }
	// // Ajax навигация
	// $(document).on('click', 'a', function(e) {
	// 	if($('#content').length > 0 && $('#content').hasClass('ajax-nav')){ // && !is_admin
	// 		ajax_load($(this), e);
	// 	}
	// });

	$(document).on('click', '.close-mfp', function(e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
});

// window.addEventListener('scroll', function() {
//   //console.log(pageYOffset);
//   //scrolled_header(pageYOffset);
// });

// $(window).on('load', function(event) {
// 	//is_high_monitor();
// });
// $(window).on('resize', function(event) {
// 	// is_high_monitor();
// });
