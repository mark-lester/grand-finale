var options={
	database:'marmot',
	user:'marmot',
	password:'marmot',
	host:'localhost',
	dialect:'mysql'
}
var S=require("sequelize");
const _=require("underscore");
const sequelize=new S.Sequelize(options)
const http = require('http');
var express = require('express')
var app = express();
sequelize.define('test1',{'field1':{type:S.DataTypes.TEXT(10)}})
const GrandFinale=require("../index.js")
var grand_finale=new GrandFinale({
	app: app,
	sequelize: sequelize,
	Sequelize: S,
	directory:'./test/controllers',
})
grand_finale.initialize()

app.set('port',options.webport || 8080);
var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
})

var assert = require('assert');
describe('Load', async function () {
	it('Should exist', async function () {
		assert.equal(grand_finale.getresources()[0].model.name,'test1')
		assert.equal(grand_finale.getresources()[1].model.name,'search')
		var dictionary=await grand_finale.dictionary()
		assert.equal(dictionary[0].model.name,'test1')
		assert.equal(dictionary[1].model.name,'search')
	});

	it('server test', async function () {
		const axios=require("axios")
		var response = await axios.get("http://localhost:8080/api/")
		var dictionary=response.data
		assert.equal(dictionary[0].name,'test1')
		assert.equal(dictionary[1].name,'search')
		server.close()
	})
})


