var ZXXFILE = {
	numLimit: 0,				//是否开启数量限制
	resize : 1,				    //压缩比率
	module : 'other',			//模块名称
	indexlength:0,
	width : 200,				//kuandu
	fileInput: null,				//html file控件
	dragDrop: null,					//拖拽敏感区域
	upButton: null,					//提交按钮
	url: "",						//ajax地址
	fileFilter: [],					//过滤后的文件数组
	filter: function(files) {		//选择文件组的过滤方法
		return files;	
	},
	onSelect: function() {},		//文件选择后
	onDelete: function() {},		//文件删除后
	onDragOver: function() {},		//文件拖拽到敏感区域时
	onDragLeave: function() {},	//文件离开到敏感区域时
	onProgress: function() {},		//文件上传进度
	onSuccess: function() {},		//文件上传成功时
	onFailure: function() {},		//文件上传失败时,
	onComplete: function() {},		//文件全部上传完毕时

	
	/* 开发参数和内置方法分界线 */
	
	//文件拖放
	funDragHover: function(e) {
		e.stopPropagation();
		e.preventDefault();
		this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
		return this;
	},
	//获取选择文件，file控件或拖放
	funGetFiles: function(e) {
		// 取消鼠标经过样式
		this.funDragHover(e);
				
		// 获取文件列表对象
		var files = e.target.files || e.dataTransfer.files;
		//继续添加文件
		this.fileFilter = this.fileFilter.concat(this.filter(files));
		//this.funDealFiles();
		this.funDealFiles(files);
		return this;
	},
	
	//选中文件的处理与回调
	funDealFiles: function(files) {
		var l= this.fileFilter.length-files.length;
		for (var i = 0, file; file = files[i]; i++) {
			//增加唯一索引值
			file = this.fileFilter[l+i];
			//file.index =this.indexlength++;
			file.index =1;
		}
		//执行选择回调
		//this.onSelect(this.fileFilter);
		this.onSelect(files,this.fileFilter.length);
		return this;
	},
	
	//删除对应的文件
	funDeleteFile: function(fileDelete) {
		//var arrFile = [];
		for (var i = 0, file; file = this.fileFilter[i]; i++) {
			if (file == fileDelete) {
				this.onDelete(fileDelete,i);	
				file.index=0;
			}
		}
		//this.fileFilter = arrFile;
		return this;
	},
	
	//文件上传
	funUploadFile: function() {
		var self = this;	
		if (location.host.indexOf("sitepointstatic") >= 0) {
			//非站点服务器上运行
			return;	
		}
		
		//是否开启数量限制
		if(self.numLimit){
			if(($("#upload_preview").find(".list").length) > self.numLimit){
				alert("只能上传" + self.numLimit + "个文件");
				return false;
			}			
		}
		
		
		//判断是否有上传文件
		if(this.fileFilter.length)
		{   
			var tmplen=0,sendedlen=0;
			for (var i=0, file; file = this.fileFilter[i]; i++) {
				(function(file, i) {
					if(file.index)
					{			
						    tmplen++;
	
							// 开始上传
							//xhr.open("POST", self.url, true);
							//xhr.setRequestHeader("X_FILENAME", file.name);
							//xhr.send(file);
							//var formdata = new FormData();
		                    //formdata.append("FileData",  file);
							//formdata.append("mediatype",  self.mediatype);
		                    // 开始上传
							self.compressImgData({
					             width: self.width,
					             quality: self.resize,
					             file:file,	
   				                 success: function (result,file) {
					            	 var FileData = "Data="+ result.clearBase64 +"&Name="+ file.name+"&module="+ self.module ;	

					            	 var xhr = new XMLHttpRequest();
									 if (xhr.upload) {
											// 上传中
											xhr.upload.addEventListener("progress", function(e) {
												self.onProgress(file, e.loaded, e.total);
											}, false);
								
											// 文件上传成功或是失败
											xhr.onreadystatechange = function(e) {
												if (xhr.readyState == 4) {
													if (xhr.status == 200) {
														sendedlen++;
														self.onSuccess(file, xhr.responseText);
														self.funDeleteFile(file);
														if (tmplen ==sendedlen ) {											
															//全部完毕
															self.onComplete();	
														}
													} else {
														
														self.onFailure(file, xhr.responseText);		
													}
												}
											};
					            	xhr.open("POST", self.url , true);
					            	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"); 
				                    xhr.send(FileData);	
									 } 
					             }
					         });
		                    
		                   
						//}						
					}
				})(file,i);	
			}
		}else{
			self.onComplete();
		}
			
	},
 compressImgData:function (obj) {          
            var reader = new FileReader();
            var uploadBase64;
            var conf = {}, file = obj.file;

            // wifi 下图片高质量
            if (window.NETTYPE == window.NETTYPE_WIFI) {
                conf = {
                    maxW: 3000, //目标宽
                    maxH: 1280, //目标高
                    quality: obj.quality || 0.8, //目标jpg图片输出质量
                };
            }

            reader.onload = function(e) {
                var imgresult = this.result;

                // 如果是jpg格式图片，读取图片拍摄方向,自动旋转
                if (file.type == 'image/jpeg'){
                    // console.log(result);
                    // console.log(file.name);
                    try {
                        var jpg = new JpegMeta.JpegFile(imgresult, file.name);
                    } catch (e) {
                        //jq.DIC.dialog({content: '图片不是正确的图片数据',autoClose:true});
                        //jq('#li' + id).remove();
                        alert(e);
                        return false;
                    }
                    if (jpg.tiff && jpg.tiff.Orientation) {
                        //设置旋转
                        conf = jQuery.extend(conf, {
                            orien: jpg.tiff.Orientation.value
                        });
                    }
                }

                // 压缩
                if (ImageCompresser.support()) {
                    var img = new Image();
                    img.onload = function() {
                        console.log(conf);
                        try {
                            uploadBase64 = ImageCompresser.getImageBase64(this, conf);
                        } catch (e) {
                            //jq.DIC.dialog({content: '压缩图片失败',autoClose:true});
                            //jq('#li' + id).remove();
                            return false;
                        }
                        if (uploadBase64.indexOf('data:image') < 0) {
                            //jq.DIC.dialog({content: '上传照片格式不支持',autoClose:true});
                            //jq('#li' + id).remove();
                            return false;
                        }
                       // 生成结果
                       var result = {
            	            index:obj.index,
                          base64 : uploadBase64,
                          clearBase64: uploadBase64.substr( uploadBase64.indexOf(',') + 1 )
                       };  
                       // 执行后函数
                      obj.success(result,file);
                    }
                    img.onerror = function() {
                        //jq.DIC.dialog({content: '解析图片数据失败',autoClose:true});
                        //jq('#li' + id).remove();
                        return false;
                    }
                    img.src = ImageCompresser.getFileObjectURL(file);
                    // console.log('compress');
                } else {
                    uploadBase64 = imgresult;
                    if (uploadBase64.indexOf('data:image') < 0) {
                        //jq.DIC.dialog({content: '上传照片格式不支持',autoClose:true});
                        //jq('#li' + id).remove();
                        return false;
                    }
                                           // 生成结果
                    var result = {
            	            index:obj.index,
                          base64 : uploadBase64,
                          clearBase64: uploadBase64.substr( uploadBase64.indexOf(',') + 1 )
                       };  
                       // 执行后函数
                      obj.success(result,file);
              }
        }
       reader.readAsBinaryString(file);
  }, 
init: function() {
		var self = this;
		
		if (this.dragDrop) {
			this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
		}
		
		//文件选择控件选择
		if (this.fileInput) {
			this.fileInput.addEventListener("change", function(e) { 
				self.funGetFiles(e); 
				self.funUploadFile(e);	
			}, false);	
		}
		
		//上传按钮提交
		if (this.upButton) {
			this.upButton.addEventListener("click", function(e) { self.funUploadFile(e); }, false);	
		} 
	}
};

var JpegMeta={};this.JpegMeta=JpegMeta;JpegMeta.parseNum=function parseNum(a,g,h,d){var c;var b;var e=(a===">");if(h===undefined){h=0}if(d===undefined){d=g.length-h}for(e?c=h:c=h+d-1;e?c<h+d:c>=h;e?c++:c--){b<<=8;b+=g.charCodeAt(c)}return b};JpegMeta.parseSnum=function parseSnum(a,g,h,d){var c;var b;var j;var e=(a===">");if(h===undefined){h=0}if(d===undefined){d=g.length-h}for(e?c=h:c=h+d-1;e?c<h+d:c>=h;e?c++:c--){if(j===undefined){j=(g.charCodeAt(c)&128)===128}b<<=8;b+=j?~g.charCodeAt(c)&255:g.charCodeAt(c)}if(j){b+=1;b*=-1}return b};JpegMeta.Rational=function Rational(a,b){this.num=a;this.den=b||1;return this};JpegMeta.Rational.prototype.toString=function toString(){if(this.num===0){return""+this.num}if(this.den===1){return""+this.num}if(this.num===1){return this.num+" / "+this.den}return this.num/this.den};JpegMeta.Rational.prototype.asFloat=function asFloat(){return this.num/this.den};JpegMeta.MetaGroup=function MetaGroup(b,a){this.fieldName=b;this.description=a;this.metaProps={};return this};JpegMeta.MetaGroup.prototype._addProperty=function _addProperty(d,a,c){var b=new JpegMeta.MetaProp(d,a,c);this[b.fieldName]=b;this.metaProps[b.fieldName]=b};JpegMeta.MetaGroup.prototype.toString=function toString(){return"[MetaGroup "+this.description+"]"};JpegMeta.MetaProp=function MetaProp(c,a,b){this.fieldName=c;this.description=a;this.value=b;return this};JpegMeta.MetaProp.prototype.toString=function toString(){return""+this.value};JpegMeta.JpegFile=function JpegFile(m,a){var k=this._SOS;this.metaGroups={};this._binary_data=m;this.filename=a;var l=0;var g=0;var c;var i;var b;var h;var d;var e;var j;	if(this._binary_data.slice(0,2)!==this._SOI_MARKER){		throw new Error("Doesn't look like a JPEG file. First two bytes are "+this._binary_data.charCodeAt(0)+","+this._binary_data.charCodeAt(1)+".")	}	l+=2;	while(l<this._binary_data.length){c=this._binary_data.charCodeAt(l++);i=this._binary_data.charCodeAt(l++);console.log(i.toString(16));g=l;if(c!=this._DELIM){break}if(i===k){break}	d=JpegMeta.parseNum(">",this._binary_data,l,2);console.log("headsize="+d);l+=d;while(l<this._binary_data.length){c=this._binary_data.charCodeAt(l++);if(c==this._DELIM){b=this._binary_data.charCodeAt(l++);if(b!=0){l-=2;break}}}h=l-g;if(this._markers[i]){e=this._markers[i][0];j=this._markers[i][1]}else{e="UNKN";j=undefined}if(j){this[j](i,g+2)}}if(this.general===undefined){throw Error("Invalid JPEG file.")}return this};this.JpegMeta.JpegFile.prototype.toString=function(){return"[JpegFile "+this.filename+" "+this.general.type+" "+this.general.pixelWidth+"x"+this.general.pixelHeight+" Depth: "+this.general.depth+"]"};this.JpegMeta.JpegFile.prototype._SOI_MARKER="\xff\xd8";this.JpegMeta.JpegFile.prototype._DELIM=255;this.JpegMeta.JpegFile.prototype._EOI=217;this.JpegMeta.JpegFile.prototype._SOS=218;this.JpegMeta.JpegFile.prototype._sofHandler=function _sofHandler(b,a){if(this.general!==undefined){throw Error("Unexpected multiple-frame image")}this._addMetaGroup("general","General");this.general._addProperty("depth","Depth",JpegMeta.parseNum(">",this._binary_data,a,1));this.general._addProperty("pixelHeight","Pixel Height",JpegMeta.parseNum(">",this._binary_data,a+1,2));this.general._addProperty("pixelWidth","Pixel Width",JpegMeta.parseNum(">",this._binary_data,a+3,2));this.general._addProperty("type","Type",this._markers[b][2])};this.JpegMeta.JpegFile.prototype._JFIF_IDENT="JFIF\x00";this.JpegMeta.JpegFile.prototype._JFXX_IDENT="JFXX\x00";this.JpegMeta.JpegFile.prototype._EXIF_IDENT="Exif\x00";this.JpegMeta.JpegFile.prototype._types={1:["BYTE",1],2:["ASCII",1],3:["SHORT",2],4:["LONG",4],5:["RATIONAL",8],6:["SBYTE",1],7:["UNDEFINED",1],8:["SSHORT",2],9:["SLONG",4],10:["SRATIONAL",8],11:["FLOAT",4],12:["DOUBLE",8]};this.JpegMeta.JpegFile.prototype._tifftags={256:["Image width","ImageWidth"],257:["Image height","ImageLength"],258:["Number of bits per component","BitsPerSample"],259:["Compression scheme","Compression",{1:"uncompressed",6:"JPEG compression"}],262:["Pixel composition","PhotmetricInerpretation",{2:"RGB",6:"YCbCr"}],274:["Orientation of image","Orientation",{1:"Normal",2:"Reverse?",3:"Upside-down",4:"Upside-down Reverse",5:"90 degree CW",6:"90 degree CW reverse",7:"90 degree CCW",8:"90 degree CCW reverse"}],277:["Number of components","SamplesPerPixel"],284:["Image data arrangement","PlanarConfiguration",{1:"chunky format",2:"planar format"}],530:["Subsampling ratio of Y to C","YCbCrSubSampling"],531:["Y and C positioning","YCbCrPositioning",{1:"centered",2:"co-sited"}],282:["X Resolution","XResolution"],283:["Y Resolution","YResolution"],296:["Resolution Unit","ResolutionUnit",{2:"inches",3:"centimeters"}],273:["Image data location","StripOffsets"],278:["Number of rows per strip","RowsPerStrip"],279:["Bytes per compressed strip","StripByteCounts"],513:["Offset to JPEG SOI","JPEGInterchangeFormat"],514:["Bytes of JPEG Data","JPEGInterchangeFormatLength"],301:["Transfer function","TransferFunction"],318:["White point chromaticity","WhitePoint"],319:["Chromaticities of primaries","PrimaryChromaticities"],529:["Color space transformation matrix coefficients","YCbCrCoefficients"],532:["Pair of black and white reference values","ReferenceBlackWhite"],306:["Date and time","DateTime"],270:["Image title","ImageDescription"],271:["Make","Make"],272:["Model","Model"],305:["Software","Software"],315:["Person who created the image","Artist"],316:["Host Computer","HostComputer"],33432:["Copyright holder","Copyright"],34665:["Exif tag","ExifIfdPointer"],34853:["GPS tag","GPSInfoIfdPointer"]};
this.JpegMeta.JpegFile.prototype._exiftags={36864:["Exif Version","ExifVersion"],40960:["FlashPix Version","FlashpixVersion"],40961:["Color Space","ColorSpace"],37121:["Meaning of each component","ComponentsConfiguration"],37122:["Compressed Bits Per Pixel","CompressedBitsPerPixel"],40962:["Pixel X Dimension","PixelXDimension"],40963:["Pixel Y Dimension","PixelYDimension"],37500:["Manufacturer notes","MakerNote"],37510:["User comments","UserComment"],40964:["Related audio file","RelatedSoundFile"],36867:["Date Time Original","DateTimeOriginal"],36868:["Date Time Digitized","DateTimeDigitized"],37520:["DateTime subseconds","SubSecTime"],37521:["DateTimeOriginal subseconds","SubSecTimeOriginal"],37522:["DateTimeDigitized subseconds","SubSecTimeDigitized"],33434:["Exposure time","ExposureTime"],33437:["FNumber","FNumber"],34850:["Exposure program","ExposureProgram"],34852:["Spectral sensitivity","SpectralSensitivity"],34855:["ISO Speed Ratings","ISOSpeedRatings"],34856:["Optoelectric coefficient","OECF"],37377:["Shutter Speed","ShutterSpeedValue"],37378:["Aperture Value","ApertureValue"],37379:["Brightness","BrightnessValue"],37380:["Exposure Bias Value","ExposureBiasValue"],37381:["Max Aperture Value","MaxApertureValue"],37382:["Subject Distance","SubjectDistance"],37383:["Metering Mode","MeteringMode"],37384:["Light Source","LightSource"],37385:["Flash","Flash"],37386:["Focal Length","FocalLength"],37396:["Subject Area","SubjectArea"],41483:["Flash Energy","FlashEnergy"],41484:["Spatial Frequency Response","SpatialFrequencyResponse"],41486:["Focal Plane X Resolution","FocalPlaneXResolution"],41487:["Focal Plane Y Resolution","FocalPlaneYResolution"],41488:["Focal Plane Resolution Unit","FocalPlaneResolutionUnit"],41492:["Subject Location","SubjectLocation"],41493:["Exposure Index","ExposureIndex"],41495:["Sensing Method","SensingMethod"],41728:["File Source","FileSource"],41729:["Scene Type","SceneType"],41730:["CFA Pattern","CFAPattern"],41985:["Custom Rendered","CustomRendered"],41986:["Exposure Mode","Exposure Mode"],41987:["White Balance","WhiteBalance"],41988:["Digital Zoom Ratio","DigitalZoomRatio"],41990:["Scene Capture Type","SceneCaptureType"],41991:["Gain Control","GainControl"],41992:["Contrast","Contrast"],41993:["Saturation","Saturation"],41994:["Sharpness","Sharpness"],41995:["Device settings description","DeviceSettingDescription"],41996:["Subject distance range","SubjectDistanceRange"],42016:["Unique image ID","ImageUniqueID"],40965:["Interoperability tag","InteroperabilityIFDPointer"]};this.JpegMeta.JpegFile.prototype._gpstags={0:["GPS tag version","GPSVersionID"],1:["North or South Latitude","GPSLatitudeRef"],2:["Latitude","GPSLatitude"],3:["East or West Longitude","GPSLongitudeRef"],4:["Longitude","GPSLongitude"],5:["Altitude reference","GPSAltitudeRef"],6:["Altitude","GPSAltitude"],7:["GPS time (atomic clock)","GPSTimeStamp"],8:["GPS satellites usedd for measurement","GPSSatellites"],9:["GPS receiver status","GPSStatus"],10:["GPS mesaurement mode","GPSMeasureMode"],11:["Measurement precision","GPSDOP"],12:["Speed unit","GPSSpeedRef"],13:["Speed of GPS receiver","GPSSpeed"],14:["Reference for direction of movement","GPSTrackRef"],15:["Direction of movement","GPSTrack"],16:["Reference for direction of image","GPSImgDirectionRef"],17:["Direction of image","GPSImgDirection"],18:["Geodetic survey data used","GPSMapDatum"],19:["Reference for latitude of destination","GPSDestLatitudeRef"],20:["Latitude of destination","GPSDestLatitude"],21:["Reference for longitude of destination","GPSDestLongitudeRef"],22:["Longitude of destination","GPSDestLongitude"],23:["Reference for bearing of destination","GPSDestBearingRef"],24:["Bearing of destination","GPSDestBearing"],25:["Reference for distance to destination","GPSDestDistanceRef"],26:["Distance to destination","GPSDestDistance"],27:["Name of GPS processing method","GPSProcessingMethod"],28:["Name of GPS area","GPSAreaInformation"],29:["GPS Date","GPSDateStamp"],30:["GPS differential correction","GPSDifferential"]};this.JpegMeta.JpegFile.prototype._markers={192:["SOF0","_sofHandler","Baseline DCT"],193:["SOF1","_sofHandler","Extended sequential DCT"],194:["SOF2","_sofHandler","Progressive DCT"],195:["SOF3","_sofHandler","Lossless (sequential)"],197:["SOF5","_sofHandler","Differential sequential DCT"],198:["SOF6","_sofHandler","Differential progressive DCT"],199:["SOF7","_sofHandler","Differential lossless (sequential)"],200:["JPG",null,"Reserved for JPEG extensions"],201:["SOF9","_sofHandler","Extended sequential DCT"],202:["SOF10","_sofHandler","Progressive DCT"],203:["SOF11","_sofHandler","Lossless (sequential)"],205:["SOF13","_sofHandler","Differential sequential DCT"],206:["SOF14","_sofHandler","Differential progressive DCT"],207:["SOF15","_sofHandler","Differential lossless (sequential)"],196:["DHT",null,"Define Huffman table(s)"],204:["DAC",null,"Define arithmetic coding conditioning(s)"],208:["RST0",null,"Restart with modulo 8 count 閳?0閳?"],209:["RST1",null,"Restart with modulo 8 count 閳?1閳?"],210:["RST2",null,"Restart with modulo 8 count 閳?2閳?"],211:["RST3",null,"Restart with modulo 8 count 閳?3閳?"],212:["RST4",null,"Restart with modulo 8 count 閳?4閳?"],213:["RST5",null,"Restart with modulo 8 count 閳?5閳?"],214:["RST6",null,"Restart with modulo 8 count 閳?6閳?"],215:["RST7",null,"Restart with modulo 8 count 閳?7閳?"],216:["SOI",null,"Start of image"],217:["EOI",null,"End of image"],218:["SOS",null,"Start of scan"],219:["DQT",null,"Define quantization table(s)"],220:["DNL",null,"Define number of lines"],221:["DRI",null,"Define restart interval"],222:["DHP",null,"Define hierarchical progression"],223:["EXP",null,"Expand reference component(s)"],224:["APP0","_app0Handler","Reserved for application segments"],225:["APP1","_app1Handler"],226:["APP2",null],227:["APP3",null],228:["APP4",null],229:["APP5",null],230:["APP6",null],231:["APP7",null],232:["APP8",null],233:["APP9",null],234:["APP10",null],235:["APP11",null],236:["APP12",null],237:["APP13",null],238:["APP14",null],239:["APP15",null],240:["JPG0",null],241:["JPG1",null],242:["JPG2",null],243:["JPG3",null],244:["JPG4",null],245:["JPG5",null],246:["JPG6",null],247:["JPG7",null],248:["JPG8",null],249:["JPG9",null],250:["JPG10",null],251:["JPG11",null],252:["JPG12",null],253:["JPG13",null],254:["COM",null],1:["JPG13",null]};
this.JpegMeta.JpegFile.prototype._addMetaGroup=function _addMetaGroup(a,b){var c=new JpegMeta.MetaGroup(a,b);this[c.fieldName]=c;this.metaGroups[c.fieldName]=c;return c};this.JpegMeta.JpegFile.prototype._parseIfd=function _parseIfd(x,s,g,q,p,y,u){var t=JpegMeta.parseNum(x,s,g+q,2);var w,v;var b;var h;var c,e,o;var d;var n;var r;var a;var l;var k;var m;m=this._addMetaGroup(y,u);for(var w=0;w<t;w++){b=g+q+2+(w*12);h=JpegMeta.parseNum(x,s,b,2);console.log("tag-field="+h);e=JpegMeta.parseNum(x,s,b+2,2);d=JpegMeta.parseNum(x,s,b+4,4);n=JpegMeta.parseNum(x,s,b+8,4);if(this._types[e]===undefined){continue}c=this._types[e][0];o=this._types[e][1];if(o*d<=4){n=b+8}else{n=g+n}if(c=="UNDEFINED"){f=s.slice(n,n+d)}else{if(c=="ASCII"){r=s.slice(n,n+d);r=r.split("\x00")[0]}else{r=new Array();for(v=0;v<d;v++,n+=o){if(c=="BYTE"||c=="SHORT"||c=="LONG"){r.push(JpegMeta.parseNum(x,s,n,o))}if(c=="SBYTE"||c=="SSHORT"||c=="SLONG"){r.push(JpegMeta.parseSnum(x,s,n,o))}if(c=="RATIONAL"){l=JpegMeta.parseNum(x,s,n,4);k=JpegMeta.parseNum(x,s,n+4,4);r.push(new JpegMeta.Rational(l,k))}if(c=="SRATIONAL"){l=JpegMeta.parseSnum(x,s,n,4);k=JpegMeta.parseSnum(x,s,n+4,4);r.push(new JpegMeta.Rational(l,k))}r.push()}if(d===1){r=r[0]}}}if(p[h]!==undefined){m._addProperty(p[h][1],p[h][0],r)}}};this.JpegMeta.JpegFile.prototype._jfifHandler=function _jfifHandler(b,a){if(this.jfif!==undefined){throw Error("Multiple JFIF segments found")}this._addMetaGroup("jfif","JFIF");this.jfif._addProperty("version_major","Version Major",this._binary_data.charCodeAt(a+5));this.jfif._addProperty("version_minor","Version Minor",this._binary_data.charCodeAt(a+6));this.jfif._addProperty("version","JFIF Version",this.jfif.version_major.value+"."+this.jfif.version_minor.value);this.jfif._addProperty("units","Density Unit",this._binary_data.charCodeAt(a+7));this.jfif._addProperty("Xdensity","X density",JpegMeta.parseNum(">",this._binary_data,a+8,2));this.jfif._addProperty("Ydensity","Y Density",JpegMeta.parseNum(">",this._binary_data,a+10,2));this.jfif._addProperty("Xthumbnail","X Thumbnail",JpegMeta.parseNum(">",this._binary_data,a+12,1));this.jfif._addProperty("Ythumbnail","Y Thumbnail",JpegMeta.parseNum(">",this._binary_data,a+13,1))};this.JpegMeta.JpegFile.prototype._app0Handler=function app0Handler(c,b){var a=this._binary_data.slice(b,b+5);if(a==this._JFIF_IDENT){this._jfifHandler(c,b)}else{if(a==this._JFXX_IDENT){}else{}}};this.JpegMeta.JpegFile.prototype._app1Handler=function _app1Handler(c,b){var a=this._binary_data.slice(b,b+5);if(a==this._EXIF_IDENT){this._exifHandler(c,b+6)}else{}};JpegMeta.JpegFile.prototype._exifHandler=function _exifHandler(d,l){if(this.exif!==undefined){throw new Error("Multiple JFIF segments found")}var h;var g;var c;var i,j,e;var b=this._binary_data.slice(l,l+2);if(b==="II"){h="<"}else{if(b==="MM"){h=">"}else{throw new Error("Malformed TIFF meta-data. Unknown endianess: "+b)}}g=JpegMeta.parseNum(h,this._binary_data,l+2,2);if(g!==42){throw new Error("Malformed TIFF meta-data. Bad magic: "+g)}c=JpegMeta.parseNum(h,this._binary_data,l+4,4);this._parseIfd(h,this._binary_data,l,c,this._tifftags,"tiff","TIFF");if(this.tiff.ExifIfdPointer){console.log(".,.,.,.,."+this.tiff.ExifIfdPointer.value)};if(this.tiff.ExifIfdPointer){console.log("has pointer1");this._parseIfd(h,this._binary_data,l,this.tiff.ExifIfdPointer.value,this._exiftags,"exif","Exif")}if(this.tiff.GPSInfoIfdPointer){this._parseIfd(h,this._binary_data,l,this.tiff.GPSInfoIfdPointer.value,this._gpstags,"gps","GPS");if(this.gps.GPSLatitude){var k;k=this.gps.GPSLatitude.value[0].asFloat()+(1/60)*this.gps.GPSLatitude.value[1].asFloat()+(1/3600)*this.gps.GPSLatitude.value[2].asFloat();if(this.gps.GPSLatitudeRef.value==="S"){k=-k}this.gps._addProperty("latitude","Dec. Latitude",k)}if(this.gps.GPSLongitude){var a;a=this.gps.GPSLongitude.value[0].asFloat()+(1/60)*this.gps.GPSLongitude.value[1].asFloat()+(1/3600)*this.gps.GPSLongitude.value[2].asFloat();if(this.gps.GPSLongitudeRef.value==="W"){a=-a}this.gps._addProperty("longitude","Dec. Longitude",a)}}};
var ImageCompresser={isIosSubSample:function(b){var a=b.naturalWidth,e=b.naturalHeight,d=false;if(a*e>1024*1024){var c=document.createElement("canvas");ctx=c.getContext("2d"),c.width=c.height=1;ctx.drawImage(b,1-a,0);d=ctx.getImageData(0,0,1,1).data[3]===0;c=ctx=null}return d},getIosImageRatio:function(d,j,e){var a=document.createElement("canvas"),k=a.getContext("2d"),c,g=0,f=e,i=e;a.width=1;a.height=e;k.drawImage(d,1-Math.ceil(Math.random()*j),0);c=k.getImageData(0,0,1,e).data;while(i>g){var b=c[(i-1)*4+3];if(b===0){f=i}else{g=i}i=(f+g)>>1}return i/e},getImageBase64:function(C,n){n=jQuery.extend({maxW:1800,maxH:1800,quality:0.8,orien:1},n);var A=n.maxW,g=n.maxW,m=n.quality,u=C.naturalWidth,c=C.naturalHeight,j,t;if(jQuery.os.ios&&ImageCompresser.isIosSubSample(C)){u=u/2;c=c/2}if(u>A&&u/c>=A/g){j=A;t=c*A/u}else{if(c>g&&c/u>=g/A){j=u*g/c;t=g}else{j=u;t=c}}var e=document.createElement("canvas"),r=e.getContext("2d"),a;this.doAutoRotate(e,j,t,n.orien);if(jQuery.os.ios){var b=document.createElement("canvas"),f=b.getContext("2d"),z=1024,s=ImageCompresser.getIosImageRatio(C,u,c),p,o,q,B,k,i,l,v;b.width=b.height=z;o=0;while(o<c){B=o+z>c?c-o:z,p=0;while(p<u){q=p+z>u?u-p:z;f.clearRect(0,0,z,z);f.drawImage(C,-p,-o);k=Math.floor(p*j/u);l=Math.ceil(q*j/u);i=Math.floor(o*t/c/s);v=Math.ceil(B*t/c/s);r.drawImage(b,0,0,q,B,k,i,l,v);p+=z}o+=z}b=f=null}else{r.drawImage(C,0,0,u,c,0,0,j,t)}if(jQuery.os.android){var y=r.getImageData(0,0,e.width,e.height),x=new JPEGEncoder(m*100);a=x.encode(y);x=null}else{a=e.toDataURL("image/jpeg",m)}console.log(a);e=r=null;return a},doAutoRotate:function(d,e,a,c){var b=d.getContext("2d");if(c>=5&&c<=8){d.width=a;d.height=e}else{d.width=e;d.height=a}switch(c){case 2:b.translate(e,0);b.scale(-1,1);break;case 3:b.translate(e,a);b.rotate(Math.PI);break;case 4:b.translate(0,a);b.scale(1,-1);break;case 5:b.rotate(0.5*Math.PI);b.scale(1,-1);break;case 6:b.rotate(0.5*Math.PI);b.translate(0,-a);break;case 7:b.rotate(0.5*Math.PI);b.translate(e,-a);b.scale(-1,1);break;case 8:b.rotate(-0.5*Math.PI);b.translate(-e,0);break;default:break}},getFileObjectURL:function(b){var a=window.URL||window.webkitURL||false;if(a){return a.createObjectURL(b)}},support:function(){return typeof(window.File)&&typeof(window.FileList)&&typeof(window.FileReader)&&typeof(window.Blob)}};
function JPEGEncoder(k){var m=this;var C=Math.round;var K=Math.floor;var g=new Array(64);var J=new Array(64);var Q=new Array(64);var X=new Array(64);var A;var h;var q;var T;var I=new Array(65535);var l=new Array(65535);var O=new Array(64);var R=new Array(64);var i=[];var B=0;var a=7;var D=new Array(64);var d=new Array(64);var U=new Array(64);var e=new Array(256);var E=new Array(2048);var z;var N=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63];var f=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0];var b=[0,1,2,3,4,5,6,7,8,9,10,11];var y=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125];var s=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250];var x=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0];var Y=[0,1,2,3,4,5,6,7,8,9,10,11];var n=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119];var u=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];function L(ag){var af=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99];for(var ae=0;ae<64;ae++){var aj=K((af[ae]*ag+50)/100);if(aj<1){aj=1}else{if(aj>255){aj=255}}g[N[ae]]=aj}var ah=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99];for(var ad=0;ad<64;ad++){var ai=K((ah[ad]*ag+50)/100);if(ai<1){ai=1}else{if(ai>255){ai=255}}J[N[ad]]=ai}var ac=[1,1.387039845,1.306562965,1.175875602,1,0.785694958,0.5411961,0.275899379];var ab=0;for(var ak=0;ak<8;ak++){for(var aa=0;aa<8;aa++){Q[ab]=(1/(g[N[ab]]*ac[ak]*ac[aa]*8));X[ab]=(1/(J[N[ab]]*ac[ak]*ac[aa]*8));ab++}}}function H(ae,af){var ad=0;var ag=0;var ac=new Array();for(var aa=1;aa<=16;aa++){for(var ab=1;ab<=ae[aa];ab++){ac[af[ag]]=[];ac[af[ag]][0]=ad;ac[af[ag]][1]=aa;ag++;ad++}ad*=2}return ac}function W(){A=H(f,b);h=H(x,Y);q=H(y,s);T=H(n,u)}function v(){var ab=1;var ad=2;for(var aa=1;aa<=15;aa++){for(var ac=ab;ac<ad;ac++){l[32767+ac]=aa;I[32767+ac]=[];I[32767+ac][1]=aa;I[32767+ac][0]=ac}for(var ae=-(ad-1);ae<=-ab;ae++){l[32767+ae]=aa;I[32767+ae]=[];I[32767+ae][1]=aa;I[32767+ae][0]=ad-1+ae}ab<<=1;ad<<=1}}function V(){for(var aa=0;aa<256;aa++){E[aa]=19595*aa;E[(aa+256)>>0]=38470*aa;E[(aa+512)>>0]=7471*aa+32768;E[(aa+768)>>0]=-11059*aa;E[(aa+1024)>>0]=-21709*aa;E[(aa+1280)>>0]=32768*aa+8421375;E[(aa+1536)>>0]=-27439*aa;E[(aa+1792)>>0]=-5329*aa}}function Z(ab){var ac=ab[0];var aa=ab[1]-1;while(aa>=0){if(ac&(1<<aa)){B|=(1<<a)}aa--;a--;if(a<0){if(B==255){r(255);r(0)}else{r(B)}a=7;B=0}}}function r(aa){i.push(e[aa])}function G(aa){r((aa>>8)&255);r((aa)&255)}function M(aY,av){var aM,aL,aK,aJ,aI,aG,aF,aD;var aP=0;var aR;const au=8;const an=64;for(aR=0;aR<au;++aR){aM=aY[aP];aL=aY[aP+1];aK=aY[aP+2];aJ=aY[aP+3];aI=aY[aP+4];aG=aY[aP+5];aF=aY[aP+6];aD=aY[aP+7];var aZ=aM+aD;var aO=aM-aD;var aX=aL+aF;var aQ=aL-aF;var aW=aK+aG;var aS=aK-aG;var aV=aJ+aI;var aT=aJ-aI;var ar=aZ+aV;var ao=aZ-aV;var aq=aX+aW;var ap=aX-aW;aY[aP]=ar+aq;aY[aP+4]=ar-aq;var aA=(ap+ao)*0.707106781;aY[aP+2]=ao+aA;aY[aP+6]=ao-aA;ar=aT+aS;aq=aS+aQ;ap=aQ+aO;var aw=(ar-ap)*0.382683433;var az=0.5411961*ar+aw;var ax=1.306562965*ap+aw;var ay=aq*0.707106781;var ak=aO+ay;var aj=aO-ay;aY[aP+5]=aj+az;aY[aP+3]=aj-az;aY[aP+1]=ak+ax;aY[aP+7]=ak-ax;aP+=8}aP=0;for(aR=0;aR<au;++aR){aM=aY[aP];aL=aY[aP+8];aK=aY[aP+16];aJ=aY[aP+24];aI=aY[aP+32];aG=aY[aP+40];aF=aY[aP+48];aD=aY[aP+56];var am=aM+aD;var at=aM-aD;var ah=aL+aF;var aB=aL-aF;var ae=aK+aG;var aE=aK-aG;var ab=aJ+aI;var aU=aJ-aI;var al=am+ab;var aa=am-ab;var ag=ah+ae;var ad=ah-ae;aY[aP]=al+ag;aY[aP+32]=al-ag;var ai=(ad+aa)*0.707106781;aY[aP+16]=aa+ai;aY[aP+48]=aa-ai;al=aU+aE;ag=aE+aB;ad=aB+at;var aN=(al-ad)*0.382683433;var af=0.5411961*al+aN;var a1=1.306562965*ad+aN;var ac=ag*0.707106781;var a0=at+ac;var aC=at-ac;aY[aP+40]=aC+af;aY[aP+24]=aC-af;aY[aP+8]=a0+a1;aY[aP+56]=a0-a1;aP++}var aH;for(aR=0;aR<an;++aR){aH=aY[aR]*av[aR];O[aR]=(aH>0)?((aH+0.5)|0):((aH-0.5)|0)}return O}function S(){G(65504);G(16);r(74);r(70);r(73);r(70);r(0);r(1);r(1);r(0);G(1);G(1);r(0);r(0)}function F(ab,aa){G(65472);G(17);r(8);G(aa);G(ab);r(3);r(1);r(17);r(0);r(2);r(17);r(1);r(3);r(17);r(1)}function t(){G(65499);G(132);r(0);for(var ab=0;ab<64;ab++){r(g[ab])}r(1);for(var aa=0;aa<64;aa++){r(J[aa])}}function p(){G(65476);G(418);r(0);for(var ae=0;ae<16;ae++){r(f[ae+1])}for(var ad=0;ad<=11;ad++){r(b[ad])}r(16);for(var ac=0;ac<16;ac++){r(y[ac+1])}for(var ab=0;ab<=161;ab++){r(s[ab])}r(1);for(var aa=0;aa<16;aa++){r(x[aa+1])}for(var ah=0;ah<=11;ah++){r(Y[ah])}r(17);for(var ag=0;ag<16;ag++){r(n[ag+1])}for(var af=0;af<=161;af++){r(u[af])}}function o(){G(65498);G(12);r(3);r(1);r(0);r(2);r(17);r(3);r(17);r(0);r(63);r(0)}function j(ae,aa,ak,ap,ao){var ag=ao[0];var ac=ao[240];var ad;const aq=16;const ah=63;const af=64;var ar=M(ae,aa);for(var al=0;al<af;++al){R[N[al]]=ar[al]}var an=R[0]-ak;ak=R[0];if(an==0){Z(ap[0])}else{ad=32767+an;Z(ap[l[ad]]);Z(I[ad])}var ab=63;for(;(ab>0)&&(R[ab]==0);ab--){}if(ab==0){Z(ag);return ak}var am=1;var au;while(am<=ab){var aj=am;for(;(R[am]==0)&&(am<=ab);++am){}var ai=am-aj;if(ai>=aq){au=ai>>4;for(var at=1;at<=au;++at){Z(ac)}ai=ai&15}ad=32767+R[am];Z(ao[(ai<<4)+l[ad]]);Z(I[ad]);am++}if(ab!=ah){Z(ag)}return ak}function w(){var ab=String.fromCharCode;for(var aa=0;aa<256;aa++){e[aa]=ab(aa)}}this.encode=function(ap,ak){var ac=new Date().getTime();if(ak){c(ak)}i=new Array();B=0;a=7;G(65496);S();t();F(ap.width,ap.height);p();o();var al=0;var ar=0;var ao=0;B=0;a=7;this.encode.displayName="_encode_";var ax=ap.data;var au=ap.width;var an=ap.height;var at=au*4;var ab=au*3;var aj,ai=0;var am,aw,ay;var ad,aq,af,ah,ag;while(ai<an){aj=0;while(aj<at){ad=at*ai+aj;aq=ad;af=-1;ah=0;for(ag=0;ag<64;ag++){ah=ag>>3;af=(ag&7)*4;aq=ad+(ah*at)+af;if(ai+ah>=an){aq-=(at*(ai+1+ah-an))}if(aj+af>=at){aq-=((aj+af)-at+4)}am=ax[aq++];aw=ax[aq++];ay=ax[aq++];D[ag]=((E[am]+E[(aw+256)>>0]+E[(ay+512)>>0])>>16)-128;d[ag]=((E[(am+768)>>0]+E[(aw+1024)>>0]+E[(ay+1280)>>0])>>16)-128;U[ag]=((E[(am+1280)>>0]+E[(aw+1536)>>0]+E[(ay+1792)>>0])>>16)-128}al=j(D,Q,al,A,q);ar=j(d,X,ar,h,T);ao=j(U,X,ao,h,T);aj+=32}ai+=8}if(a>=0){var av=[];av[1]=a+1;av[0]=(1<<(a+1))-1;Z(av)}G(65497);var ae="data:image/jpeg;base64,"+btoa(i.join(""));i=[];var aa=new Date().getTime()-ac;console.log("Encoding time: "+aa+"ms");return ae};function c(ab){if(ab<=0){ab=1}if(ab>100){ab=100}if(z==ab){return}var aa=0;if(ab<50){aa=Math.floor(5000/ab)}else{aa=Math.floor(200-ab*2)}L(aa);z=ab;console.log("Quality set to: "+ab+"%")}function P(){var ab=new Date().getTime();if(!k){k=50}w();W();v();V();c(k);var aa=new Date().getTime()-ab;console.log("Initialization "+aa+"ms")}P()}function getImageDataFromImage(b){var c=(typeof(b)=="string")?document.getElementById(b):b;var d=document.createElement("canvas");d.width=c.width;d.height=c.height;var a=d.getContext("2d");a.drawImage(c,0,0);return(a.getImageData(0,0,d.width,d.height))};
jQuery.extend({
    os:{
        ios : false,
        android: false,
        version: false
    }
});
(function() {
    var ua = navigator.userAgent;
    var browser = {},
        weixin = ua.match(/MicroMessenger\/([^\s]+)/),
        webkit = ua.match(/WebKit\/([\d.]+)/),
        android = ua.match(/(Android)\s+([\d.]+)/),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod).*OS\s([\d_]+)/),
        iphone = !ipod && !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        mqqbrowser = ua.match(/MQQBrowser\/([\d.]+)/),
        chrome = ua.match(/CriOS\/([\d.]+)/),
        opera = ua.match(/Opera\/([\d.]+)/),
        safari = ua.match(/Safari\/([\d.]+)/);
    if (weixin) {
       jQuery.os.wx = true;
       jQuery.os.wxVersion = weixin[1];
    }
    // if (browser.webkit = !! webkit) browser.version = webkit[1]
    if (android) {
        jQuery.os.android = true;
        jQuery.os.version = android[2];
    }
    if (iphone) {
        jQuery.os.ios = jQuery.os.iphone = true;
        jQuery.os.version = iphone[2].replace(/_/g, '.');
    }
    if (ipad) {
        jQuery.os.ios = jQuery.os.ipad = true;
        jQuery.os.version = ipad[2].replace(/_/g, '.');
    }
    if (ipod) {
        jQuery.os.ios = jQuery.os.ipod = true;
        jQuery.os.version = ipod[2].replace(/_/g, '.');
    }
    window.htmlEncode = function(text) {
        return text.replace(/&/g, '&amp').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    window.htmlDecode = function(text) {
        return text.replace(/&amp;/g, '&').replace(/&quot;/g, '/"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    
    window.NETTYPE = 0;
    window.NETTYPE_FAIL = -1;
    window.NETTYPE_WIFI = 1;
    window.NETTYPE_EDGE = 2;
    window.NETTYPE_3G = 3;
    window.NETTYPE_DEFAULT = 0;
})();
