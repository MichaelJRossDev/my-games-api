const request = require('supertest')
const app = require('../app')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    db.end();
})

describe('GET Reviews', () => {
    //console.log(reviewsData);
    test('should return object with one entry: {"reviews" : <all reviews data>}', () => {
        return request(app).get('/api/reviews')
        .expect(200)
        .then((res) => {
            const reviews = res.body.reviews;

            expect(reviews.length).toBe(13);
            
            reviews.forEach(review => {
                expect(review).toHaveProperty(
                    'review_id',
                    'title',
                    'category',
                    'designer',
                    'owner',
                    'review_body',
                    'review_img_url',
                    'created_at',
                    'votes'
                )
            });
        })
    });
});