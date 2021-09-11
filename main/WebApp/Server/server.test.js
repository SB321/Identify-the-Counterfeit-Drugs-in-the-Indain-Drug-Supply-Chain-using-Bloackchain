
const axios = require('axios');
const app = require('./server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

test('should be defined', () => {expect(axios).toBeDefined()})

test('checcking status code',async () => {
    const response = await request.get('/')

  expect(response.status).toBe(200)
  
 
})
test('checcking status code',async () => {
    const response = await request.get('/login')

  expect(response.status).toBe(200)
  
 
})
test('checcking status code',async () => {
    const response = await request.get('/aboutproject')

  expect(response.status).toBe(200)
  
 
})
test('checcking status code',async () => {
  const response = await request.get('/register')

expect(response.status).toBe(200)


})
test('checcking status code',async () => {
    const apiUrl = "http://localhost:4000/read/medicine?args=[\"ad6dc643502ff4a3898441d5588b8a07ac876d97\"]";
    await axios.get(apiUrl)
      .then(r => {
        expect(r.status).toBeLessThan(300);
      })
      .catch(e => {
        fail(`Expected successful response`);
      });
})

test('checcking status code',async () => {
    const apiUrl = "http://localhost:4000/read/history/medicine?args=[\"c87b60eabaf0b3701449039c125a52e2876c1468\"]";
    await axios.get(apiUrl)
      .then(r => {
        expect(r.status).toBeLessThan(300);
      })
      .catch(e => {
        fail(`Expected successful response`);
      });
})
afterAll(done => {
    app.close();
    done();
});
