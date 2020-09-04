# grand-finale
Extension module for finale.

## Objectives
1. Auto Loading of entire exposable Sequelize schema
1. Support for arbitrary controllers and endpoints
1. Enable schema model definitions collection at api root 


## Usage
'''
const S=require("sequelize");
const _=require("underscore");
const sequelize=new S.Sequelize('postgres://test:test@localhost:5432/test')
var express = require('express')
var app = express();
sequelize.define('test1',{'field1':{type:S.DataTypes.TEXT(10)}})
const GrandFinale=require("grand-finale")
_.extend(S,{
	app: app,
	sequelize: sequelize,
	directory:'./test/controllers',
})
var grand_finale=new GrandFinale(S)
grand_finale.initialize()

