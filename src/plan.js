//可视化交互方案
class plan {

	static render(d, dp){
		return this.caseAll(d,dp)
	}
	static caseAll(data,dp){
		let t = this.caseTuple(data,dp)
		let view = this.viewRender(t)
		let hide = this.caseHide(data,dp)
		let all = this.allRender(view,hide)
		return all
	}
	static viewRender(temp){
		return {
			'.class':'container',
			row:{
				'.class':'row',
				layout:{
					'.class':"col-md-12",
					temp:temp
				}
			}
		}

	}
	static allRender(view,hide){
		return {
			view:view,
			hide:hide
		}
	}
	static hideRender(temps){
		let hide = {
			'.hidden':"hidden"
		}
		for (let k in temps) {
			hide[k] = temps[k]
		}

		return hide
	}
	
	//隐藏域处理
	static caseHide(){
		let temp = {}
		for (let k in pue.dpMap) {
			let input = this.inputRender(pue.dpMap[k],{'-t':'submit','-pm':k},k)
			temp[k] = this.funContainerRender(input,pue.dpMap[k],k)
			//设置模态框弹出事件和绑定模型
			temp[k]['-inFun'] ={
				show(self){
					//console.log(self)
					$('#'+self.id).modal('show')
					//console.log(self.id)
					//self.modal('show')
				},
				hide(self){
					$('#'+self.id).modal('hide')
					//alert(111111)
				},
				dm:k
			} 
			
		}
		return temp
	}
	static caseTuple(data,dp){

		let temp = this.tupleRender(dp)

		let fields = dp.fields
		let methods = dp.methods
		// for (let k in methods) {
		// 	methods[k]['-b'] = data['-b']
		// }
		//console.log(fields)
		let fds = {}
		let funs = {}
		for (let key in fields) {
			let type = fields[key].type
			let memberTemp = {}
			switch (type) {
				
				case 'string':
					// 字符串类型处理
					memberTemp = this.stringRender(data[key],fields[key])					
					
					break;
				case 'number':
					// 数字类型处理
					memberTemp = this.numberRender(data[key],fields[key])
					
					break;
				case 'date':
					// 日期类型处理
					memberTemp = this.dateRender(data[key],fields[key])
					
					break;
				case 'list':
					// 不定元素list处理
					memberTemp = this.listRender(data[key],fields[key])
					
					break;
				default:
					const listRegex = /list<.*>/;
					//泛型list处理
					if(type.match(listRegex) != null){
						let t = type.split(/<|>/)
						// console.log('===============')
						// console.log(t)
						//基础类型处理
						if(t[1].match(/string|number|date/)){

						}else if(pue.dpMap[t[1]]){
							//元组泛型处理
							memberTemp = this.caseListT(data[key],pue.dpMap[t[1]])

						}else{
							//无法识别
						}
					}else if(pue.dpMap[type]){
						memberTemp = this.caseTuple(data[key],pue.dpMap[type])
						//元组类型处理
					}else{
						//无法识别
					}
					break;
			}
			fds[key] = memberTemp
		}

		for (let key in methods) {
			const m = Object.assign({}, methods[key])
			m['-b'] = dataBindMap.get(data)//data['-b']
			//console.log(data)
			if(key != 'load'){
				funs[key] = this.funContactRender(m)
			}
			
		}
		return temp(fds,funs,dp)

	}
	static caseListT(data,dp){
		let temp = this.listTRender(data,dp)
		let rows = []
		//console.log('data:')
		//console.log(data.length)
		for (let r in data) {
			//console.log('b:')
			
			//const b = dataBindMap.get(data[r]) // data[r]['-b']
			//console.log(b)
			let row = this.listTRowRender(data[r],dp)
			// for (key in dp) {
			// 	let k = listTEach(data,dp,content)
			// }
			vdomBindMap.set(row,dataPathMap.get(data[r]))
			rows.push(row)
		}


		//console.log('rows:')
		//console.log(rows)
		let result = temp(rows)

		vdomBindMap.set(result,dataPathMap.get(data))
		return result

	}
	static caseListTRow(){

	}
	static stringRender(value,dp){
		return {
			'-uiType':'span',
			'.innerHtml':value
		}
	}
	static numberRender(value,dp){
		return {
			'-uiType':'span',
			'.innerHtml':value
		}
	}
	static funContainerRender(input,dp,dpKey){
		let temp = {
			'.class':'modal fade',
	        '.id':dpKey,
	        '.tabindex':'-1',
	        '.role':'dialog',
	        '.aria-labelledby':'myModalLabel',
	        '.aria-hidden':"true",
	        modal:{
	        	'.class':'modal-dialog',
	        	content:{
	        		'.class':'modal-content',
	        		header:{
	        			'.class':"modal-header",
	        			esc:{
	        				'-uiType':'button',
	        				'.type':"button",
	        				'.class':"close" ,
	        				'.data-dismiss':"modal" ,
	        				'.aria-hidden':"true",
	        				'.innerHtml':'&times;'
	        			},
	        			title:{
	        				'-uiType':'h4',
	        				'.class':"modal-title",
	        				'.innerHtml':dp.name
	        			}
	        		},
	        		body:{
	        			'.class':'modal-body',
	        			input:input
	        		},
	        		footer:{
	        			'.class':"modal-footer"
	        		}
	        	}
	        }

		}

		return temp
	}
	static funContactRender(method){
		let temp = {			
			'-uiType':'button',
			'.class':'btn btn-default navbar-btn',
			'@onclick':method,
			'.innerHtml':method.name			
		}

		return temp
	}
	//_t = input _dp #fun
	static inputRender(dp,submit,dmName){
		let temp = {
			'-uiType':'form',
			'.role':'form'
		}

		for (let k in dp.fields) {
			switch (dp.fields[k].type) {
				case 'string':
					temp[k] = {
						'.class':'form-group',
						label:{
							'-uiType':'label',
							'.for':k,
							'.innerHtml':dp.fields[k].name
						},
						input:{
							'-uiType':'input',
							'.type':'text',
							'.class':'form-control',
							'.placeholder':'',
							'-inBind':{
								dm:dmName,
								k:k
							}
						}
					}
					break;			
				case 'number':
					temp[k] = {
						'.class':'form-group',
						label:{
							'-uiType':'label',
							'.for':k,
							'.innerHtml':dp.fields[k].name
						},
						input:{
							'-uiType':'input',
							'.type':'number',
							'.class':'form-control',
							'.placeholder':'',
							'-inBind':{
								dm:dmName,
								k:k
							}
						}
					}
					break;
				case 'date':
					temp[k] = {
						'.class':'form-group',
						label:{
							'-uiType':'label',
							'.for':k,
							'.innerHtml':dp.fields[k].name
						},
						input:{
							'-uiType':'input',
							'.type':'date',
							'.class':'form-control',
							'.placeholder':'',
							'-inBind':{
								dm:dmName,
								k:k
							}
						}
					}
					break;
				default:
					// statements_def
					break;
			}
			
		}

		temp.submit = {
			'-uiType':'button',
			'.class':'btn btn-default',
			'.innerHtml':'提交',
			'.type':'button',
			'@onclick':submit
		}

		return temp
	}

	static contactRender(method){

	}
	static tupleMemberRender(){

	}
	static listMemberRender(){

	}
	static dateRender(){
		return {
			'-uiType':'span',
			'.innerHtml':value
		}
	}
	static listRender(){

	}
	static tupleRender(dp){
		return function (fds,funs) {
			let temp = {
				'.class':'col-md-12',
				toolbar:{
					'.class':'row',
					nav:{
						'.class':'navbar navbar-default',
						'.role':"navigation",
						btns:{
							'.class':"container-fluid"
						}
					}			
				},
				menber:{
					'.class':'row',
					content:{
						'.class':'col-md-12'
					}

				}
			}
			//console.log('=================')
			//console.log(dp)
			for (let key in fds) {
				temp.menber.content[key]={
					label:{
						'-uiType':'label',
						'.innerHtml':dp.fields[key].name
					},
					value:fds[key]
				}
			}

			for (let key in funs) {
				temp.toolbar.nav.btns[key]=funs[key]
			}

			return temp
		}
	}
	static listTRender(rows,dp){
		return function (rows){
			let temp = {
				'-uiType':'table',
				'.class':'table table-hover',
				head:{
					'-uiType':'thead',
					tr:{
						'-uiType':'tr'
					}
				},
				body:{
					'-uiType':'tbody'
				}
			}

			for (let k in dp.fields) {
				temp.head.tr[k] = {
					'-uiType':'th',
					'.innerHtml':dp.fields[k].name
				}
			}

			if(dp.methods){
				temp.head.tr['op'] = {
					'-uiType':'th',
					'.innerHtml':'操作'
				}
			}

			for (let k in rows) {
				temp.body['t'+k] =  rows[k]
			}

			return temp
		}
	}
	static listTRowRender(t,dp,b){
		let  row = {
			'-uiType':'tr'
		}
		for (let k in dp.fields) {
			row[k] = {
				'-uiType':'td',
				'.innerHtml':t[k]
			}
		}
		row['op'] = {
			'-uiType':'td'
		}
		const methods = dp.methods
		//const i = r
		//console.log('tb:')
		//console.log(dp.methods)
		for (let k in methods) {
			//拷贝 避免方法指向同一处
			const m = Object.assign({}, methods[k])
			m['-b'] = dataBindMap.get(t) ///t['-b']
			if(k != 'load'){
				row['op'][k] = this.funContactRender(m)
			}
			
		}

		return row

	}
	static listTEachRender(){

	}


}