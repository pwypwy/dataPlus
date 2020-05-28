var pue = {
    dpMap:{},
    define(name,dt){
        this.dpMap[name] = dt
    }
}

class dataModel{
    static new(mdName,param){
        let data =  param;
        if(pue.dpMap[mdName]&& pue.dpMap[mdName].init){
            data = pue.dpMap[mdName].init()
        }
        dmBindMap.set(data,mdName)
        return data
    }
}

var pMap = {
    inputShow:[],
    inputHide:[],
    inputValue:[],
    inputFun:[],
    inputData:[],
    currentGen:{}
}

var dataPathMap = new WeakMap();
var dataBindMap = new WeakMap();
var vdomBindMap = new WeakMap();
var dmBindMap = new WeakMap();

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
        //     methods[k]['-b'] = data['-b']
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
            //     let k = listTEach(data,dp,content)
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


var pui = {
    id:0,
    pid:[],
    data:[],
    uiList:[],
    uiMap:[],
    dataMap:[],
    objMap:[],
    componentMap:[],
    realDomMap:[],
    virtualDomMap:[],
    dataModelMap:[],
    plan:{},
    opData:{},
   // pue:pue,

    show(dpName,interactPlan){
        var dp = pue.dpMap[dpName]
        var data = dp.methods.load();

        var abstractData = this.buildAbstractData(data)

        console.log(data)
        console.log('++++++++++++++')
        console.log(abstractData)


        let temp = plan.render(abstractData,dp)
        console.log(temp)

    },
    buildAbstractData(data,dmName){
        let abstractData= {}
        for (let k in data) {
            console.log(dmName)
            let dm = null //= pue.dpMap[dmName].fields[k].type
            if(pue.dpMap[dmName]){
                dm = pue.dpMap[dmName].fields[k].type
            }
            if(typeof data[k] == 'object'){                            
                abstractData[k]=this.buildAbstractData(data[k],dm)             
                dataPathMap.set(abstractData[k],{key:k,obj:data,dm:dm});
                
            }else{
                abstractData[k] = {
                    '-bind':{
                        key:k,
                        obj:data,
                        dm:dm
                    }                                  
                }
            }
        }
        dataBindMap.set(abstractData,data)
        return abstractData
    },
    bindData(){

    },
    render(component,data,containerId){
       // console.log(data)
       // console.log(component)
        let container = document.body
        if(containerId){
            container = document.getElementById(containerId)
        }
        //dom 符号 (唯一标识符)
        const symbol = Symbol(data)
        //虚拟dom对象
        let uiObj = component(data)
        //dom对象
        let element = this.new(uiObj,null,symbol) 
        //页面容器          
        container.appendChild(element)
        //realDomMap
        this.uiMap[symbol] = element
        this.dataMap[symbol] = data
        this.componentMap[symbol] = component
        //virtualDomMap
        this.objMap[symbol] = uiObj

    },
    //可视化
    visualize(dmName,interactPlan,containerId){
        let container = document.body
        if(containerId){
            container = document.getElementById(containerId)
        }
        var dm = pue.dpMap[dmName]
        var data = dm.methods.load();

        var abstractData = this.buildAbstractData(data,dmName)
        // console.log('abstractData:')
        // console.log(abstractData)

        // console.log('dataBindMap:')
        // console.log(dataBindMap)
        //dom 符号 (唯一标识符)
        const symbol = Symbol(data)
        //虚拟dom对象
        let virtualDom = plan.render(abstractData,dm)
        if(interactPlan){

        }
        
        // console.log('virtualDom:')
        // console.log(virtualDom)
        
        //构建dom对象实例
        let realDom = this.buildDom(virtualDom) 
        // console.log('realDom:')
        // console.log(realDom)
        //页面容器          
        container.appendChild(realDom)
        //realDomMap
        this.realDomMap[symbol] = realDom
        this.opData = data
        this.plan = plan
        this.virtualDomMap[symbol] = realDom
    },
    //虚拟dom实例化
    buildDom(virtualDom){
        let realDom = {}
        //根据-uiType 设置节点类型 默认为div
        if(virtualDom['-uiType']){
            realDom = document.createElement(virtualDom['-uiType'])
        }else{
            realDom = document.createElement('div')
        }
        
        for (key in virtualDom) {
            switch (key[0]) {
                case '.':
                    //构造节点属性
                    this.buildAttribute(realDom,key.substr(1),virtualDom[key])
                    break;
                case '@':
                    //构造结点事件

                    const symbol = Symbol('fun')
                    pui.dataMap[symbol] = virtualDom[key]['-b']
                    console.log('方法识别:')
                    console.log(virtualDom[key])
                    this.buildEvent(realDom,key.substr(1),virtualDom[key],symbol)
                    break;
                case '-':
                    //构造额外操作
                    this.buildOtherOp(realDom,key.substr(1),virtualDom[key])
                    break;
   
                default:
                    //判定是否为字母开头
                    var isLetter = /^[a-zA-Z]+$/.test(key[0])
                    if(isLetter){
                        //添加结点
                        realDom.appendChild(this.buildDom(virtualDom[key]))
                    }
                    break;

                }
        }

        //自动刷新策略
        let bindPath = vdomBindMap.get(virtualDom)
        if(bindPath){
            //console.log('绑定数据:')
            //console.log(bindPath)
            this.bindDom(bindPath,realDom)

        }
        return realDom
    },
    //实现数据和dom节点的绑定,用于刷新事件
    bindDom(path,realDom){
        let obj = path.obj
        let key = path.key
        let dm = path.dm
        let value = obj[key]
        let a = this
        //let buildAbstractData = this.buildAbstractData
        
        Object.defineProperty(obj,key,{                      
            get:function(){
                //console.log('取值:  '+value)
                return value
            },
            set:function(newValue){
                value = newValue
                //setAttribute(realDom,key,newValue)
                console.log('捕捉数据节点变化 :')
                console.log(newValue)
                let ad = a.buildAbstractData(newValue,dm)
                let vd
                //根据数据类型采用不同的渲染器生成对应的虚拟dom
                if(newValue instanceof Array){
                    //console.log('数组对象')
                    //获取泛型 (下版本改进点)
                    let t = dm.split(/<|>/)
                    //console.log(t[1])
                    vd = plan.caseListT(ad,pue.dpMap[t[1]])
                    //console.log(vd)
                    
                }else {
                    vd = plan.caseTuple(ad,pue.dpMap[dm])
                    
                }
                //用新的dom节点替换原来的dom节点
                let newRealDom = a.buildDom(vd)
               // console.log(newRealDom)
                let father = realDom.parentNode
                father.replaceChild(newRealDom,realDom)
                a.bindDom(path,newRealDom)
               

            },
            enumerable:true,  //为 true  表示 该属性 可被枚举 
            configurable:true //为true 标识该属性可被修改和删除
        })
    },
    buildAttribute(realDom,key,value){
        //console.log(key + '      '+value)
        switch (typeof value) {
            case 'string':
                //设置属性
                this.setAttribute(realDom,key,value)
                break;
            case 'object':
                if(value['-bind']){
                    this.bindAttribute(realDom,key,value['-bind'].obj,value['-bind'].key)
                }
                break;
            case 'function':
                break;
            default:
                break;
        }
    },
    setAttribute(realDom,key,value){      
    
        if (key == 'innerHtml') {
            
            realDom.innerHTML = value;
        }else{
            //console.log(key)
            //sconsole.log(value)
            realDom.setAttribute(key, value)
        } 
    },
    bindAttribute(realDom,key,obj,k){
        this.setAttribute(realDom,key,obj[k])
        let setAttribute = this.setAttribute
        //console.log('===='+key)
        let value = obj[k]
        
        Object.defineProperty(obj,k,{                      
            get:function(){
                //console.log('取值:  '+value)
                //console.log('取值key:  '+key)
                //console.log('取值k:  '+k)
                return value
            },
            set:function(newValue){
                value = newValue
                //Reflect.set(obj, k,newValue)
                setAttribute(realDom,key,newValue)
                //console.log('set :'+newValue)
            },
            enumerable:true,  //为 true  表示 该属性 可被枚举 
            configurable:true //为true 标识该属性可被修改和删除
        })
    },
    buildEvent(realDom,key,value,dataSymbol){
        //console.log('开始构建事件')
        switch (typeof value) {
            case 'string':
                //设置属性
                //this.setAttribute(realDom,key,value)
                break;
            case 'object':
                let data = pui.dataMap[dataSymbol]
                if(value['-t'] == 'fun'){                   
                    this.buildFunEvent(realDom,key,value,data)
                }else if(value['-t'] == 'gen'){
                    this.buildGenEvent(realDom,key,value,data)
                }else if(value['-t'] == 'submit'){
                    this.buildSubmitEvent(realDom,key,value,data)
                }
                break;
            default:
                break;
        }
    },
    buildFunEvent(realDom,key,value,data){
        if(value['paramType']){
            this.bindParamFun(realDom,key,value,data)
        }else{
            this.bindNoParamFun(realDom,key,value,data)
        }
    },
    buildGenEvent(realDom,key,value,data){
        if(value['paramType']){
            //this.bindParamFun(realDom,key,value,data)
        }else{
            this.bindNoParamGen(realDom,key,value,data)
        }
    },
    bindNoParamGen(realDom,key,value,data){
        console.log('构建无参Gen事件')
        console.log(data)
        realDom[key] =  function(){            
            let result = value.fun(data)

            let gen = value.fun(data) 

            //let awaitData = gen.next()
            //let dm = dmBindMap.get(awaitData.value)
            pMap.currentGen = gen

            //递归方式处gen函数输入问题
            dealFun(data)
            
            function dealFun(opData,param){
                let gen = pMap.currentGen 
                let awaitData
                if(param){
                   awaitData = gen.next(param) 
                }else {
                   awaitData = gen.next()
                }
                
                let dm = dmBindMap.get(awaitData.value)
                if(awaitData.done){
                    if(awaitData.value){
                        alert(awaitData.value)
                    }
                }else{  
                    console.log('awaitData:')
                    console.log(awaitData.value)  
                    let awaitValue = awaitData.value
                    let param = pMap.inputValue[dm]   
                    for (i in param) {
                        if(awaitValue[i]){
                            param[i] = awaitValue[i] 
                        }                               
                    }            
                    //设置当前操作数据
                    pMap.inputData[dm] = opData
                    //弹出参数入口
                    pMap.inputShow[dm]()
                    //存储中间函数
                    pMap.currentGen = gen
                    //设置提交事件
                    pMap.inputFun[dm] = dealFun
                    //弹出对应参数入口

                }
            }
            
        }
    },
    bindParamFun(realDom,key,value,data){
        //console.log('构建有参方法事件:')
        //console.log(value)
        realDom[key] =  function(){     
            //1 绑定参数入口函数 
            
            // 设置当前操作的数据
            pMap.inputData[value.paramType] = data
            //弹出参数入口
            //console.log(value)
            //console.log(pMap)
            pMap.inputShow[value.paramType]()
            //绑定提交事件
            pMap.inputFun[value.paramType] = value.fun
            //let result = value.fun(data)
        }
    },
    bindNoParamFun(realDom,key,value,data){
        //console.log('构建无参方法事件')
        console.log('构建无参方法事件')
        console.log(data)
        realDom[key] =  function(){            
            let result = value.fun(data)

            if(result){
                alert(result)
            }
        }
    },
    buildOtherOp(realDom,key,value){
        switch (key) {
            case 'inFun':
                pMap.inputShow[value.dm] = function(){
                    value.show(realDom)
                } 
                pMap.inputHide[value.dm] = function(){
                    value.hide(realDom)
                }
                if(!pMap.inputValue[value.dm]){
                    pMap.inputValue[value.dm] = {}
                }
                
                break;
            case 'inBind':
                //参数入口数据双向绑定
                // dom -> data
                console.log('value-----')
                console.log(value)

                if(!pMap.inputValue[value.dm]){
                    pMap.inputValue[value.dm] = {}
                }
                let k = value.k
                let v //= obj[k]
                realDom['oninput'] = function(){
                    console.log('value: ====')
                    
                    pMap.inputValue[value.dm][k] = realDom.value

                    //console.log(pMap.inputValue[value.dm])
                }
                //data -> dom
                Object.defineProperty(pMap.inputValue[value.dm],k,{                      
                    get:function(){
                        //console.log('取值:  '+value)
                        return v
                    },
                    set:function(newValue){
                        v = newValue 
                        realDom.value = newValue
                        //console.log('set :'+newValue)
                    },
                    enumerable:true,  //为 true  表示 该属性 可被枚举 
                    configurable:true //为true 标识该属性可被修改和删除
                })
                
                break;
            default:
                // statements_def
                break;
        }
    },
    buildSubmitEvent(realDom,key,value,data){

        //console.log('构建提交事件')
        realDom[key] =  function(){ 
            //1 获取参数临时变量
            let param = pMap.inputValue[value['-pm']] 
            //2 获取当前准备操作的数据  
            let opData = pMap.inputData[value['-pm']]  
            //2 触发绑定事件
            // console.log('当前操作数据')
            // console.log(data2.name)
            // console.log(data2.pass)
            let result = pMap.inputFun[value['-pm']](opData,param)
            if(result){
                alert(result)
            }
            //3 关闭参数入口
            pMap.inputHide[value['-pm']]()
        }
    },
    new(temp,name,uiSymbol){
        let element = {}
       // console.log(temp)

        if(temp.uiType == null || temp.uiType == undefined){
            if((typeof name == 'string')&&(name.indexOf('_')!=-1)){
                let type = name.split('_').pop()
                element = document.createElement(type)
            }else{
                element = document.createElement('div')
            }               
        }else{
            element = document.createElement(temp.uiType)
        }

        if(typeof name == 'string'){
            element.setAttribute('p-tag', name)
        }
        let pid = this.getPid()
        element.setAttribute('p-id', pid)


        for (key in temp) {
            switch (key) {
                case 'uiType':
                    break;
   
                default:
                    //this.define(element,key,temp[key])    
                    switch (typeof temp[key]) {
                        case 'string':
                            this.define(element,key,temp[key])
                            break;
                        case 'object':
                            //数组或对象则新建子节点
                            element.appendChild(this.new(temp[key],key,uiSymbol))
                            break;
                        case 'function':
                            //方法事件绑定
                            const symbol = Symbol('fun')
                            pui.dataMap[symbol] = temp
                            //console.log('绑定方法:'+key)
                            const funName = key
                           // pui.pid[symbol] = pid

                            //alert('事件绑定'+key)
                            // 普通function 和 Generator区别实现
                            if(temp[key].prototype == '[object Generator]'){
                                element[key] =  function(){
                                   // console.log('高级调用方法:'+funName)
                                    //console.log(pui.data[symbol])
                                    let fun = pui.dataMap[symbol][funName]()  
                                    let awaitData = fun.next()
                                    while(true){
                                        if(awaitData.done){
                                            break
                                        }
                                        alert(awaitData.value)
                                        awaitData = fun.next(9)
                                    }
                                    if(awaitData.value){
                                        alert(awaitData.value)
                                    } 
                                   // console.log('协程状态:')    
                                   // console.log(awaitData)      
                                    //console.log(pui.dataMap[symbol][key])
                                    //pui.refresh(uiSymbol)
                                   // console.log('高级调用结束')
                                    
                                }
                            }else{
                                element[key] =  function(){
                                   // console.log('调用方法:'+funName)
                                    //console.log(pui.data[symbol])
                                    pui.dataMap[symbol][funName]()                          
                                   // console.log(pui.dataMap[symbol][key])
                                    //pui.refresh(uiSymbol)
                                   // console.log('调用结束')
                                    
                                }
                            }
                            

                            
                            break;

                        default:
                            console.log(key+'未定义')
                            break;
                    }
                    break;
            }
            
        }
        return element
    },
    define(element,key,data) {
        switch (typeof(data)) {
            case 'string':
                this.setElement(element,key,data)
                break;
            default:
                // statements_def
                break;
        } 
    },
    setElement(element,key,data) {
        if (key == 'innerHTML') {
            element.innerHTML = data;
        }else{
            element.setAttribute(key, data)
        }           
    },
    bindFun(obj,funName){
        const symbol = Symbol(obj);
        this.dataMap[symbol] = obj
       // console.log(obj[funName].prototype.toString())
        console.log('打印:')
        //console.log(typeof Object.getPrototypeOf(obj[funName]))
        return obj[funName].bind(obj)
        // if(obj[funName].prototype == '[object Generator]'){
        //     console.log('高级Generator')
        //     return pui.dataMap[symbol][funName]
                
        // }else{
        //     return ()=>{
        //         pui.dataMap[symbol][funName]()
        //     }
        // }
        
    },
    getPid(){
        this.id ++
        return this.id
    },
    refresh(uiSymbol){
        //console.log('刷新!')
        let data = pui.dataMap[uiSymbol]
        let element = pui.uiMap[uiSymbol]
        let uiObj = pui.componentMap[uiSymbol](data)
        let oldUiObj = pui.objMap[uiSymbol]
        //console.log(data)
        //console.log(uiObj)
        //console.log(element)
        

        console.log(Object.getOwnPropertyDescriptors(oldUiObj))
        console.log(Object.getOwnPropertyDescriptors(uiObj))
        //如果虚拟dom存在变化则刷新ui界面 
        if(Object.getOwnPropertyDescriptors(oldUiObj) != Object.getOwnPropertyDescriptors(uiObj)){
            console.log('刷新!')
            let newElement = this.new(uiObj,null,uiSymbol)
            console.log(newElement)
            let father = element.parentNode
            father.replaceChild(newElement,element);
            pui.uiMap[uiSymbol] = newElement
        }
        //this.uiList[symbol] = element
        //this.data[symbol] = uiObj
    }

}

//console.log('11111111111111111112')

