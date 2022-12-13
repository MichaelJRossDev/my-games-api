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
    test('should return object with one entry: {"reviews" : <all reviews data>}', () => {
        return request(app).get('/api/reviews')
        .expect(200)
        .then((res) => {
            const reviews = res.body.reviews;

            expect(reviews.length).toBe(13);
            expect(String(reviews[0].created_at)).toBe('2021-01-25T11:16:54.963Z')
            expect(String(reviews[12].created_at)).toBe('1970-01-10T02:08:38.400Z')
            
            reviews.forEach(review => {
                expect(review).toHaveProperty('review_id');
                expect(review).toHaveProperty('title');
                expect(review).toHaveProperty('category');
                expect(review).toHaveProperty('designer');
                expect(review).toHaveProperty('owner');
                expect(review).toHaveProperty('review_body');
                expect(review).toHaveProperty('review_img_url');
                expect(review).toHaveProperty('created_at');
                expect(review).toHaveProperty('votes');
                //expect(review).toHaveProperty('comment_count');
            });
        })
    });
});