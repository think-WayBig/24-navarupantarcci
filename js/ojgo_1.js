"use strict";
function bighearts_accordion_init(){
var accordions=jQuery('.wgl-accordion');
if(!accordions.length){
return;
}
accordions.each(function (){
var header=jQuery(this).find('.wgl-accordion_header');
var content=jQuery(this).find('.wgl-accordion_content');
var type=jQuery(this).data('type');
var transition=400;
header.off('click');
header.each(function (){
if(jQuery(this).data('default')==='yes'){
jQuery(this).parent('.wgl-accordion_panel').addClass('active');
jQuery(this).next().slideDown(transition);
}});
header.on('click', function (e){
e.preventDefault();
var self=jQuery(this);
var selfPanel=self.parent('.wgl-accordion_panel');
var siblingPanels=selfPanel.siblings();
if('accordion'===type){
selfPanel.toggleClass('active');
self.next().slideToggle(transition);
}else if('toggle'===type){
selfPanel.toggleClass('active');
self.next().slideToggle(transition);
content.not(self.next()).slideUp(transition);
siblingPanels.removeClass('active');
}});
});
}
function bighearts_services_accordion_init(){
var widgetList=jQuery('.wgl-accordion-services');
if(!widgetList.length){
return;
}
widgetList.each(function (){
var itemClass='.service__item';
jQuery(this)
.find(itemClass + ':first-child')
.addClass('active');
jQuery(this)
.find(itemClass)
.on('mouseover', function (){
jQuery(this).addClass('active').siblings().removeClass('active');
});
});
}
(function($){
jQuery(document).ready(function(){
bighearts_ajax_load();
});
function bighearts_ajax_load(){
var i, section;
var sections=document.getElementsByClassName('wgl_cpt_section');
for (i=0; i < sections.length; i++){
section=sections[i];
var infinity_item=section.getElementsByClassName('infinity_item');
var load_more=section.getElementsByClassName('load_more_item');
if(infinity_item.length||load_more.length){
bighearts_ajax_init(section);
}}
}
var wait_load=false;
var offset_items=0;
var infinity_item;
var js_offset;
function bighearts_ajax_query(grid, section, request_data){
if(wait_load) return;
wait_load=true;
request_data['offset_items']=request_data.js_offset
? request_data.js_offset
: offset_items;
request_data['items_load']=request_data.items_load;
request_data['js_offset']=request_data.js_offset
? request_data.js_offset
: offset_items;
if(request_data.query&&request_data.query.request){
delete request_data.query.request;
}
$.post(wgl_core.ajaxurl,
{
action: 'wgl_ajax',
data: request_data
},
function(response, status){
var resp, new_items, load_more_hidden, count_products;
resp=document.createElement('div');
resp.innerHTML=response;
new_items=$('.item', resp);
count_products=$('.woocommerce-result-count', resp);
load_more_hidden=$('.hidden_load_more', resp);
if(load_more_hidden.length){
jQuery(section)
.find('.load_more_wrapper')
.fadeOut(300, function(){
$(this).remove();
});
}else{
jQuery(section)
.find('.load_more_wrapper .load_more_item')
.removeClass('loading');
}
jQuery(section)
.find('.woocommerce-result-count')
.html(jQuery(count_products).html());
if($(grid).hasClass('carousel')){
$(grid)
.find('.slick-track')
.append(new_items);
$(grid)
.find('.slick-dots')
.remove();
$(grid)
.find('.wgl-carousel_slick')
.slick('reinit');
}else if($(grid).hasClass('grid')){
new_items=new_items.hide();
$(grid).append(new_items);
new_items.fadeIn('slow');
}else{
var items=jQuery(new_items);
jQuery(grid)
.imagesLoaded()
.always(function(){
jQuery(grid)
.append(items)
.isotope('appended', items)
.isotope('reloadItems');
setTimeout(function(){
jQuery(grid).isotope('layout');
bighearts_scroll_animation();
updateFilter(grid);
updateCarousel(grid);
}, 500);
});
}
if(typeof jarallax==='function'){
bighearts_parallax_video();
}else{
jQuery(grid)
.find('.parallax-video')
.each(function(){
jQuery(this).jarallax({
loop: true,
speed: 1,
videoSrc: jQuery(this).data('video'),
videoStartTime: jQuery(this).data('start'),
videoEndTime: jQuery(this).data('end')
});
});
}
updateCarousel(grid);
bighearts_scroll_animation();
var offset_data=$('.js_offset_items', resp);
request_data.js_offset=parseInt(offset_data.data('offset'));
wait_load=false;
}
);
}
function bighearts_ajax_init(section){
offset_items=0;
var grid, form, data_field, data, request_data, load_more;
if(section==undefined) return;
grid=section.getElementsByClassName('container-grid');
if(!grid.length) return;
grid=grid[0];
form=section.getElementsByClassName('posts_grid_ajax');
if(!form.length) return;
form=form[0];
data_field=form.getElementsByClassName('ajax_data');
if(!data_field.length) return;
data_field=data_field[0];
data=data_field.value;
data=JSON.parse(data);
request_data=data;
infinity_item=section.getElementsByClassName('infinity_item');
if(infinity_item.length){
infinity_item=infinity_item[0];
if(jQuery(infinity_item).is_visible()){
bighearts_ajax_query(grid, section, request_data);
}
var lastScrollTop=0;
jQuery(window).on('resize scroll', function(){
if(jQuery(infinity_item).is_visible()){
var st=jQuery(this).scrollTop();
if(st > lastScrollTop){
bighearts_ajax_query(grid, section, request_data);
}
lastScrollTop=st;
}});
}
load_more=section.getElementsByClassName('load_more_item');
if(load_more.length){
load_more=load_more[0];
load_more.addEventListener('click',
function(e){
offset_items=parseInt(request_data.post_count);
e.preventDefault();
jQuery(this).addClass('loading');
bighearts_ajax_query(grid, section, request_data);
},
false
);
}}
function slickCarousel(grid){
jQuery(grid).slick({
draggable: true,
fade: true,
speed: 900,
cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
touchThreshold: 100
});
}
function destroyCarousel(grid){
if(jQuery(grid).hasClass('slick-initialized')){
jQuery(grid).slick('destroy');
}}
function updateFilter(grid){
jQuery(grid).isotope({ sortBy:'original-order' });
jQuery('.isotope-filter a').each(function(){
var data_filter=this.getAttribute('data-filter');
if(jQuery(this).parent().hasClass('product__filter')){
var num=jQuery(this)
.closest('.wgl-products-grid')
.find('.product')
.filter(data_filter).length;
jQuery(this)
.find('.number_filter')
.text('(' + num + ')');
}else{
var num=jQuery(this)
.closest('.wgl-portfolio')
.find('.wgl-portfolio-list_item')
.filter(data_filter).length;
jQuery(this)
.find('.number_filter')
.text('(' + num + ')');
}
if(num!=0&&jQuery(this).hasClass('empty')){
jQuery(this).removeClass('empty');
}});
}
function updateCarousel(grid){
if(jQuery(grid).find('.wgl-carousel_slick').size() > 0){
jQuery(grid)
.find('.wgl-carousel_slick')
.each(function(){
destroyCarousel(jQuery(this));
slickCarousel(jQuery(this));
if(jQuery(grid).hasClass('blog_masonry')){
jQuery(grid).isotope('layout');
}});
}}
})(jQuery);
function bighearts_scroll_animation(){
var portfolio=jQuery('.wgl-portfolio_container');
var shop=jQuery('.wgl-products.appear-animation');
var gallery=jQuery('.wgl-gallery_items.appear-animation');
(function($){
var docElem=window.document.documentElement;
function getViewportH(){
var client=docElem['clientHeight'],
inner=window['innerHeight'];
if(client < inner)
return inner;
else
return client;
}
function scrollY(){
return window.pageYOffset||docElem.scrollTop;
}
function getOffset(el){
var offsetTop=0, offsetLeft=0;
do {
if(!isNaN(el.offsetTop)){
offsetTop +=el.offsetTop;
}
if(!isNaN(el.offsetLeft)){
offsetLeft +=el.offsetLeft;
}} while(el=el.offsetParent)
return {
top:offsetTop,
left:offsetLeft
}}
function inViewport(el, h){
var elH=el.offsetHeight,
scrolled=scrollY(),
viewed=scrolled + getViewportH(),
elTop=getOffset(el).top,
elBottom=elTop + elH,
h=h||0;
return (elTop + elH * h) <=viewed&&(elBottom - elH * h) >=scrolled;
}
function extend(a, b){
for(var key in b){
if(b.hasOwnProperty(key)){
a[key]=b[key];
}}
return a;
}
function AnimOnScroll(el, options){
this.el=el;
this.options=extend(this.defaults, options);
if(this.el.length){
this._init();
}}
AnimOnScroll.prototype={
defaults:{
viewportFactor:0
},
_init:function(){
this.items=Array.prototype.slice.call(jQuery(this.el).children());
this.itemsCount=this.items.length;
this.itemsRenderedCount=0;
this.didScroll=false;
this.delay=100;
var self=this;
if(typeof imagesLoaded==='function'){
imagesLoaded(this.el, this._imgLoaded(self));
}else{
this._imgLoaded(self);
}},
_imgLoaded:function(self){
var interval;
self.items.forEach(function(el, i){
if(inViewport(el)){
self._checkTotalRendered();
if(!jQuery(el).hasClass('show')&&!jQuery(el).hasClass('animate')&&inViewport(el, self.options.viewportFactor)){
self._item_class(jQuery(el), self.delay, interval);
self.delay +=200;
setTimeout(function(){
self.delay=100;
}, 200);
}}
});
window.addEventListener('scroll', function(){
self._onScrollFn();
}, false);
window.addEventListener('resize', function(){
self._resizeHandler();
}, false);
},
_onScrollFn:function(){
var self=this;
if(!this.didScroll){
this.didScroll=true;
setTimeout(function(){ self._scrollPage(); }, 60);
}},
_item_class:function(item_array, delay, interval){
interval=setTimeout(function(){
if(item_array.length){
jQuery(item_array).addClass('animate');
}else{
clearTimeout(interval);
}}, delay);
},
_scrollPage:function(){
var self=this;
var interval;
this.items.forEach(function(el, i){
if(!jQuery(el).hasClass('show')&&!jQuery(el).hasClass('animate')&&inViewport(el, self.options.viewportFactor)){
setTimeout(function(){
var perspY=scrollY() + getViewportH() / 2;
self._checkTotalRendered();
self._item_class(jQuery(el), self.delay, interval);
self.delay +=200;
setTimeout(function(){
self.delay=100;
}, 200);
}, 25);
}});
this.didScroll=false;
},
_resizeHandler:function(){
var self=this;
function delayed(){
self._scrollPage();
self.resizeTimeout=null;
}
if(this.resizeTimeout){
clearTimeout(this.resizeTimeout);
}
this.resizeTimeout=setTimeout(delayed, 1000);
},
_checkTotalRendered:function(){
++this.itemsRenderedCount;
if(this.itemsRenderedCount===this.itemsCount){
window.removeEventListener('scroll', this._onScrollFn);
}}
}
window.AnimOnScroll=AnimOnScroll;
})(jQuery);
new AnimOnScroll(portfolio, {});
new AnimOnScroll(shop, {});
new AnimOnScroll(gallery, {});
}
function bighearts_init_appear(){
var item=jQuery('.wgl-timeline-vertical.appear_animation .tlv__item, .hotspots_container.appear_animation .hotspots_item');
if(item.length){
item.each(function(){
var item=jQuery(this);
item.appear(function(){
item.addClass('show');
});
});
}}
function bighearts_scroll_up(){
(function ($){
$.fn.goBack=function (options){
var defaults={
scrollTop: jQuery(window).height(),
scrollSpeed: 600,
fadeInSpeed: 1000,
fadeOutSpeed: 500,
};
var options=$.extend(defaults, options);
var $this=$(this);
$(window).on('scroll', function (){
if($(window).scrollTop() > options.scrollTop){
$this.addClass('active');
}else{
$this.removeClass('active');
}});
$this.on('click', function (){
$('html,body').animate({
scrollTop: 0,
},
options.scrollSpeed
);
});
};})(jQuery);
jQuery('#scroll_up').goBack();
}
function bighearts_blog_masonry_init (){
var blog=jQuery('.blog-posts > .masonry');
if(jQuery('.masonry').length){
var blog_dom=blog.get(0);
var $grid=imagesLoaded(blog_dom, function(){
setTimeout(function(){
blog.isotope({
layoutMode: 'masonry',
masonry: {
columnWidth: '.item',
},
itemSelector: '.item',
percentPosition: true
});
jQuery(window).trigger('resize');
}, 250);
});
}}
function bighearts_carousel_slick(){
var carousel=jQuery('.wgl-carousel_slick');
if(!carousel.length){
return;
}
carousel.each(function(item, value){
if(jQuery(this).hasClass('slick-initialized')){
jQuery(this).slick('destroy');
}
if(jQuery(this).hasClass('fade_slick')){
jQuery(this).slick({
draggable: true,
fade: true,
speed: 900,
cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
touchThreshold: 100
});
}else{
jQuery(this).slick({});
}});
}
function bighearts_circuit_service(){
var services=jQuery('.wgl-circuit-service');
if(!services.length){
return;
}
services.each(function (){
var $circle=jQuery(this).find('.wgl-services_icon-wrap');
var agle=360 / $circle.length;
var agleCounter=-1;
$circle.each(function (){
var $this=jQuery(this);
jQuery(this).parents('.wgl-services_item:first-child').addClass('active');
$this.on('mouseover', function (){
jQuery(this)
.parents('.wgl-services_item')
.addClass('active')
.siblings()
.removeClass('active');
});
var percentWidth =
(100 * parseFloat($this.css('width'))) /
parseFloat($this.parent().css('width'));
var curAgle=agleCounter * agle;
var radAgle=(curAgle * Math.PI) / 180;
var x=50 + (50 - percentWidth / 2) * Math.cos(radAgle) - percentWidth / 2;
var y=50 + (50 - percentWidth / 2) * Math.sin(radAgle) - percentWidth / 2;
$this.css({
left: x + '%',
top: y + '%',
});
agleCounter++;
});
});
}
function bighearts_countdown_init (){
var countdown=jQuery('.wgl-countdown');
if(!countdown.length){
return;
}
countdown.each(function (){
var data_atts=jQuery(this).data('atts');
var time=new Date(+data_atts.year, +data_atts.month-1, +data_atts.day, +data_atts.hours, +data_atts.minutes);
jQuery(this).countdown({
until: time,
padZeroes: true,
digits: [
'<span>0</span>',
'<span>1</span>',
'<span>2</span>',
'<span>3</span>',
'<span>4</span>',
'<span>5</span>',
'<span>6</span>',
'<span>7</span>',
'<span>8</span>',
'<span>9</span>',
],
format: data_atts.format ? data_atts.format:'yowdHMS',
labels: [data_atts.labels[0],data_atts.labels[1],data_atts.labels[2],data_atts.labels[3],data_atts.labels[4],data_atts.labels[5], data_atts.labels[6], data_atts.labels[7]],
labels1: [data_atts.labels[0],data_atts.labels[1],data_atts.labels[2], data_atts.labels[3], data_atts.labels[4], data_atts.labels[5], data_atts.labels[6], data_atts.labels[7]]
});
});
}
function bighearts_counter_init(){
var counters=jQuery('.wgl-counter');
if(!counters.length){
return;
}
counters.each(function(){
var counter=jQuery(this).find('.wgl-counter__value');
counter.appear(function(){
var from=jQuery(this).data('start-value'),
max=jQuery(this).data('end-value'),
speed=jQuery(this).data('speed');
counter.countTo({
from: from,
to: max,
speed: speed,
refreshInterval: 10
});
});
});
}
function bighearts_dynamic_styles(){
var style=jQuery('#bighearts-footer-inline-css');
(function ($){
$.fn.wglAddDynamicStyles=function (){
if(this.length===0){
return this;
}
return this.each(function (){
var $style='',
self=jQuery(this);
var init=function (){
$style +=self.text();
self.remove();
appendStyle();
},
appendStyle=function (){
jQuery('head').append('<style>' + $style + '</style>');
};
init();
});
};})(jQuery);
style.wglAddDynamicStyles();
}
function bighearts_give_wp_sidebar(){
var progressBars=document.querySelectorAll('.give-progress-bar');
if(!progressBars.length){
return;
}
progressBars.forEach(function (el){
var goal_in_percents=el.parentElement.querySelector('.raised > .give-percentage');
if(goal_in_percents){
return;
}
var currentWidth=el.getAttribute('aria-valuenow');
el.firstElementChild.innerHTML='<span class="current-width">' + parseInt(currentWidth) + '%</span>';
})
}
function mobilecheck(){
var check=false;
(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm(os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s)|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp(i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac(|\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt(|\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg(g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v)|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v)|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-|)|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check=true})(navigator.userAgent||navigator.vendor||window.opera);
return check;
}
var click=mobilecheck() ? ('ontouchstart' in document.documentElement ? 'touchstart':'click'):'click';
function initClickEvent(){
click=mobilecheck() ? ('ontouchstart' in document.documentElement ? 'touchstart':'click'):'click';
}
jQuery(window).on('resize', initClickEvent);
(function($){
"use strict";
$.fn.countTo=function(options){
options=$.extend({}, $.fn.countTo.defaults, options||{});
var loops=Math.ceil(options.speed / options.refreshInterval),
increment=(options.to - options.from) / loops;
return $(this).each(function(){
var _this=this,
loopCount=0,
value=options.from,
interval=setInterval(updateTimer, options.refreshInterval);
function updateTimer(){
value +=increment;
loopCount++;
$(_this).html(value.toFixed(options.decimals));
if(typeof(options.onUpdate)==='function'){
options.onUpdate.call(_this, value);
}
if(loopCount >=loops){
clearInterval(interval);
value=options.to;
if(typeof(options.onComplete)==='function'){
options.onComplete.call(_this, value);
}}
}});
};
$.fn.countTo.defaults={
from: 0,
to: 100,
speed: 1000,
refreshInterval: 100,
decimals: 0,
onUpdate: null,
onComplete: null
};})(jQuery);
function bighearts_slick_navigation_init (){
jQuery.fn.bighearts_slick_navigation=function (){
jQuery(this).each(function (){
var el=jQuery(this);
jQuery(this).find('span.left_slick_arrow').on("click", function(){
jQuery(this).closest('.wgl_cpt_section').find('.slick-prev').trigger('click');
});
jQuery(this).find('span.right_slick_arrow').on("click", function(){
jQuery(this).closest('.wgl_cpt_section').find('.slick-next').trigger('click');
});
});
}}
function is_visible_init (){
jQuery.fn.is_visible=function (){
var elementTop=jQuery(this).offset().top;
var elementBottom=elementTop + jQuery(this).outerHeight();
var viewportTop=jQuery(window).scrollTop();
var viewportBottom=viewportTop + jQuery(window).height();
return elementBottom > viewportTop&&elementTop < viewportBottom;
}}
jQuery(window).load(function(){
jQuery('#preloader-wrapper').fadeOut();
});
function bighearts_image_comparison(){
var item=jQuery('.wgl-image_comparison.cocoen');
if(item.length!==0){
item.each(function(){
jQuery(this).cocoen();
});
}}
function bighearts_img_layers(){
jQuery('.wgl-image-layers').each(function(){
var container=jQuery(this);
var initImageLayers=function(){
container.appear(function(){
container.addClass('img-layer_animate');
},
{ done: true }
);
};
initImageLayers();
});
}
function bighearts_images_gallery(){
var item='.wgl-gallery_item-wrapper',
gallery_masonry='.gallery-masonry',
gallery_justified='.gallery-justified';
if(jQuery(gallery_masonry).length){
var dom=jQuery(gallery_masonry).get(0);
var iso=jQuery(gallery_masonry).isotope({
layoutMode: 'masonry',
percentPosition: true,
itemSelector: item
});
imagesLoaded(dom, function (){
iso.isotope('layout');
});
jQuery(window).on('resize', function (){
iso.isotope();
});
}
if(jQuery(gallery_justified).length){
var dom=jQuery(gallery_justified).get(0);
var jus=jQuery(gallery_justified).justifiedGallery({
rowHeight: deviceData('height'),
margins: deviceData('gap'),
lastRow: 'nojustify',
captions: false,
});
imagesLoaded(dom, function (){
jus.justifiedGallery();
});
jQuery(window).on('resize', function (){
jus.justifiedGallery({
rowHeight: deviceData('height'),
margins: deviceData('gap'),
});
});
}
function deviceData(option){
var data=jQuery(gallery_justified).data(option);
if(jQuery('#main').width() <=767){
data=jQuery(gallery_justified).data('mobile-' + option);
}else if(jQuery('#main').width() <=1024){
data=jQuery(gallery_justified).data('tablet-' + option);
}
return data;
}}
function bighearts_isotope(){
if(jQuery('.isotope').length){
var dom=jQuery('.isotope').get(0);
var filter=jQuery('.isotope-filter a');
var $grid=imagesLoaded(dom, function(){
var mode=jQuery(".isotope").hasClass('fit_rows') ? 'fitRows':'masonry';
setTimeout(function(){
jQuery(".isotope").isotope({
layoutMode: mode,
percentPosition: true,
itemSelector: '.wgl-portfolio-list_item, .item, .product',
masonry: {
columnWidth: '.wgl-portfolio-list_item-size, .wgl-portfolio-list_item, .item, .product',
}}).isotope('layout');
jQuery(window).trigger('resize');
}, 250);
});
filter.each(function(){
var data_filter=this.getAttribute('data-filter');
if(jQuery(this).parent().hasClass('product__filter')){
var num=jQuery(this)
.closest('.wgl-products-grid')
.find('.product')
.filter(data_filter).length;
jQuery(this)
.find('.number_filter')
.text('(' + num + ')');
}else{
var num=jQuery(this)
.closest('.wgl-portfolio')
.find('.wgl-portfolio-list_item')
.filter(data_filter).length;
jQuery(this)
.find('.number_filter')
.text('(' + num + ')');
}
if(num==0){
jQuery(this).addClass('empty');
}});
filter.on('click', function(e){
e.preventDefault();
jQuery(this)
.addClass('active')
.siblings()
.removeClass('active');
var filterValue=jQuery(this).attr('data-filter');
jQuery(this)
.closest('.wgl_cpt_section')
.find('.isotope')
.isotope({ filter: filterValue });
if(jQuery(this).closest('.elementor-widget-container').find('.isotope').hasClass('appear-animation')){
jQuery(this).closest('.elementor-widget-container').find('.item').addClass('animate');
}});
}}
function bighearts_menu_lavalamp(){
var lavalamp=jQuery('.menu_line_enable > ul');
if(lavalamp.length!==0){
lavalamp.each(function(){
var $this=jQuery(this);
$this.lavalamp();
});
}}
(function($, window){
var Lavalamp=function(element, options){
this.element=$(element).data('lavalamp', this);
this.options=$.extend({}, this.options, options);
this.init();
};
Lavalamp.prototype={
options: {
current:
'.current-menu-ancestor,.current-menu-item,.current-category-ancestor,.current-page-ancestor,.current_page_parent',
items: 'li',
bubble: '<div class="lavalamp-object fas fa-caret-up"></div>',
animation: false,
blur: $.noop,
focus: $.noop,
easing: 'easeInOutCubic',
duration: '0.6s'
},
element: null,
current: null,
bubble: null,
_focus: null,
init: function(){
var resizeTimer,
self=this,
child=self.element.children('li');
this.onWindowResize=function(){
if(resizeTimer){
clearTimeout(resizeTimer);
}
resizeTimer=setTimeout(function(){
self.reload();
}, 100);
};
$(window).bind('resize.lavalamp', this.onWindowResize);
$(child).addClass('lavalamp-item');
this.element
.on('mouseenter.lavalamp', '.lavalamp-item', function(){
self.current.each(function(){
self.options.blur.call(this, self);
});
self._move($(this));
})
.on('mouseleave.lavalamp', function(){
if(self.current.index(self._focus) < 0){
self._focus=null;
self.current.each(function(){
self.options.focus.call(this, self);
});
self._move(self.current);
}});
this.bubble=$.isFunction(this.options.bubble)
? this.options.bubble.call(this, this.element)
: $(this.options.bubble).prependTo(this.element);
self.element.addClass('lavalamp');
self.element.find('.lavalamp-object').addClass(self.options.easing);
this.reload();
self.element.addClass('lavalamp_animate');
},
reload: function(){
this.current=this.element.children(this.options.current);
if(this.current.size()===0){
this.current=this.element
.children()
.not('.lavalamp-object')
.eq(0);
}
this._move(this.current, false);
},
destroy: function(){
if(this.bubble){
this.bubble.remove();
}
this.element.unbind('.lavalamp');
$(window).unbind('resize.lavalamp', this.onWindowResize);
},
_move: function(el, animate){
var pos=el.position();
pos.left=pos.left + parseInt(el.children('a').css('paddingLeft'));
var child_width =
el
.children('a')
.children('span')
.width() - 2;
var translate_pos=pos.left + (child_width/2 - 2);
this._focus=el;
this.bubble.css({
WebkitTransitionDuration: this.options.duration,
MozTransitionDuration: this.options.duration,
transitionDuration: this.options.duration,
transform: 'translateX(' + translate_pos + 'px)'
});
}};
$.fn.lavalamp=function(options){
if(typeof options==='string'){
var instance=$(this).data('lavalamp');
return instance[options].apply(instance,
Array.prototype.slice.call(arguments, 1)
);
}else{
return this.each(function(){
var instance=$(this).data('lavalamp');
if(instance){
$.extend(instance.options, options||{});
instance.reload();
}else{
new Lavalamp(this, options);
}});
}};})(jQuery, window);
(function($){
$(document).on('click', '.sl-button', function(){
var button=$(this),
post_id=button.attr('data-post-id'),
security=button.attr('data-nonce'),
iscomment=button.attr('data-iscomment'),
allbuttons;
if(iscomment==='1'){ 
allbuttons=$('.sl-comment-button-'+post_id);
}else{
allbuttons=$('.sl-button-'+post_id);
}
var loader=allbuttons.next('#sl-loader');
if(post_id!==''){
$.ajax({
type: 'POST',
url: wgl_core.ajaxurl,
data:{
action:'bighearts_like',
post_id:post_id,
nonce:security,
is_comment:iscomment,
},
beforeSend: function(){
loader.html('&nbsp;<div class="loader">Loading...</div>');
},
success: function(response){
var icon=response.icon;
var count=response.count;
allbuttons.html(icon+count);
if(response.status==='unliked'){
allbuttons.prop('title', button.data('title-like'));
allbuttons.removeClass('liked');
}else{
allbuttons.prop('title', button.data('title-unlike'));
allbuttons.addClass('liked');
}
loader.empty();
}});
}
return false;
});
})(jQuery);
function bighearts_link_scroll(){
jQuery('a.smooth-scroll, .smooth-scroll').on('click', function(event){
var href;
if(this.tagName=='A'){
href=jQuery.attr(this, 'href');
}else{
var that=jQuery(this).find('a');
href=jQuery(that).attr('href');
}
jQuery('html, body').animate({
scrollTop: jQuery(href).offset().top
},
500
);
event.preventDefault();
});
}
function bighearts_message_anim_init(){
jQuery('body').on('click', '.message_close_button', function (e){
jQuery(this).closest('.bighearts_module_message_box.closable').slideUp(350);
});
}
function bighearts_mobile_header(){
var menu=jQuery('.wgl-mobile-header .mobile_nav_wrapper .primary-nav > ul');
(function($){
$.fn.wglMobileMenu=function(options){
var defaults={
'toggleBtn':'.wgl-mobile-header .hamburger-box',
'switcher':'.button_switcher',
'back':'.back',
'overlay':'.wgl-menu_overlay',
'anchor':'.menu-item > a[href*=\\#]'
};
if(this.length===0) return this;
return this.each(function (){
var wglMenu={},
ds=$(this),
sub_menu=jQuery('.mobile_nav_wrapper .primary-nav > ul ul'),
m_width=jQuery('.mobile_nav_wrapper').data("mobileWidth"),
m_toggle=jQuery('.hamburger-box'),
body=jQuery('body');
var open='is-active',
openSubMenu='show_sub_menu',
mobile_on='mobile_switch_on',
mobile_off='mobile_switch_off',
mobile_switcher='button_switcher';
var init=function(){
wglMenu.settings=$.extend({}, defaults, options);
createButton();
showMenu();
addPerfectScroll();
};
var showMenu=function(){
if(jQuery(window).width() <=m_width){
if(!m_toggle.hasClass(open)){
create_nav_mobile_menu();
}}else{
reset_nav_mobile_menu();
}};
var create_nav_mobile_menu=function(){
sub_menu.removeClass(openSubMenu);
ds.hide().addClass(mobile_on);
body.removeClass(mobile_on);
};
var reset_nav_mobile_menu=function(){
sub_menu.removeClass(openSubMenu);
body.removeClass(mobile_on);
ds.show().removeClass(mobile_on);
m_toggle.removeClass(open);
jQuery('.' + mobile_switcher).removeClass('is-active');
};
var createButton=function(){
ds.find('.menu-item-has-children').each(function(){
jQuery(this)
.find('> a')
.append('<span class="' + mobile_switcher + '"></span>');
});
};
var addPerfectScroll=function(){
new PerfectScrollbar('#wgl-perfect-container', {
wheelSpeed: 6,
suppressScrollX: true
});
};
var toggleMobileMenu=function(e){
ds.toggleClass(openSubMenu);
body.toggleClass(mobile_on);
if(body.hasClass(mobile_on)) body.removeClass(mobile_off);
else body.addClass(mobile_off);
};
var hideSubMenu=function(e){
if(!jQuery('.button_switcher').is(e.target)){
jQuery('.mobile_nav_wrapper .menu-item-has-children')
.find('.sub-menu')
.stop(true)
.slideUp(450)
.removeClass(openSubMenu);
jQuery('.mobile_nav_wrapper .menu-item-has-children')
.find('.button_switcher')
.removeClass(open);
if(jQuery(e.target).closest('.wgl-mobile-header').length){
toggleMobileMenu();
}}
};
var showSubMenu=function(e){
e.preventDefault();
var item=jQuery(this).parents('li');
if(!jQuery(this).hasClass(open)){
jQuery('.mobile_nav_wrapper .menu-item-has-children').not(item).find('.sub-menu').stop(true).slideUp(450).removeClass(openSubMenu);
jQuery('.mobile_nav_wrapper .menu-item-has-children').not(item).find('.button_switcher').removeClass(open);
jQuery('.mobile_nav_wrapper .menu-item-has-children').not(item).find('a[href*=\\#]').removeClass(open);
jQuery(this).parent().prev('.sub-menu').stop(true).slideDown(450).addClass(openSubMenu);
jQuery(this).parent().next('.sub-menu').stop(true).slideDown(450).addClass(openSubMenu);
}else{
jQuery(this).parent().prev('.sub-menu').stop(true).slideUp(450).removeClass(openSubMenu);
jQuery(this).parent().next('.sub-menu').stop(true).slideUp(450).removeClass(openSubMenu);
}
jQuery(this).toggleClass(open);
};
var eventClose=function(e){
var container=$("#wgl-perfect-container");
if(!container.is(e.target)
&& container.has(e.target).length===0
&& $('body').hasClass(mobile_on)
){
toggleMobileMenu();
}};
var goBack=function(e){
e.preventDefault();
jQuery(this).closest('.sub-menu').removeClass(openSubMenu);
jQuery(this).closest('.sub-menu').prev('a').removeClass(open);
jQuery(this).closest('.sub-menu').prev('a').find('.' + mobile_switcher).removeClass(open);
};
init();
jQuery(wglMenu.settings.toggleBtn).on(click, toggleMobileMenu);
jQuery(wglMenu.settings.overlay).on(click, eventClose);
jQuery(wglMenu.settings.switcher).on(click, showSubMenu);
jQuery(wglMenu.settings.anchor).on(click, hideSubMenu);
jQuery(wglMenu.settings.back).on(click, goBack);
jQuery(window).resize(function(){
showMenu();
}
);
});
};})(jQuery);
menu.wglMobileMenu();
}
function bighearts_page_title_parallax(){
var page_title=jQuery('.page-header.page_title_parallax')
if(page_title.length!==0){
page_title.paroller();
}}
function bighearts_extended_parallax(){
var item=jQuery('.extended-parallax')
if(item.length!==0){
item.each(function(){
jQuery(this).paroller();
})
}}
function bighearts_portfolio_parallax(){
var portfolio=jQuery('.wgl-portfolio-item_bg.portfolio_parallax')
if(portfolio.length!==0){
portfolio.paroller();
}}
function bighearts_parallax_video(){
jQuery('.parallax-video').each(function(){
jQuery(this).jarallax({
loop: true,
speed: 1,
videoSrc: jQuery(this).data('video'),
videoStartTime: jQuery(this).data('start'),
videoEndTime: jQuery(this).data('end')
});
});
}
function bighearts_pie_chart_init(){
var item=jQuery('.wgl-pie_chart');
if(item.length){
item.each(function(){
var chart=item.find('.chart');
item.appear(function(){
jQuery(chart).easyPieChart({
barColor: jQuery(this).data("barColor"),
trackColor: jQuery(this).data("trackColor"),
scaleColor: false,
lineCap: 'round',
lineWidth: jQuery(this).data("lineWidth"),
animate: { duration: 1400, enabled: true },
size: jQuery(this).data("size"),
onStep: function(from, to, percent){
jQuery(this.el).find('.percent').text(Math.round(percent) + '%');
}});
});
});
}}
function bighearts_videobox_init (){
var gallery=jQuery(".videobox, .swipebox, .gallery a[href$='.jpg'], .gallery a[href$='.jpeg'], .gallery a[href$='.JPEG'], .gallery a[href$='.gif'], .gallery a[href$='.png']");
if(gallery.length!==0){
gallery.each(function(){
jQuery(this).attr('data-elementor-open-lightbox', 'yes');
});
}}
function bighearts_progress_bars_init(e){
var item=jQuery('.wgl-progress_bar');
if(item.length){
item.each(function(){
var item=jQuery(this),
slidable_label=false,
item_label=item.find('.progress_label_wrap'),
bar=item.find('.progress_bar'),
data_width=bar.data('width'),
counter=item.find('.progress_value'),
duration=parseFloat(bar.css('transition-duration')) * 1000,
interval=Math.floor(duration / data_width),
temp=0;
if(item.hasClass('dynamic-value')){
slidable_label=true;
}
if(!e){
item.appear(function(){
bar.css('width', data_width + '%');
if(slidable_label==true){
item_label.css('width', data_width + '%');
}
var recap=setInterval(function(){
counter.text(temp);
temp++;
}, interval);
var stopCounter=setTimeout(function(){
clearInterval(recap);
counter.text(data_width);
}, duration);
});
}else{
bar.css('width', data_width + '%');
if(slidable_label){
item_label.css('width', data_width + '%');
}
var recap=setInterval(function(){
counter.text(temp);
temp++;
}, interval);
var stopCounter=setTimeout(function(){
clearInterval(recap);
counter.text(data_width);
}, duration);
}});
}}
function bighearts_search_init(){
(function($){
$.fn.wglSearch=function(options){
var defaults={
'toggleID':'.header_search-button',
'closeID':'.header_search-close',
'searchField':'.header_search-field',
'body':'body > *:not(header)',
};
if(this.length===0){ return this; }
return this.each(function(){
var wglSearch={},
s=$(this),
openClass='header_search-open',
searchClass='.header_search',
init=function(){
wglSearch.settings=$.extend({}, defaults, options);
},
open=function(){
$(s).addClass(openClass);
setTimeout(function(){
$(s)
.find('input.search-field')
.focus();
}, 100);
return false;
},
close=function(){
jQuery(s).removeClass(openClass);
},
toggleSearch=function(e){
if(! $(s).closest(searchClass).hasClass(openClass)){
open();
}else{
close();
}},
eventClose=function(e){
if(! $(e.target).closest('.search-form').length){
if(jQuery(searchClass).hasClass(openClass)){
close();
}}
};
init();
if(jQuery(this).hasClass('search_standard')){
jQuery(this).find(wglSearch.settings.toggleID).on(click, toggleSearch);
jQuery(this).find(wglSearch.settings.closeID).on(click, eventClose);
}else{
jQuery(wglSearch.settings.toggleID).on(click, toggleSearch);
jQuery(wglSearch.settings.searchField).on(click, eventClose);
}
jQuery(wglSearch.settings.body).on(click, eventClose);
});
};})(jQuery);
jQuery('.header_search').wglSearch();
}
function bighearts_side_panel_init(){
(function($){
$.fn.wglSidePanel=function(options){
var defaults={
"toggleID":".side_panel-toggle",
"closeID":".side-panel_close",
"closeOverlay":".side-panel_overlay",
"body":"body > *:not(header)",
"sidePanel":"#side-panel .side-panel_sidebar"
};
if(this.length===0){ return this; }
return this.each(function (){
var wglSidePanel={},
s=$(this),
openClass='side-panel_open',
wglScroll,
sidePanelClass='.side_panel',
init=function(){
wglSidePanel.settings=$.extend({}, defaults, options);
},
open=function (){
if(! $('#side-panel').hasClass('side-panel_active')){
$('#side-panel').addClass('side-panel_active');
}
$('#side-panel').addClass(openClass);
$(s).addClass(openClass);
$('body').removeClass('side-panel--closed').addClass('side-panel--opened');
var wglClassAnimated=$('#side-panel').find('section.elementor-element').data('settings');
if(wglClassAnimated&&wglClassAnimated.animation){
$('#side-panel').find('section.elementor-element').removeClass('elementor-invisible').addClass('animated').addClass(wglClassAnimated.animation);
}},
close=function (){
$(s).removeClass(openClass);
$('#side-panel').removeClass(openClass);
$('body').removeClass('side-panel--opened').addClass('side-panel--closed');
var wglClassAnimated=$('#side-panel').find('section.elementor-element').data('settings');
if(wglClassAnimated&&wglClassAnimated.animation){
$('#side-panel').find('section.elementor-element').removeClass(wglClassAnimated.animation);
}},
togglePanel=function(e){
e.preventDefault();
wglScroll=$(window).scrollTop();
if(! $(s).closest(sidePanelClass).hasClass(openClass)){
open();
jQuery(window).scroll(function(){
if(450 < Math.abs(jQuery(this).scrollTop() - wglScroll)){
close();
}});
}else{
}},
closePanel=function(e){
e.preventDefault();
if($(s).closest(sidePanelClass).hasClass(openClass)){
close();
}},
eventClose=function(e){
var element=$(sidePanelClass),
container=$("#side-panel");
if(! container.is(e.target)&&container.has(e.target).length===0){
if($(element).hasClass(openClass)){
close();
}}
};
init();
jQuery(wglSidePanel.settings.toggleID).on(click, togglePanel);
jQuery(wglSidePanel.settings.body).on(click, eventClose);
jQuery(wglSidePanel.settings.closeID).on(click, closePanel);
jQuery(wglSidePanel.settings.closeOverlay).on(click, closePanel);
new PerfectScrollbar('#side-panel', {
wheelSpeed: 6,
suppressScrollX: true
});
});
};})(jQuery);
if(jQuery('#side-panel').length){
jQuery('.side_panel').wglSidePanel();
}}
function bighearts_skrollr_init(){
var blog_scroll=jQuery('.blog_skrollr_init');
if(blog_scroll.length){
if(!/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent||navigator.vendor||window.opera)){
skrollr.init({
smoothScrolling: false,
forceHeight: false
});
}}
}
function bighearts_sticky_init(){
var section='.wgl-sticky-header',
top=jQuery(section).height(),
data=jQuery(section).data('style'),
previousScroll=0;
function init(element){
if(! element){
return;
}
var y=jQuery(window).scrollTop();
if(data=='standard'){
if(y >=top){
jQuery(section).addClass('sticky_active');
}else{
jQuery(section).removeClass('sticky_active');
}}else{
if(y > top){
if(y > previousScroll){
jQuery(section).removeClass('sticky_active');
}else{
jQuery(section).addClass('sticky_active');
}}else{
jQuery(section).removeClass('sticky_active');
}
previousScroll=y;
}};
if(jQuery('.wgl-sticky-header').length!==0){
jQuery(window).scroll(function(){
init(jQuery(this));
});
jQuery(window).resize(function(){
init(jQuery(this));
});
}}
function bighearts_sticky_sidebar(){
if(jQuery('.sticky-sidebar').length){
jQuery('body').addClass('sticky-sidebar_init');
jQuery('.sticky-sidebar').each(function(){
jQuery(this).theiaStickySidebar({
additionalMarginTop: 150,
additionalMarginBottom: 30
});
});
}
if(jQuery('.sticky_layout .info-wrapper').length){
jQuery('.sticky_layout .info-wrapper').each(function(){
jQuery(this).theiaStickySidebar({
additionalMarginTop: 150,
additionalMarginBottom: 150
});
});
}}
function bighearts_tabs_init(){
if(jQuery('.wgl-tabs').length){
jQuery('.wgl-tabs').each(function(){
var $this=jQuery(this);
var tab=$this.find('.wgl-tabs_headings .wgl-tabs_header');
var	data=$this.find('.wgl-tabs_content-wrap .wgl-tabs_content');
tab.filter(':first').addClass('active');
data.filter(':not(:first)').hide();
tab.each(function(){
var currentTab=jQuery(this);
currentTab.on('click tap', function(){
var id=currentTab.data('tab-id');
currentTab.addClass('active').siblings().removeClass('active');
jQuery('.wgl-tabs .wgl-tabs_content[data-tab-id='+id+']').slideDown().siblings().slideUp();
});
});
})
}}
function bighearts_text_background(){
var anim_text=jQuery('.wgl-animation-background-text');
if(anim_text.length){
anim_text.each(function(index){
var paralax_text=jQuery('<div class="wgl-background-text"/>');
jQuery(this)
.find('>div:eq(0)')
.before(paralax_text);
var text=window.getComputedStyle(this, ':before').content;
var matches=text.match(/[^"]+/g);
text=matches[0];
paralax_text.addClass('element-' + index);
paralax_text.attr('data-info', index);
jQuery(this)
.find(paralax_text)
.html(text.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>")
);
var self=jQuery(this);
anim_text.appear(function(){
if(typeof anime==='function'){
var item_anime=jQuery(this)
.find('.wgl-background-text')
.data('info');
if(item_anime===index){
anime.timeline({ loop: false }).add({
targets: '.element-' + index + ' .letter',
translateY: [100, 0],
translateZ: 0,
opacity: [0, 1],
easing: 'easeOutExpo',
duration: 1400,
delay: function(el, i){
return 0 + 350 * i;
}});
}}
});
});
}}
function bighearts_woocommerce_helper(){
jQuery('body').on('click', '.quantity.number-input span.minus', function(e){
this.parentNode.querySelector('input[type=number]').stepDown();
if(document.querySelector('.woocommerce-cart-form [name=update_cart]')){
document.querySelector('.woocommerce-cart-form [name=update_cart]').disabled=false;
}});
jQuery('body').on('click', '.quantity.number-input span.plus', function(e){
this.parentNode.querySelector('input[type=number]').stepUp();
if(document.querySelector('.woocommerce-cart-form [name=update_cart]')){
document.querySelector('.woocommerce-cart-form [name=update_cart]').disabled=false;
}});
jQuery('ul.wgl-products li a.add_to_cart_button.ajax_add_to_cart').on("click", function(){
jQuery(this).closest('li').addClass('added_to_cart_item');
});
}
function bighearts_woocommerce_login_in(){
if(jQuery('header .login-in').length){
var mc=jQuery('header .login-in'),
icon=mc.find('a.login-in_link'),
overlay=mc.find('div.overlay');
icon.on('click tap', function(e){
e.preventDefault();
mc.toggleClass('open_login');
});
overlay.on('click tap', function(e){
if(!jQuery(e.target).closest('.modal_content').length &&
!jQuery(e.target).is('.modal_content')
){
mc.removeClass('open_login');
}});
}}
function bighearts_woocommerce_mini_cart(){
if(jQuery('header .wgl-cart-header .mini-cart').length){
jQuery('header .wgl-cart-header .mini-cart').each(function(){
jQuery(this).prepend('<div class="mini_cart-overlay"></div>');
var self=jQuery(this),
overlay=self.find('div.mini_cart-overlay');
jQuery('a.woo_icon').on('click tap', function(){
self.toggleClass('open_cart');
});
overlay.on('click tap', function(){
self.removeClass('open_cart');
});
jQuery('body').on('click', 'header a.close_mini_cart', function(){
self.removeClass('open_cart');
});
});
}}
function bighearts_select_wrap(){
jQuery('select').each(function (){
if(this.classList.contains('give-hidden')
|| this.classList.contains('give-cs-mini-dropdown')
){
return;
}
jQuery(this).wrap("<div class='select__field'></div>");
});
};