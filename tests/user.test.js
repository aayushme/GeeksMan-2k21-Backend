const request=require('supertest')
const app=require('../app')
const User=require('../models/User')
const {useroneId,userOne,setupdatabase}=require('./fixtures/db')
jest.setTimeout(30000);
//Runs before each test
beforeEach(setupdatabase)

test('should signup a new user',async ()=>{
       await request(app).post('/signup').send({
           name:"paragthakur",
           email:"paragthakurtest21@gmail.com",
           password:"helloparag"
       }).expect(201)
})

test('should login existing user',async ()=>{
    await request(app).post('/login'),send({
        name:userOne.email,
        password:userOne.password
    }).expect(200)
})

// request(app).post('/someurl').set('Authorization','Bearer ${token}')

test('should not login non existing users',async ()=>{
    await request(app).post('/login').send({
        email:userOne.email,
        password:'Thisisnotpassword'
    }).expect(400)
})

test('should return all the users',async ()=>{
    await request(app).get('/users').send().expect(200)
})
