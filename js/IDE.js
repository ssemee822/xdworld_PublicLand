// Auto update layout
(function() {
	// window.layoutHelpers.setAutoUpdate(true);
	
	
})();

var IDE = {
	itv:null,
	canvas:null,
	context:null,
	mapid:null,
	lastMapCount:null,
	init:function() {

		IDE.PRODUCT.init();
		IDE.MAPTOOL.init();	// sumin 201230
		IDE.PLACE.ps = null;
		
		IDE.LAYER.init();
		IDE.POPUP.init();//팝업창 관련 함수 초기화
		
		if(D_MEMBER.MID == 78){
			
			//성과테스트
			minx = 128.92826773771736;
			miny = 35.014539974534394;
			maxx = 129.23960804383287;
			maxy = 35.19904096970111;
			setTimeout(function(){
				Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(minx), parseFloat(miny)),new Module.JSVector2D(parseFloat(maxx), parseFloat(maxy)));
			},500)
		}
		// hanriver 로그인시 초기 위치 
		if(D_MEMBER.DLID == 12){
			setTimeout(function(){
				Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(127.2633380478723, 35.31258364253918), new Module.JSVector2D(127.42075602113817, 35.382295874551936));
			},1500)
		}
		
		// policyhouse 로그인시 브이월드 건물 off > 서울시 건물 on
		if(D_MEMBER.DLID == 13){
			setTimeout(function(){
				$("[name=def_vworld_layer][value=0]").prop("checked",false);
				$("[name=def_seoul_facilities][value=1]").prop("checked",true);
				dtcLayer.DEFAULT.VWORLD.hide(0);
				dtcLayer.DEFAULT.FACILITY.show(1);
			},3000)
		}

		// indonesia
		if(D_MEMBER.DLID == 14){
			dtcSetting.instance();
			setTimeout(function(){
				$("[name=dem_indonesia][value=0]").prop("checked",true).change();
			},100)
	
		}
		
		// 양평 - 미도
		if(D_MEMBER.MID == 710){
			dtcSetting.instance();
			setTimeout(function(){
				$("[name=bldg_add_building][value=0]").prop("checked",true).change();
				$("[name=dem_yp_mido][value=0]").prop("checked",true).change();
				$("[name=def_yp_mido][value=10]").prop("checked",true).change();
				$("[name=def_yp_add_mido][value=11]").prop("checked",true).change();
			},100)
		}
		// 제이시스 남양주
		if(D_MEMBER.MID == 908){
			dtcSetting.instance();
			setTimeout(function(){
				$("[name=bldg_add_building][value=3]").prop("checked",true).change();
				$("[name=bldg_add_building][value=4]").prop("checked",true).change();
				$("[name=dem_NYJ_SC]").prop("checked",true).change();
				$("[name=hybrid_img_NYJ_4cm]").prop("checked",true).change();
				$("[name=hybrid_img_SC_10cm]").prop("checked",true).change();
			},100)
		}
	},
	PRODUCT:{
		init:function() {
			// load User Model
			// analysisModuleListWrap
			IDE.UI.SIDE_PANEL.slideOn();			
		},
		GROUP:{
			callGroupPanel:function() {
				// 80
				
				var t_y = $("#analysisMenuPanelWrap").height()
				
				$("#memberProductGroupWrap").css("top", t_y+"px");
				$("#memberProductGroupWrap").css("display", "block");
			},
			setMemberProductGroup:function(mpgid) {
				console.log(mpgid);
			},
			closeGroupPanel:function() {
				$("#memberProductGroupWrap").css("display", "none");
			},
			getProductGroupItem:function(obj) {
				
				
				var formData = new FormData();
				formData.append("mpgid", obj.getAttribute("mpgid"));
				
				$.ajax({
					url:"./ide/getProductGroupItemList.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result) {

						var result=JSON.parse(result);
						// console.log(result);

						if(result.rs == "complete") {
							
							
						}
					}
				});
				
				
				return "";
			}
		}
	},
	PANEL:{
		isModalOpen:false,
		isOpen:false,
		callServicePanel:function() {
			if(IDE.PANEL.isOpen == false) {
				$("#ideServiceLinkIcon").removeClass("fa-caret-down");
				$("#ideServiceLinkIcon").addClass("fa-caret-up");
				
				$("#servicePanelWrap").css("display", "block");
				
				$("#ideServiceLink").addClass("ideServiceLinkActive");
				
				IDE.PANEL.isOpen = true;
			} else {
				IDE.PANEL.closeServicePanel();
			}
		},
		closeServicePanel:function() {
			$("#ideServiceLinkIcon").removeClass("fa-caret-up");
			$("#ideServiceLinkIcon").addClass("fa-caret-down");
			
			$("#servicePanelWrap").css("display", "none");
			
			$("#ideServiceLink").removeClass("ideServiceLinkActive");
			
			IDE.PANEL.isOpen = false;
		},
		callServicePanelModal:function(){
			
			if(!IDE.PANEL.isModalOpen){
				$.ajax({
					url:'./desk/store/storeInfoList.do',
					type:'POST',
					dataType:'json',
					success:function(result){
						
						var htmlList="";
						for(var j=0;j<result.productList.length;j++){
							htmlList +="<li class=\"list-group-item py-4\">";
							htmlList +="	<div class=\"media flex-wrap\">";
							htmlList +="		<div class=\"d-none d-sm-block ui-w-140\">";
							htmlList +="			<a href=\"javascript:void(0);\" class=\"d-block ui-rect-67 ui-bg-cover\" style=\"background-image: url('"+result.productList[j].thumb+"'); border:1px solid #A5A5A5;\"></a>";
							htmlList +="		</div>";
							htmlList +="		<div class=\"media-body ml-sm-4\">";
							htmlList +="			<h5 class=\"mb-2\">";
							htmlList +="				<div class=\"float-right font-weight-semibold ml-3\">";
							htmlList +="					<i class=\"fas fa-won-sign\"></i>"+result.productList[j].price;
							htmlList +="				</div>";
							htmlList +="				<a href=\"javascript:void(0);\" class=\"text-body\"><strong>"+result.productList[j].name+"</strong></a>&nbsp;"
							htmlList +="			</h5>";
							htmlList +="			<div class=\"d-flex flex-wrap align-items-center mb-2\">";
							htmlList +="				 <div class=\"text-muted small\">";
							htmlList +="					<i class=\"ion ion-md-time text-primary\"></i>";
							htmlList +="						<span>12h</span>";
							htmlList +="				 </div>";
							htmlList +="				 <div class=\"ui-stars ml-3\">";
							htmlList +="					<div class=\"ui-star filled\">";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
			                htmlList +="					</div>";        
			                htmlList +="					<div class=\"ui-star filled\">";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
			                htmlList +="					</div>";        
			                htmlList +="					<div class=\"ui-star filled\">";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
			                htmlList +="					</div>";        
			                htmlList +="					<div class=\"ui-star filled\">";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
			                htmlList +="					</div>";       
			                htmlList +="					<div class=\"ui-star half-filled\">";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
							htmlList +="						<i class=\"ion ion-md-star\"></i>";
			                htmlList +="					</div>";
			                htmlList +="				</div>";
			                htmlList +="				<a href=\"javascript:void(0)\" class=\"text-muted small\">55</a>";
			                htmlList +="			</div>";
			                htmlList +="			<div>"+result.productList[j].comment+"</div>";
			                htmlList +="			<div class=\"mt-2\" style=\"position:relative;\">";
			                htmlList +="				<span class=\"badge badge-outline-default text-muted font-weight-normal\">"+result.productList[j].cate_nm+"</span>";
			                htmlList +="				<div class=\"storeItemPayWrap\">";
			                htmlList +="					<a href=\"JavaScript:PRODUCT.buyProductModal('"+result.productList[j].pid+"');\" class=\"btn btn-primary btn-sm\">구매</a>";
			                htmlList +="				</div>";
			                htmlList +="			</div>";
			                htmlList +="		</div>";
			                htmlList +="	</div>";
			                htmlList +="</li>";
						}
						
						$("#storeProdctLists").append(htmlList);
						
						new PerfectScrollbar(document.getElementById('storeProdctLists'));
						
						$("#serviceModal").show();
					}
				});
				
				IDE.PANEL.isModalOpen=true;
				
			}else{
				$("#serviceModal").show();
			}
			
		},
		closeServicePanelModal:function(){
			$("#serviceModal").hide();
		}
	},
	FILE:{
		files:[],
		xhr:null,
		splitFileData:null,
		splitSampleData:null,
		executeUpload:function() {
			if(IDE.FILE.xhr != null) {
				IDE.FILE.xhr.abort();
			}
		},
		UTIL:{
			checkPreSetFile:function() {
				if(IDE.FILE.files[0].type == "application/vnd.ms-excel" || IDE.FILE.files[0].type == "text/csv") {
					
					//
					console.log(IDE.FILE.files[0]);
					
					var fileName = IDE.FILE.files[0].name;
					
					fArr = fileName.split(".");
					
					IDE.MAP.DATA.CSV.layerName = fArr[0];
					
					if(IDE.FILE.files[0].size > 0) {
						
						
						IDE.FILE.splitFileData = IDE.FILE.files[0].slice(0, 16384);
						
						var splitFileReader = new FileReader();
						
						splitFileReader.onload = (function(aFile) {
							
							return function(e) {
								//
								console.log(e);
								var result = e.target.result;
								var count=0;

								var pos = 0;
								var count = 0;
								var line = [];
								var output ="";

								
								// 11개의 라인만 뽑아냄
								while(pos >= 0) {
									if(count > 10) break;
									pos1 = pos;
									pos = e.target.result.indexOf("\n", ++pos);
									line[count] = e.target.result.slice(pos1, pos);
									output += line[count];
									// console.log(count, line[count]); // 라인출력
									count++;
								}
								
								if(line.length > 0) {
									// 
									IDE.FILE.splitSampleData = IDE.UTIL.CSVToArray(output);
									
									// CALL SAMPLE VIEWER POPUP
									console.log(IDE.FILE.splitSampleData);
									
									IDE.MAP.DATA.CSV.callSelectAddressColumn();
								}
							};
						})(IDE.FILE.splitFileData);
						
						
						splitFileReader.readAsText(IDE.FILE.splitFileData,"EUC-KR");

						/*
						 * if(IDE.FILE.files && typeof FileReader !==
						 * "undefined") { //extract FileList as File object
						 * for(var i=0; i < files.length; i++) {
						 * if(IDE.FILE.files[0].type ==
						 * "application/vnd.ms-excel" || IDE.FILE.files[0].type ==
						 * "text/csv") {
						 * 
						 * CXDMap.GLOBAL.fileRead(files[i]); // ADD MORE FILE
						 * EXT } } }
						 */
						
					}
					
				} else {
					
					IDE.FILE.executeUpload();
				}
			},
			checkExts:function() {
				// Check File Exts
				// console.log(IDE.FILE.files);
				
				var filesName = new Array();
				
				for(var i = 0; i < IDE.FILE.files.length; i++) {
					filesName.push(IDE.FILE.files[i].name);
				}
				
				var formData = new FormData();
				formData.append("control", "checkFileExtention");
				formData.append("filesName", filesName);
				
				$.ajax({
					url:"./data/checkFileExtention.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result){

						var result=JSON.parse(result);
						
						if(result.rs == "complete") {
							if(!result.isAble) {
								alert('지원하지 않는 데이터 포맷입니다.')
								return false;
							} else {
								IDE.FILE.UTIL.checkPreSetFile();
							}
						}
					}
				});
			}
		}
	},
	UI:{
		LAYER:{
			callLayerPanel:function() {
				$("#layerListWrap").css("display", "block");
			},
			closeLayerPanel:function() {
				$("#layerListWrap").css("display", "none");
			}
		},
		SIDE_PANEL:{
			isOn:true, // 분석 리스트 On|Off
			slideOff:function() {
				
				$("#analysisMenuPanelWrap").animate({
					left:"-100px"
				}, 400, function() {
					$("#analysisMenuPanelSlideOffWrap").css("display", "block");
					IDE.UI.SIDE_PANEL.isOn = false;
					
					IDE.MODULE.PROPERTY.movePosition();
				});
				
			},
			slideOn:function() {
				IDE.UI.SIDE_PANEL.isOn = true;
				
				IDE.MODULE.PROPERTY.movePosition();
				
				$("#analysisMenuPanelSlideOffWrap").css("display", "none");
				
				$("#analysisMenuPanelWrap").animate({
					left:"0px"
				}, 400, function() {
					
				});
			}
		},
		MODULE_PANEL:{
			slideDown:function() {
				$("#moduleInterfaceBaseWrap").css("display", "none");
				$("#moduleUISlideUpWrap").css("display", "block");
			},
			slideUp:function() {
				$("#moduleUISlideUpWrap").css("display", "none");
				$("#moduleInterfaceBaseWrap").css("display", "block");
			}
		}
	},
	MAP:{
		DEFAULT:{
			init:function() {
				var httpPort = "";

				if(window.location.protocol != "https:") {
					httpPort = ":8080";
				}
				IDE.MAP.DEFAULT.dtCreateLayer("hybrid_bound", "xdworld.vworld.kr"+httpPort, 0, false, false, false, 10, 0, 15);
				IDE.MAP.DEFAULT.dtCreateLayer("hybrid_road", "xdworld.vworld.kr"+httpPort, 0, false, false, false, 10, 0, 15);
				IDE.MAP.DEFAULT.dtCreateLayer("poi_bound", "xdworld.vworld.kr"+httpPort, 0, false, false, false, 10, 0, 15);
				IDE.MAP.DEFAULT.dtCreateLayer("poi_road", "xdworld.vworld.kr"+httpPort, 0, false, false, false, 10, 0, 15);
				/*Module.XDEMapCreateLayer("poi_base", "xdworld.vworld.kr"+httpPort, 0, false, true, false, 5, 0, 15);
				Module.XDEMapCreateLayer("poi_bound", "xdworld.vworld.kr"+httpPort, 0, false, true, false, 5, 0, 15);
				Module.XDEMapCreateLayer("poi_road", "xdworld.vworld.kr"+httpPort, 0, false, true, false, 5, 0, 15);*/
				IDE.MAP.DEFAULT.dtCreateLayer("facility_build", "xdworld.vworld.kr"+httpPort, 0, true, false, false, 9, 0, 15);
				IDE.MAP.DEFAULT.dtCreateLayer("facility_bridge", "xdworld.vworld.kr"+httpPort, 0, true, true, false, 9, 0, 15);
				IDE.MAP.DEFAULT.dtCreateLayer("bldg_3ds_korea_lv15_xnd", "3dmap.egiscloud.com", 0, true, true, false, 29, 0, 15);
				

				Module.setVisibleRange('facility_build',parseFloat(2.0),10000);
				Module.setVisibleRange('bldg_3ds_korea_lv15_xnd',parseFloat(2.0),10000);

			},
			dtCreateLayer:function(name, url, port, selectable, visible, userLayer, type, minLevel, maxLevel){
				var servername = "XDServer";
				if(url.indexOf("vworld.kr") > -1) servername = "XDServer3d";
				var layer = Module.getTileLayerList().createXDServerLayer({
					url : url,
					servername : servername,
					name : name,
					type : type,
					minLevel : minLevel,
					maxLevel : maxLevel,
					selectable : selectable,
					visible : visible,
				});
			},
			VWORLD:{
				vworldLayers:["facility_build", "facility_bridge"],
				show:function(v) {
					var layerList = new Module.JSLayerList(false);
					layerList.nameAtLayer(IDE.MAP.DEFAULT.VWORLD.vworldLayers[v]).setVisible(true);
				},
				hide:function(v) {
					var layerList = new Module.JSLayerList(false);
					layerList.nameAtLayer(IDE.MAP.DEFAULT.VWORLD.vworldLayers[v]).setVisible(false);
				}
			},
			FACILITY:{
				defFacilities:["facility_buildseoul", "tile_build_seoul", "facility_bridgehi", "facility_bridgelow", "facility_palaces"], 
				// defFacilities:["tile_build_seoul", "facility_bridgehi",
				// "facility_bridgelow", "facility_palaces"],
				show:function(f) {
					console.log(e);
					var layerList = new Module.JSLayerList(false);
					layerList.nameAtLayer(IDE.MAP.DEFAULT.FACILITY.defFacilities[f]).setVisible(true);

				},
				hide:function(f) {
					var layerList = new Module.JSLayerList(false);
					layerList.nameAtLayer(IDE.MAP.DEFAULT.FACILITY.defFacilities[f]).setVisible(false);
				}
			},
			IMAGE:{
				defImages:["hybrid_seoul25cm", "hybrid_seoul08", "car", "najusandan"],
				show:function(l) {
					var layerList = new Module.JSLayerList(false);
					layerList.nameAtLayer(IDE.MAP.DEFAULT.IMAGE.defImages[l]).setVisible(true);
				},
				hide:function(l) {
					var layerList = new Module.JSLayerList(false);
					layerList.nameAtLayer(IDE.MAP.DEFAULT.IMAGE.defImages[l]).setVisible(false);
				}
			},
			THEMATIC:{

			}
		},
		DATA:{
			CSV:{
				titleIdx:null,
				isTwoColumn:"N",
				lonIdx:null,
				latIdx:null,
				addressIdx:null,
				is3DPOI:"N",
				layerName:"",
				boardColumns:[],
				reset:function() {
					IDE.MAP.DATA.CSV.addressIdx = null;
					IDE.MAP.DATA.CSV.titleIdx = null;
					IDE.MAP.DATA.CSV.isTwoColumn = "N";
					IDE.MAP.DATA.CSV.lonIdx = null;
					IDE.MAP.DATA.CSV.latIdx = null;
					IDE.MAP.DATA.CSV.is3DPOI = "N";
					IDE.MAP.DATA.CSV.layerName = "";
					IDE.MAP.DATA.CSV.boardColumns = [];
					
					$("#analysisCSVModalBody").html("");
					
					$("#analysisCSV3DPOIStyleBody").css("display", "none");
					$("#analysisCSVModal3DPOICheckWrap").css("display", "none");
					$("#analysisCSVModalTwoColumnWrap").css("display", "none");
					
					$("#analysisCSVTwoColumn").prop("checked", false);
					
					$("#btnAnalysisCSVSetupComplete").css("display", "none");
					$("#btnAnalysisCSVSetupComplete").prop("disabled", true);
					
					$("#analy3DPOIVerticalTbl").empty();
					$("#analy3DPOIHorizontalTbl").empty();
					
					$("#analysisCSVModal").modal("hide");
				},
				callSampleDataSelectTitle:function() {
					$("#analysisCSVModal3DPOICheckWrap").css("display", "block");
					
					$("#analysisCSVModalTwoColumnWrap").css("display", "none");
					
					
					$("#btnAnalysisCSVSetupDisplay").css("display", "none");
					$("#btnAnalysisCSVSetupComplete").css("display", "");
					
					$("#analysisCSVModalTitle").html("장소표시 또는 POI 위치를 표하실 열 선택");
					$("#analysisCSVModalComment").html("지도에 표시되는 <span style=\"color:#FFAA2A;\">제목 마커</span> 항목에 사용될 열을 선택 하세요.");
					
					var html = "";
					html += "<div class=\"custom-controls-stacked\">\n";

					for(var i = 0; i < IDE.FILE.splitSampleData[0].length; i++) {
						var checked = "";
						
						
						// if(i == 0) checked = " checked";
						
						// <button type="button" class="btn btn-default"
						// data-toggle="popover" data-trigger="focus"
						// data-placement="right" data-content="Vivamus sagittis
						// lacus vel augue laoreet rutrum faucibus." title=""
						// data-original-title="Popover title"
						// aria-describedby="popover40307">Popover on
						// right</button>
						
						var infoHtml = "<button type=\"button\" class=\"btn icon-btn btn-xs btn-outline-secondary\" data-toggle=\"popover\" data-trigger=\"hover\" data-placement=\"right\" data-content=\""+IDE.MAP.DATA.CSV.getSampleData(i)+"\" data-original-title=\""+IDE.FILE.splitSampleData[0][i]+"\" aria-describedby=\"popover40307"+i+"\" data-html=\"true\">\n";
						infoHtml += "\t<span class=\"oi oi-info\"></span>\n";
						infoHtml += "</button>";
						
						html += "<label class=\"custom-control custom-radio\">\n";
						html += "\t<input name=\"csvTitleField\" type=\"radio\" value=\""+i+"\" class=\"custom-control-input\""+checked+">\n";
						html += "\t<span class=\"custom-control-label\">"+IDE.FILE.splitSampleData[0][i]+"</span> "+infoHtml+"\n";
						html += "</label>\n";
					}
					 
					html += "</div>\n";
					
					$("#analysisCSVModalBody").html(html);
					
					$('[data-toggle="popover"]').popover();
					
					
					$("input[type=radio][name=csvTitleField]").change(function(e) {
						if($(this).val()) {
							IDE.MAP.DATA.CSV.titleIdx = $(this).val();
							$("#btnAnalysisCSVNext").prop("disabled", false);
						}
					});
				},
				callSelectAddressColumn:function() {
					
					// $("#btnAnalysisCSVNext").prop("disabled", true);
					$("#btnAnalysisCSVNext").css("display", "none");
					$("#btnAnalysisCSVSetupDisplay").css("display", "");
					
					$("#analysisCSVModalTitle").html("주소 항목이나 좌표항으로 사용할 열 선택");
					$("#analysisCSVModalComment").html("파일에서 주소 또는 <span style=\"color:#FFAA2A;\">위도, 경도</span> 쌍과 같이 지도에서 장소표시 마커의 위치표시를 위하여 사용할 열을 선택하세요.");
					
					$("#analysisCSVModalTwoColumnWrap").css("display", "block");
					
					// IDE.MAP.DATA.CSV.layerName
					
					$("#analyCSVDataName").val(IDE.MAP.DATA.CSV.layerName);
					
					var html = "";
					html += "<div class=\"custom-controls-stacked\">\n";

					for(var i = 0; i < IDE.FILE.splitSampleData[0].length; i++) {
						var checked = "";
						
						
						// if(i == 0) checked = " checked";
						
						// <button type="button" class="btn btn-default"
						// data-toggle="popover" data-trigger="focus"
						// data-placement="right" data-content="Vivamus sagittis
						// lacus vel augue laoreet rutrum faucibus." title=""
						// data-original-title="Popover title"
						// aria-describedby="popover40307">Popover on
						// right</button>
						
						var infoHtml = "<button type=\"button\" class=\"btn icon-btn btn-xs btn-outline-secondary\" data-toggle=\"popover\" data-trigger=\"hover\" data-placement=\"right\" data-content=\""+IDE.MAP.DATA.CSV.getSampleData(i)+"\" data-original-title=\""+IDE.FILE.splitSampleData[0][i]+"\" aria-describedby=\"popover40307"+i+"\" data-html=\"true\">\n";
						infoHtml += "\t<span class=\"oi oi-info\"></span>\n";
						infoHtml += "</button>";
						
						// console.log(IDE.MAP.DATA.CSV.getSampleData(i));
						
						// IDE.MAP.DATA.CSV.getSampleData(i);
						
						html += "<label class=\"custom-control custom-radio\">\n";
						html += "\t<input name=\"csvAddressField\" type=\"radio\" value=\""+i+"\" class=\"custom-control-input\""+checked+">\n";
						html += "\t<span class=\"custom-control-label p-t-5\">"+IDE.FILE.splitSampleData[0][i]+"</span> "+infoHtml+"\n";
						html += "</label>\n";
					}
					 
					html += "</div>\n";
					
					$("#analysisCSVModalBody").html(html);
					
					$("input[type=radio][name=csvAddressField]").change(function(e) {
						if($(this).val()) {
							if(IDE.MAP.DATA.CSV.isTwoColumn == "N") {
								IDE.MAP.DATA.CSV.addressIdx = $(this).val();
								$("#btnAnalysisCSVSetupDisplay").prop("disabled", false);
							}
						}
					});
					
					$('[data-toggle="popover"]').popover();
					
					$("#analysisCSVModal").modal("show");
					
				},
				getSampleData:function(idx) {
					// IDE.FILE.splitSampleData
					
					var html = "";
					
					for(var i = 1; i <= 10; i++) {
						var comma = "<br/>";
						
						if(i == 10) comma = "";
						html += IDE.FILE.splitSampleData[i][idx]+comma;
					}
					
					return html;
				},
				checkedSampleDataTwoColumn:function() {
					var html = "";
					html += "<div class=\"custom-controls-stacked\">\n";
					
					for(var i = 0; i < IDE.FILE.splitSampleData[0].length; i++) {
						
						var isFloat = 0;
						var radioLatLon = "";
						
						for(var j = 1; j < IDE.FILE.splitSampleData.length; j++) {
							
							if(IDE.UTIL.isFloat(IDE.FILE.splitSampleData[j][i])) {
								isFloat = 1;
								
								radioLatLon = " <span style=\"display:inline-block;\" id=\optIsLatLon_"+i+"\">\r";
								radioLatLon += "	<div class=\"radio\" style=\"display:inline-block !important;  margin:0 !important;\">\r";
								radioLatLon += "	<label>\r";
								radioLatLon += "		<input type=\"radio\" name=\"isLonLat\" value=\"lon\" idx=\""+i+"\" id=\"isLonLat_lon_"+i+"\">\r";
								radioLatLon += "		경도(LON)\r";
								radioLatLon += "	</label>\r";
								radioLatLon += "	</div>\r";
								radioLatLon += "	<div class=\"radio\" style=\"display:inline-block !important; margin:0 !important;\">\r";
								radioLatLon += "	<label>\r";
								radioLatLon += "		<input type=\"radio\" name=\"isLonLat\" value=\"lat\" idx=\""+i+"\" id=\"isLonLat_lat_"+i+"\">\r";
								radioLatLon += "		위도(LAT)\r";
								radioLatLon += "	</label>\r";
								radioLatLon += "	</div>\r";
								radioLatLon += "</span>\r";
							}
						}
						
						var infoHtml = "<button type=\"button\" class=\"m-t-3 btn icon-btn btn-xs btn-outline-secondary\" data-toggle=\"popover\" data-trigger=\"hover\" data-placement=\"right\" data-content=\""+IDE.MAP.DATA.CSV.getSampleData(i)+"\" data-original-title=\""+IDE.FILE.splitSampleData[0][i]+"\" aria-describedby=\"popover40307"+i+"\" data-html=\"true\">\n";
						infoHtml += "\t<span class=\"oi oi-info\"></span>\n";
						infoHtml += "</button>";
						
						var isDisabled = "";
						var checked = "";
						
						if(isFloat != 1) {
							isDisabled = " disabled";
						} else {
							checked = " checked";
						}
						
						html += "<label class=\"custom-control custom-checkbox m-0\">\n";
	                    html += "\t<input type=\"checkbox\" class=\"custom-control-input\" name=\"csvAddressField\" value=\""+i+"\""+isDisabled+""+checked+">\n";
	                    html += "\t\t<span class=\"custom-control-label\">"+IDE.FILE.splitSampleData[0][i]+"</span> "+infoHtml+""+radioLatLon+"\n";
	                    html += "</label>\n";
					}
					
					html += "</div>\n";
					
					$("#analysisCSVModalBody").html(html);
					
					$("input[type=radio][name=isLonLat").change(function(e) {
						if($(this).val() == "lon") {
							IDE.MAP.DATA.CSV.lonIdx = $(this).attr("idx");
							
						} else if($(this).val() == "lat") {
							IDE.MAP.DATA.CSV.latIdx = $(this).attr("idx");
						}
						
						if(IDE.MAP.DATA.CSV.isTwoColumn == "Y" && IDE.MAP.DATA.CSV.lonIdx != null && IDE.MAP.DATA.CSV.latIdx != null) {
							$("#btnAnalysisCSVSetupDisplay").prop("disabled", false);
						}
					});
					
					$('[data-toggle="popover"]').popover();
				},
				call3DPOISetting:function() {
					$("#analysisCSVModalTitle").html("지도에 표시될 3D POI 스타일 설정");
					$("#analysisCSVModalComment").html("지도에 표시되는 3D POI 에 표시될 항목과 스타일을 설정하세요.");
					
					$("#analysisCSV3DPOIStyleBody").css("display", "");
					
					$("#analysisCSVModalBody").html("");
					
					var html = "";
					html += "<div class=\"custom-controls-stacked\">\n";

					for(var i = 0; i < IDE.FILE.splitSampleData[0].length; i++) {
						
						var infoHtml = "<button type=\"button\" class=\"btn icon-btn btn-xs btn-outline-secondary\" data-toggle=\"popover\" data-trigger=\"hover\" data-placement=\"right\" data-content=\""+IDE.MAP.DATA.CSV.getSampleData(i)+"\" data-original-title=\""+IDE.FILE.splitSampleData[0][i]+"\" aria-describedby=\"popover40307"+i+"\" data-html=\"true\">\n";
						infoHtml += "\t<span class=\"oi oi-info\"></span>\n";
						infoHtml += "</button>";
						
						html += "<label class=\"custom-control custom-checkbox\">\n";
						html += "\t<input name=\"csv3DPOIColumn\" type=\"checkbox\" value=\""+i+"\" class=\"custom-control-input\">\n";
						html += "\t<span class=\"custom-control-label p-t-5\">"+IDE.FILE.splitSampleData[0][i]+"</span> "+infoHtml+"\n";
						html += "</label>\n";
					}
					 
					html += "</div>\n";
					
					$("#analysisCSVModalBody").html(html);
					
					// analy3DPOIVerticalUL
					
					$("input[name=csv3DPOIColumn]:checkbox").change(function(e) {
						var idx = parseInt(e.target.value);
						
						if(this.checked) {
							// IDE.FILE.splitSampleData[0][i]
							/*
							 * <tr> <th class="POI3DHead">어린이집명</th> <td>여의도어린이집</td>
							 * </tr>
							 */
							// analy3DPOIVerticalTbl
							// analy3DPOIHorizontalTbl
							
							// IDE.MAP.DATA.CSV.boardColumns
							
							var isDup = false;
							
							
							for(var i = 0; i < IDE.MAP.DATA.CSV.boardColumns.legnth; i++) {
								if(IDE.MAP.DATA.CSV.boardColumns[i] == idx) {
									isDup = true;
								}
							}
							
							if(!isDup) {
								var htmlV = "";
								htmlV += "<tr id=\"csv3DColumnVertical_"+e.target.value+"\">\n";
								htmlV += "\t<th class=\"POI3DHead pd-5\">"+IDE.FILE.splitSampleData[0][idx]+"</th>\n";
								htmlV += "\t<td class=\"pd-5\">"+IDE.FILE.splitSampleData[1][idx]+"</td>\n";
								htmlV += "</tr>\n";
								
								var htmlH = "";
								htmlH += "<tr id=\"csv3DColumnHorizontal_"+e.target.value+"\">\n";
								htmlH += "\t<th class=\"POI3DHead pd-5\">"+IDE.FILE.splitSampleData[0][idx]+"</th>\n";
								htmlH += "\t<td class=\"pd-5\">"+IDE.FILE.splitSampleData[1][idx]+"</td>\n";
								htmlH += "</tr>\n";
								
								$("#analy3DPOIVerticalTbl").append(htmlV);
								$("#analy3DPOIHorizontalTbl").append(htmlH);
								
								IDE.MAP.DATA.CSV.boardColumns.push(idx);
							}
							
						} else {
							$("#csv3DColumnVertical_"+idx).remove();
							$("#csv3DColumnHorizontal_"+idx).remove();
							
							IDE.MAP.DATA.CSV.boardColumns.remove(idx);
						}
					});
					
					$('[data-toggle="popover"]').popover();
				},
				checkComplete:function() {
					var isComplete = true;
					
					/*
					 * titleIdx:null, isTwoColumn:"N", lonIdx:null, latIdx:null,
					 * addressIdx:null, is3DPOI:"N", layerName:"",
					 * boardColumns:[],
					 */
					
					if(IDE.MAP.DATA.CSV.isTwoColumn == "N") {
						
						if(IDE.MAP.DATA.CSV.addressIdx == null) return false;
						if($("#analyCSVDataName").val() == "") return false;
						
						if(IDE.MAP.DATA.CSV.is3DPOI == "Y") {
							if(IDE.MAP.DATA.CSV.boardColumns.length == 0) return false;
						} else {
							if(IDE.MAP.DATA.CSV.titleIdx == null) return false;
						}
						
					} else if(IDE.MAP.DATA.CSV.isTwoColumn == "Y") {
						if(IDE.MAP.DATA.CSV.lonIdx == null) return false;
						if(IDE.MAP.DATA.CSV.latIdx == null) return false;
						if($("#analyCSVDataName").val() == "") return false;
						
						if(IDE.MAP.DATA.CSV.is3DPOI == "Y") {
							if(IDE.MAP.DATA.CSV.boardColumns.length == 0) return false;
						} else {
							if(IDE.MAP.DATA.CSV.titleIdx == null) return false;
						}
						
					}
					
					return isComplete;
				}
			}
		}
	},
	BASEMAP:{
		callBaseMapList:function() {
			$("#baseMapListWrap").css("display", "block");
		},
		closeBaseMapList:function() {
			$("#baseMapListWrap").css("display", "none");
		}
	},
	LAYER:{
		
	},
	USER:{
		
	},
	MAPTOOL:{
		
		humanModeTarget : null,
		humanModeModel : null,
		humanModeInterval : false,
		MOUSE_BUTTON_PRESS : false,
		KEY_PRESS_w : false,
		KEY_PRESS_a : false,
		KEY_PRESS_s : false,
		KEY_PRESS_d : false,
		
		isMarkerReady : false,
		isDrawingReady : false,
		
		activeType : 0,
		measureLayer : null,
		
		/* 툴바 기능 초기화 */
		init : function() {
			
			$.getScript("//egiscloud.com/assets/js/toolbar_marker.js", function() {
				IDE.MAPTOOL.isMarkerReady = true;
			});
			
			$.getScript("//egiscloud.com/assets/js/toolbar_drawing.js", function() {
				IDE.MAPTOOL.isDrawingReady = true;
			});
		},
		setNorth:function(){ //국립공원 요청사항 추후 삭제해야할듯?
			//정북방향
			var camera = Module.getViewCamera();
			camera.setDirect(0);

			//LOG_TRACKER.write("63", "1", "툴바 정북방향 사용");
		},
		currentLocation:function(){
			if ("geolocation" in navigator) {
			    navigator.geolocation.getCurrentPosition(function(info){
					Module.getViewCamera().setViewAt(info.coords.longitude, info.coords.latitude, 2000, 90, 0);
				}, function(info){
					if(info.code == 1){
						//User denied Geolocation
			   			COMMON.alert("위치 정보를<br>사용할 수 없습니다.","error",function(){return false;});
					}
				}, function(info){
				    console.log(info);
				});
			} else {
			    COMMON.alert("현재 브라우저에서는<br>사용할 수 없습니다.","error",function(){return false;});
			}
		},
		getNationalPoint:function() {
			
			
			if($("#nationalPointBtn").hasClass('btn-dark')){
				$("#nationalPointCloseBtn").click();
				return false;
			}
			
			$("#nationalPointLon").text("");
			$("#nationalPointLat").text("");
			$("#nationalPointNum").text("");
			
			$("#nationalPointBtn").removeClass('btn-outline-dark-menu');
			$("#nationalPointBtn").addClass('btn-dark');
			
           	$("#nationalPointPanel").show();

			var canvas = document.getElementById('canvas');
			canvas.addEventListener('click',IDE.MAPTOOL.nationalPointEvent);

			//LOG_TRACKER.write("62", "1", "툴바 국가지점번호 사용");
		},
		areaTransparency:function() {
			
			if($("#areaTransparencyBtn").hasClass('btn-dark')){
				$("#areaTransparencyCloseBtn").click();
				return false;
			}

			$("#areaTransparencyBtn").removeClass('btn-outline-dark-menu');
			$("#areaTransparencyBtn").addClass('btn-dark');
			
			$("#areaTransparencyPanel").show();

			////LOG_TRACKER.write("62", "1", "툴바 국가지점번호 사용");
		},
		buildingOnOff:function() {
			
			if($("#buildingOnOffBtn").hasClass('btn-dark')){
				
				$("#buildingOnOffBtn").addClass('btn-outline-dark-menu');
				$("#buildingOnOffBtn").removeClass('btn-dark');
				dtcLayer.DEFAULT.VWORLD.hide(0);
				
				return false;
			}
			
			dtcLayer.DEFAULT.VWORLD.show(0);
			$("#buildingOnOffBtn").removeClass('btn-outline-dark-menu');
			$("#buildingOnOffBtn").addClass('btn-dark');
			
		},
		goHome:function() {
			Module.getViewCamera().setViewAt(127, 38, 6378137*3, 90, 0);
			Module.XDRenderData();

			//LOG_TRACKER.write("60", "1", "툴바 위치초기화 사용");
		},
		resetMouse:function() {
			if(dtcApps.front == 4){
				//건물편집
				M_EDITBUILDING.setMouseState("none");
				M_EDITBUILDING.closeTooltip("editBuildingSetArea");
				M_EDITBUILDING.closeTooltip("editBuildingDelArea");
				Module.XDSetMouseState(6);
			}else if(dtcApps.front == 12){
				//경사분석
				M_SLOPE.resetArea();
			}else{
				Module.XDSetMouseState(1);
			}

			//LOG_TRACKER.write("60", "1", "툴바 선택초기화 사용");
		},
		resetAll:function(){
			var appList = IDE.MODULE.execs;
			if(appList.length > 0){
				COMMON.confirm("모든 앱을 종료하시겠습니까?","","info",function(){
					while(appList.length > 0) {
						IDE.MODULE.closeModule(appList[0]);
					}
            	},function(){
            		return false;
            	});
			}else{
				COMMON.alert("실행중인 앱이 없습니다.","error",function(){return false;});
			}

			//LOG_TRACKER.write("64", "1", "툴바 모든앱종료 사용");
		},
		load : function(_src) {
			
			var script = document.createElement("script");
			script.src = _src;
			script.onload = function(){
				if (typeof _onload != "undefined") {
					_onload();
				}
			}
			_parentNode.appendChild(script);
		},
		
		execute : function(_type) {
			
			if (_type == 5 || _type == 7 || _type == 8) {
			
				this.on(_type);
				return;
			
			} else {
				// 스위칭 방식으로 동작하는 기능들
				if (_type == this.activeType) {
					
					this.off(_type);
					return;
				} else {
					this.off(this.activeType);
					this.on(_type);
				}
				
			}
		},
		
		on : function(_type) {
			
			switch(_type) {
			
			case 1 :	// 거리 측정
				if (!this.isMarkerReady) {
					return;
				}
				Module.XDSetMouseState(Module.MML_ANALYS_DISTANCE);
				this.activeType = _type;
			
				$("#distMeaBtn").removeClass('btn-outline-dark-menu');
				$("#distMeaBtn").addClass('btn-dark');

				//LOG_TRACKER.write("65", "1", "툴바 거리측정 사용");
				
				break;
			case 2 :	// 면적 측정
				if (!this.isMarkerReady) {
					return;
				}
				Module.XDSetMouseState(Module.MML_ANALYS_AREA);
				this.activeType = _type;
				$("#areaMeaBtn").removeClass('btn-outline-dark-menu');
				$("#areaMeaBtn").addClass('btn-dark');

				//LOG_TRACKER.write("66", "1", "툴바 면적측정 사용");

				break;
			case 3 :	// 고도 측정
				if (!this.isMarkerReady) {
					return;
				}
				Module.XDSetMouseState(Module.MML_ANALYS_ALTITUDE);
				this.activeType = _type;
				
				$("#heightMeaBtn").removeClass('btn-outline-dark-menu');
				$("#heightMeaBtn").addClass('btn-dark');

				//LOG_TRACKER.write("67", "1", "툴바 고도측정 사용");
				
				break;
			case 4 :	// 가시권 분석 (2D)
				Module.XDSetMouseState(Module.MML_ANALYS_VIEWSHED);
				this.activeType = 4;
				
				$("#viewShedPanel").show();

				$("#viewshed3dBtn").removeClass('btn-outline-dark-menu');
				$("#viewshed3dBtn").addClass('btn-dark');

				//LOG_TRACKER.write("70", "1", "툴바 가시권 분석2D 사용");

				break;
			case 5 :	// 화면 캡쳐
				this.saveScreenShot();

				//LOG_TRACKER.write("71", "1", "툴바 스크린샷 사용");

				break;
			case 6 :	// 펜 그리기
				if (!this.isDrawingReady) {
					return;
				}
				toolbar_drawing.open(Module.canvas);
				this.activeType = 6;
				
				$("#memoToobarBtn").removeClass('btn-outline-dark-menu');
				$("#memoToobarBtn").addClass('btn-dark');

				//LOG_TRACKER.write("72", "1", "툴바 메모 사용");
				
				break;
			case 7 :	// 공유하기
				break;
			case 8 :	// 마우스 컨트롤 초기화
				Module.XDSetMouseState(1);

				break;
			case 9 :	// 경관분석
				this.activeType = _type;
				Module.XDSetViewPoint(!0);
				
				$("#heightFixBtn").removeClass('btn-outline-dark-menu');
				$("#heightFixBtn").addClass('btn-dark');

				//LOG_TRACKER.write("68", "1", "툴바 경관 분석 사용");
				
				break;
			case 10 :	// 가시권분석 (3D)
				this.activeType = _type;
				Module.getAnalysis().setViewshedMode(true);

				$("#viewshed3dBtn").removeClass('btn-outline-dark-menu');
				$("#viewshed3dBtn").addClass('btn-dark');

				//LOG_TRACKER.write("70", "1", "툴바 가시권 분석3D 사용");
				break;
			case 11 :	// 휴먼모드
				if($("#keyModeImg").css("display") != "none"){
					//키보드 이동 모드 켜져있을때
					COMMON.alert('키보드 이동을 사용 중일 경우\n휴먼모드를 켤 수 없습니다.','warning',function(){
						return false;
	                });
					return false;
				}

				//LOG_TRACKER.write("69", "1", "툴바 휴먼 모드 사용");

				this.activeType = _type;
				IDE.MAPTOOL.humanModeCameraMove(function(){
					if(IDE.MAPTOOL.humanModeModel == null){
						Module.getGhostSymbolMap().insert({
		
				            id : "human",
				            url : "/siteData/humanMode/human.3ds",
				            callback : function(e) {
				    			var loc = Module.getViewCamera().getLocation();
				                IDE.MAPTOOL.humanModeModel = Module.createGhostSymbol("human");
								IDE.MAPTOOL.humanModeModel.lightColor = new Module.JSColor(128, 128, 128, 128);
				
				                // base point 설정
				                IDE.MAPTOOL.humanModeModel.setBasePoint(0.0, IDE.MAPTOOL.humanModeModel.getHeight(), 0.0);
				                IDE.MAPTOOL.humanModeModel.setScale(new Module.JSSize3D(0.7, 0.7, 0.7));
				                IDE.MAPTOOL.humanModeModel.setGhostSymbol("human");
				                IDE.MAPTOOL.humanModeModel.setPosition(new Module.JSVector3D(loc.Longitude, loc.Latitude, loc.Altitude));	
				
				                var traceTarget = Module.createTraceTarget(IDE.MAPTOOL.humanModeModel.getId());
				                traceTarget.set({
				                    object : IDE.MAPTOOL.humanModeModel,
				                    tilt : 5.0,
				                    direction : 0.0,
				                    distance : 25.0
				                });
				
				                IDE.MAPTOOL.humanModeTarget = traceTarget;
				
				                var camera = Module.getViewCamera();
				                camera.setTraceTarget(IDE.MAPTOOL.humanModeTarget);
				                camera.setTraceActive(true);
				                camera.setLimitTilt(-88.0);
				            }
				        });

					}else{
		    			var loc = Module.getViewCamera().getLocation();
						IDE.MAPTOOL.humanModeModel.setVisible(true);
						// base point 설정
						IDE.MAPTOOL.humanModeModel.setBasePoint(0.0, IDE.MAPTOOL.humanModeModel.getHeight(), 0.0);
						IDE.MAPTOOL.humanModeModel.setScale(new Module.JSSize3D(0.7, 0.7, 0.7));
						IDE.MAPTOOL.humanModeModel.setGhostSymbol("human");
						IDE.MAPTOOL.humanModeModel.setPosition(new Module.JSVector3D(loc.Longitude, loc.Latitude, loc.Altitude));	
						
						var traceTarget = Module.createTraceTarget(IDE.MAPTOOL.humanModeModel.getId());
						traceTarget.set({
							object : IDE.MAPTOOL.humanModeModel,
							tilt : 5.0,
							direction : 0.0,
							distance : 25.0
						});
						
						IDE.MAPTOOL.humanModeTarget = traceTarget;
						
						var camera = Module.getViewCamera();
						camera.setTraceTarget(IDE.MAPTOOL.humanModeTarget);
						camera.setTraceActive(true);
						camera.setLimitTilt(-88.0);
					}
					
					window.addEventListener('keydown', IDE.MAPTOOL.humanModeKeydown);
					window.addEventListener('keyup', IDE.MAPTOOL.humanModeKeyup);
					Module.canvas.addEventListener('mousedown', IDE.MAPTOOL.humanModeMousedown);
					Module.canvas.addEventListener('mouseup', IDE.MAPTOOL.humanModeMouseup);
					Module.canvas.addEventListener('mousemove', IDE.MAPTOOL.humanModeMousemove);
					Module.canvas.addEventListener('wheel',IDE. MAPTOOL.humanModeWheel);
					IDE.MAPTOOL.humanModeInterval = setInterval(IDE.MAPTOOL.renewObjectMoving, 50);
	
					$("#humanBtn").removeClass('btn-outline-dark-menu');
					$("#humanBtn").addClass('btn-dark');
					$("#humanModeImg").show();
				});
			
				
				break;
			default :
				return;
			}
		},
		
		off : function(_type) {
			
			switch(_type) {
			
			case 1 :	// 거리 측정
				$("#distMeaBtn").addClass('btn-outline-dark-menu');
				$("#distMeaBtn").removeClass('btn-dark');
				
			case 2 :	// 면적 측정
				$("#areaMeaBtn").addClass('btn-outline-dark-menu');
				$("#areaMeaBtn").removeClass('btn-dark');
			case 3 :	// 고도 측정
				toolbar_marker.clear();
				$("#heightMeaBtn").addClass('btn-outline-dark-menu');
				$("#heightMeaBtn").removeClass('btn-dark');
				break;
			case 4 :	// 가시권 분석
				$('input:radio[name="view_shed_mode"]:input[value="T"]').prop('checked',true);
				Module.getAnalysis().clearViewshed();
				Module.XDSetMouseState(Module.MML_MOVE_GRAB);
				
				$("#viewShedPanel").hide();
				
				$("#viewshed3dBtn").addClass('btn-outline-dark-menu');
				$("#viewshed3dBtn").removeClass('btn-dark');				
				break;
			case 6 :	// 펜 그리기
				toolbar_drawing.close();
				
				$("#memoToobarBtn").addClass('btn-outline-dark-menu');
				$("#memoToobarBtn").removeClass('btn-dark');
				break;
			case 9 :	// 경관분석
				Module.XDSetViewPoint(!1);
				$("#heightFixBtn").addClass('btn-outline-dark-menu');
				$("#heightFixBtn").removeClass('btn-dark');
				break;
			case 10 :	// 가시권분석 (3D)
				Module.getAnalysis().setViewshedMode(false);
				$("#viewshed3dBtn").addClass('btn-outline-dark-menu');
				$("#viewshed3dBtn").removeClass('btn-dark');
				break;
			case 11 :	// 휴먼모드
				Module.getViewCamera().setTraceActive(false);
				Module.getViewCamera().setPermitUnderGround(false);
				Module.getViewCamera().setLimitAltitude(1);
				Module.getViewCamera().setAnimationSpeed(10);
				Module.getViewCamera().setLimitTilt(10);
				IDE.MAPTOOL.humanModeModel.setVisible(false);
				Module.getViewCamera().look(new Module.JSVector3D(IDE.MAPTOOL.humanModeModel.getPosition().Longitude,IDE.MAPTOOL.humanModeModel.getPosition().Latitude,IDE.MAPTOOL.humanModeModel.getPosition().Altitude+5000),IDE.MAPTOOL.humanModeModel.getPosition());
				window.removeEventListener('keydown', IDE.MAPTOOL.humanModeKeydown);
				window.removeEventListener('keyup', IDE.MAPTOOL.humanModeKeyup);
				Module.canvas.removeEventListener('mousedown', IDE.MAPTOOL.humanModeMousedown);
				Module.canvas.removeEventListener('mouseup', IDE.MAPTOOL.humanModeMouseup);
				Module.canvas.removeEventListener('mousemove', IDE.MAPTOOL.humanModeMousemove);
				Module.canvas.removeEventListener('wheel',IDE. MAPTOOL.humanModeWheel);
				clearInterval(IDE.MAPTOOL.humanModeInterval);
				$("#humanBtn").addClass('btn-outline-dark-menu');
				$("#humanBtn").removeClass('btn-dark');
				$("#humanModeImg").hide();
				break;
			default :
				return;
			}
			
			Module.XDSetMouseState(Module.MML_MOVE_GRAB);
			this.activeType = 0;
		},
		
		/* 화면 캡쳐 */
		saveScreenShot : function() {

			var outputCanvas = document.createElement("canvas");
			var ctx = outputCanvas.getContext('2d');
			outputCanvas.width = Module.canvas.width;
			outputCanvas.height = Module.canvas.height;
			
			// 지도화면, 메모 화면 복사
			ctx.drawImage(Module.canvas, 0, 0);
			if (this.activeType == 6){
				toolbar_drawing.removeDrawCanvasBorder();
				ctx.drawImage(toolbar_drawing.canvas, 0, 0);
			}

			// 로고 그린 후 이미지 다운로드 실행
			var logoImage = new Image();
			logoImage.onload = function(e) {
				// 로고 붙이기
				var margin = 10;
				var width = 200;
				var avg = this.width / width;
				var height = this.height / avg;
				this.width = width;
				this.height = height;
				ctx.drawImage(this, outputCanvas.width-this.width-margin, outputCanvas.height-this.height-margin,width,height);
				var today = new Date();
				today.getFullYear()
				var month = (today.getMonth() + 1) + "";
				if(month.length == 1) month = "0"+month;
				var day = today.getDate() + "";
				if(day.length == 1) day = "0"+day;
				// 다운로드 실행
				if (outputCanvas.msToBlob) {
					var blob = outputCanvas.msToBlob();
					window.navigator.msSaveBlob(blob, 'DigitalTwinCloud_'+today.getFullYear()+month+day+'.png');
				}
				else {
					var canvasBlob = outputCanvas.toBlob(function(blob){
						var url = URL.createObjectURL(blob);
						var dl = document.createElement('a');
						dl.setAttribute('href', url);
						dl.setAttribute("download", 'DigitalTwinCloud_'+today.getFullYear()+month+day+'.png');
						document.body.appendChild(dl);
						dl.click();
						document.body.removeChild(dl);
					}, "image/png", 1.0);
				}
				
				if (IDE.MAPTOOL.activeType == 6){
					toolbar_drawing.setDrawCanvasBorder();
				}
			}
			var name = "logo-egis-new";
			if (window.location.href.indexOf("beta") > -1 || window.location.href.indexOf("newlayer") > -1
				|| window.location.href.indexOf("alpha") > -1 || window.location.href.indexOf("delta") > -1) {
				name = "logo-newlayer";
			}
			logoImage.src = "//egiscloud.com/assets/images/"+name+".png";
		},
		nationalPointEvent:function(e) {
			
			var layerList = new Module.JSLayerList(true);
			
			Module.XDEMapRemoveLayer("location");
			
			var imageName = null;
			imageName = "//egiscloud.com/assets/img/poi/poi_2.png";
	
			var poiImage = new Image();
			poiImage.src = imageName;
			poiImage.width = 40;
			poiImage.height = 40;
			
			poiImage.onload = function() {
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				canvas.width = poiImage.width;
				canvas.height = poiImage.height;
				context.drawImage(poiImage, 3, 0, poiImage.width-6, poiImage.height);
			
				var image = context.getImageData(0,0,canvas.width,canvas.height);
	
				Module.getAddObject().Add3DPoint("location", "start", mapPosition.Longitude,mapPosition.Latitude, mapPosition.Altitude, image.data, image.width, image.height, "");
			 
				var drawCanvas = document.createElement('canvas');
				drawCanvas.width = 75;
				drawCanvas.height = 50;
				
				Module.XDRenderData();
				layerList.nameAtLayer("location").setMaxDistance(600000);
			}
			
		    var screenPosition = new Module.JSVector2D(e.layerX, e.layerY);
			var mapPosition = Module.getMap().ScreenToMapPointEX(screenPosition);
		
		    var vPosition = new Module.JSVector2D(mapPosition.Longitude, mapPosition.Latitude);
		    var vResult = Module.getProjection().convertProjection(13, vPosition, 26);
		    var nationalPointNumber = IDE.MAPTOOL.getNationalPointNumber(vResult.x,vResult.y);
			IDE.MAPTOOL.getNationalPointAddress(vPosition.y,vPosition.x);
			$("#nationalPointLon").text(mapPosition.Longitude.toFixed(5));
			$("#nationalPointLat").text(mapPosition.Latitude.toFixed(5));
			$("#nationalPointNum").text(nationalPointNumber);
			
		},
		getNationalPointAddress:function(x, y) {

			var nationalPointAddress = '';
			var geocoder = new kakao.maps.services.Geocoder();

			geocoder.coord2Address(y, x, function(result, status) {
		        if (status === kakao.maps.services.Status.OK) {
		            nationalPointAddress = !!result[0].road_address ? result[0].road_address.address_name : '';
					if(nationalPointAddress == '')
						nationalPointAddress = result[0].address.address_name;
						
		    		$("#nationalPointAddress").text(nationalPointAddress);	
		    
			    } 
 				else {
					$("#nationalPointAddress").text("주소지 정보 없음");
				}
 			}); 
	
		},
		getNationalPointNumber:function(x, y) {
			try {
				//라사 2559 8364    --> x: 1025590,  y : 1983640
				//다바 1953 5843
				// 동향값 E, East x
				var HAN_E = {
					"7": {HANGUL:"가", NUM: "07"},
					"8": {HANGUL:"나", NUM: "08"},
					"9": {HANGUL:"다", NUM: "09"},
					"10": {HANGUL:"라", NUM: "10"},
					"11": {HANGUL:"마", NUM: "11"},
					"12": {HANGUL:"바", NUM: "12"},
					"13": {HANGUL:"사", NUM: "13"}
					//"14": {HANGUL:"아", NUM: "14"}
				};
				// 북향값 N, North y
				var HAN_N = {
					"13": {HANGUL:"가", NUM: "13"},
					"14": {HANGUL:"나", NUM: "14"},
					"15": {HANGUL:"다", NUM: "15"},
					"16": {HANGUL:"라", NUM: "16"},
					"17": {HANGUL:"마", NUM: "17"},
					"18": {HANGUL:"바", NUM: "18"},
					"19": {HANGUL:"사", NUM: "19"},
					"20": {HANGUL:"아", NUM: "20"}
				};
				//반올림한다
				var x2 = Math.round(Number(x)).toString();
				var y2 = Math.round(Number(y)).toString();
				
				var restCount = 4;
				 
				//앞 두자리를 숫자를 잘라서 해당 숫자의 한글을 가져오고, 나머지 좌표를 잘라서 합친다.
				var nationalPointNumber = 
		            HAN_E[Number(x2.substring(0, (x2.length == 6) ? 1 : 2)).toString()].HANGUL +
		            HAN_N[y2.substring(0, 2)].HANGUL + " " +
		            x2.substring((x2.length == 6) ? 1 : 2, Number((x2.length == 6) ? 1 : 2) + Number(restCount)) + " " +
		            y2.substring(2, Number(restCount) + 2);
		      											
			} catch (e){
				//
			}
			return nationalPointNumber;
		},
		humanModeKeydown:function(e){
			IDE.MAPTOOL["KEY_PRESS_"+e.key] = true;
		},
		humanModeKeyup:function(e){
			IDE.MAPTOOL["KEY_PRESS_"+e.key] = false;
		},
		humanModeMousedown:function(e){
			IDE.MAPTOOL.MOUSE_BUTTON_PRESS = true;
		},
		humanModeMouseup:function(e){
			IDE.MAPTOOL.MOUSE_BUTTON_PRESS = false;
		},
		humanModeMousemove:function(e){
			if (IDE.MAPTOOL.MOUSE_BUTTON_PRESS) {
		        if (e.buttons == 1) {
					//왼쪽마우스로 각도
		            IDE.MAPTOOL.humanModeTarget.tilt += (e.movementY*0.5);
		        }
				if (e.buttons == 2) {
					//오른쪽마우스 회전
		            IDE.MAPTOOL.humanModeTarget.direction += (e.movementX*0.5);
		            IDE.MAPTOOL.humanModeTarget.tilt += (e.movementY*0.5);
		        }
		    }
		},
		humanModeWheel:function(e){
		    if (e.wheelDelta < 0) { 
		        IDE.MAPTOOL.humanModeTarget.distance *= 1.10;
		    } else {
		        IDE.MAPTOOL.humanModeTarget.distance *= 0.90;
		    }
		},
		humanModeCameraMove:function(callback){
			var camera = Module.getViewCamera();
			var speed = camera.getAnimationSpeed();
			
			//camera.setLocation(new Module.JSVector3D(129.1259517039155, 35.16852862708818, 200.0));
			camera.setPermitUnderGround(true);
			camera.setLimitAltitude(-1000.0);
			camera.setAnimationSpeed(0.1);
			var alt = Module.getMap().getTerrHeight(Module.getViewCamera().getLocation().Longitude,  Module.getViewCamera().getLocation().Latitude)+10;
			var movePath = Module.getMath().convertBeZierLine({
				start : Module.getViewCamera().getLocation(),
				end : new Module.JSVector3D(Module.getViewCamera().getLocation().Longitude,  Module.getViewCamera().getLocation().Latitude, alt),
				detail : 100,					// 곡선 보간 점 수 (값이 클 수록 곡선에 가까운 형태가 됩니다.)
				height : alt,		// 곡선 최고 높이 (해발고도, m 단위)
				percent : 70,					// 시작점부터 끝점 라인 중 곡선 최고점 위치
			});
			IDE.MAPTOOL.moveCamera(movePath.return, 0 ,callback);
		},
		moveCamera:function(_path, _index, _callback) {
		
			// 현재 지점에서 다음 경로 지점을 바라보도록 설정
			Module.getViewCamera().look(_path.get(_index), _path.get(_index+1));
		
			if (_index < _path.count()-2) {
				setTimeout(function(){
					IDE.MAPTOOL.moveCamera(_path, _index+1, _callback);
				}, 10);
			}else{
				setTimeout(function(){
					_callback();
				}, 1300);
			}
		},
		renewObjectMoving:function(){
			if (IDE.MAPTOOL.humanModeTarget == null) {
				return;
			}
		
			var move_front = 0.0;
			var move_right = 0.0;
		
			if (IDE.MAPTOOL["KEY_PRESS_w"]) {
				move_front = 1.0;
			} else if (IDE.MAPTOOL["KEY_PRESS_s"]) {
				move_front = -1.0;
			} else;
		
			if (IDE.MAPTOOL["KEY_PRESS_a"]) {
				move_right = -1.0;
			} else if (IDE.MAPTOOL["KEY_PRESS_d"]) {
				move_right = 1.0;
			} else;
		
			IDE.MAPTOOL.humanModeTarget.move(move_front, move_right, true);
			Module.XDRenderData();
		}
	},
	LAYER:{
		init:function() {
			D_MEMBER.MEMBERID = parent.D_MEMBER.MEMBERID;
			D_MEMBER.MID = parent.D_MEMBER.MID;
			eval(parent.appObj).extPath = "/userData/"+parent.devAppId+"/DEV_DATA/"+parent.appObj+"/";
        	eval(parent.appObj).init();
		}
	},
	MODULE:{
		execs:[],// 현재 종료되지 않은 모듈 번호
		front:null, // 현재 실행중인 모듈 번호
		obj:null,
		PROPERTY:{
			propertyOn:true,
			// 모듈별 설정 윈도우 컨트롤,
			resetProperty:function(m) {
				
			},
			movePosition:function() {
				
				if(IDE.MODULE.front == null) return;
				
				var target = IDE.MODULE.PROPERTY.getFrontTargetWrap();
				
				// console.log(target);
				
				switch(IDE.MODULE.front) {
					case 1:
						if(IDE.UI.SIDE_PANEL.isOn) {
							$("#"+target).css("left", "82px");
						} else {
							$("#"+target).css("left", "38px");
						}
					break;
				}
				
				
			},
			getFrontTargetWrap:function() {
				var target = "";
				
				switch(IDE.MODULE.front) {
					case 1:
						// 건물 편집
						target = "moduleEditBuildingWrap";
					break;
					
					case 2:
						target = "";
					break;
				}
				
				return target;
			},
			getSelectPropertyWrap:function(m) {
				var target = "";
				
				switch(m) {
					case 1:
						// 건물 편집
						target = "moduleEditBuildingWrap";
					break;
					
					case 2:
						target = "";
					break;
				}
				
				return target;
			},
			slideOnPropertyWindow:function(m) {
				var target = IDE.MODULE.PROPERTY.getSelectPropertyWrap(m);
				
				IDE.MODULE.PROPERTY.propertyOn = true;
				
				$("#modulePropertyIconWrap_"+m).remove();
				$("#"+target).css("display", "block");
			},
			slideOffPropertyWindow:function(m) {
				
				var target = IDE.MODULE.PROPERTY.getSelectPropertyWrap(m);
				
				var html = "";
				html += "<li onClick=\"JavaScript:IDE.MODULE.PROPERTY.slideOnPropertyWindow("+m+");\" id=\"modulePropertyIconWrap_"+m+"\" class=\"m-l-3\">\n";
				html += "	<button type=\"button\" class=\"btn icon-btn btn-sm btn-dark\" id=\"modulePropertyIcon_"+m+"\">\n";
				html += "		<i class=\"ion ion-md-settings\"></i>\n";
				html += "	</button>\n";
				html += "</li>\n";
				
				$("#analysisModuleBtnWrap_"+m).after(html);
				$("#"+target).css("display", "none");
				
				IDE.MODULE.PROPERTY.propertyOn = false;
			}
		},
		callModule:function(m) {
			
			if(m == IDE.MODULE.front) {
				return;
			}
			
			IDE.MODULE.loadMobule(m);
		},
		callFront:function(m) {

			if(IDE.MODULE.front == m) {
				
				if(!$("#analysisCloseModuleBtn_"+m).exists()) {
					var html = "";
					html += "<li onClick=\"JavaScript:IDE.MODULE.removeModuleInterface("+m+");\" id=\"analysisCloseModuleBtnWrap_"+m+"\">\n";
					html += "	<button type=\"button\" class=\"btn icon-btn btn-sm btn-danger\" id=\"analysisCloseModuleBtn_"+m+"\">\n";
					html += "		<i class=\"fas fa-times\"></i>\n";
					html += "	</button>\n";
					html += "</li>\n";
					
					$("#analysisModuleBtnWrap_"+IDE.MODULE.front).append(html);
				} else {
					$("#analysisCloseModuleBtnWrap_"+m).remove();
				}
				
				
			} else {
				
				if(IDE.MODULE.front != null) {
					$("#analysisModuleBtn_"+IDE.MODULE.front).removeClass("btn-info");
					$("#analysisModuleBtn_"+IDE.MODULE.front).addClass("btn-dark");
					
					IDE.MODULE.front = m;
					
					$("#analysisModuleBtn_"+IDE.MODULE.front).removeClass("btn-dark");
					$("#analysisModuleBtn_"+IDE.MODULE.front).addClass("btn-info");
				}
			}
			
			
		},
		initModuleInterface:function(m) {
			
			for(var i = 0; i < IDE.MODULE.execs.length; i++) {
				if(IDE.MODULE.execs[i] == m) {
					// call front selecte module
					IDE.MODULE.callFront(m);
					return;
				}
			}
			
			if(IDE.MODULE.front != null) {
				$("#analysisModuleBtn_"+IDE.MODULE.front).removeClass("btn-info");
				$("#analysisModuleBtn_"+IDE.MODULE.front).addClass("btn-dark");
			}
			
			switch(m) {
				case 1:
					var html = "";
					html += "<li onClick=\"JavaScript:IDE.MODULE.callFront("+m+");\" id=\"analysisModuleBtnWrap_"+m+"\">\n";
					html += "	<button type=\"button\" class=\"btn icon-btn btn-sm btn-info\" id=\"analysisModuleBtn_"+m+"\">\n";
					html += "		<i class=\"far fa-building\"></i>\n";
					html += "	</button>\n";
					html += "</li>\n";
					
					$("#executeModuleListUL").append(html);
					
					$("#moduleEditBuildingWrap").css("display", "block");
					
				break;
				
				case 2:
					var html = "";
					html += "<li onClick=\"JavaScript:IDE.MODULE.callFront("+m+");\" id=\"analysisModuleBtnWrap_"+m+"\">\n";
					html += "	<button type=\"button\" class=\"btn icon-btn btn-sm btn-info\" id=\"analysisModuleBtn_"+m+"\">\n";
					html += "		<i class=\"fa fa-adjust\"></i>\n";
					html += "	</button>\n";
					html += "</li>\n";
					
					$("#executeModuleListUL").append(html);

				break;
			}
			
			IDE.MODULE.front = m;
			
			IDE.MODULE.execs.push(m);
			IDE.UI.SIDE_PANEL.slideOff();
			
		},
		removeModuleInterface:function(m) {
			$("#analysisModuleBtnWrap_"+m).remove();
			$("#analysisCloseModuleBtnWrap_"+m).remove();
			$("#modulePropertyIconWrap_"+m).remove();
			
			var target = IDE.MODULE.PROPERTY.getFrontTargetWrap();
			
			$("#"+target).css("display", "none");
			
			// IDE.MODULE.execs.push(m);
			
			IDE.MODULE.execs.splice(IDE.MODULE.execs.indexOf(parseInt(m)), 1);
			
			if(IDE.MODULE.execs.length > 0) {
				IDE.MODULE.callFront(IDE.MODULE.execs[0]);
			} else {
				
				IDE.MODULE.front = null;
			}
			
		},
		loadMobule:function(m) {
			
			// checking beforeExecute
			// if(IDE.MODULE.execs.length != 0
			for(var i = 0; i < IDE.MODULE.execs.length; i++) {
				if(IDE.MODULE.execs[i] == m) {
					// call front selecte module
					IDE.MODULE.initModuleInterface(m);
 
					for(var i = 0; i < IDE.MODULE.execs.length; i++) {
						// console.log($("#navs-analy-"+i+"-link"));
						$("#navs-analy-"+IDE.MODULE.execs[i]+"-link").removeClass("active");
						
						$("#navs-analy-"+IDE.MODULE.execs[i]).removeClass("show active");
						
					}
					
					$("#navs-analy-"+m+"-link").addClass("active");
					$("#navs-analy-"+m).addClass("show active");
					
					
					return;
				}
			}
			
			// console.log(IDE.MODULE.execs);
			// reset nav tab
			for(var i = 0; i < IDE.MODULE.execs.length; i++) {
				// console.log($("#navs-analy-"+i+"-link"));
				$("#navs-analy-"+IDE.MODULE.execs[i]+"-link").removeClass("active");
				
				$("#navs-analy-"+IDE.MODULE.execs[i]).removeClass("show active");
			}
			
			var currentModule = null;
			
			for(var i = 0; i < IDE.MODULE.obj.moduleList.length; i++) {
				if(m == IDE.MODULE.obj.moduleList[i].mdid) {
					currentModule =IDE.MODULE.obj.moduleList[i];
				}
			}
			
			var ts = + new Date();
			
			
			var jsSrc = currentModule.js_url+"?ts="+ts;
			var htmlSrc = currentModule.html_url+"?ts="+ts;
			var cssSrc = currentModule.css_url+"?ts="+ts;
			
			// console.log(jsSrc, htmlSrc, cssSrc);
			
			
			var moduleObj = currentModule.module_obj;
			
			// js까지 다 부르고 추가 라이브러리 있으면 다 부르기 sumin 201203
			if (currentModule.is_extjs == "Y") {
				IDE.MODULE.loadExtraModules(currentModule.mdid, IDE.MODULE.obj.moduleExtObjectList);
			}
			
			// Create Tab
			var html = "";
			html += "<li class=\"nav-item\" id=\"analy-module-"+m+"-nav-item\">\n";
			html += "\t<a class=\"nav-link\" data-toggle=\"tab\" href=\"#navs-analy-"+m+"\" style=\"display:inline;\" id=\"navs-analy-"+m+"-link\">"+currentModule.name+" <button type=\"button\" class=\"btn btn-xs rounded-pill borderless\" onClick=\"JavaScript:IDE.MODULE.closeModule("+m+");\"><i class=\"fas fa-times-circle\"></i></button></a>\n";
			// html += "\t<a class=\"nav-link\" data-toggle=\"tab\"
			// href=\"#navs-analy-"+m+"\" style=\"display:inline;\"
			// id=\"navs-analy-"+m+"-link\">"+currentModule.name+"</a>\n";
			html += "</li>\n";
			
			$("#moduleUITabUL").append(html);
			
			$('#navs-analy-'+m+'-link').on('hide.bs.tab', function (e) {
				
				// 이전 탭 hide 처리
				var hideModuleIdx = e.target.id.replace("navs-analy-", "");
				hideModuleIdx = parseInt(hideModuleIdx.replace("-link", ""));
				IDE.MODULE.hideModule(hideModuleIdx);
				
				// 현재 탭 display 처리
				var displayModuleIdx = e.relatedTarget.id.replace("navs-analy-", "");
				displayModuleIdx = parseInt(displayModuleIdx.replace("-link", ""));
				IDE.MODULE.displayModule(displayModuleIdx);
			});
			
			var html = "";
			html += "<div class=\"tab-pane fade\" id=\"navs-analy-"+m+"\">\n";
			html += "\t<div class=\"card-body p-10\" id=\"analy_"+m+"_body\">\n";
			html += "\t</div>\n";
			html += "</div>\n";
			
			$("#moduleUITabContent").append(html);

			/* css, html, js 순서로 load */
			
			if(cssSrc != null) {
				// load html
				IDE.MODULE.execs.push(m);
				$("#analy_"+m+"_body").load(htmlSrc, function() {
					var cssId = "m_style_"+m;
					$.loadCSS(cssSrc,cssId, function() {
						$.getScript(jsSrc, function() {
							// Module load finish
							$("#navs-analy-"+m+"-link").addClass("active");
							$("#navs-analy-"+m).addClass("show active");
							
							var html = "";
							html += "<div class=\"moduleUISlideDownWrap\">\n";
							html += "\t<a href=\"JavaScript:IDE.UI.MODULE_PANEL.slideDown();\"><button type=\"button\" class=\"btn btn-sm btn-secondary rounded-right\" style=\"outline: rgb(255, 255, 255) none 0px;\"><i class=\"fa fa-angle-double-down\"></i> 컨트롤 숨기기</button></a>\n";
							html += "</div>\n";
							
							$("#analy_"+m+"_body").append(html);
							
							
							eval(moduleObj).init();

						}).fail(function() {
							console.log("fail");
						}).done(function() {
							console.log("done");
						});
					});
				});
			} else {
				/*
				 * $("#analy_"+m+"_body").load("./assets/js/module/"+htmlSrc,
				 * function() { $.getScript("./assets/js/module/"+jsSrc,
				 * function() { // Module load finish
				 * 
				 * IDE.MODULE.execs.push(m);
				 * $("#navs-analy-"+m+"-link").addClass("active");
				 * $("#navs-analy-"+m).addClass("show active");
				 * 
				 * var html = ""; html += "<div
				 * class=\"moduleUISlideDownWrap\">\n"; html += "\t<a
				 * href=\"JavaScript:IDE.UI.MODULE_PANEL.slideDown();\"><button
				 * type=\"button\" class=\"btn btn-sm btn-dark panelColor
				 * rounded-right\" style=\"outline: rgb(255, 255, 255) none
				 * 0px;\"><i class=\"fa fa-angle-double-down\"></i></button></a>\n";
				 * html += "</div>\n";
				 * 
				 * $("#analy_"+m+"_body").append(html);
				 * 
				 * eval(moduleObj).init();
				 * 
				 * }); });
				 */
			}
			
			
			$('[data-toggle="tooltip"]').tooltip();
			$('[data-toggle="tooltip"]').click(function () {
	          $('[data-toggle="tooltip"]').tooltip("hide");
	       });
			
		},
		
		// 추가 모듈 로드
		loadExtraModules : function(mdid, extraModules) {
			
			for (var i=0; i<extraModules.length; i++) {
				
				for (var j=0; j<extraModules[i].length; j++) {
				
					// 지금 로드 된 모듈 번호와 같으면 로드
					if (mdid == extraModules[i][j].mdid) {
						// console.log(extraModules[i][j]);
						if(extraModules[i][j].file_type == "css") {
							var id = "m_e_s_"+mdid;
							$.loadCSS(extraModules[i][j].file_url,id, function() {
								
							}); 
						} else if(extraModules[i][j].file_type == "js") {
							$.getScript(extraModules[i][j].file_url);
						}
					}
				}
			}
		},
		closeModule:function(m) {
			
			$("#navs-analy-"+m).remove();
			$("#navs-analy-"+m+"-link").removeClass("active");
			$("#analy-module-"+m+"-nav-item").remove();
			$('#m_s_'+m).remove();
			// eval(moduleObj).init();
			
			if($('#m_e_s_'+m)){
				$('#m_e_s_'+m).remove();
			}
			
			var currentModule = null;
			
			for(var i = 0; i < IDE.MODULE.obj.moduleList.length; i++) {
				if(m == IDE.MODULE.obj.moduleList[i].mdid) {
					currentModule = IDE.MODULE.obj.moduleList[i];
				}
			}
			
			// var jsSrc = currentModule.js_url;
			// var htmlSrc = currentModule.html_url;
			// var cssSrc = currentModule.css_url;
			var moduleObj = currentModule.module_obj;
			
			
			IDE.MODULE.execs.splice(IDE.MODULE.execs.indexOf(parseInt(m)), 1);
			$("#navs-analy-"+m+"-link .spinnericon").css("visibility","hidden");
			$("#navs-analy-"+m+"-link .closeicon").css("display","none");

			//$("#navs-analy-"+m+"-list").remove();
			
			/*if(IDE.MODULE.execs.length > 0) {
				// IDE.MODULE.callFront(IDE.MODULE.execs[0]);
				var f = IDE.MODULE.execs[0];
				$("#navs-analy-"+f+"-link").addClass("active");
				$("#navs-analy-"+f).addClass("show active");
				IDE.MODULE.front = f;
				
			} else {
				IDE.MODULE.front = null;
				
				Module.XDIsMouseOverDiv(false);
				
				// console.log(IDE.MODULE.execs);
			}
			*/
			
			if(dtcApps.front == m){
				dtcApps.front = null;
				$("#toolAre2").css('right','0px');
				$("#layout-navbar").css('right', '5px');
			}
			
			eval(moduleObj).destory();
			
			if(IDE.MODULE.execs.length == 0){
				//실행중인 앱 목록보기 아이콘
				/*$(".appList").css("visibility","hidden");
				$(".appListIcon").css("visibility","hidden");
				$(".appListText").css("visibility","hidden");*/
				$("#appListBtn").css("background-color","transparent");
			}
			$("#appListBtn").css("background-color","transparent");
			Module.XDIsMouseOverDiv(false);
		},
		
		hideModule : function(m) {
			
			var currentModule = null;
			
			for(var i = 0; i < IDE.MODULE.obj.moduleList.length; i++) {
				if(m == IDE.MODULE.obj.moduleList[i].mdid) {
					currentModule = IDE.MODULE.obj.moduleList[i];
				}
			}
			
			var moduleObj = currentModule.module_obj;
			
			// 모듈 변환
			if (eval(moduleObj).hide) {
				eval(moduleObj).hide();
			}
		},
		
		displayModule : function(m) {
			
			var currentModule = null;
			
			for(var i = 0; i < IDE.MODULE.obj.moduleList.length; i++) {
				if(m == IDE.MODULE.obj.moduleList[i].mdid) {
					currentModule = IDE.MODULE.obj.moduleList[i];
				}
			}
			
			var moduleObj = currentModule.module_obj;
			
			// 모듈 변환
			if (eval(moduleObj).display) {
				eval(moduleObj).display();
			}
		},
		
		Module : function(m) {
			
			var currentModule = null;
			
			for(var i = 0; i < IDE.MODULE.obj.moduleList.length; i++) {
				if(m == IDE.MODULE.obj.moduleList[i].mdid) {
					currentModule = IDE.MODULE.obj.moduleList[i];
				}
			}
			
			var moduleObj = currentModule.module_obj;
			
			// 모듈 변환
			if (eval(moduleObj).hide) {
				eval(moduleObj).hide();
			}
		}
		
	}, // Module
	PLACE:{
		ps:null,
		data:null,
		search:function() {
			if($("#searchPlace").val() != "") {
				IDE.PLACE.ps.keywordSearch($("#searchPlace").val(), IDE.PLACE.searchResult);
			}
		},
		closeWithClear:function() {
			$("#searchResultHeader").html("");
			
			$("#searchResultHeader").html("PLACE 검색");
			
			$("#searchResultItems").empty();
			
			$("#searchResultWrap").css("display", "none");
			
			$("#searchPlace").val("");
		},
		closeSearch:function() {
			$("#searchResultHeader").html("");
			
			$("#searchResultHeader").html("PLACE 검색");
			
			$("#searchResultItems").empty();
			
			$("#searchResultWrap").css("display", "none");
		},
		moveToSearchPlace:function(idx) {
			var x = parseFloat(IDE.PLACE.data[idx].x);
			var y = parseFloat(IDE.PLACE.data[idx].y);
			
			Module.getViewCamera().setViewAt(x, y, 500, 45, 0);
			Module.XDRenderData();

			IDE.PLACE.closeSearch();
			
			Module.XDIsMouseOverDiv(false);
		},
		getCategory:function(code) {
			var c = "";
			switch(code) {
				case "MT1" :
					c = "대형마트";
				break;

				case "CS2" :
					c = "편의점";
				break;

				case "PS3" :
					c = "어린이집, 유치원";
				break;

				case "SC4" :
					c = "학교";
				break;

				case "AC5" :
					c = "학원";
				break;

				case "PK6" :
					c = "주차장";
				break;

				case "OL7" :
					c = "주유소, 충전소";
				break;

				case "SW8" :
					c = "지하철역";
				break;

				case "BK9" :
					c = "은행";
				break;

				case "CT1" :
					c = "문화시설";
				break;

				case "AG2" :
					c = "중개업소";
				break;

				case "PO3" :
					c = "공공기관";
				break;

				case "AT4" :
					c = "관광명소";
				break;

				case "AD5" :
					c = "숙박";
				break;

				case "FD6" :
					c = "음식점";
				break;

				case "CE7" :
					c = "카페";
				break;

				case "HP8" :
					c = "병원";
				break;

				case "PM9" :
					c = "약국";
				break;
			}

			return c;
		}, // End of get Category
		searchResult:function(data, status, pagination) {
			if(status == kakao.maps.services.Status.OK) {
				// console.log(pagination);
				// console.log(data);
				
				$("#searchResultHeader").html("");
				
				$("#searchResultHeader").html("PLACE 검색 ("+pagination.totalCount+")");
				
				$("#searchResultItems").empty();
				
				// searchResultHeader
				IDE.PLACE.data = data;
				$.each(data, function(k, v) {
					var html = "";
                    html += "<a href=\"JavaScript:IDE.PLACE.moveToSearchPlace("+k+");\" class=\"list-group-item list-group-item-action media d-flex align-items-center\">\n";
                    html += " <div class=\"t-c\">\n";
                    html += "  <i class=\"fa fa-map-marker-alt text-primary\"></i>\n";
                    html += "  <p class=\"ts-8 p-0\">"+IDE.PLACE.getCategory(v.category_group_code)+"</p>\n";
                    html += " </div>\n";
                    html += "  <div class=\"media-body ml-3\">\n";
                    html += "    <div class=\"text-body line-height-condenced ts-9\">"+v.place_name+"</div>\n";
                    html += "    <div class=\"text-light small mt-1 ts-7\">\n";
                    html += "      "+v.category_name+"\n";
                    html += "    </div>\n";
                    html += "  </div>\n";
                    html += "</a>\n";
					/*
					 * html += "<li class=\"media\">\n"; html += " <a
					 * href=\"JavaScript:IDE.PLACE.moveToSearchPlace("+k+");\">\n";
					 * html += " <div class=\"media-left t-c\">\n"; html += " <i
					 * class=\"fa fa-map-marker-alt text-primary\"></i>\n";
					 * html += " <p>"+IDE.PLACE.getCategory(v.category_group_code)+"</p>\n";
					 * html += " </div>\n"; html += " <div
					 * class=\"media-body\">\n"; html += "
					 * <h6 class=\"media-heading\">"+v.place_name+"</h6>\n";
					 * html += " <p>"+v.address_name+"</p>\n"; html += " <div
					 * class=\"text-muted f-s-11\">"+v.category_name+"</div>\n";
					 * html += " </div>\n"; html += " </a>\n"; html += " </li>\n";
					 */
					$("#searchResultItems").append(html);
					
					
				});
				
				$("#searchResultWrap").css("display", "block");
			}
		}
	},
	UTIL:{
		getRandomColor:function() {
			var r, g, b, rg, gb, rb;
			var range = 255; // controls the range of r,g,b you would like
			// reduce the range if you want more darker colors
			var sep = range / 4; // controls the minimum separation for
									// saturation
			// note- keep sep < range/3 otherwise may crash browser due to
			// performance
			// reduce the sep if you do not mind pastel colors
			// generate r,g,b, values as long as any difference is < separation
			do {
				r = Math.floor(Math.random() * range);
				g = Math.floor(Math.random() * range);
				b = Math.floor(Math.random() * range);

				rg = Math.abs(r - g);
				gb = Math.abs(g - b);
				rb = Math.abs(r - b);
			} while (rg < sep || gb < sep || rb < sep);

			// convert the rgb to hex

			function rgbtohex(rgb) {
				var first, second; // makes the two hex code for each rgb value

				first = Math.floor(rgb / 16); // get first unit of hex
				second = rgb % 16; // get second unit of hex
				// convert to string with hex base 16
				first = first.toString(16);
				second = second.toString(16);
				// concatenate the two units of the hex
				var rgbtohex = first + second;
				// return the two unit hex code for the r,g,b value
				return rgbtohex;
			}

			// convert the r,g,b numbers to hex code by calling the rgbto hex
			// function
			var r_str = rgbtohex(r),
			g_str = rgbtohex(g),
			b_str = rgbtohex(b);
			// concatenate the final string for the output
			var final = '#' + r_str + g_str + b_str;

			// output random color
			return final;
		},
		componentToHex:function(c) {
			var hex = c.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
		},
		rgbToHex:function(r, g, b) {
			//var rgb = r | (g << 8) | (b << 16);
			var rgb =  r << 16 | (g << 8) | b;
			return '#' + (0x1000000 + rgb).toString(16).slice(1)
		},
		getCoordTypeByName:function(t) {
			var coordType = "Unknown";

			switch(t) {
				case "13" :
					coordType = "EPSG:4326";
				break;

				case "14" : // 보정된 오래된 지리원 표준 - 서부원점 epsg:5173

					coordType = "EPSG:5173";
				break;

				case "15" : // 보정된 오래된 지리원 표준 - 중부원점 epsg:5174

					coordType = "EPSG:5174";
				break;

				case "16" : // 보정된 오래된 지리원 표준 - 동부원점 epsg:5176

					coordType = "EPSG:5176";
				break;

				case "17" : // 타원제 바꾼 지리원 표준 - 중부원점 epsg:5181

					coordType = "EPSG:5181";
				break;

				case "18" : // 타원제 바꾼 지리원 표준 - 동부원점 epsg:5183

					coordType = "EPSG:5183";
				break;

				case "19" : // 보정된 오래된 지리원 표준 - 제주원점 epsg:5175

					coordType = "EPSG:5175";

				break;

				case "20" : // 2017년 국토지리정보원 표준 - 중부원점 epsg:5186

					coordType = "EPSG:5186";
				break;

				case "21" : // 2017년 국토지리정보원 표준 - 서부원점 epsg:5185

					coordType = "EPSG:5185";
				break;

				case "24" : // UTM-K (Bessel): 새주소지도에서 사용 중 epsg:5178

					coordType = "EPSG:5178";
				break;

				case "25" : // 네비게이션용 KATEC 좌표계(KOTI-KATEC)

					coordType = "KOTI-KATEC";
				break;

				case "26" : // UTM-K (GRS80): 네이버지도에서 사용중인 좌표계 epsg:5179

					coordType = "EPSG:5179";
				break;

				case "34" : // UTM Zone 51 Northern(Bessel) epsg:32651

					coordType = "EPSG:32651";
				break;

				case "35" : // UTM Zone 52 Northern(Bessel) epsg:32652
					coordType = "EPSG:32652";
				break;

				case "135" :
					coordType = "EPSG:32750";
				break;
			}
			return coordType;
		},
		transformCoord:function(x, y, t) {

			Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

			var source = null;

			switch(t) {
				case "13" :
					source = new Proj4js.Proj("EPSG:4326");
				break;

				case "14" : // 보정된 오래된 지리원 표준 - 서부원점 epsg:5173
					Proj4js.defs["EPSG:5173"] = "+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("EPSG:5173");
				break;

				case "15" : // 보정된 오래된 지리원 표준 - 중부원점 epsg:5174
					Proj4js.defs["EPSG:5174"] = "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("EPSG:5174");
				break;

				case "16" : // 보정된 오래된 지리원 표준 - 동부원점 epsg:5176
					Proj4js.defs["EPSG:5176"] = "+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("EPSG:5176");
				break;

				case "17" : // 타원제 바꾼 지리원 표준 - 중부원점 epsg:5181
					Proj4js.defs["EPSG:5186"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5186");
				break;

				case "18" : // 타원제 바꾼 지리원 표준 - 동부원점 epsg:5183
					Proj4js.defs["EPSG:5187"] = "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5187");
				break;

				case "19" : // 보정된 오래된 지리원 표준 - 제주원점 epsg:5175
					Proj4js.defs["EPSG:5182"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5182");

				break;

				case "20" : // 2017년 국토지리정보원 표준 - 중부원점 epsg:5186
					Proj4js.defs["EPSG:5186"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5186");
				break;

				case "21" : // 2017년 국토지리정보원 표준 - 서부원점 epsg:5185
					Proj4js.defs["EPSG:5185"] = "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5185");
				break;

				case "24" : // UTM-K (Bessel): 새주소지도에서 사용 중 epsg:5178
					Proj4js.defs["EPSG:5178"] = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("EPSG:5178");
				break;

				case "25" : // 네비게이션용 KATEC 좌표계(KOTI-KATEC)
					Proj4js.defs["KOTI-KATEC"] = "+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("KOTI-KATEC");
				break;

				case "26" : // UTM-K (GRS80): 네이버지도에서 사용중인 좌표계 epsg:5179
					Proj4js.defs["EPSG:5179"] = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5179");
				break;

				case "34" : // UTM Zone 51 Northern(Bessel) epsg:32651
					Proj4js.defs["EPSG:32651"] = "+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:32651");
				break;

				case "35" : // UTM Zone 52 Northern(Bessel) epsg:32652

					Proj4js.defs["EPSG:32652"] = "+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:32652");
				break;

				case "130" :
					// UTM 48N
					Proj4js.defs["EPSG:32648"] = "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:32648");
				break;

				case "131" :
					// UTM 48S
					Proj4js.defs["EPSG:32748"] = "+proj=utm +zone=48 +south +datum=WGS84 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:32748");
				break;

				case "135" :
					Proj4js.defs["EPSG:32750"] = "+proj=utm +zone=50 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ";
					source = new Proj4js.Proj("EPSG:32750");

				break;

			}

			var dest = new Proj4js.Proj("EPSG:4326");

			console.log(source, dest);
			console.log(x, y, t);

			var pt = new Proj4js.Point(x, y);
			console.log(pt);

			var rs = Proj4js.transform(source, dest, pt);
			console.log(rs);

			return rs;

			/*
			 * Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84
			 * +datum=WGS84 +no_defs"; Proj4js.defs["EPSG:32648"] = "+proj=utm
			 * +zone=48 +ellps=WGS84 +datum=WGS84 +units=m +no_defs "; var
			 * source = new Proj4js.Proj("EPSG:32648"); var lbx = 823529; var
			 * lby = 1776562; var rtx = 842597; var rty = 1795576; var lb = new
			 * Proj4js.Point(lbx, lby); var rt = new Proj4js.Point(rtx, rty);
			 * var nlb = Proj4js.transform(source, dest, lb); var nrt =
			 * Proj4js.transform(source, dest, rt);
			 */
		},
		cutString:function(str, limit) {
			/*
			 * var tmpStr = str; var byte_count = 0; var len = str.length; var
			 * dot = ""; for(i=0; i<len; i++) { byte_count +=
			 * CXDMap.UTIL.charaterByte(str.charAt(i)); if(byte_count ==
			 * limit-1) { if(CXDMap.UTIL.charaterByte(str.charAt(i+1)) == 2) {
			 * tmpStr = str.substring(0,i+1); dot = "..."; } else { if(i+2 !=
			 * len) dot = "..."; tmpStr = str.substring(0,i+2); } break; } else
			 * if(byte_count == limit) { if(i+1 != len) dot = "..."; tmpStr =
			 * str.substring(0,i+1); break; } } return tmpStr+dot;
			 */
			var len = limit;
			var l = 0;
			for(var i = 0; i < str.length; i++) {
				l += (str.charCodeAt(i) > 128) ? 2: 1;
				if(l > len) return str.substring(0,i) + "...";
			}

			return str;
		},
		charaterByte:function(chr) {
			if(escape(chr).length > 4)
				return 2;
			else
				return 1;
		},
		ColorPickerConter:function(e) {
			if(e.target.id == "POI3DStyleHeadColor_1") {
				$(".POI3DSelectedHeader_1").css("color", ""+e.color.toHex()+"");
				if(CXDMap.CSV.POI3DStyle == 1) {
					CXDMap.CSV.headerColor = e.color.toHex();
				}
			} else if(e.target.id == "POI3DStyleHeadColor_2") {
				$(".POI3DSelectedHeader_2").css("color", ""+e.color.toHex()+"");
				if(CXDMap.CSV.POI3DStyle == 2) {
					CXDMap.CSV.headerColor = e.color.toHex();
				}
			} else if(e.target.id == "SHPLineRGBA") {
				CXDMap.CLOUD.FILE.SHP.changeLineColor(e.color.toHex());
			} else if(e.target.id == "SHPBackgroundRGBA") {
				CXDMap.CLOUD.FILE.SHP.changeBackgroundColor(e.color.toHex());
			} else if(e.target.id == "SHPLineRGBAProperty") {
				CXDMap.CLOUD.FILE.SHP.changeLineColorProperty(e.color.toHex());
			} else if(e.target.id == "SHPBackgroundRGBAProperty") {
				CXDMap.CLOUD.FILE.SHP.changeBackgroundColorProperty(e.color.toHex());
			} else if(e.target.id == "modalPropertyLabelTextColor") {
				// Label 텍스트 색상
				$("#modalPropertyLabelFontPreview").css("color", e.color.toHex());
			} else if(e.target.id == "modalPropertyLabelBackgroundColor") {
				// Label 배경 색상
			} else if(e.target.id == "modalPropertyLabelBackgroundLineColor") {
				// Label 배경 테두리 색상
			}
		},
		ObjectSize:function(obj) {
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		},
		checkImageColumn:function(arr) {
			if(!Array.isArray(arr)) return false;

			if(arr.length == 0) return false;

			// var last_element = my_array[my_array.length - 1];

			var imageIdx = -1;

			for(var i = 0; i < arr.length; i++) {
				if(arr[i][1] != "") {
					var imageUrl = arr[i][1];
					var arrImage = imageUrl.split(".");
					var ext = arrImage[arrImage.length - 1];

					if(ext == "jpg" || ext == "JPG" || ext == "gif" || exit == "GIF" || ext == "png" || ext == "PNG") {
						imageIdx = i;
					}
				}
			}
			return imageIdx;
		},
		checkStringAddress:function(s) {
			var reg = new RegExp("(([가-힣]+(\d{1,5}|\d{1,5}(,|.)\d{1,5}|)+(읍|면|동|가|리))(^구|)((\d{1,5}(~|-)\d{1,5}|\d{1,5})(가|리|)|))([ ](산(\d{1,5}(~|-)\d{1,5}|\d{1,5}))|)|(([가-힣]|(\d{1,5}(~|-)\d{1,5})|\d{1,5})+(로|길))");

			// var reg = new
			// RegExp("(([가-힣]+(\d{1,5}|\d{1,5}(,|.)\d{1,5}|)+(읍|면|동|가|리))(^구|)((\d{1,5}(~|-)\d{1,5}|\d{1,5})(가|리|)|))([
			// ](산(\d{1,5}(~|-)\d{1,5}|\d{1,5}))|)|(([가-힣]|(\d{1,5}(~|-)\d{1,5})|\d{1,5})+(로|길))");

			var v = reg.exec(s);
			// console.log(v);

			return v;
		},
		checkSIDO:function(s) {
			if(s == "") return false;

			var SIDOGUN = [
				"서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
				"경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도",
				"서울시", "부산시", "대구시", "인천시", "광주시", "대전시", "울산시", "세종시", "제주시",
				"수원시", "성남시", "안양시", "안산시", "용인시", "광명시", "평택시", "과천시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "이천시", "안성시", "김포시", "화성시", "여주시", "부천시", "고양시", "의정부시", "동두천시", "구리시", "남양주시", "파주시", "양주시", "포천시",
				"춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시","양평군",
				"홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군",
				"청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "진천군", "괴산군", "음성군", "단양군", "증평군",
				"천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시",
				"전주시", "익산시", "군산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군",
				"목포시", "여수시", "순천시", "나주시", "광약시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군",
				"포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "군위군", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군",
				"창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군", "서귀포시"
			];

			var isSido = false;

			$.each(SIDOGUN, function(k, v) {
				if(v != "") {
					if(v.match(s) != null) {
						// console.log(v.match(s));
						isSido = true;
					}
				}
			});

			return isSido;
		},
		isFloat:function(f) {
			return !!(f % 1);
		},
		isInteger:function(i) {
			return typeof i === "number" && isFinite(i) && Math.floor(i) === i;
		},
		popAndPushArray:function(arr, value) {

		},
		encode:function(input) {
			var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			while (i < input.length) {
				chr1 = input[i++];
				chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure
																	// if the
																	// index
				chr3 = i < input.length ? input[i++] : Number.NaN; // checks
																	// are
																	// needed
																	// here

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
						  keyStr.charAt(enc3) + keyStr.charAt(enc4);
			}
			return output;
		},
		// This will parse a delimited string into an array of
		// arrays. The default delimiter is the comma, but this
		// can be overriden in the second argument.
		CSVToArray:function( strData, strDelimiter ){
			// Check to see if the delimiter is defined. If not,
			// then default to comma.
			strDelimiter = (strDelimiter || ",");
			// Create a regular expression to parse the CSV values.
			var objPattern = new RegExp(
				(
					// Delimiters.
					"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
					// Quoted fields.
					"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
					// Standard fields.
					"([^\"\\" + strDelimiter + "\\r\\n]*))"
				),
				"gi"
				);
			// Create an array to hold our data. Give the array
			// a default empty first row.
			var arrData = [[]];
			// Create an array to hold our individual pattern
			// matching groups.
			var arrMatches = null;
			// Keep looping over the regular expression matches
			// until we can no longer find a match.
			var cnt = 0;
			while (arrMatches = objPattern.exec( strData )){

				// Get the delimiter that was found.
				var strMatchedDelimiter = arrMatches[ 1 ];
				// Check to see if the given delimiter has a length
				// (is not the start of string) and if it matches
				// field delimiter. If id does not, then we know
				// that this delimiter is a row delimiter.

				// Now that we have our delimiter out of the way,
				// let's check to see which kind of value we
				// captured (quoted or unquoted).
				if (arrMatches[ 2 ]){
					// We found a quoted value. When we capture
					// this value, unescape any double quotes.
					var strMatchedValue = arrMatches[ 2 ].replace( new RegExp( "\"\"", "g" ), "\"");
				} else {
					// We found a non-quoted value.
					var strMatchedValue = arrMatches[ 3 ];
				}
				// Now that we have our value string, let's add
				// it to the data array.
				if(strMatchedValue != ""){
					if (
						strMatchedDelimiter.length &&
						(strMatchedDelimiter != strDelimiter)
						){
						// Since we have reached a new row of data,
						// add an empty row to our data array.
						arrData.push( [] );
					}
				}
				arrData[ arrData.length - 1 ].push( strMatchedValue );
				cnt++;
			}
			// Return the parsed data.
			return( arrData );
		},
		CSVStringToObj:function(s) {
			var arrData = new Array();

			for(var i = 0; i < s.length; i++) {
				var a = s[i].split(",");

				for(var j = 0; j < a.length; j++) {
					a[j] = CXDMap.UTIL.filterSpec(a[j]);
				}

				arrData.push(a);
			}

			return arrData;
		},
		filterSpec:function(s) {
			s = s.replace("\r", "");
			s = s.replace("\n", "");
			s = s.replace(/(^s*)|(s*$)/g, "");
			// s = s.replace('"', '&amp;');
			// s = s.replace('"', '&quot;');
			s = s.replace('"', '');
			s = s.replace('"', '');
			s = s.replace(',', '');
			s = s.replace('(', '');
			s = s.replace(')', '');
			s = s.replace('\'', '&#39;');
			// s = s.replace('<', '&lt;');
			// s = s.replace('>', '&gt;');
			s = s.replace("㈜", "(주)");
			/*
			 * var arr_char = "\"'\[]!@#$^&*=\\,<>?！'，．／：；？＾｀｜￣‥…¨〃–―∥＼´ˇ˘˝˙¸˛¡¿ː（）［］｛｝〔〕〈〉《》「」『』【】＋－＜＝＞±×÷≠≤≥∞∴♂♀∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢⇒⇔∀∃∮∑∏＄％￦′″Å￠￡￥¤℉‰€㎕㎗㎘㏄㎣㎤㎦㎙㎚㎛㎞㎢㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰㎱㎲㎳㎴㎵㎶㎷㎸㎹㎀㎁㎂㎃㎄㎺㎻㎼㎽㎾㎿㎐㎑㎒㎓㎔Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆＃＆＊＠§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡ªº─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃╄╅╆╇╈╉╊㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫㉬㉭㉮㉯㉰㉱㉲㉳㉴㉵㉶㉷㉸㉹㉺㉻㈀㈁㈂㈃㈄㈅㈆㈇㈈㈉㈊㈋㈌㈍㈎㈏㈐㈑㈒㈓㈔㈕㈖㈗㈘㈙㈚㈛ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂0123456789ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ½⅓⅔¼¾⅛⅜⅝⅞¹²³⁴ⁿ₁₂₃₄ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψωÆÐĦĲĿŁØŒÞŦŊæđðħıĳĸŀłøœßŧŋŉАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
			 */

			return s;
		},
		fileSizeCheck:function(bytes) {
			var si = true;

			var thresh = si ? 1000 : 1024;
			if(Math.abs(bytes) < thresh) {
				return bytes + ' B';
			}
			var units = si
				? ['KB','MB','GB','TB','PB','EB','ZB','YB']
				: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
			var u = -1;

			do {
				bytes /= thresh;
				++u;
			} while(Math.abs(bytes) >= thresh && u < units.length - 1);
			return bytes.toFixed(1)+' '+units[u];
		},
		HEXToRGB:function(hexStr) {
			var hex = parseInt(hexStr.substring(1), 16);
			var r = (hex & 0xff0000) >> 16;
			var g = (hex & 0x00ff00) >> 8;
			var b = hex & 0x0000ff;
			return [r, g, b];
		}
	} // END OF UTIL
	,POPUP:{
		init:function(){
			IDE.POPUP.initPopup();
			//IDE.POPUP.setPopupCookie();
		},
		initPopup:function(){
			var timediff = $('#timediff').val();
			
			$(".modal-today-close").click(function() {
				$("#pwdChgRecmd").modal("hide");
				setCookie("mycookie", 'popupEnd', 3); //3일간 모달창 띄우지 않기
			})

			var checkCookie = getCookie("mycookie");
				
			if(parseInt(timediff)>=3&&checkCookie!='popupEnd'){//회원의 최종 비밀번호 변경일자가 현재와 3개월 이상 차이날 경우와 쿠키값이 3일이 지났을 경우를 모두 충족하면 모달창을 띄움
				alert('비밀번호를 변경한지 3개월이 경과하였습니다.');
				$('#pwdChgRecmd').modal('show');
			}else{
				$('#pwdChgRecmd').modal('hide');
			}
			
			function setCookie(name, value, expiredays){
				var today = new Date();

				console.log(today.getDate())

				today.setDate(today.getDate() + expiredays); // 현재시간에 3일을 더함 

				document.cookie = name + '=' + escape(value) + '; expires=' + today.toGMTString();

			}
				
			function getCookie(name) {

				var cookie = document.cookie;
				
				if (document.cookie != "") {
					var cookie_array = cookie.split("; ");
					console.log(cookie_array)
					for ( var index in cookie_array) {
						var cookie_name = cookie_array[index].split("=");
						if (cookie_name[0] == "mycookie") {
							return cookie_name[1];
						}
					}
				}
				return;
			}

		}
	}//END OF POPUP
}




$(function() {
	
	$('#canvas').bind('contextmenu', function(e) {
	    return false;
	}); 
	
	 $(window).resize(resizeContents);
	 resizeContents();
	 
	 $("#baseMapCurrent").mouseover(function() {
		clearTimeout(IDE.itv); 
	 });
	 
	 $("#baseMapListWrap li").mouseover(function() {
		clearTimeout(IDE.itv); 
	 });
	 
	 $("#baseMapListWrap li").mouseout(function() {
		 IDE.itv = setTimeout(function() {
			 IDE.BASEMAP.closeBaseMapList();
		 }, 2000);
	 });
	 
	 $("#baseMapCurrent").mouseout(function() {
		 IDE.itv = setTimeout(function() {
			 IDE.BASEMAP.closeBaseMapList();
		 }, 2000);
	 });

	
	$("#MapContainer").on('dragover', function() {
		$("#canvas").addClass("fileActive");
		return false;
	});
	$("#MapContainer").on('dragleave', function() {
		$("#canvas").removeClass("fileActive");
		return false;
	});

	$("#MapContainer").on('drop', function(e) {
		$("#canvas").removeClass("fileActive");

		e.stopPropagation();
		e.preventDefault();

		IDE.FILE.files = e.originalEvent.dataTransfer.files;

		// FILE.readFile();
		IDE.FILE.UTIL.checkExts();

		return false;
	});

	$("#analysisCSVTwoColumn").change(function() {
		if(this.checked) {
			IDE.MAP.DATA.CSV.isTwoColumn = "Y";
			IDE.MAP.DATA.CSV.checkedSampleDataTwoColumn();
		} else {
			IDE.MAP.DATA.CSV.isTwoColumn = "N";
			IDE.MAP.DATA.CSV.callSampleDataPop();
		}
	});
	
	$("#analysisCSV3DPOI").change(function() {
		if(this.checked) {
			IDE.MAP.DATA.CSV.call3DPOISetting();
		} else {
			IDE.MAP.DATA.CSV.callSampleDataSelectTitle();
		}
	});

	/** ****************** INITIALIZE IDE **************************** */
	setTimeout(function() {
		IDE.init();
		
		$('[data-toggle="tooltip"]').tooltip();
		$('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");
       });
	}, 1500);
});

function resizeContents() {
	$("#ideContent").height($(window).height() - 3);
}

$.fn.exists = function() { return this.length > 0; };

jQuery.loadCSS = function(url,id, callback) {
    
	if (!$('link[href="' + url + '"]').length) {
    	$('head').append('<link rel="stylesheet" type="text/css" href="' + url + '" id="'+id+'">');
    }

    callback();
}

/*Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};*/

$("#MapContainer").on("click", function() {
	IDE.PLACE.closeSearch();
});