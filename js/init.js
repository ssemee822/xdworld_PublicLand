﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿var ENGINE_FILE_NAME = 'XDWorldEM';
var ENGINE_FILE_DIR = '';
var MAP_CONTAINER = null;
var MAP_LOAD_CALLBACK = null;
var Module = null;

// ysm_220708 2.0 엔진 로드
	Module = {
		locateFile : function(s) {
			return "//cdn.xdworld.kr/beta/"+ s;
		},
		postRun: function() {
			
			var httpPort = "";
			if(window.location.protocol != "https:") {
				httpPort = ":8080";
			}

			Module.XDESetDemUrlLayerName("https://openlab-3d.eseoul.go.kr", "dem_seoul_2022_50cm");	
			//Module.XDESetDemUrlLayerName("https://openlab-3d.eseoul.go.kr", "dem_2020_seoul_1m");	
			Module.XDESetSatUrlLayerName("https://openlab-3d.eseoul.go.kr", "image_seoul_2022_25cm");
			//Module.XDESetSatUrlLayerName("https://openlab-3d.eseoul.go.kr", "image_2020_seoul_25cm");
			var container = document.getElementById("MapContainer");
			Module.initialize({
				container : container
			});
			canvas.style.position = "";
			canvas.addEventListener("Fire_EventRotateCompass", function(e){
				var compassDiv = $("#geoCompass");
				if (typeof compassDiv != "undefined"){
					var str = "rotate("+(-e.dCameraHeadAngle)+"deg)";
					$("#geoCompass").css("transform",str);
				}
			});

			Module.getNavigation().setNaviVisible(false);
			
			$(".noScroll").mouseover(function() {
				Module.XDIsMouseOverDiv(true);
			})
			.mouseout(function() {
				Module.XDIsMouseOverDiv(false);
			});
			Module.canvas.addEventListener("mouseout",function() {
				Module.getControl().mouseLeftButtonDown = false;
				Module.getControl().mouseRightButtonDown = false;
			});
			// 키 입력 disabled sumin 201218
			var control = Module.getControl();
			control.setKeyRotMode(false);
			control.setKeyZoomMode(false);
			control.setKeyPanMode(false);
			
			// 피킹 방식 설정(컬러맵, 속도개선) sumin 201228
			//Module.getOption().setPickingCalculateType(true);
		
			// 텍스쳐 수신 용량 제한 해제
			Module.getOption().setTextureCapacityLimit(false);
			
			IDE.MAP.DEFAULT.init();
			
			Module.getViewCamera().look(new Module.JSVector3D(126.97790309220153, 37.5588697041225, 791.5603801952675), new Module.JSVector3D(126.97803660754558, 37.56679689768885, 28.95005114376545));
			
		}
	};

	;(function(){
		
		var currentScript = document.currentScript;
		var scriptSRC = currentScript.src;
		ENGINE_FILE_DIR = scriptSRC.substring(0, scriptSRC.lastIndexOf('/')) + "/";
		
		if (currentScript.attributes.container) {
			var containerID = currentScript.attributes.container.value;
			MAP_CONTAINER = document.getElementById(containerID);
		}
		
		if (currentScript.attributes.loadcallback) {
			var callbackFuncName = currentScript.attributes.loadcallback.value;
			if (typeof window[callbackFuncName] == 'function') {
				MAP_LOAD_CALLBACK = window[callbackFuncName];
			}
		}
			

		var script = document.createElement('script');
		script.src = "//cdn.xdworld.kr/beta/XDWorldEM.js";
		document.body.appendChild(script);
		
	})();

	window.onresize = function() {
		
		Module.Resize($("#MapContainer").width(), $("#MapContainer").height());
			
		Module.XDRenderData();
		
		$("#analysBtnDiv").css("height","");
		var height = $("#analysBtn-items").css("height");

		if(window.innerHeight < parseInt(height)){
			$("#analysBtnDiv").css("height",window.innerHeight - 200);
			$("#analysBtn-items .dropdown-menu").css("height",window.innerHeight - 200);
		}
		if(document.getElementById('analysBtnDiv') != null)
			new PerfectScrollbar(document.getElementById('analysBtnDiv'));
			
			$("#analysBtn-items .dropdown-menu").each(function(index,item){
				new PerfectScrollbar(item);
			});
		
	};
