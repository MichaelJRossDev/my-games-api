const request = require('supertest')
const app = require('../app')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')

beforeEach(() => {
    return seed(data);
})

describe('GET Reviews', () => {
    //console.log(reviewsData);
    test('should return object with one entry: {"reviews" : <all reviews data>}', () => {
        return request(app).get('/api/reviews')
        .expect(200)
        .then((res) => {
            const reviews = res.body.reviews;

            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.length).toBe(13);
            
            reviews.forEach(review => {
                expect(typeof review.review_id).toBe('number');
                expect(typeof review.title).toBe('string');
                expect(typeof review.category).toBe('string');
                expect(typeof review.designer).toBe('string');
                expect(typeof review.owner).toBe('string');
                expect(typeof review.review_body).toBe('string');
                expect(/[\/.](gif|jpg|jpeg|tiff|png)/i.test(review.review_img_url)).toBe(true);
                expect(typeof review.created_at).toBe('string');
                expect(typeof review.votes).toBe('number');
            });
        })
    });
});