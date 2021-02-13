var lazyLoadInstance,
		speed = 500,
		working = false, //Load more status
		is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
		prev_arrow = '<a href="#" class="slick-prev slick-arrow"><svg class="svg"><use xlink:href="#arrow_r_svg"></use></svg></a>',
		next_arrow = '<a href="#" class="slick-next slick-arrow"><svg class="svg"><use xlink:href="#arrow_r_svg"></use></svg></a>';
var isMobile = {
	Android: function() {return navigator.userAgent.match(/Android/i);},
	BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};


function is_high_monitor(){
	if($(window).height() / $(window).width() > 0.65){
		$('html').addClass('hight-monitor');
	}else{
		$('html').removeClass('hight-monitor');
	}
}
function add_header_data_class(){
	if($('#content').length){
		$('header').attr('data-body-class', $('.body-class').data('class'));
	}
}

function scroll_to(href, speed, top, offset){
	var is_has_target = true;
	var destination = 0;
	var custom_offset = 0;
	var top = false;
	if(offset != undefined){
		custom_offset = offset;
	}
	if(href == '#'){
		destination = 0;
		is_has_target = true;
		top = true;
	}
	if(!top){
		if($(href).length > 0){
			destination = $(href).offset().top-(custom_offset);
		}else{
			is_has_target = false;
		}
	}
	if(is_has_target){
		if(is_safari){
			$("body").animate({ scrollTop: destination}, speed);
		}else{
			$("html").animate({ scrollTop: destination}, speed);
		}
	}
}
function scrolled_header(){
	if($(window).scrollTop() > 70){ //&& $(window).width() < 780
		if(!$('body').hasClass('fixed_header')){
			var header_height = $('header').outerHeight();
			$('body').css('padding-top', header_height+'px').addClass('fixed_header');
		}
	}else{
		$('body').css('padding-top', '0px').removeClass('fixed_header');
	}
}

function show_mf_modal(el, fixed){
	if(fixed == undefined){
		fixed = false;
	}
	if($('.mfp-bg.mfp-ready').length > 0){
		//loadPageOverlay(true);
		$.magnificPopup.close();
		setTimeout(function() {
			//loadPageOverlay(false);
			open_mf_modal(el, fixed);
		}, 600);
	}else{
		open_mf_modal(el, fixed);
	}
}
function open_mf_modal(el, fixed){
	if(fixed == undefined){
		fixed = false;
	}
	$.magnificPopup.open({
    tLoading: 'Загрузка...',
    items: {
        src: $(el),
        type: 'inline'
    },
    removalDelay: 500,
    callbacks: {
      beforeOpen: function() {
        this.st.mainClass = 'mfp-zoom-in';
        load_overlay(false);
        if(fixed){
        	$('body').addClass('mobile_fixed_popup');
        }
      },
      beforeClose: function() {
      	if(fixed){
      		$('body').removeClass('mobile_fixed_popup');
        }
      },
      afterClose: function() {
        if(el == '#success-popup'){
        	//reload_page(true);
        	//get_cart_popup(true, true);
        	load_page_content(location.origin);
        }
        if($(el).hasClass('remove_after_close')){
        	setTimeout(function() {
        		$(el).remove();
        	}, 800);
        }
      }
    }
	});
}
function load_overlay(t){
	if(t == true){
		$('body').addClass('loading');
	}else{
		$('body').removeClass('loading');
	}
}
function loadPageOverlay(t){ //Совместимость со старыми наработками
	load_overlay(t);
}
function init_lazy(){
	lazyLoadInstance = new LazyLoad({
	  elements_selector: ".lazy",//".lazy [data-src]"
	  // ... more custom settings?
	});
}
function update_lazy(){
	//console.log('update_lazy');
	if (lazyLoadInstance) {
    lazyLoadInstance.update();
	}
}

// ============================================
// =========== PAGES HISTORY >>>> ============
// ============================================
var history_array = new Array();
function back_scroll_pos(){
	last_url_data = history_array.pop();
	$('html, body').animate({ scrollTop: last_url_data[1] }, 'slow');
}
function add_to_history_array(url, offset){
	if(offset == undefined){
		offset = $(window).scrollTop();
	}
	history_array.push([url, offset, $('.body-class').data('class')]);
	if(history_array.length > 3){
		history_array.shift();
	}
}
// ============================================
// =========== <<<< PAGES HISTORY ============
// ============================================

// ============================================
// ========= AJAX NAV FUNCTIONS >>>> ==========
// ============================================
function reload_page(no_scroll){
	if(no_scroll == undefined){
		no_scroll = false;
	}
	load_page_content(location.href, no_scroll);
}
function setLocation(loc, title, description, back){
	if(back == undefined){
		back = false;
	}
	if(title == undefined){
		title = $('title').text();
	}
	if(description == undefined){
		description = $('meta[name="description"]').attr('content')
	}
	$.magnificPopup.close();
  if ("undefined" !== typeof history.pushState) {
  	if(!back){
  		history.pushState({}, title, loc);
  	}
  	$('title').text(title); //Через history почему то не работает
  	if($('meta[name="description"]').length == 0){
  		$('head title').after('<meta name="description" content="">');
  	}
  	$('meta[name="description"]').attr('content', description);
  }else{
  	location.hash = '#' + loc;
  	//window.location.assign(loc)
  }
}
// function add_header_data_class(){
// 	if($('#content').length){
// 		$('header').attr('data-body-class', $('.body-class').data('class'));
// 	}
// }
function add_content_data_class(content, url){
	if(url == undefined){
		url = false;
	}
	if($('#content').length > 0 && content.attr('data-class') != undefined){
		$('#content').attr('class', content.attr('data-class'));
		
		if(url && $('#content').attr('data-ver') != content.attr('data-ver')){
			//$('#content').removeClass('ajax-nav');
			location.href = url;
		}
	}
}
function load_page_content(url, no_scroll, back){
	$('body').removeClass('mm-open');

	if(no_scroll == undefined){
		no_scroll = false;
	}
	if(back == undefined){
		back = false;
	}
	offset = $(window).scrollTop();
	if(!back && !no_scroll){
		scroll_to_top_after_ajax_nav();
	}
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'html',
		beforeSend: function() {
			load_overlay(true);
		},
		complete: function() {
			loadPageOverlay(false);
			enable_scroll();
		},
		success: function(html) {
			var content = $('<div>').append(html).find('#content'),//$(html).find('#content').html();
					title =  $('<div>').append(html).find('title').text(),
					description =  $('<div>').append(html).find('meta[name="description"]').attr('content'),
					head_cart = $('<div>').append(html).find('header .cart').html();
			
			if(content && content.length > 0){
				add_content_data_class(content, url);
				if(back){
					back_scroll_pos();
				}

				add_to_history_array(url, offset);
				// if(!no_scroll){
				// 	scroll_to_top_after_ajax_nav();
				// }
				$('header .cat-menu-wrp').removeClass('active');

				$('#content').html(content.html());
				$('header .cart').html(head_cart);
				setLocation(url, title, description, back);
				init();
				//scroll_to('#', speed, true);
				// if(!no_scroll){
				// 	scroll_to_top_after_ajax_nav();
				// }
			}else{
				location.href = url;
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			setTimeout(function() {
				location.href = url;
			}, 1000);
		}
	});
}
function scroll_to_top_after_ajax_nav(){
	var offset = 0;
	$("html, body").animate({ scrollTop: 0}, speed);
}
function ajax_load(el, e){
	if(is_load_link(el)){
		e.preventDefault();
		load_overlay(true);
		var url = el.attr('href');
		load_page_content(url);
	}
}
function is_load_link(el){
	var result = true;
	if(
		el.hasClass('no-link') || 
		el.hasClass('no-ajax-link') || 
		el.hasClass('mfp-link') || 
		el.hasClass('send_message') || 
		el.attr('href') == '#' || 
		el.attr('target') != undefined || 
		el.attr('data-toggle') == 'tab'){
			result = false;
	}
	if(el.attr('href').indexOf('mailto:') != -1){
		result = false;
	}
	if(!el.hasClass('no-link') && !el.hasClass('no-ajax-link') && el.closest('.texteditor').length > 0 && el.attr('href').indexOf('http') != -1 && el.attr('href').indexOf(location.hostname) == -1){
		//result = false;
		window.open(el.attr('href'), '_blank');
	}
	return result;
}
// ============================================
// ========= <<<< AJAX NAV FUNCTIONS ==========
// ============================================
function disable_scroll() {
	$('body').addClass('stop-scrolling');
  $('body').bind('touchmove', function(e){e.preventDefault()});
}
function enable_scroll() {
	$('body').removeClass('stop-scrolling');
  $('body').unbind('touchmove');
}



function init(){
	//scrolled_header();
	//add_header_data_class();

	//Обновление lazyload для клонированных элементов карусели
	if($("img.lazy:not('.loaded')").length > 0){ //Обновление lazy для всех изображений
		update_lazy();
	}
	$(".slick-slider-style").each(function(index, el) { //Обновление lazy для каруселей
		$(this).on('init', function(event, slick){
	    update_lazy();
		});
	});

	//Подкючение ссылок на модальные окна
	$('a.open-popup-link, button.open-popup-link, li.open-popup-link > a').magnificPopup({
	  type:'inline',
	  removalDelay: 500, //delay removal by X to allow out-animation
	  callbacks: {
	    beforeOpen: function() {
	    	// if($('body').hasClass('menuopen')){
    		// 	$('.head__menuopen').trigger('click');
	    	// }
	    	this.st.mainClass = 'mfp-zoom-in';
	    }
	  },
	  midClick: true
	});

	//Подкючение галерей
	$('.mf-gallery').each(function() {
		$(this).magnificPopup({
		  type: 'image',
		  delegate: 'a:not(".not-gallery-item"):not(".slick-arrow")',
		  removalDelay: 500, //delay removal by X to allow out-animation
		  mainClass: 'mfp-gallery-zoom-in',
		  gallery: {
				enabled: true,
				preloader: true,
				preload: [0,2],
				tPrev: 'Предыдущая',
				tNext: 'Следующая',
				tCounter: '<span class="mfp-counter">%curr% из %total%</span>'
			},
			zoom: {
			    enabled: true, // By default it's false, so don't forget to enable it

			    duration: 300, // duration of the effect, in milliseconds
			    easing: 'ease-in-out', // CSS transition easing function

			    // The "opener" function should return the element from which popup will be zoomed in
			    // and to which popup will be scaled down
			    // By defailt it looks for an image tag:
			    opener: function(openerElement) {
			      // openerElement is the element on which popup was initialized, in this case its <a> tag
			      // you don't need to add "opener" option if this code matches your needs, it's defailt one.
			      return openerElement.is('img') ? openerElement : openerElement.find('img');
			    }
			  },
			callbacks: {
	      beforeOpen: function() {
	        
	      },
	      open: function() {
	        //overwrite default prev + next function. Add timeout for css3 crossfade animation
	        $.magnificPopup.instance.next = function() {
	          var self = this;
	          self.wrap.removeClass('mfp-image-loaded');
	          setTimeout(function() { $.magnificPopup.proto.next.call(self); }, 120);
	        }
	        $.magnificPopup.instance.prev = function() {
	          var self = this;
	          self.wrap.removeClass('mfp-image-loaded');
	          setTimeout(function() { $.magnificPopup.proto.prev.call(self); }, 120);
	        }
	      },
	      imageLoadComplete: function() { 
	        var self = this;
	        setTimeout(function() { self.wrap.addClass('mfp-image-loaded'); }, 16);
	      }
	    },
		  midClick: true
		});
	});

	$('.mfp-video').magnificPopup({
		type: 'iframe',
		mainClass: 'mfp-zoom-in',
		preloader: true,
		iframe: {
			patterns: {
				youtube: {
					index: 'youtube.com', 
					id: 'v=',
					src: '//www.youtube.com/embed/%id%?rel=0&autoplay=1&iv_load_policy=3'
				}
			}
		},
		callbacks: {
		  beforeOpen: function() {
		    this.st.mainClass = 'mfp-zoom-in';
		  },
		  beforeClose: function() {
		  },
		  afterClose: function() {
		  }
		}
	});


	// Подключение слайдеров
	if($('.manuf-slider').length > 0){

		//Отключение центрирования, когда мало элемнентов
		// if($('.manuf-slider .item').length <= 3){
		// 	$('.manuf-slider').addClass('slick-disable-center')
		// }

		$('.manuf-slider').slick({
		  slidesToShow: 4,
		  slidesToScroll: 4,
		  autoplay: true,
		  autoplaySpeed: 8000,
		  prevArrow: prev_arrow,
		  nextArrow: next_arrow,
		  responsive: [
	      {
	        breakpoint: 800,
	        settings: {
	          slidesToShow: 3,
	          slidesToScroll: 3
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 2
	        }
	      }
	    ]
		});
	}

	// Включение пользовательских кнопок для слайдеров
	// Always after all slick init \/
	// custom owl nav
	$(document).on('click', '.custom_slick_nav .next', function(e) {
		e.preventDefault();
		$('.'+$(this).data('slick-class')).slick("slickNext");
	});
	$(document).on('click', '.custom_slick_nav .prev', function(e) {
		e.preventDefault();
		$('.'+$(this).data('slick-class')).slick("slickPrev");
	});

	// Подключение для старых браузеров, если подключается скрипт через движек
	if(typeof svg4everybody == 'function'){
		console.log('Old browser!!!');
		svg4everybody({
			polyfill: true
		});
	}
}
