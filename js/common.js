/**
 * SUBJECT :
 * AUTHOR :
 * LAST UPDATE :
 * COMMENT :
 * ext 폴더 하위 파일 접근 시 TEST_KSM.extPath + "ext/" + 파일명
 * TEST_KSM.extPath = /userData/tpals5555/DEV_DATA/TEST_KSM/
 */

 var script = document.createElement('script');
 script.src = 'https://openlayers.org/en/v3.20.1/build/ol.js';
 document.body.appendChild(script);
 var script = document.createElement('script');
 script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
 document.body.appendChild(script);
 
 let list_data = [
    {"id": "1", "date": "230701", "period": "230701 ~ 270301", "address": "양평읍 공흥리 441-22", "code": "전", "area": 37.14, "loanArea" : 15.65, "use": "경작", "isSend": "예"},
    {"id": "2", "date": "230701", "period": "230701 ~ 270301", "address": "서울 용산구 서빙고로 137", "code": "전", "area": 374.10, "loanArea" : 154.0, "use": "경작", "isSend": "예"},
    {"id": "3", "date": "230701", "period": "230701 ~ 270301", "address": "세종대로 110", "code": "전", "area": 5064.5, "loanArea" : 2340.10, "use": "경작", "isSend": "예"},
    {"id": "4", "date": "230701", "period": "230701 ~ 270301", "address": "고양시 덕양구 행신동 1081", "code": "전", "area": 765.2, "loanArea" : 231.78, "use": "경작", "isSend": "예"},
    {"id": "5", "date": "230701", "period": "230701 ~ 270301", "address": "종로구 자하문로7길 68-4", "code": "산", "area": 12.10, "loanArea" : 10.61, "use": "경작", "isSend": "예"},
    {"id": "6", "date": "240318", "period": "240318 ~ 280318", "address": "서울 용산구 효창원로 177-15", "code": "산", "area": 12.10, "loanArea" : 10.61, "use": "임대", "isSend": "예"}
 ]
 const apiKey = '11971a1d9f8576e5db899c0b789864a0'; 
 var rowsPerPage = 4; // Change this value to set the number of rows per page
 var count = 0;
 var pageCount = 0;
 var table_rows;
 var objData = [];
 var detectLegend = {
     legend: [
         {class_0: {
             name: "건물",
             key: "bldg",
             color: [255, 56, 56],
             classId: "0",
             count: 0
         }},
         {class_1: {
             name: "과수원",
             key: "orchrd",
             color: [255, 112, 31],
             classId: "2",
             count: 0
         }},
         {class_2: {
             name: "답",
             key: "ricfld",
             color: [72, 249, 10],
             classId: "5",
             count: 0
         }},
         {class_3: {
             name: "대",
             key: "grnd",
             color: [146, 204, 23],
             classId: "6",
             count: 0
         }},
         {class_4: {
             name: "도로",
             key: "road",
             color: [61, 219, 134],
             classId: "7",
             count: 0
         }},
         {class_5: {
             name: "묘지",
             key: "grvy",
             color: [0, 212, 187],
             classId: "9",
             count: 0
         }},
         {class_6: {
             name: "비닐하우스",
             key: "phw",
             color: [44, 153, 168],
             classId: "10",
             count: 0
         }},
         {class_7: {
             name: "염전",
             key: "sltpan",
             color: [0, 24, 236],
             classId: "14",
             count: 0
         }},
         {class_8: {
             name: "유지",
             key: "yugi",
             color: [82, 0, 133],
             classId: "16",
             count: 0
         }},
         {class_9: {
             name: "임야",
             key: "frtl",
             color: [203, 56, 255],
             classId: "17",
             count: 0
         }},
         {class_10: {
             name: "전",
             key: "dfld",
             color: [255, 56, 56],
             classId: "20",
             count: 0
         }},
         {class_11: {
             name: "제방",
             key: "dike",
             color: [255, 157, 151],
             classId: "21",
             count: 0
         }},
         {class_12: {
             name: "주차장",
             key: "prkplce",
             color: [207, 210, 49],
             classId: "24",
             count: 0
         }},
         {class_13: {
             name: "창고용지",
             key: "wrhous",
             color: [72, 249, 10],
             classId: "25",
             count: 0
         }},
         {class_14: {
             name: "하천",
             key: "river",
             color: [146, 204, 23],
             classId: "26",
             count: 0
         }},
         {class_15: {
             name: "철도용지",
             key: "rlroad",
             color: [61, 219, 134],
             classId: "27",
             count: 0
         }}
     ]
 }
 
 /* 폴리곤 화면 표출 */
 function callPolygon() {
     console.log("callPolygon", objData);
     for (let i = 0; i < objData.length; i++) {
         count += addPolygon(objData[i].vectorId, objData[i].coordinates, objData[i].crs, objData[i].options, objData[i].resultInfoData, i);
         //resultView(objData[i].resultInfoData, count);
     }
     $.unblockUI();
 }
 
 function addPolygon(id, coordinates, crs, style, resultInfoData, count) {
     setEachCount(resultInfoData);
     var c = count.toString()
     drawPolygon({
         id: id,
         coordinates: coordinates,
         crs: 'EPSG:4326',
         style : style,
         idcount : c
     });
     return 1;
 }
 
 function drawPolygon(dict) {
     // 1. 폴리곤 객체 생성
     var polygon = Module.createPolygon(dict.id);
 
     // 2. 좌표, 파트 설정
     var vertex = new Module.JSVec3Array();
     for (var i = 0;i < dict.coordinates[0].length ;i++){
         vertex.push(new Module.JSVector3D(dict.coordinates[0][i][0], dict.coordinates[0][i][1], dict.coordinates[0][i][2]));
     }
     var part = new Module.Collection();
     part.add(dict.coordinates[0].length);
     polygon.setPartCoordinates(vertex, part);
 
     // 3. 폴리곤 색상 설정 (선택)
     var polygonStyle = new Module.JSPolygonStyle();
 
     polygonStyle.setFill(true);
     polygonStyle.setFillColor(new Module.JSColor(parseInt(255*dict.style.fill.opacity),dict.style.fill.color[0], dict.style.fill.color[1], dict.style.fill.color[2]));
     polygonStyle.setOutLine(false);
     polygon.setStyle(polygonStyle);
 
     var center = polygon.getCenter()
 
     var object = Module.createPoint(dict.id);
     object.setText(dict.style.label.text)
     object.setPosition(center)
 
     // 5. 레이어에 폴리곤 저장
     var layerList = new Module.JSLayerList(true);
     var layer = layerList.createLayer(dict.id, Module.ELT_PLANE);
     layer.addObject(polygon, 0);
     var poi_layer = layerList.createLayer("poi_" + dict.id, Module.ELT_3DPOINT);
     poi_layer.addObject(object, 0);
 }
 
 function setEachCount(infoData) {
     let length = detectLegend.legend.length;  
     for (let i = 0; i < length; i++) {
         let obj = detectLegend.legend[i]['class_'+i];
         if (obj.key == infoData.engNm) {
             obj.count++;
         }
     }
 }
 
 function dataURLtoFile(dataurl, fileName) {
     var arr = dataurl.split(','),
         mime = arr[0].match(/:(.*?);/)[1],
         bstr = atob(arr[1]),
         n = bstr.length,
         u8arr = new Uint8Array(n);
     while (n--) {
         u8arr[n] = bstr.charCodeAt(n);
     }
     return new File([u8arr], fileName, {type: mime});
 }
 
 function checkBoxValue(value) {
     let length = $("input[name='AI_check']:checked").length;
     let checkedValues = null;
     for (let i = 0; i < length; i++) {
         let data = $("input[name='AI_check']:checked")[i].dataset.baseId;
         if (value.class == data) {
             checkedValues = value;
             break;
         }
 
     }
     return checkedValues;
 }
 
 function getScreenMapCoord(coord, identifier, totalCount, alt) {
     var coordinates = [[]];
     var data = detectLegend.legend;
     var dataOption = null;
     for (var i = 0; i < data.length; i++) {
         let index = 'class_' + i;
         if (identifier.classId == data[i][index].classId) {
             dataOption = data[i][index];
             totalCount++;
             break;
         }
     }
     let classNm = dataOption.key;
     let classId = identifier.classId;
     let name = dataOption.name;
     let confidence = identifier.confidence;
     let color = dataOption.color;
     if (color != null || color != undefined) {
         color = [color[0],color[1],color[2]]
     }
     for (var i = 0; i < coord.length; i++) {
         coord[i] = [parseFloat(coord[i][0]), parseFloat(coord[i][1]), parseFloat(alt)];
         var pos = ol.proj.transform(coord[i], 'EPSG:3857', 'EPSG:4326');
         coordinates[0].push(pos);
     }
     options = {
         fill : {
             color : color,
             opacity : 0.5
         },
         stroke:{
             color: color,
             opacity: 0.3,
             width: 0,
             lineDash: 'solid',
         },
         label : {
             fill : {
                 color: '#ffffff',
                 opacity: 1
             },
             text : name
         },
         offsetHeight : 15
     };
     let vectorId = classNm + '_' + classId + '_' + totalCount;
     let crs = 'EPSG:4326';
     let resultInfoData = {count : totalCount, engNm : dataOption.key, korNm : dataOption.name, conf : identifier.confidence, vectorId : vectorId};
 
     objData.push({vectorId, coordinates, crs, options, resultInfoData});
 }
 
 function downloadFile(fileInfo) {
     // 파일 정보에서 Blob 생성을 위한 목적 데이터
     const data = new Blob(["파일의 내용을 여기에 넣으세요"], { type: fileInfo.type });
 
     // Blob으로부터 다운로드 URL 생성
     const downloadUrl = URL.createObjectURL(data);
 
     // a 태그를 생성하여 다운로드 링크로 사용
     const a = document.createElement("a");
     a.href = downloadUrl;
     a.download = fileInfo.name; // 다운로드될 파일명 설정
     document.body.appendChild(a);
     a.click(); // 링크 클릭하여 다운로드
 
     // 사용 후 다운로드 링크 제거
     document.body.removeChild(a);
     URL.revokeObjectURL(downloadUrl); // 생성된 URL 해제
 }
 
 
 function showPage(page) {
     var start = (page - 1) * rowsPerPage;
     var end = start + rowsPerPage;
     for (var i = 0; i < table_rows.length; i++) {
         if (i >= start && i < end) {
             table_rows[i].style.display = '';
         } else {
             table_rows[i].style.display = 'none';
         }
     }
 }
 
 function createPagination() {
     var pagination = document.querySelector('.pagination');
     for (var i = 1; i <= pageCount; i++) {
         var btn = document.createElement('button');
         btn.textContent = i;
         btn.addEventListener('click', function() {
             showPage(this.textContent);
             var currentBtn = pagination.querySelector('.active');
             if (currentBtn) currentBtn.classList.remove('active');
             this.classList.add('active');
         });
         pagination.appendChild(btn);
     }
     pagination.firstChild.classList.add('active');
 }
 
 function aiJudgment() {
     console.log("ai_judgment");
 
     var canvasStyle = "";
     canvasStyle += "display:none;position:absolute;left:90px;top:0;zIndex:90;";
 
     var eParent = document.getElementById('MapContainer')
     var copyCanvas = document.createElement("canvas");
     copyCanvas.style = canvasStyle;
     copyCanvas.id = "copyCanvas";
     eParent.appendChild(copyCanvas);
 
     var ctx = copyCanvas.getContext('2d');
     copyCanvas.width = Module.canvas.width;
     copyCanvas.height = Module.canvas.height;
 
     ctx.drawImage(Module.canvas, 0, 0);
     //img 바이너리
     var dataUrl = Module.canvas.toDataURL("image/png");
     var imgFile = dataURLtoFile(dataUrl, 'hello.png');
     var formData = new FormData();
     formData.append("file", imgFile);
     formData.append("return_type", "json");
     
     // ai분석 url - 일반, 고도화
     var aiUrl = ["?url=http://203.228.54.47/detectai", "?url=http://49.247.20.149:5002/detectai"];
     let coordinate = [];
     let size;
     try {
         var topLeft = Module.getMap().ScreenToMapPointEX(new Module.JSVector2D(0,60));
         var bottomRight = Module.getMap().ScreenToMapPointEX(new Module.JSVector2D(window.innerWidth,window.innerHeight));
         console.log(topLeft)
         console.log(bottomRight)
 
         coordinate.push(ol.proj.transform([topLeft["Longitude"], topLeft["Latitude"]], 'EPSG:4326', 'EPSG:3857'));
         coordinate.push(ol.proj.transform([bottomRight["Longitude"], bottomRight["Latitude"]], 'EPSG:4326', 'EPSG:3857'));
     } catch (e) {
         console.log("e",e);
         toastr.error("화면조정후 다시 시도하세요.");
         $.unblockUI();
         return false;
     }
     size = {width : Module.canvas.width, height : Module.canvas.height};
     formData.append("coordinate", coordinate);
     formData.append("size", size);
 
     console.log(coordinate)
     fData = {};
     fData['coordinate'] = coordinate
     fData["size"] = size
 
     var pUrl = "https://ai.egiscloud.com/detectai"
 
     $.ajax({
         url: pUrl,
         type: "POST",
         dataType: "json",
         data: formData,					
         processData: false,
         contentType: false,
         success: function (result) {
             console.log(result)
             var alt = topLeft["Altitude"];
             if (result.response == null) {
                 toastr.error("분석결과값이 없습니다. 화면조정후 다시 시도하세요.");
                 $.unblockUI();
                 return false;
             } else {
                 if(result.response.length == 0 || result.response.length == undefined){
                     toastr.error("분석결과값이 없습니다. 화면조정후 다시 시도하세요.");
                     //ui.loadingBar("hide");
                     $.unblockUI();
                     return false;
                 }
             }
             if(result.response.length > 0) {
                 var detections;
                 var screenCoord = [];
                 var identifier = [];
                 var totalCount = 0;
                 for (var j = 0; j < result.response.length; j++) {
                     detections = result.response[j].detections.split(', ');
                     if (detections.length == 3) {
                         console.log(detections);
                         detections.push(detections[0]);
                     }
                     if (detections.length <= 2) {
                         console.log(detections);
                         break;
                     }
                     identifier.push({class : result.response[j].class, classId : result.response[j].classid, confidence : result.response[j].confidence});
                     screenCoord.push(detections);
                 }
                 for (var i = 0; i < screenCoord.length; i++) {
                     var analCoord = [];
                     for (var j = 0; j < screenCoord[i].length; j++){
                         var coord = screenCoord[i][j].split(' ');
                         analCoord.push(coord);
                     }
                     getScreenMapCoord(analCoord, identifier[i], totalCount++, alt);
                 }
                 // 격자효과
                 callPolygon();
             }
         },
         error: function(request, status, error){
             console.log("false")
             console.log(error)
 
         }
     });
 }
 
 function selectResult() {
     const selectElement = document.getElementById('searchResults');
     const searchAdd = document.getElementById('addressInput');
     const selectedOption = selectElement.options[selectElement.selectedIndex];
     const latitude = selectedOption.getAttribute('data-latitude');
     const longitude = selectedOption.getAttribute('data-longitude');    
     let camera = Module.getViewCamera();
     let pos = new Module.JSVector3D(longitude, latitude, 400);
     camera.setTilt(90);
     camera.setDirect(0);
     camera.setLocation(pos);
 
     // 선택 후 팝업 닫기
     selectElement.style.display = 'none';
     searchAdd.style.display = 'inline';
 }
 
 function delImgFile(e) {
     if (e.previousElementSibling.id == "sptPhoto") {
         $('#sptPhotoThumb').attr('src','');
         $('#sptPhoto').val('');
         sptPhotoFile = null;
         $('#delSptPhoto').addClass('dsplyNone');
         $('#sptPhotoThumb').addClass('dsplyNone');
     } else {
         $('#satlitPhotoThumb').attr('src','');
         $('#satlitPhoto').val('');
         satlitPhotoFile = null;
         $('#delSatlitPhoto').addClass('dsplyNone');
         $('#satlitPhotoThumb').addClass('dsplyNone');
     }
 }
 
 function downloadPdf() {
     $('.buttonBordr, #sptPhoto, #satlitPhoto, #delSptPhoto, .delFileButton').addClass('dsplyNone');
     $('input, select, textarea').addClass('pdfConvert');
     
     html2canvas(document.querySelector('#wrtContent'), { scale: 4 }).then(canvas => {
         let imgData = canvas.toDataURL("image/png"); // PNG로 변경
         
         $('#wrtContent').addClass('dsplyNone');
         let img = $('#wrtContent').after('<img id="pdfImg"/>');
         $('#pdfImg').attr('src', imgData);
         
         let imgWidth = 200; // 이미지 가로 길이(mm) A4 기준
         let pageHeight = imgWidth * 1.414;  // 출력 페이지 세로 길이 계산 A4 기준
         let imgHeight = canvas.height * imgWidth / canvas.width;
         let heightLeft = imgHeight;
 
         let pdf = new jspdf.jsPDF('p', 'mm', 'a4');
         let pdfImageSrc = $('#pdfImg').attr('src');
         pdf.addImage(pdfImageSrc, 'PNG', 10, 10, 190, imgHeight);
         heightLeft -= pageHeight;
 
         pdf.save('공유재산_실태_조사서.pdf');
         $('#pdfImg').remove();
         setTimeout(() => {
             $('#wrtContent').removeClass('dsplyNone');
         }, 500);
     });
     $('.buttonBordr, #sptPhoto, #satlitPhoto, #delSptPhoto, .delFileButton').removeClass('dsplyNone');
     $('input, select, textarea').removeClass('pdfConvert');
 }
 
 
 function isNullStr(str) {
     str = $.trim(str);
     if (str == null || str == 'undefined' || str.length == 0 || typeof str == 'undefined' || str == '') {
         return true;
     } else {
         return false;
     }
 }
 
 function btn_move_map(id) {
     var seleted_data = list_data[id-1];
     
     // 상세보기 정보 초기화
     $("#detail_location").val("");
     $("#detail_date").val("");
     $("#detail_period").val("");
     $("select[name=detail_code]").val("").prop("selected", true);
     $("#detail_area").val("");
     $("#detail_size").val("");
     $("#detail_use").val("");
     $("#detail_personal_code").val("");
     $("select[name=detail_send]").val("").prop("selected", true);
     $("#detail_name").val("");
     $("#detail_address").val("");
     $("#detail_address_code").val("");
     $("#detail_phone").val("");
     $("#detail_note").val("");
     $("select[name=detail_receipt]").val("").prop("selected", true);
     
     // 상세보기 정보 채우기
     $("#moduleDetailContainer").removeClass("hidden");
     $("#detail_location").val(seleted_data['address']);
     $("#detail_date").val(seleted_data['date']);
     $("#detail_period").val(seleted_data['period']);
     $("select[name=detail_code]").val(seleted_data['code']).prop("selected", true);
     $("#detail_area").val(seleted_data['area']);
     $("#detail_size").val(seleted_data['loanArea']);
     $("#detail_use").val(seleted_data['use']);
     $("select[name=detail_send]").val(seleted_data['isSend']).prop("selected", true);
     
     // 카메라 이동
     var url = `https://dapi.kakao.com/v2/local/search/address.json?query=${seleted_data['address']}`;
     var headers = {
         'Authorization': `KakaoAK ${apiKey}`
     };
     fetch(url, { headers })
         .then(response => response.json())
         .then(data => {
             var res = data.documents[0];
                console.log(res);
             let camera = Module.getViewCamera();
             let pos = new Module.JSVector3D(res.x, res.y, 400);
             camera.setTilt(90);
             camera.setDirect(0);
             camera.setLocation(pos);
            })
 }
 
 function readImage(input, id) {
     if (id == "sptPhoto") {
         if (input.files && input.files[0]) {
             const reader = new FileReader();
             reader.onload = e => {
                 const previewImage = document.getElementById("sptPhotoThumb");
                 previewImage.src = e.target.result;
             }
             reader.readAsDataURL(input.files[0]);
     
             if ($('#sptPhotoThumb').hasClass('dsplyNone')) {
                 $('#sptPhotoThumb').removeClass('dsplyNone');
             }
         }
     } else if (id == "satlitPhoto") {
         if (input.files && input.files[0]) {
             const reader = new FileReader();
             reader.onload = e => {
                 const previewImage = document.getElementById("satlitPhotoThumb");
                 previewImage.src = e.target.result;
             }
             reader.readAsDataURL(input.files[0]);
             
             if ($('#satlitPhotoThumb').hasClass('dsplyNone')) {
                 $('#satlitPhotoThumb').removeClass('dsplyNone');
             }
         }
     }
 }
 
 function btn_download_pdf(e){
     console.log("btn_download_pdf", e);
     $('#moduleFile').removeClass("hidden");
     document.getElementById('delSatlitPhoto').click();
     document.getElementById('delSptPhoto').click();
     
     document.getElementById("satlitPhotoThumb").src = "";
     document.getElementById("sptPhotoThumb").src = "";
     $('input[name="locplc"]').val(list_data[e-1].address);
     $('input[name="code"]').val(list_data[e-1].code);
     $('input[name="ar"]').val(list_data[e-1].area);
 }

 
         // 앱 시작시 초기화 항목
         $("#closeAppNameClose").on('click',function(){
            IDE.MODULE.closeModule(TEST_KSM.appid); // 앱 종료 버튼 클릭
        });

        // html 태그중 noScroll 클래스를 보유 하고 있는 영역에서 마우스 스크롤을 해도 지도 줌 인/아웃이 작동하지 않는다.
        $(".noScroll").mouseover(function() {
            Module.XDIsMouseOverDiv(true);
        })
        .mouseout(function() {
            Module.XDIsMouseOverDiv(false);
        });
        
         $("#closeManagementLIstClose").on('click', function(){
             document.getElementById('moduleManagementLIstContainer').style.display = 'none';
             $("#moduleDetailContainer").addClass("hidden");
             $(".pagination").empty();
        });
        
        $("#closeDetailClose").on('click', function(){
            $("#moduleDetailContainer").addClass("hidden");
        });
        
        $("#closeLayerClose").on('click', function(){
            $("#moduleLayerContainer").addClass("hidden");
        });    
        
        $("#layer").on('click', function(){
            if ($('#moduleLayerContainer').hasClass('hidden')) {
                $('#moduleLayerContainer').removeClass('hidden');
            }else{
                $("#moduleLayerContainer").addClass("hidden");
            }
        });
        
        $("#closeNewAddressClose").on('click', function(){
             document.getElementById('moduleNewAddressContainer').style.display = 'none';
        });

        $("#closeFileClose").on('click', function(){
             $('#moduleFile').addClass("hidden");
        });
        
        $("#cap_img").on('click', function(){
            var canvasStyle = "";
            canvasStyle += "display:none;position:absolute;left:90px;top:0;zIndex:90;";

            var eParent = document.getElementById('MapContainer')
            var copyCanvas = document.createElement("canvas");
            copyCanvas.style = canvasStyle;
            copyCanvas.id = "copyCanvas";
            eParent.appendChild(copyCanvas);

            var ctx = copyCanvas.getContext('2d');
            copyCanvas.width = Module.canvas.width;
            copyCanvas.height = Module.canvas.height;
            ctx.drawImage(Module.canvas, 0, 0);
            
            //img 바이너리
            var dataUrl = Module.canvas.toDataURL("image/png");

            // a 태그 생성 후 다운로드 링크로 사용
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "image" || 'canvas-image.png';  // 파일 이름 지정, 기본값 설정

            // 링크를 클릭하여 이미지 다운로드
            document.body.appendChild(link);
            link.click();

            // a 태그 제거
            document.body.removeChild(link);
        });
        
        $("#management_list").on('click', function(){
            var element = document.getElementById('moduleManagementLIstContainer');
            var currentState = window.getComputedStyle(element).getPropertyValue('display');
            const inner_element = document.getElementById('tbody');
            inner_element.innerHTML = "";
            if (currentState === 'none') {
                for (let e of list_data){
                    inner_element.innerHTML += `<tr>
                                                    <td class="col_date">${e.date}</td>
                                                    <td class="col_period">${e.period}</td>
                                                    <td class="col_address">${e.address}</td>
                                                    <td class="col_code">${e.code}</td>
                                                    <td class="col_area">${e.area}</td>
                                                    <td class="col_loanArea">${e.loanArea}</td>
                                                    <td class="col_use">${e.use}</td>
                                                    <td class="col_send">${e.isSend}</td>
                                                    <td class="col_detail"><button class="custom-btn btn-1" onclick="btn_move_map('${e.id}')">보기</button></td>
                                                    <td class="col_down"><button class="custom-btn btn-1" onclick="btn_download_pdf(${e.id})">다운</button></td>
                                                    <td class="col_delete"><button class="custom-btn btn-1">삭제</button></td>
                                                </tr>`;
                }
                element.style.display = 'block';
                var element_new = document.getElementById('moduleNewAddressContainer');
                element_new.style.display = 'none';
                var table = document.getElementById('tblMain');
                table_rows = table.tBodies[0].rows;
                pageCount = Math.ceil(table_rows.length / rowsPerPage);
                createPagination();
                showPage(1);
            } else {
                inner_element.innerHTML = "";
                element.style.display = 'none';moduleFile
                $("#moduleDetailContainer").addClass("hidden");
                $("#moduleFile").addClass("hidden");
                $(".pagination").empty();
            }
        });
        
        $("#new_address").on('click', function(){
            console.log("new_address click");
            var element = document.getElementById('moduleNewAddressContainer');
            var currentState = window.getComputedStyle(element).getPropertyValue('display');
            if (currentState === 'none') {
                element.style.display = 'block';
                var element_list = document.getElementById('moduleManagementLIstContainer');
                element_list.style.display = 'none';
                $("#moduleDetailContainer").addClass("hidden");
                $("#moduleFile").addClass("hidden");
            } else {
                element.style.display = 'none';
            }
        });
        
        $("#ai_judgment").on('click', function(){
            aiJudgment();
        });
        
        $("#cancle").on('click', function(){
            var element = document.getElementById('moduleNewAddressContainer');
            element.style.display = 'none';
        });
        
        $("#submit").on('click', function(){
            var input_data = [];
            input_data['inputLocation'] = $("#input_location").val();
            input_data['inputDate'] = $("#input_date").val();
            input_data['inputPeriod'] = $("#input_period").val();
            input_data['inputCode'] = $("#input_code").val();
            input_data['inputArea'] = $("#input_area").val();
            input_data['inputSize'] = $("#input_size").val();
            input_data['inputUse'] = $("#input_use").val();
            input_data['inputPersonalCode'] = $("#input_personal_code").val();
            input_data['inputSend'] = $("#input_send").val();
            input_data['inputName'] = $("#input_name").val();
            input_data['inputAddress'] = $("#input_address").val();
            input_data['inputAddressCode'] = $("#input_address_code").val();
            input_data['inputPhone'] = $("#input_phone").val();
            input_data['inputNote'] = $("#input_note").val();
            input_data['inputReceipt'] = $("#input_receipt").val();
            console.log("submit", input_data);
        });
        
        // 조사목록 검색
        $('input[name="keyword"]').keyup(function() {
            var val = $(this).val();
            if (isNullStr(val)) {
                $('#tblMain > tbody > tr').show();
            } else {
                $('#tblMain > tbody > tr').hide();
                // 대소문자를 구분(contains)하는 버전
                var filtered = $('#tblMain > tbody > tr > td:nth-child(4n+3):contains("' + val + '")');
                filtered.parent().show();
            }
        });
        
        // 산 on/off
        $('input[name="mountain"]').on('click', function() {
            var val = $(this).is(':checked');
            var filtered = $('#tblMain > tbody > tr > td:nth-child(4n+4):contains("산")');
            if (val){
                filtered.parent().show();
            }else{
                filtered.parent().hide();
            }
        });
        
        $('input[name="layer_ai"]').on('click', function() {
            var val = $(this).is(':checked');
            if (val){
                callPolygon();
            }else{
                let layerList = new Module.JSLayerList(true); 
                let count = layerList.count();
                for(var i = 0; i<count; i++){
                    layerList.delLayerAtLast();
                }
            }
        });
        
        const inputImage = document.getElementById("sptPhoto");
        inputImage.addEventListener("change", e => {
            readImage(e.target, inputImage.id);
        });

        const inputSatlitImage = document.getElementById("satlitPhoto");
        inputSatlitImage.addEventListener("change", e => {
            readImage(e.target, inputSatlitImage.id);
        })
        
        $("#sptPhoto").on("change", function(event){
            sptPhotoFile = event.target.files[0];
            if ($('#delSptPhoto').hasClass('dsplyNone')) {
                $('#delSptPhoto').removeClass('dsplyNone');
            }
        });

        $('#satlitPhoto').on("change", function(event){
            satlitPhotoFile = event.target.files[0];
            if ($('#delSatlitPhoto').hasClass('dsplyNone')) {
                $('#delSatlitPhoto').removeClass('dsplyNone');
            }
        });
        
        $("#serchAddress").on('click', function(){
            const query = document.getElementById('addressInput').value.trim();
            if (query === '') {
                const searchResultsElement = document.getElementById('searchResults');
                searchResultsElement.innerHTML = ''; 
                return;
            }

            var url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;
            var headers = {
                'Authorization': `KakaoAK ${apiKey}`
            };

            fetch(url, { headers })
                .then(response => response.json())
                .then(data => {
                const results = data.documents;
                if (results && results.length > 0) {
                    const searchResultsElement = document.getElementById('searchResults');
                    const searchAdd = document.getElementById('addressInput');
                    searchResultsElement.innerHTML = ''; // 이전 검색 결과 지우기
                    const option = document.createElement('option');
                    option.textContent = '선택해주세요';
                    searchResultsElement.appendChild(option);

                    results.forEach(result => {
                        const option = document.createElement('option');
                        option.textContent = result.place_name;
                        option.setAttribute('data-latitude', result.y);
                        option.setAttribute('data-longitude', result.x);
                        searchResultsElement.appendChild(option);
                    });
                    searchResultsElement.style.display = 'inline';
                    searchAdd.style.display = 'none';
                } else {
                    alert('검색 결과가 없습니다.');
                }
            })
                .catch(error => {
                console.error('API 호출에 실패했습니다.', error);
            });
        });
        
 
 var TEST_KSM = {
     appid : null, // 모듈(앱) ID (앱 실행시 자동 부여됨)
     extPath : null, // 모듈(앱) 경로 (앱 실행시 자동 부여됨)
     init:function() {
     },
     
     onBackground:function() {
         // 앱 실행 상태 Background (앱 기능 충돌시 기능 처리)
     },
 
     onForeground:function() {
         // 앱 실행 상태 Foreground (앱 기능 충돌시 기능 처리)
     },
 
     reset:function() {
         // 앱 실행중 변경된 항목 모두 초기화
     },
 
     destory:function() {
         // 앱 실행 종료 - 모든 이벤트 Unregister, 앱설정등 모두 초기화
     },
 
 }