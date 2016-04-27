# city-select
城市选择控件


## 使用

```javascript

##默认初始化 
	jQuery("#input1").citySelect({
		provinceSelected:function(province){
			
		},
		citySelected:function(areaId,province,city){
				jQuery("#areaId1").val(areaId);
				jQuery("#province1").val(province);
				jQuery("#city1").val(city);
		}
	});
##通过areaId初始化控件
	jQuery("#input2").citySelect({
		areaId:10145,
		provinceSelected:function(province){
			
		},
		/**
			选择城市里回调函数
		**/
		citySelected:function(areaId,province,city){
				jQuery("#areaId2").val(areaId);
				jQuery("#province2").val(province);
				jQuery("#city2").val(city);
		}
	});
##通过省、市初始化控件
	jQuery("#input3").citySelect({
		province:'湖南',
		city:'长沙',
		provinceSelected:function(province){
			
		},
		/**
			选择城市里回调函数
		**/
		citySelected:function(areaId,province,city){
				jQuery("#areaId3").val(areaId);
				jQuery("#province3").val(province);
				jQuery("#city3").val(city);
			}
		});
```

##Demo 请查看
```html 
		src/city-select-demo.html
```
