//本文件用于定义数据模型

//用户数据
pue.define('user',
{
	fields:{
		name:{
			type:'string',
			name:'名称',
			enum:['选项1','选项2','选项3']
		},
		pass:{
			type:'string',
			name:'密码'
		}

	},
	methods:{
		load(){
			var data = {
				name:'pwy',
				pass:'666666'
			}
			return data  			
		},
		edit:{
			'-t':'fun',
			paramType:'user',
			name:'修改',
			fun(data,param){
				//data.name = param.name
				//data.pass = param.pass
				console.log('param:')
				console.log(param)
				///console.log(data)
				data.name = param.name
				data.pass = param.pass
				//alert('修改成功!')
				//return '修改成功!'
			}
		},
		test:{	
			'-t':'fun',		
			name:'测试',
			fun(data){
				alert('成功: '+data.pass+"   "+data.name)
				//data.pass = data.pass + 1
				//return '测试成功!'
			}
		},
		gen:{	
			'-t':'gen',		
			name:'测试gen',
			fun: function* (data){
				let a = dataModel.new('user',{name:'ppp',pass:'yyy'})
	            // console.log(this.a)
	            // console.log('开始获取数据')
	            a = yield a

	            for (i in data) {
	            	if(a[i]){
	            		data[i] = a[i]
	            	}
	            }

	            //return '测试GEN结束!'
			}
		}

	}
})

//用户页面
pue.define('pageUser',
{
	fields:{
		pageSize:{
			type:'number',
			name:'页面大小'
		},
		pageNo:{
			type:'number',
			name:'页数'
		},
		list:{
			type:'list<user>',
			name:'列表'
		}

	},
	methods:{
		load(){
			var data = {
				pageNo:1,
				pageSize:20,
				list:[{
					name:'pwy',
					pass:'666666'
				},{
					name:'pwy2',
					pass:'22222'
				},{
					name:'pwy3',
					pass:'333333'
				}]
			}
			return data  			
		},
		query:{
			'-t':'fun',	
			paramType:'user',
			name:'查询',
			fun(data,param){
				alert('查询成功!')
			}
		},
		test:{
			'-t':'fun',	
			//paramType:'user',
			name:'测试节点变更',
			fun(data){
				data.list = [{name:'ppp',pass:'44444'},{name:'dddd',pass:'5555'}]
				console.log(data)
				//alert('测试成功!')
			}
		}

	}
})

//console.log('11111')