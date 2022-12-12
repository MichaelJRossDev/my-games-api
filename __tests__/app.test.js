const request = require('supertest')
const app = require('../app')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')

const categoriesData = require('../db/data/test-data/categories')

beforeEach(() => {
    return seed(data);
})

describe('GET Categories', () => {
    test('should return object with one entry: {"categories" : <all categories data>}', () => {
        return request(app).get('/api/categories')
        .expect(200)
        .expect({'categories' : categoriesData})
    });
});