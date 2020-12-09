(function(){
	var windows = [];
	function delayWrite(termSelector, delay, prepend) {
		var result;
		$(termSelector + "-script").children().each(function (index, child) {
			result = delay * index;
			setTimeout(function () {
				if (prepend)
					$(termSelector).prepend(child);
				else
					$(termSelector).append(child);
			}, result);
		});
		return result;
	}
	function initLink(){
		activateWindow($("#linkBack"));
	}
	function initDB() {
		activateWindow($("#dbFaceMatch"));
		db();
		setTimeout(initLink, 5000);
	}
	function db() {
		$.ajax({
			url: 'https://randomuser.me/api/',
			dataType: 'json',
			success: function (data) {
				if (data) {
					data = data.results[0];
					$("#dbFace").attr("src", data.picture.medium);
					$("#dbName").text(data.name.first + " " + data.name.last);
					$("#dbDOB").text(new Date(data.dob).toDateString());
					$("#dbPH").text(data.phone);
					$("#dbMd5").text(data.login.md5.substr(0, 31));
					$("#dbSha1").text(data.login.sha1.substr(0, 31));
					$("#dbSha256").text(data.login.sha256.substr(0,31));
				}
				setTimeout(db, 1000);
			}
		});
	}
	function initCctv(){
		activateWindow($("#cctv"));
		cctv();
		setTimeout(initDB, 9000);
		setTimeout(function () {
			activateWindow($("#satMap"));
		}, 4000);
	}
	var currentCctv = 1, cctvRuntimes = [1900, 6500, 6000, 8000, 8000, 8000];
	function cctv() {
		setTimeout(function () {
			currentCctv++;
			if (currentCctv > 8)
				currentCctv = 1;
			$("#cctvImg").attr("src", "400x300-" + currentCctv + ".gif");
			cctv();
		}, cctvRuntimes[currentCctv - 1]);
	}
	var dodBox = $("#dodUser"), dodNumber = $("#dodNumerator");
	function randAlpha(){
		return Math.random().toString(36).substr(2,1);
	}
	function randNumeric(){
		return Math.floor(Math.random() * 9);
	}
	var crackerCount = 1;
	function crack(){
		var newUser = "";
		for (var i = 0; i < 8; i++){
			newUser += randAlpha();
		}
		newUser += randNumeric() +""+ randNumeric();
		dodBox.text(newUser);
		dodNumber.text(crackerCount);
		crackerCount++;
	}
	function initCracker(){
		activateWindow($("#cracking"));
		crack();
		setInterval(crack, 1000);
		setTimeout(initCctv, 5000);
	}
	function initScrollSource() {
		activateWindow($("#scrollSource"));
		$.get("https://cdn.rawgit.com/torvalds/linux/master/net/ipv4/datagram.c").then(function (data) {
			$("#scrollSourceBody pre")[0].innerHTML = data;
			setTimeout(initCracker, 1000);
		});
	}
	function initXServer() {
		activateWindow($("#xt1"));
		$("#topBar").show().addClass("on");
		setTimeout(function () {
			setTimeout(initScrollSource, delayWrite("#x-term-1", 100));
		}, 750);
	}
	function bringToTop(element) {
		windows.push(element[0]);
		windows.splice(windows.indexOf(element[0]), 1);
		windows.push(element);
		for(var i = 0; i < windows.length; i++){
			windows[i].css({ 'z-index': i+1 });
		}
	}
	function activateWindow(element){
		element.show().addClass("on");
		bringToTop(element);
	}
	$(document).ready(function () {
		activateWindow($(".term-screen"));
		setTimeout(function () {
			$("#bottom-term").show();

			setTimeout(initXServer,
				delayWrite("#bottom-term", 100)
			);
		}, 400);

		/** click n drag **/
		var pinned = null, offsetX, offsetY;
		$(".title-bar").on('mousedown', function (event) {
			pinned = $(this).parent();
			bringToTop($(pinned));
			offsetX = event.offsetX;
			offsetY = event.offsetY;
		});
		$(document).on('mouseup', function () {
			pinned = null;
		});
		$(document).on('mousemove', function (event) {
			if (pinned)
				pinned.offset({ left: event.clientX - offsetX, top: event.clientY - offsetY });
		});
		/** end click n drag **/
	});
})();