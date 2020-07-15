const requireDir=require('require-dir')
const _ = require('underscore');
const DEFAULT_DIRECTORY='./controllers'
const finale=require('finale-rest')

function grand_finale(options){
	var options=options || {}
	this.finale=finale
	this.options=options
	this.resources=[]
	return this
}

grand_finale.prototype.initialize=function (options){
	options=options || this.options
	this.sequelize=options.sequelize
	this.finale.initialize(options)
	this.load(options)
}

grand_finale.prototype.load=function(options){
	controllers.bind(this)(options)
	resourceAll.bind(this)(options)
	registerDictionary.bind(this)(options)
}

grand_finale.prototype.resource=function(options){
	var resource=this.finale.resource(options)
	this.resources.push(resource)
	return resource
}

grand_finale.prototype.getresources=function(){
	return this.resources;
}

grand_finale.prototype.dictionary=function (options){
	return this.resources.map(resourceJSON.bind(this))
}


function resourceAll(){
	_.each(this.sequelize.models,((model,name)=>{
		if (
			model.options &&
			model.options.Options &&
			model.options.Options.excludeFromApi
		)
			return

		this.resource({
			model:model
		})
	}).bind(this))
}

function controllers(options){
	var directory= options && options.directory ? options.directory : DEFAULT_DIRECTORY
	var defs= requireDir(directory)
	_.each(defs,((def,name)=>{
		def.endpoints=def.endpoints || [name]
		makeControllerModel.bind(this)(name,def)
	}).bind(this))
}

function registerDictionary(){
	this.finale.app.use(this.finale.base,handleResponse({handler:this.dictionary}))
}

// fake sequelize model
function makeControllerModel(name,def){
	var dummy=this.options.sequelize.define(name,{dummy:this.options.DataTypes.INTEGER})
	dummy.findAndCountAll=def.find
	return dummy
}


function resourceJSON(resource){
	var clean=  decircularize(resource,decirctest)
	clean.model=resource.model
	clean.name=resource.model.name
	return clean
}

function decircularize (ob,test){
	return JSON.parse(JSON.stringify(ob,test))
}


function decirctest (k,v){
	if (typeof v !== 'object')
		return v
	if (k.charAt(0) === '_')
		return undefined

	if (typeof v === 'object')
		switch(k){
			case 'classMethods':
			case 'instanceMethods':
			case 'modelManager':
			case 'Model':
			case 'paired':
			case 'daoFactoryManager': 
			case 'daos': 
			case 'source': 
			case 'target':
			case 'sequelize':
			case 'GeminiHidden':
			case 'hooks':
			case 'lookup':
			case 'resource':
				return undefined;
		}

	return v
}


function handleResponse(responseHandler){
	return function(req, res){
		res.setHeader('Content-Type', responseHandler.contentType || 'application/json');
		responseHandler.handler.bind(this)(req)
		.then(res.send)
	}.bind(this)
}

module.exports=grand_finale
