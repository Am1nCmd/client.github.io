/*!
 * Thorium Generic functions for framework7 projects
 * Version 1.2 September, 2019
 * framework7 v5.x (https://framework7.io) MIT Licensed
 * Copyright 2018-2020 Thorium builder, All Rights Reserved.
*/

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
var httpRoot=""; /* -- Change to another address if WebService os located on another Server eg. https://mydomain.com/path/ -- */
var localroot="http://localhost:8080/client_amin/";
var mediaRoot='./db/dbassets/';
var gtimeOut=6000;
var gCrossDomain=false;
var gAuthMode=0;
var gHomeScreen="PGRpdiBjbGFzcz0icG9wdXAiPjxkaXYgY2xhc3M9ImJsb2NrIGN1c3RvbS1ibG9jayB0ZXh0LWNlbnRlciI+PGgyPkFtczFnbjwvaDI+PGltZyBzcmM9Ii4vaW1nL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC5wbmciPjwvaW1nPjxoMj48L2gyPjxwIGNsYXNzPSJtYi01IiBzdHlsZT0iZm9udC1zaXplOjE3cHg7IiA+PC9wPjwvZGl2PjwvZGl2Pg==";
var dataTheme='.color-theme-white';
var dataCustomColor=null;
var dataFill=false;


var $ = Dom7; 
var routes = [
{
    path: '/',
    url: './index.html',
    name: 'index',
},
{
    path: '/song_detail/',
    url: './pages/song_detail.html?r=69668',
    name: 'song_detail',
},
{
    path: '(.*)',
    url: './pages/404.html',
},
];


var app = new Framework7({
   "version": "1.0.0",
    "id": "com.thorium.ams1gn",
    "root": "#app",
    "theme": "auto",
    "language": "en",
    "routes": routes,
    "name": "Ams1gn",
    "initOnDeviceReady": true,
    "init": true,
    "iosTranslucentBars": false,
    "iosTranslucentModals": false,
    "touch": {
        "disableContextMenu": true,
        "tapHold": true,
        "tapHoldDelay": 750,
        "tapHoldPreventClicks": true,
        "activeState": true,
        "activeStateElements": "a, button, label, span, .actions-button",
        "materialRipple": true,
        "iosTouchRipple": false,
        "materialRippleElements": ".ripple, .link, .item-link, .links-list a, .button, button, .input-clear-button, .dialog-button, .tab-link, .item-radio, .item-checkbox, .actions-button, .searchbar-disable-button, .fab a, .checkbox, .radio, .data-table .sortable-cell, .notification-close-button"
    },
    "clicks": {
        "externalLinks": ".external"
    },
    "statusbar": {
    	"enabled": "true",
        "overlay": "auto",
        "scrollTopOnClick": true,
        "iosOverlaysWebView": true,
        "iosTextColor": "black",
        "iosBackgroundColor": "white",
        "materialBackgroundColor": null
    },
    "view": {
        "main": false,
        "router": true,
        "linksView": null,
        "stackPages": true,
        "xhrCache": true,
        "xhrCacheIgnore": [],
        "xhrCacheIgnoreGetParameters": false,
        "xhrCacheDuration": 600000,
        "preloadPreviousPage": true,
        "uniqueHistory": false,
        "uniqueHistoryIgnoreGetParameters": false,
        "allowDuplicateUrls": false,
        "reloadPages": false,
        "removeElements": true,
        "removeElementsWithTimeout": false,
        "removeElementsTimeout": 0,
        "restoreScrollTopOnBack": true,
        "unloadTabContent": true,
        "iosSwipeBack": true,
        "iosSwipeBackAnimateShadow": true,
        "iosSwipeBackAnimateOpacity": false,
        "iosSwipeBackActiveArea": 30,
        "iosSwipeBackThreshold": 0,
        "pushState": false,
        "pushStateAnimate": true,
        "pushStateAnimateOnLoad": true,
        "pushStateSeparator": "#!",
        "pushStateOnLoad": false,
        "animate": true,
        "animateWithJS": false,
        "iosDynamicNavbar": false,
        "iosSeparateDynamicNavbar": true,
        "iosAnimateNavbarBackIcon": true,
        "iosPageLoadDelay": 0,
        "materialPageLoadDelay": 0
    },
    "navbar": {
        "scrollTopOnTitleClick": true,
        "iosCenterTitle": true,
        "hideOnPageScroll": false,
        "showOnPageScrollEnd": true,
        "showOnPageScrollTop": true
    },
    "toolbar": {
        "hideOnPageScroll": false,
        "showOnPageScrollEnd": true,
        "showOnPageScrollTop": true
    },
    "modal": {
        "moveToRoot": true,
        "queueDialogs": true
    },
    "dialog": {
        "buttonOk": "OK",
        "buttonCancel": "Cancel",
        "usernamePlaceholder": "Username",
        "passwordPlaceholder": "Password",
        "preloaderTitle": "Loading... ",
        "progressTitle": "Loading... ",
        "closeByBackdropClick": false
    },
    "popup": {
        "backdrop": true,
        "closeByBackdropClick": true
    },
    "popover": {
        "closeByBackdropClick": true,
        "closeByOutsideClick": true,
        "backdrop": true
    },
    "actions": {
        "convertToPopover": true,
        "forceToPopover": false,
        "closeByBackdropClick": true,
        "render": null,
        "renderPopover": null,
        "backdrop": true
    },
    "sheet": {
        "closeByBackdropClick": true,
        "closeByOutsideClick": false
    },
    "toast": {
        "icon": null,
        "text": null,
        "position": "bottom",
        "closeButton": false,
        "closeButtonColor": null,
        "closeButtonText": "Ok",
        "closeTimeout": null,
        "cssClass": null,
        "render": null
    },
    "sortable": false,
    "swipeout": {
        "actionsNoFold": false,
        "noFollow": false,
        "removeElements": true,
        "removeElementsWithTimeout": false,
        "removeElementsTimeout": 0
    },
    "panel": {
        "leftBreakpoint":0,
        "rightBreakpoint": 0,
        "swipeActiveArea": 0,
        "swipeCloseOpposite": true,
        "swipeOnlyClose": true,
        "swipeNoFollow": false,
        "swipeThreshold": 0,
        "closeByBackdropClick": true
    },
    "input": {
        "scrollIntoViewOnFocus": false,
        "scrollIntoViewCentered": false
    },
    "smartSelect": {
        "openIn": "page",
        "pageBackLinkText": "Back",
        "popupCloseLinkText": "Close",
        "sheetCloseLinkText": "Done",
        "searchbar": false,
        "searchbarPlaceholder": "Search",
        "searchbarDisableText": "Cancel",
        "closeOnSelect": false,
        "virtualList": false,
        "routableModals": true,
        "url": "select/"
    },
    "calendar": {
        "monthNames": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        "monthNamesShort": [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],
        "dayNames": [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        "dayNamesShort": [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ],
        "firstDay": 1,
        "weekendDays": [
            0,
            6
        ],
        "multiple": false,
        "rangePicker": false,
        "dateFormat": "yyyy-mm-dd",
        "direction": "horizontal",
        "minDate": null,
        "maxDate": null,
        "disabled": null,
        "events": null,
        "rangesClasses": null,
        "touchMove": true,
        "animate": true,
        "closeOnSelect": false,
        "monthSelector": true,
        "yearSelector": true,
        "weekHeader": true,
        "value": null,
        "containerEl": null,
        "openIn": "auto",
        "formatValue": null,
        "inputEl": null,
        "inputReadOnly": false,
        "closeByOutsideClick": true,
        "scrollToInput": true,
        "header": false,
        "headerPlaceholder": "Select date",
        "footer": false,
        "toolbar": true,
        "toolbarCloseText": "Done",
        "cssClass": null,
        "routableModals": true,
        "view": null,
        "url": "date/",
        "renderWeekHeader": null,
        "renderMonths": null,
        "renderMonth": null,
        "renderMonthSelector": null,
        "renderYearSelector": null,
        "renderHeader": null,
        "renderFooter": null,
        "renderToolbar": null,
        "renderInline": null,
        "renderPopover": null,
        "renderSheet": null,
        "render": null
    },
    "picker": {
        "updateValuesOnMomentum": false,
        "updateValuesOnTouchmove": true,
        "rotateEffect": false,
        "momentumRatio": 7,
        "freeMode": false,
        "cols": [],
        "containerEl": null,
        "openIn": "auto",
        "formatValue": null,
        "inputEl": null,
        "inputReadOnly": true,
        "closeByOutsideClick": true,
        "scrollToInput": true,
        "toolbar": true,
        "toolbarCloseText": "Done",
        "cssClass": null,
        "routableModals": true,
        "view": null,
        "url": "select/",
        "renderColumn": null,
        "renderToolbar": null,
        "renderInline": null,
        "renderPopover": null,
        "renderSheet": null,
        "render": null
    },
    "lazy": {
        "placeholder": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXCwsK592mkAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==",
        "threshold": 0,
        "sequential": true
    },
    "photoBrowser": {
        "photos": [],
        "exposition": true,
        "expositionHideCaptions": false,
        "type": "standalone",
        "navbar": true,
        "toolbar": true,
        "theme": "light",
        "swipeToClose": true,
        "backLinkText": "Close",
        "navbarOfText": "of",
        "url": "photos/",
        "routableModals": true,
        "virtualSlides": true,
        "swiper": {
            "initialSlide": 0,
            "spaceBetween": 20,
            "speed": 300,
            "loop": false,
            "preloadImages": true,
            "navigation": {
                "nextEl": ".photo-browser-next",
                "prevEl": ".photo-browser-prev"
            },
            "zoom": {
                "enabled": true,
                "maxRatio": 3,
                "minRatio": 1
            },
            "lazy": {
                "enabled": true
            }
        }
    },
    "notification": {
        "icon": null,
        "title": null,
        "titleRightText": null,
        "subtitle": null,
        "text": null,
        "closeButton": false,
        "closeTimeout": null,
        "closeOnClick": false,
        "swipeToClose": true,
        "cssClass": null,
        "render": null
    },
    "autocomplete": {
        "typeahead": false,
        "highlightMatches": true,
        "expandInput": false,
        "updateInputValueOnSelect": true,
        "multiple": false,
        "valueProperty": "id",
        "textProperty": "text",
        "openIn": "page",
        "pageBackLinkText": "Back",
        "popupCloseLinkText": "Close",
        "searchbarPlaceholder": "Search...",
        "searchbarDisableText": "Cancel",
        "animate": true,
        "autoFocus": false,
        "closeOnSelect": false,
        "notFoundText": " Nothing found",
        "requestSourceOnOpen": false,
        "preloader": false,
        "routableModals": true,
        "url": "select"
    },
    "vi": {
        "enabled": false,
        "autoplay": true,
        "fallbackOverlay": true,
        "fallbackOverlayText": "Please watch this ad",
        "showMute": true,
        "startMuted": true,
        "appId": null,
        "appVer": null,
        "language": null,
        "width": null,
        "height": null,
        "placementId": "pltd4o7ibb9rc653x14",
        "placementType": "interstitial",
        "videoSlot": null,
        "showProgress": true,
        "showBranding": true,
        "os": null,
        "osVersion": null,
        "orientation": null,
        "age": null,
        "gender": null,
        "advertiserId": null,
        "latitude": null,
        "longitude": null,
        "accuracy": null,
        "storeId": null,
        "ip": null,
        "manufacturer": null,
        "model": null,
        "connectionType": null,
        "connectionProvider": null
    }
});

var isLocal = function() { if (window.location.protocol=="file:") {return true;} else {return false;} };

/*-- patch isos12.2 WebApp link issue --*/
$(document).on('click', 'a[href^=mailto],a[href^=tel],a[href^=sms],a[href^=skype],a[href^=facetime]', function (e) {    
    if ((app.device.webView==true) && (app.device.ios==true)) {
        e.preventDefault();
        var href=e.target.getAttribute("href");
        if (href) {window.location=href;} 
        return false;
    }
});
/*-- patch isos12.2 WebApp link issue --*/

/*-- shortcut functions --*/
function loadpage(page,param,transition) {
    if (transition) {
        app.view[0].router.navigate('/'+page+'/?data='+param,{ animate: true,transition: transition,reloadAll: false });
    } else {
        app.view[0].router.navigate('/'+page+'/?data='+param,{ animate: true,reloadAll: false });        
    }
}
function getpageparam(e) {
    var a=e.detail.route;
    if (a) {return a.query.data||null;}
}
function reloadHomePage() {
    app.view[0].router.navigate('/',{ animate: false,reloadAll: true });
}
function backToPreviousPage() {
    app.view[0].router.back();
}
/*-- shortcut functions --*/


function ShowNotification (m) {
	var notificationFull = app.notification.create({
		icon: '<i class="f7-icons text-info">alert</i>',
		title: 'Ams1gn',
		titleRightText: '',
		subtitle: '',
		text: m,
		closeTimeout: 3000,
	  });
	  notificationFull.open();
}

function showToast(text,closeButton,position,closeTimeout,icon) {
    var toast;	
    closeButton=closeButton||true;
    position=position||'bottom';
    closeTimeout=closeTimeout||2000;
    icon=icon||null;
	if (icon) {
		toast = app.toast.create({
			icon: (icon)? '<i class="f7-icons">'+icon+'</i>' : null,
			text: text,
			position: position,
			closeTimeout: closeTimeout,
		  });	
	} else {
		toast = app.toast.create({
			text: text,
			closeButton: closeButton,
			position: position,
			closeTimeout: closeTimeout,
		  });
	}
	toast.open();
}


function openPopup(p) {
    var myPopup = app.popup.create({
        content: p,
  });
  myPopup.open();
}

$(document).on('submit', '.form', function (e) {
    var dm = $(this).attr('data-mode')||null;
    if ((dm == 0) || (dm == 1)) {
        e.preventDefault;
        var cm = $(this).attr("data-form-message");

        if ((isLocal() == true) && (dm == 0)) {
            $(this)[0].reset();
            app.dialog.alert(cm);
            return;
        }
        var formData = new FormData();
        for (var i = 0; i < this.length; i++) {
            if (this[i].type == "radio") {
                if (this[i].checked === true) { formData.append(this[i].name, this[i].value); }
            }
            else if (this[i].type == "checkbox") { formData.append(this[i].name, this[i].checked); }
            else if (this[i].type == "submit") { }
            else { formData.append(this[i].name, this[i].value); }
        }
        var url;
        var data;
        var method;
        var contentType;
        var processData;
        if (dm == 0) { //mail Form
            url = httpRoot + 'forms/form.php';
            var em = $(this).attr("data-email");
            var et = $(this).attr("data-email-title");
            formData.append("form_email", em);
            formData.append("form_title", et);
            data = formData;
            method = "POST";
            contentType = 'multipart/form-data';
            processData = true;
        } else { //API Form
            var dataMode = $(this).attr("data-api-data-mode") || 0;
            var root = $(this).attr("data-api-root") || ''; //fields
            url = $(this).attr("data-api-url");
            if (dataMode == 0) { //FormData
                data = formData;
                contentType = 'multipart/form-data';
                processData = true;
            } else { //Json
                var o = { [root]: {} };
                formData.forEach(function (value, key) {
                    o[root][key] = value;
                });
                var json = JSON.stringify(o);
                data = json;
                contentType = 'application/json';
                processData = false;
            }
            method = $(this).attr("data-api-method") || 'POST';
        }
        app.request({
            url: url,
            data: data,
            method: method,
            crossDomain: false,
            contentType: contentType,
            timeout: 0,
            processData: processData,
            beforeSend() {
                app.preloader.show();
            },
            error(xhr, status) {
                if (status != 0) {
                    app.preloader.hide();
                    app.dialog.alert('error ' + xhr.responseText);
                    app.emit('userFormError', xhr.responseText);
                }
            },
            success(data, status, xhr) {
                app.preloader.hide();
                if (cm.length > 0) { app.dialog.alert(cm) };
                app.emit('userFormSuccess', data);
            },
        });
    }
});

function initSwiper() {
    $('.swiper-container:not(.swiper-container-3d)').each(function(i, field) {
		var o=$("#"+field.id);
	    if  (o)  {
		    var s=o.attr('data-swiper-type')||'bullets'; //fraction progressbar bullets
            var d=o.attr('data-swiper-direction')||'horizontal';    //horizontal vertical
			var e=o.attr('data-swiper-effect')||'slide'; //"slide", "fade", "cube", "coverflow" or "flip"
						var spv=parseInt(o.attr('data-swiper-slidesperview'))||0;
						if (spv==0) {spv="auto";}
						var sb=parseInt(o.attr('data-swiper-spacebetween'))||0;
						
            var l=(o.attr('data-swiper-loop')=='true')||false;
            var sc=(o.attr('data-swiper-center')=='true')||false;
            var db=(o.attr('data-swiper-dynamicbullets')=='true')||false;
            var fm=(o.attr('data-swiper-freeMode')=='true')||false;
            var mw=(o.attr('data-swiper-mousewheel')=='true')||false;
						var apd=parseInt(o.attr('data-swiper-delay'))||999999999;
						var is=parseInt(o.attr('data-swiper-initialslide'))||0;
						if (is>0) {is=is-1;}

            var mySwiper = new Swiper(o, {
                pagination: {
                    el: '.swiper-pagination',
                    type: s, 
                    clickable: true,
                    dynamicBullets: db,
								},
								autoplay: {
									delay: apd,
									disableOnInteraction: true,
								},
								cubeEffect: {
									slideShadows: false,
								},
								coverflowEffect: {
									rotate: 50,
									stretch: 0,
									depth: 100,
									modifier: 1,
									slideShadows : false,
								},
								flipEffect: {
									rotate: 30,
									slideShadows: false,
								},
								scrollbar: {
									el: '.swiper-scrollbar',
									hide: false,
								},
								navigation: {
									nextEl: '.swiper-button-next',
									prevEl: '.swiper-button-prev',
								},
								parallax: false,
                freeMode: fm,
                mousewheel: mw,
                touchEventsTarget: 'container',
                simulateTouch: true,
                allowTouchMove: true,
                grabCursor: true,
                initialSlide: is,
                direction: d ,
                speed: 300,
                effect: e, 
                spaceBetween: sb,
                slidesPerView: spv,
                centeredSlides: sc,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
                preloadImages: true,
                loop: l,
            });
		}
	}); 
};

function showPhotoBrowser($v,s,t) {
 if (s) {        
     var photos = [
        {
            url: s,
            caption: t
        }
    ];
	$v.standalone = $v.app.photoBrowser.create({
  		  zoom: true,
  		  maxZoom: 3,
  		  initialSlide:0,
  		  minZoom: 1,
  		  swipeToClose: true,
          photos:  photos,
          backLinkText: 'Back',
          ofText: 'Close',
          captionsTheme: 'dark',
          navbar: true,
          toolbar: false,
		  theme: 'dark',
          type: 'standalone',
          loop: true,
          lazyLoading: true,
          captionTemplate: 'title',
          navbarTemplate: 'title',

        });
    $v.standalone.open(0);
    app.emit('photobrowserDisplayed',$v.standalone);
  }  
}

$(document).on('click', '.img-zoom', function (e) {
    var view=e.view;
    var target=e.target;
    var s=target.getAttribute("src");
    var t=target.getAttribute("title");
    if (!(s)) {
        s=target.style.backgroundImage;
        s = s.replace('url(','').replace(')','').replace(/\"/gi, "");
    }
    showPhotoBrowser(view,s,t);
});

$(document).on('click', '.collection-item-zoom', function (e) {
    var c = $(this).find('.collection-item-image');
	if (c) {
		var view=e.view;
		showPhotoBrowser(view,c.attr('data-file'),c.attr('title')||'');
	}
});

$(document).on('click', '.card-opened', function (e) {
    e.preventDefault;
    app.card.close($(this), true);
 });

$(document).on('click', '.dynamic-popover', function (e) {
  e.preventDefault;  
  var s=e.target.getAttribute("data-content");
  if ((s)) {
    var dynamicPopover = app.popover.create({
       targetEl: this,
       content: '<div class="popover">'+
              '<div class="popover-inner">'+
                  s
              +'</div>'+
            '</div>',
    });
	dynamicPopover.open();				
  }
});

function initialize_view(p) {
  initSwiper();
}

$(document).on('page:beforeout', function (e) {
  $('.custominfowindow').hide();
})
$(document).on('page:beforein', function (e) {
  $('.custominfowindow').hide();
})

$(document).on('page:init', function (e) {
  var p = e.detail;
  initialize_view(p);
})

$(document).on('page:mounted', function (e) {
	if (dataFill==true) { $(".navbar").css("background-color",'var(--f7-theme-color)')};
});

function setStyle() {   
    var root
    if (dataCustomColor) {
        root = document.documentElement; 
        root.style.setProperty('--f7-theme-color',dataCustomColor);     
    }
}

 if (app.initialized==true) {
  if (isLocal()==true) {httpRoot=localroot;}
  setStyle();
  if (gAuthMode>0) {
    app.preloader.show(); 
    $('.preloader-backdrop').addClass('opaque');
  }
  initialize_view(page);
  app.emit('appInitialised');
  
}
