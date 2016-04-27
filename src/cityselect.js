/*!
 * citySelect - jQuery Plugin
 * version: 1.0.0 (Fri, 14 Jun 2015)
 * @requires jQuery v1.6 or later
 * @auther leiming
 * 
 * License: www.zt906.com
 * 
 * Copyright 2015 中拓电商  - leiming19877@163.com
 *
 */

(function (window, document, $, undefined) {
	"use strict";

	var W = $(window),
		D = $(document),
		version ="1.0.0",//版本
		componentIdPrefix = "ks-component",//组件id前缀
		componentContntIdPrefix = "ks-content-ks-component",//组件内容id前缀
		cacheUids=[],//当前所有城市控件Id
		spanSplit='<span style="color:#cfcfcf">/</span>',//城市分割
		inputDivClass='bf-select  lSelect clearfix',
		inputDivContent = [
		                   '<div  tabindex="0" class="city-title">请选择省市区</div>',
		   					'<div class="bf-menu-button-dropdown"></div>'
		                   ].join(""),
		tpl=[
'<div class="ks-overlay ks-overlay-hidden" style="width: 300px; left: -1px; top: 27px;">',
'	<div class="ks-overlay-content">',
'		<div class="city-select-warp">',
'			<div class="city-select-tab">',
'				<a class="current" attr-cont="city-province">省份</a>',
'				<a class="last" attr-cont="city-city">城市</a>',
'			</div>',
'			<div class="city-select-content">',
'				<div class="city-select city-province">',
'					<dl>',
'						<dt>A-G</dt>',
'						<dd>',
'							<a title="安徽"  href="javascript:;">安徽</a><a',
'								title="北京"  href="javascript:;">北京</a><a',
'								title="重庆"  href="javascript:;">重庆</a><a',
'								title="福建"  href="javascript:;">福建</a><a',
'								title="甘肃"  href="javascript:;">甘肃</a><a',
'								title="广东"  href="javascript:;">广东</a><a',
'								title="广西"  href="javascript:;">广西</a><a',
'								title="贵州"  href="javascript:;">贵州</a>',
'						</dd>',
'					</dl>',
'					<dl>',
'						<dt>H-K</dt>',
'						<dd>',
'							<a title="海南"  href="javascript:;">海南</a><a',
'								title="河北"  href="javascript:;">河北</a><a',
'								title="黑龙江"  href="javascript:;">黑龙江</a><a',
'								title="河南"  href="javascript:;">河南</a><a',
'								title="湖北"  href="javascript:;">湖北</a><a',
'								title="湖南"  href="javascript:;">湖南</a><a',
'								title="江苏"  href="javascript:;">江苏</a><a',
'								title="江西"  href="javascript:;">江西</a><a',
'								title="吉林"  href="javascript:;">吉林</a>',
'						</dd>',
'					</dl>',
'					<dl>',
'						<dt>L-S</dt>',
'						<dd>',
'							<a title="辽宁"  href="javascript:;">辽宁</a><a',
'								title="内蒙古"  href="javascript:;">内蒙古</a><a',
'								title="宁夏"  href="javascript:;">宁夏</a><a',
'								title="青海"  href="javascript:;">青海</a><a',
'								title="山东"  href="javascript:;">山东</a><a',
'								title="上海"  href="javascript:;">上海</a><a',
'								title="山西"  href="javascript:;">山西</a><a',
'								title="陕西"  href="javascript:;">陕西</a><a',
'								title="四川"  href="javascript:;">四川</a>',
'						</dd>',
'					</dl>',
'					<dl>',
'						<dt>T-Z</dt>',
'						<dd>',
'							<a title="天津"  href="javascript:;">天津</a><a',
'								title="新疆"  href="javascript:;">新疆</a><a',
'								title="西藏"  href="javascript:;">西藏</a><a',
'								title="云南"  href="javascript:;">云南</a><a',
'								title="浙江"  href="javascript:;">浙江</a>',
'						</dd>',
'					</dl>',
'				</div>',
'				<div class="city-select city-city" style="display: none;">',
'					<dl class="city-select-city">',
'						<dd></dd>',
'					</dl>',
'				</div>',
'			</div>',
'		</div>',
'	</div>',
'</div>'
].join("");
	
	//省市数据
	var areas = [];
	
	
	var nextUid=(function() { var counter=1; return function() { return counter++; }; }());
	/**
	 * 阻止事件冒泡
	 */
	function killEvent(event) {
	        event.preventDefault();
	        event.stopPropagation();
	 }
	
	function killEventImmediately(event) {
	        event.preventDefault();
	        event.stopImmediatePropagation();
	}
	/**
	 * 获取具体的区域信息
	 * @param areaId 区域主键
	 * @returns  area 对象
	 */
	function getArea(areaId){
		for(var i=0;i<areas.length;i++){
			if(areas[i].areaId == areaId){
				return areas[i];
			}			
		}
		return null;
	}
	
	/**
	 * 城市选择组件
	 */
	var CitySelect= function(inputDiv,options){
		this.areaId;//地区组件
		this.province ="";//当前选择的省
		this.city = "";//当前选择的城市
		this.inputDiv = inputDiv;
		this.componentId = "";
		this.component = null;//组件domElement jQuery对象
		this.options = jQuery.extend({},options);
		this.createComponent();
		this.initAreaData();//初始化省市数据
	}
	/**
	 * 初始化省市数据
	 */
	CitySelect.prototype.initAreaData = function(){
		var self = this;
		//测试先注释掉ajax方式加载城市数据,实际使用时数据可能是从后台加载
		/*
		jQuery.ajax({
			type:'GET',
			cache:true,
			url:'/steel/area/getListAreas.pfv?ver='+version,
			dataType:'json',
			success:function(data){
				areas = data;
				self.initInputDiv();
			}	
		});	*/
		areas = golabelAreas;
		self.initInputDiv();
	}
	/**
	 * 初始化城市控件输入框
	 * @param options
	 */
	CitySelect.prototype.initInputDiv = function(){
		//如果存在areaId
		if(this.options.areaId){
			this.areaId=this.options.areaId;//地区组件
			var area = getArea(this.options.areaId);
			if(area){//存在区域
				this.province = area.provinceName;//省
				this.city = area.areaName;//城市
				this.appendAllChoice();
			}
		//如果初始化了省市
		}else if(this.options.province  &&
				this.options.city ){
				this.province = this.options.province;//省
				this.city = this.options.city;//城市
				this.appendAllChoice();
		}	
	};
	/**
	 * 
	 * 判断是否需要创建元素
	 */
	CitySelect.prototype.isCreateComponent=function(){
		if(this.inputDiv.find("div.ks-overlay").length === 1){
			return true;
		}
		return false;
	}
	
	/**
	 * 创建控件
	 */
	CitySelect.prototype.createComponent = function(){
		if(this.isCreateComponent()){
			this.showComponent();
			return;
		}
		this.createInput();
		this.component = jQuery(tpl);
		this.componentId = componentIdPrefix+nextUid();
		cacheUids.push(this.componentId);
		this.component.filter("div.ks-overlay").prop("id",this.componentId);
		this.component.appendTo(this.inputDiv);
		//绑定事件
		this.bindSelfEvents();
		this.bindEvents();
	}
	/**
	 * 创建输入
	 */
	CitySelect.prototype.createInput = function(){
		 this.inputDiv.addClass(inputDivClass);
		 this.inputDiv.append(inputDivContent);
	}
	
	/**
	 * 绑定事件
	 */
	CitySelect.prototype.bindEvents = function(){
		this.inputDiv.click(killEvent);
		var citySelect = this;
		var selectTab = this.component.find("div.ks-overlay-content>div.city-select-warp>div.city-select-tab>a")
		selectTab.click(
				function(e){
					var self = jQuery(this);
					//选择的是那一个
					var attrCont = self.attr("attr-cont");
					//显示对应的内容
					citySelect.show(attrCont);
				}
		);
		
		var provinceSelects = this.component.find("div.ks-overlay-content>div.city-select-warp>div.city-select-content>div.city-province a");
		provinceSelects.click(function(e){
			var self = jQuery(this);
			var province = self.text();
			citySelect.province = province;//当前选择的省
			citySelect.reBuildCity(province);
			provinceSelects.removeClass("current");
			self.addClass("current");
			citySelect.show("city-city");
			//触发省选择事件
			citySelect.component.trigger("provinceSelected",province);
		});
		//绑定城市选择事件
		this.component.delegate("div.ks-overlay-content>div.city-select-warp>div.city-select-content>div.city-city a","click",function(event){
			//阻止事件传递
	        event.stopPropagation();
			var self = jQuery(this);
			//将同级元素所有选择样式删除
			self.parent().find("a").removeClass("current");
			//添加当前选择样式
			self.addClass("current");
			var city = self.text();
			citySelect.city = city;//当前选择的市
			var areaId = self.attr("areaId");//主键id
			//触发省选择事件
			citySelect.component.trigger("citySelected",[areaId,citySelect.province,city]);
			citySelect.appendAllChoice();
			citySelect.hideComponent();
		});
	}
	/**
	 * 显示组件指定区域
	 * @param tab 要显示的区域
	 */
	CitySelect.prototype.show = function(tab){
		//显示对应的tab
		this.component.find("div.city-select-tab>a.current").removeClass("current");
		this.component.find('div.city-select-tab>a[attr-cont='+tab+']').addClass("current");
		//显示对应的内容
		this.component.find("div.city-select").hide();
		this.component.find("div."+tab).show();
	}
	/**
	 * 绑定选择省、选择市的事件，分别为
	 * 	options.provinceSelected(province)
	 *  options.citySelected(city)
	 * @param component 组件
	 * @options 初始化参数
	 */
	CitySelect.prototype.bindSelfEvents = function(){
		var citySelect = this;
		this.component.bind("provinceSelected",function(event,province){
				if(typeof citySelect.options.provinceSelected === 'function'){
					citySelect.options.provinceSelected(province);
				}
		});
		this.component.bind("citySelected",function(event,areaId,province,city){
			if(typeof citySelect.options.citySelected === 'function'){
				citySelect.options.citySelected(areaId,province,city);
			}
	});
	}
	/**
	 * 显示控件
	 */
	CitySelect.prototype.showComponent=function(){
		this.component.removeClass("ks-overlay-hidden");
	}
	/**
	 * 显示控件
	 */
	CitySelect.prototype.hideComponent=function(){
		this.component.addClass("ks-overlay-hidden");
	}
	
	/**
	 * 
	 * @param province 省名字
	 */
	CitySelect.prototype.reBuildCity=function(province){
		var cityContent = this.component.find("dl.city-select-city>dd");
		cityContent.html("");
		for(var i=0;i<areas.length;i++){
			if(areas[i].provinceName === province){
				cityContent.append('<a tilte="'+areas[i].areaName+'" areaId="'+areas[i].areaId+'" '+'" href="javascript:;">'+areas[i].areaName+'</a>');
			}			
		}
	}
	
	/**
	 * 填充选择的省、城市信息
	 */
	CitySelect.prototype.appendAllChoice=function(){
		var input = this.inputDiv.find("div.city-title");
		input.html("");
		input.append(this.province+spanSplit);
		input.append(this.city);
		input = null;
	}
	//隐藏这些控件
	D.bind("click",function(e){
		 e = e || window.event;   
	     var elem = e.srcElement||e.target; 
	     var matchcomponent = "";
	     var isMatch = false;
		 for(var i=0;i<cacheUids.length;i++){
		      while(elem)   
		      {   
		    	  //阻止隐藏控件
		          if(elem === jQuery("#"+cacheUids[i]).parent().get(0))   
		          {   
		        	  matchcomponent = cacheUids[i];
		        	  isMatch = true;
		              break; 
		          }   
		          elem = elem.parentNode;        
		      }
		      //如果有匹配，就退出
		      if(isMatch){
		    	   break;
		      }
		 }
		 //隐藏其它的控件
		 for(var i=0;i<cacheUids.length;i++){
			 if(cacheUids[i] !== matchcomponent){
				 jQuery("#"+cacheUids[i]).addClass("ks-overlay-hidden");
			 }
		 }
	});

	// jQuery plugin initialization
	$.fn.citySelect = function (options,event) {
		var selected = new CitySelect(this,options);
		this.click(function(){
			selected.showComponent();
		});
		return this;
	};


}(window, document, jQuery));