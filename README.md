# [DataPlus](https://github.com/pwypwy/dataPlus/edit/master/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pwypwy/dataPlus/edit/master/README.md) 

DataPlus1.0 版本定位是面向后端开发的轻量级前端快速开发框架

* **数据与UI解耦:** 使用 DataPlus 可以轻松地创建交互式 ui。核心思想是面向数据，即开发人员对数据的关注胜过一切，这也是本质上与React，Vue等前端框架的最大区别。我们把页面ui视作对数据结构和数据操作进行可视化展示。
用公式表达为：DataPlus  = DataModel(数据模型) + Vplan(可视化方案)

* **面向数据:** 数据模型是该框架的设计核心，通过定义数据模型的结构，方法完成业务逻辑的实现。数据模型包括基础模型（字符串，数字，日期等），高级模型（元组等），集合模型（列表，集合等）。通过对数据模型的拼装，继承，重写等操作完成对复杂数据模型的构建。

* **可视化方案:** 可视化方案遵循完备解释原则(即任意结构数据模型都能映射成对应的页面ui)。引入组件，抽象组件的概念用于设计可视化方案。


## 安装

在代码中引入dataPlus.js

## 文档




## 例子

```js
pue.define('hello'
{
	fields:{
		content:{
			type:'string',
			name:'内容'
		}
	},
	methods:{
		load(){
			var data = {
				name:'hello world'
			}
			return data  			
		}
	}
})
pui.visualize('hello')
```
这个例子将呈现“ hello world”到页面上的一个容器中。

## 贡献



### 许可证

MIT licensed](./LICENSE).
