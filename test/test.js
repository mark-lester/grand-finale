var options={
	database:'marmot',
	user:'marmot',
	password:'marmot',
	host:'localhost',
	dialect:'mysql'
}
var S=require("sequelize");
const _=require("underscore");
const sequelize=new S.Sequelize(options.user,options.password,options.database,options)
const http = require('http');
var express = require('express')
var app = express();
var test_model=sequelize.define('test1',{'field1':{type:S.DataTypes.STRING(100)}})
sequelize.sync()
.then(main)

function main(){

const GrandFinale=require("../index.js")
var grand_finale=new GrandFinale({
	app: app,
	sequelize: sequelize,
	DataTypes: S.DataTypes,
	directory:'./test/controllers',
	base:'/api',
})
grand_finale.initialize()

app.set('port',options.webport || 8080);
var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
})

var assert = require('assert');
describe('Exist', async function () {
	assert.equal(grand_finale.getresources()[0].model.name,'test1')
	assert.equal(grand_finale.getresources()[1].model.name,'search')
	var dictionary=await grand_finale.dictionary()
	assert.equal(dictionary[0].model.name,'test1')
	assert.equal(dictionary[1].model.name,'search')
});

describe('server test', async function () {
	const axios=require("axios")
	var FIELD1_1= 'content field1, first record'
	var FIELD1_2= 'content field1, second record'
	var FIELD1_3= 'content field1, third record'

	var sample= await sequelize.models.test1.create({
		field1:FIELD1_1
	})
	var sample2= await sequelize.models.test1.create({
		field1:FIELD1_2
	})
	var sample3= await sequelize.models.test1.create({
		field1:FIELD1_3
	})

	var response = await axios.get("http://localhost:8080/api/")
	var dictionary=response.data
	assert.equal(dictionary[0].name,'test1')
	assert.equal(dictionary[1].name,'search')

	response = await axios.get("http://localhost:8080/api/test1s")
	var results=response.data
	assert.equal(results.length,3)

	assert.equal(results[0].field1,FIELD1_1)
	assert.equal(results[1].field1,FIELD1_2)
	assert.equal(results[2].field1,FIELD1_3)

	response = await axios.get("http://localhost:8080/api/test1s/"+sample.id)
	var result=response.data
	assert.equal(result.field1,FIELD1_1)

	response = await axios.get("http://localhost:8080/api/test1s/"+sample2.id)
	var result2=response.data
	assert.equal(result2.field1,FIELD1_2)
	server.close()
	sequelize.close()
})


} // end main
