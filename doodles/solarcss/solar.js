
(function () {
    var w = window.document.body.clientWidth, 
	    h = window.document.body.clientHeight;
    var canvas = document.getElementsByTagName('canvas')[0];
    var stars = [], starNumber = 100;

    window.addEventListener('resize', function resize(event) {
        updateDimensions();
        randomizeStars();
        draw();
    });

    function updateDimensions() {
        //w = window.innerWidth;
        //h = window.innerHeight;
		w = window.document.body.clientWidth;
		h = window.document.body.clientHeight;
        canvas.width = w;
        canvas.height = h;
    }
	function getRandomStar(rangeW, rangeH){
		rangeW = (rangeW || w);
		rangeH = (rangeH || h);
		
		var newStar = {
			x: Math.floor(Math.random() * rangeW) - (rangeW / 2),
			y: Math.floor(Math.random() * rangeH) - (rangeH / 2),
			m: Math.floor(Math.random() * 3) + 1
		}
		newStar.slope = newStar.y / newStar.x;
		
		return newStar;
	}
    function randomizeStars(rangeW, rangeH) {
        for (var i = 0; i < starNumber; i++) {
            stars[i] = getRandomStar(rangeW, rangeH);
        }
    }
    function boundsValid(val, max) {
        return (val > -max) && (val <= max);
    }
    function draw(drawBackground) {

        var ctx = canvas.getContext("2d");
		var halfW = (w/2), halfH = (h/2);
        if (drawBackground) {
            ctx.fillStyle = "rgba(0,0,0,.25)";
            ctx.clearRect(0, 0, w, h);
        }

        ctx.fillStyle = '#ffffff';
        for (var i = 0; i < starNumber; i++) {
            if (!boundsValid(stars[i].x, halfW) || !boundsValid(stars[i].y, halfH))
				stars[i] = getRandomStar(halfW / 2, halfH / 2);
				
			ctx.fillRect(
				halfW + stars[i].x, 
				halfH + stars[i].y, 
				stars[i].m, 
				stars[i].m);
        }
    }

    updateDimensions();
    randomizeStars();
    draw();

    function moveStarsInWarp(speed, deltaDepth) {
        var currentStar;
        var increment; 
        for (var i = 0; i < starNumber; i++) {
            currentStar = stars[i];
			increment = Math.min(speed, Math.abs(speed / currentStar.slope));
			
			currentStar.x += (currentStar.x > 0) ? increment : -increment;
			currentStar.y = currentStar.slope * currentStar.x;
			
            currentStar.m += deltaDepth || 0;        
			//star.opacity += star.speed / 100;
        }
    }

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();
    function changeHidden(action) {
        var hides = document.querySelectorAll('.sun-wrapper, .planet')
        for (var i = 0; i < hides.length; i++) {
            hides[i].classList[action || "add"]('hidden');
        }

    }
	function afterWarp(){
	    document.querySelectorAll('.warp-warning')[0].classList.remove('on');
	    changeHidden("remove");
	}
    function warp() {
        var currentFrame = 0;
        var maxFrame = 200;
        document.querySelectorAll('.warp-warning')[0].classList.add('on');
        changeHidden();
        function warpFrame() {
            moveStarsInWarp(
                
                Math.max(currentFrame / 8, 1)
				//,1
                ,(currentFrame % 40 == 0)? 1: 0
            //    ,currentFrame + 1
            );

            draw(true);
            currentFrame++;

            if (currentFrame < maxFrame)
                requestAnimFrame(warpFrame);
			else
				afterWarp();
        }

        warpFrame();
    }

    var navs = document.querySelectorAll('.nav');
    for (var i = 0; i < navs.length; i++) {
        navs[i].addEventListener('click', function () {
            warp();
        });
    }
})();
(function () {
    var animated = document.querySelectorAll('.do-pause');
    var animating = true;
    for (var i = 0; i < animated.length; i++) {
        animated[i].addEventListener('mouseover', function () {
            setAnimationState(false);
            setZoom(this, true);
        });
        animated[i].addEventListener('mouseleave', function () {
            setAnimationState(true);
            setZoom(this, false);
        });
    }
    //for debugging
    window.toggleAll = function () {
        setAnimationState(!animating);
        for (var i = 0; i < animated.length; i++) {
            toggleZoom(animated[i]);
        }
    }
    function setZoom(ele, zoom) {
        if (ele.classList.contains('zoom-info')) {
            if (zoom)
                ele.classList.add('open');
            else
                ele.classList.remove('open');
        }
    }
    function toggleZoom(ele) {
        if (ele.classList.contains('zoom-info')){
            if (ele.classList.contains('open'))
                ele.classList.remove('open');
            else
                ele.classList.add('open');
        }
    }
    function setAnimationState(shouldRun) {
        for (var i = 0; i < animated.length; i++) {
            if (shouldRun) {
                animated[i].classList.remove('paused');
            } else {
                animated[i].classList.add('paused');
            }
        }
        animating = shouldRun;
    }
})();
