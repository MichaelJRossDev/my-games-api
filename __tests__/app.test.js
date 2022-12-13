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
        .then((res) => {
            const categories = res.body.categories;

            console.log(categories);

            expect(Array.isArray(categories)).toBe(true);
            expect(categories.length).toBe(4);
            
            categories.forEach(category => {
                expect(typeof category.slug).toBe('string');
                expect(typeof category.description).toBe('string');
                expect(Object.keys(category).length).toBe(2);
            });
        })
    });
});