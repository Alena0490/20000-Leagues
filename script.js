/* Video */
const video = document.getElementById('foot-video');

video.addEventListener('ended', () => {
  setTimeout(() => {
    video.currentTime = 0; // Nastavení na začátek
    video.play(); // Znovu přehrát
  }, 500); // Prodleva před opakováním
});


/*Hlobkověr*/
document.addEventListener('DOMContentLoaded', function () {
    const indicator = document.querySelector('.depth-indicator');
    const depthMeter = document.querySelector('.depth-meter');

    function updateDepthMeter() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = window.scrollY / scrollHeight;

        const depthMeterHeight = depthMeter.offsetHeight - indicator.offsetHeight;
        let newPosition = scrollPercentage * depthMeterHeight;

        // Aktualizace polohy indikátoru
        indicator.style.top = `${newPosition}px`;

        // Dynamické zmenšování indikátoru (až na 75 % původní velikosti)
        let newScale = 1 - (scrollPercentage * 0.25);
        indicator.style.transform = `scale(${newScale})`;

        // Přechod z oranžové do tmavě měděné (nutno přepsat celý `background`)
        let lightness = 70 - (scrollPercentage * 40); // Od světlé 70% po tmavou 30%
        indicator.style.background = `radial-gradient(circle, hsl(30, 100%, ${lightness}%) 20%, hsl(20, 80%, ${lightness - 10}%) 70%)`;

        // Plynulý přechod
        indicator.style.transition = 'background 0.2s linear, transform 0.2s linear';
    }

    window.addEventListener('scroll', updateDepthMeter);
    window.addEventListener('resize', updateDepthMeter);

    updateDepthMeter();
});



// Vytvoření vlastního kurzoru
const cursor = document.createElement('div');
cursor.id = 'customCursor';
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let lastX = 0; // Ukládání předchozí X pozice

// Sledování pozice myši
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Otočení kurzoru podle směru pohybu
    if (mouseX > lastX) {
        cursor.style.transform = "translate(-50%, -50%) scaleX(1)"; // Normální směr (doprava)
    } else if (mouseX < lastX) {
        cursor.style.transform = "translate(-50%, -50%) scaleX(-1)"; // Otočení doleva
    }

    lastX = mouseX; // Uložení aktuální X pozice pro příští srovnání
});

// Plynulý pohyb kurzoru
function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover efekt: Skrývání kurzoru při najetí na tlačítko nebo odkaz
document.querySelectorAll('button, a, input, textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0'; // Skrytí kurzoru
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.opacity = '1'; // Znovuzobrazení kurzoru
    });
});


/*** Bubbles */
(function bubblesCursor() {
    const particles = [];
    let lastTime = 0;

    // Generování bublin na pozici kurzoru
    document.addEventListener('mousemove', () => {
        const now = Date.now();
        if (now - lastTime > 150) { // Generování každých 150 ms
            addParticle(cursorX-700, cursorY); // Použití stejné pozice jako kurzor
            lastTime = now;
        }
    });

    // Vytvoření bubliny
    function addParticle(x, y) {
        const particle = new Particle();
        particle.init(x, y);
        particles.push(particle);
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].lifeSpan < 0) {
                particles[i].die();
                particles.splice(i, 1);
            }
        }
    }
    function loop() {
        requestAnimationFrame(loop);
        updateParticles();
    }
    // Vlastnosti bubliny
    function Particle() {
        this.lifeSpan = 500; // Délka života bubliny (ms)
        this.initialStyles = {
            position: "absolute",
            display: "block",
            "z-index": "9999",
            width: "clamp(7px, .5rem, 15px)",
            height: "clamp(7px, .5rem, 15px)",
            "will-change": "transform",
            "background": "#e6f1f750",
            "box-shadow": "-1px 0px rgba(160, 220, 255, 0.67), 0px -1px rgba(107, 173, 211, 0.71), 1px 0px rgba(58, 146, 197, 0.69), 0px 1px rgba(58, 146, 197, 0.69)",
            "border-radius": "50%",
            "z-index": "-1",
            opacity: 1
        };

        this.init = function (x, y) {
            this.velocity = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };

            this.position = { x, y };
            this.element = document.createElement('span');
            Object.assign(this.element.style, this.initialStyles);
            this.update();

            document.body.appendChild(this.element);
        };

        this.update = function () {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.lifeSpan--;

            this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
            this.element.style.opacity = this.lifeSpan / 400;
        };

        this.die = function () {
            this.element.remove();
        };
    }

    loop();
})();

/***Parallax */
/***Scrolování na stránce */
document.addEventListener('DOMContentLoaded', function() {
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $(function() {
                function smoothScroll(target) {
                    if ($(target).length) {
                        $("html, body").animate({
                            scrollTop: $(target).offset().top - 90
                        }, 1000);
                        
                        // Odebrání # z URL, aby stránka neskočila zpět
                        history.replaceState(null, null, ' ');
                    } else {
                        console.warn("Sekce " + target + " nebyla nalezena.");
                    }
                }

                $(".jq--scroll-about").click(function(event) {
                    event.preventDefault();
                    smoothScroll(".jq--about");
                });

                $(".jq--scroll-features").click(function(event) {
                    event.preventDefault();
                    smoothScroll(".jq--features");
                });

                $(".jq--scroll-gallery").click(function(event) {
                    event.preventDefault();
                    smoothScroll(".jq--gallery");
                });

                $(".jq--scroll-contact").click(function(event) {
                    event.preventDefault();
                    smoothScroll(".jq--contact");
                });
            });
        })(jQuery);
    } else {
        console.error("jQuery nebylo načteno.");
    }
});


// Vrácení stránky nahoru
// $(window).on("load", function() {
//     if (window.location.hash !== "#contact-form") {
//         setTimeout(function() {
//             $("html, body").scrollTop(0);
//         }, 10);
//     }
// });


/***  Change burger menu ***/
document.addEventListener("DOMContentLoaded", function() {
    const navIcon = document.querySelector('.jq--nav-icon');
    const mobileNavBack = document.querySelector('.mobile-nav-back');
    const navMenu = document.querySelector('nav ul');

    // Skrytí menu na začátku
    mobileNavBack.style.display = "none";
    navMenu.style.display = "none";

    // Zajistíme, že burger menu nebude na desktopu
    function checkWindowSize() {
        if (window.innerWidth > 768) {
            navIcon.style.display = "none"; // Skryje burger menu na desktopu
            navMenu.style.display = "flex"; // Zajistí, že navigace bude viditelná
        } else {
            navIcon.style.display = "block"; // Zobrazí burger menu na mobilu
            navMenu.style.display = "none"; // Navigace zůstane skrytá
        }
    }

    checkWindowSize(); // Spustí kontrolu při načtení stránky
    window.addEventListener('resize', checkWindowSize); // Sleduje změnu velikosti okna

    // Toggle menu po kliknutí
    navIcon.addEventListener("click", function(event) {
        event.preventDefault();

        const isOpen = navMenu.style.display === "block";

        if (!isOpen) {
            navIcon.src = "img/closew.webp"; // Změna na křížek
            mobileNavBack.style.display = "block";
            navMenu.style.display = "block";
        } else {
            navIcon.src = "img/burger-barw.webp"; // Zpět na burger menu
            mobileNavBack.style.display = "none";
            navMenu.style.display = "none";
        }
    });
});


/*Zobrazení galerie*/
//   $(function() {
//     $(".slider-wrapper").hide().fadeIn(3000);
// });

//   $(function() {
//     $(".album").hide().fadeIn(4000);
// });
//   $(function() {
//     $("iframe").hide().fadeIn(4000);
// });

/****Lightbox */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],b):"object"==typeof exports?module.exports=b(require("jquery")):a.lightbox=b(a.jQuery)}(this,function(a){function b(b){this.album=[],this.currentImageIndex=void 0,this.init(),this.options=a.extend({},this.constructor.defaults),this.option(b)}return b.defaults={albumLabel:"Image %1 of %2",alwaysShowNavOnTouchDevices:!1,fadeDuration:600,fitImagesInViewport:!0,imageFadeDuration:600,positionFromTop:50,resizeDuration:700,showImageNumberLabel:!0,wrapAround:!1,disableScrolling:!1,sanitizeTitle:!1},b.prototype.option=function(b){a.extend(this.options,b)},b.prototype.imageCountLabel=function(a,b){return this.options.albumLabel.replace(/%1/g,a).replace(/%2/g,b)},b.prototype.init=function(){var b=this;a(document).ready(function(){b.enable(),b.build()})},b.prototype.enable=function(){var b=this;a("body").on("click","a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]",function(c){return b.start(a(c.currentTarget)),!1})},b.prototype.build=function(){if(!(a("#lightbox").length>0)){var b=this;a('<div id="lightboxOverlay" tabindex="-1" class="lightboxOverlay"></div><div id="lightbox" tabindex="-1" class="lightbox"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""/><div class="lb-nav"><a class="lb-prev" role="button" tabindex="0" aria-label="Previous image" href="" ></a><a class="lb-next" role="button" tabindex="0" aria-label="Next image" href="" ></a></div><div class="lb-loader"><a class="lb-cancel" role="button" tabindex="0"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close" role="button" tabindex="0"></a></div></div></div></div>').appendTo(a("body")),this.$lightbox=a("#lightbox"),this.$overlay=a("#lightboxOverlay"),this.$outerContainer=this.$lightbox.find(".lb-outerContainer"),this.$container=this.$lightbox.find(".lb-container"),this.$image=this.$lightbox.find(".lb-image"),this.$nav=this.$lightbox.find(".lb-nav"),this.containerPadding={top:parseInt(this.$container.css("padding-top"),10),right:parseInt(this.$container.css("padding-right"),10),bottom:parseInt(this.$container.css("padding-bottom"),10),left:parseInt(this.$container.css("padding-left"),10)},this.imageBorderWidth={top:parseInt(this.$image.css("border-top-width"),10),right:parseInt(this.$image.css("border-right-width"),10),bottom:parseInt(this.$image.css("border-bottom-width"),10),left:parseInt(this.$image.css("border-left-width"),10)},this.$overlay.hide().on("click",function(){return b.end(),!1}),this.$lightbox.hide().on("click",function(c){"lightbox"===a(c.target).attr("id")&&b.end()}),this.$outerContainer.on("click",function(c){return"lightbox"===a(c.target).attr("id")&&b.end(),!1}),this.$lightbox.find(".lb-prev").on("click",function(){return 0===b.currentImageIndex?b.changeImage(b.album.length-1):b.changeImage(b.currentImageIndex-1),!1}),this.$lightbox.find(".lb-next").on("click",function(){return b.currentImageIndex===b.album.length-1?b.changeImage(0):b.changeImage(b.currentImageIndex+1),!1}),this.$nav.on("mousedown",function(a){3===a.which&&(b.$nav.css("pointer-events","none"),b.$lightbox.one("contextmenu",function(){setTimeout(function(){this.$nav.css("pointer-events","auto")}.bind(b),0)}))}),this.$lightbox.find(".lb-loader, .lb-close").on("click keyup",function(a){if("click"===a.type||"keyup"===a.type&&(13===a.which||32===a.which))return b.end(),!1})}},b.prototype.start=function(b){function c(a){d.album.push({alt:a.attr("data-alt"),link:a.attr("href"),title:a.attr("data-title")||a.attr("title")})}var d=this,e=a(window);e.on("resize",a.proxy(this.sizeOverlay,this)),this.sizeOverlay(),this.album=[];var f,g=0,h=b.attr("data-lightbox");if(h){f=a(b.prop("tagName")+'[data-lightbox="'+h+'"]');for(var i=0;i<f.length;i=++i)c(a(f[i])),f[i]===b[0]&&(g=i)}else if("lightbox"===b.attr("rel"))c(b);else{f=a(b.prop("tagName")+'[rel="'+b.attr("rel")+'"]');for(var j=0;j<f.length;j=++j)c(a(f[j])),f[j]===b[0]&&(g=j)}var k=e.scrollTop()+this.options.positionFromTop,l=e.scrollLeft();this.$lightbox.css({top:k+"px",left:l+"px"}).fadeIn(this.options.fadeDuration),this.options.disableScrolling&&a("body").addClass("lb-disable-scrolling"),this.changeImage(g)},b.prototype.changeImage=function(b){var c=this,d=this.album[b].link,e=d.split(".").slice(-1)[0],f=this.$lightbox.find(".lb-image");this.disableKeyboardNav(),this.$overlay.fadeIn(this.options.fadeDuration),a(".lb-loader").fadeIn("slow"),this.$lightbox.find(".lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption").hide(),this.$outerContainer.addClass("animating");var g=new Image;g.onload=function(){var h,i,j,k,l,m;f.attr({alt:c.album[b].alt,src:d}),a(g),f.width(g.width),f.height(g.height);var n=g.width/g.height;m=a(window).width(),l=a(window).height(),k=m-c.containerPadding.left-c.containerPadding.right-c.imageBorderWidth.left-c.imageBorderWidth.right-20,j=l-c.containerPadding.top-c.containerPadding.bottom-c.imageBorderWidth.top-c.imageBorderWidth.bottom-c.options.positionFromTop-70,"svg"===e?(n>=1?(i=k,h=parseInt(k/n,10)):(i=parseInt(j/n,10),h=j),f.width(i),f.height(h)):(c.options.fitImagesInViewport?(c.options.maxWidth&&c.options.maxWidth<k&&(k=c.options.maxWidth),c.options.maxHeight&&c.options.maxHeight<j&&(j=c.options.maxHeight)):(k=c.options.maxWidth||g.width||k,j=c.options.maxHeight||g.height||j),(g.width>k||g.height>j)&&(g.width/k>g.height/j?(i=k,h=parseInt(g.height/(g.width/i),10),f.width(i),f.height(h)):(h=j,i=parseInt(g.width/(g.height/h),10),f.width(i),f.height(h)))),c.sizeContainer(f.width(),f.height())},g.src=this.album[b].link,this.currentImageIndex=b},b.prototype.sizeOverlay=function(){var b=this;setTimeout(function(){b.$overlay.width(a(document).width()).height(a(document).height())},0)},b.prototype.sizeContainer=function(a,b){function c(){d.$lightbox.find(".lb-dataContainer").width(g),d.$lightbox.find(".lb-prevLink").height(h),d.$lightbox.find(".lb-nextLink").height(h),d.$overlay.trigger("focus"),d.showImage()}var d=this,e=this.$outerContainer.outerWidth(),f=this.$outerContainer.outerHeight(),g=a+this.containerPadding.left+this.containerPadding.right+this.imageBorderWidth.left+this.imageBorderWidth.right,h=b+this.containerPadding.top+this.containerPadding.bottom+this.imageBorderWidth.top+this.imageBorderWidth.bottom;e!==g||f!==h?this.$outerContainer.animate({width:g,height:h},this.options.resizeDuration,"swing",function(){c()}):c()},b.prototype.showImage=function(){this.$lightbox.find(".lb-loader").stop(!0).hide(),this.$lightbox.find(".lb-image").fadeIn(this.options.imageFadeDuration),this.updateNav(),this.updateDetails(),this.preloadNeighboringImages(),this.enableKeyboardNav()},b.prototype.updateNav=function(){var a=!1;try{document.createEvent("TouchEvent"),a=!!this.options.alwaysShowNavOnTouchDevices}catch(a){}this.$lightbox.find(".lb-nav").show(),this.album.length>1&&(this.options.wrapAround?(a&&this.$lightbox.find(".lb-prev, .lb-next").css("opacity","1"),this.$lightbox.find(".lb-prev, .lb-next").show()):(this.currentImageIndex>0&&(this.$lightbox.find(".lb-prev").show(),a&&this.$lightbox.find(".lb-prev").css("opacity","1")),this.currentImageIndex<this.album.length-1&&(this.$lightbox.find(".lb-next").show(),a&&this.$lightbox.find(".lb-next").css("opacity","1"))))},b.prototype.updateDetails=function(){var a=this;if(void 0!==this.album[this.currentImageIndex].title&&""!==this.album[this.currentImageIndex].title){var b=this.$lightbox.find(".lb-caption");this.options.sanitizeTitle?b.text(this.album[this.currentImageIndex].title):b.html(this.album[this.currentImageIndex].title),b.fadeIn("fast")}if(this.album.length>1&&this.options.showImageNumberLabel){var c=this.imageCountLabel(this.currentImageIndex+1,this.album.length);this.$lightbox.find(".lb-number").text(c).fadeIn("fast")}else this.$lightbox.find(".lb-number").hide();this.$outerContainer.removeClass("animating"),this.$lightbox.find(".lb-dataContainer").fadeIn(this.options.resizeDuration,function(){return a.sizeOverlay()})},b.prototype.preloadNeighboringImages=function(){if(this.album.length>this.currentImageIndex+1){(new Image).src=this.album[this.currentImageIndex+1].link}if(this.currentImageIndex>0){(new Image).src=this.album[this.currentImageIndex-1].link}},b.prototype.enableKeyboardNav=function(){this.$lightbox.on("keyup.keyboard",a.proxy(this.keyboardAction,this)),this.$overlay.on("keyup.keyboard",a.proxy(this.keyboardAction,this))},b.prototype.disableKeyboardNav=function(){this.$lightbox.off(".keyboard"),this.$overlay.off(".keyboard")},b.prototype.keyboardAction=function(a){var b=a.keyCode;27===b?(a.stopPropagation(),this.end()):37===b?0!==this.currentImageIndex?this.changeImage(this.currentImageIndex-1):this.options.wrapAround&&this.album.length>1&&this.changeImage(this.album.length-1):39===b&&(this.currentImageIndex!==this.album.length-1?this.changeImage(this.currentImageIndex+1):this.options.wrapAround&&this.album.length>1&&this.changeImage(0))},b.prototype.end=function(){this.disableKeyboardNav(),a(window).off("resize",this.sizeOverlay),this.$lightbox.fadeOut(this.options.fadeDuration),this.$overlay.fadeOut(this.options.fadeDuration),this.options.disableScrolling&&a("body").removeClass("lb-disable-scrolling")},new b});
//# sourceMappingURL=lightbox.min.map

document.addEventListener("DOMContentLoaded", function() {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("accept-cookies");

  console.log("Script spuštěn - zobrazujeme banner");

  // Vždy zobrazíme banner při načtení stránky
  if (cookieBanner) {
      cookieBanner.style.display = "block";
  } else {
      console.warn("Element #cookie-banner nenalezen.");
  }

  // Přidáme posluchač události na tlačítko
  if (acceptButton) {
      acceptButton.addEventListener("click", function() {
          console.log("Tlačítko Souhlasím bylo stisknuto.");

          // Skryjeme banner
          cookieBanner.style.display = "none";
      });
  } else {
      console.warn("Element #accept-cookies nenalezen.");
  }
});
