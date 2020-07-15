const S=require("sequelize");
const _=require("underscore");
const sequelize=new S.Sequelize('postgres://test:test@localhost:5432/test')
var express = require('express')
var app = express();
sequelize.define('test1',{'field1':{type:S.DataTypes.TEXT(10)}})
const GrandFinale=require("../index.js")
_.extend(S,{
	app: app,
	sequelize: sequelize,
	directory:'./test/controllers',
})
var grand_finale=new GrandFinale(S)
grand_finale.initialize()

var assert = require('assert');
describe('Load', function () {
	it('Should exist', function () {
		assert.equal(grand_finale.getresources()[0].model.name,'test1')
		assert.equal(grand_finale.getresources()[1].model.name,'search')
		assert.equal(grand_finale.dictionary()[0].model.name,'test1')
		assert.equal(grand_finale.dictionary()[1].model.name,'search')
	});
});

