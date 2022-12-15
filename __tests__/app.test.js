const request = require('supertest')
const app = require('../app')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
})

describe('GET Reviews', () => {
    test('should return object with one entry: {"reviews" : <all reviews data>}', () => {
        return request(app).get('/api/reviews')
        .expect(200)
        .then((res) => {
            const reviews = res.body.reviews;

            expect(reviews.length).toBe(13);

            expect(reviews).toBeSortedBy('created_at', {
                descending: true
              });
            
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
                expect(review).toHaveProperty('comment_count');
                expect(typeof review.comment_count).toBe('number'); //Checks the CAST() SQL function has worked
            })
        })
    })
})

describe('GET Categories', () => {
    test('should return object with one entry: {"categories" : <all categories data>}', () => {
        return request(app).get('/api/categories')
        .expect(200)
        .then((res) => {
            const categories = res.body.categories;
            expect(categories.length).toBe(4);
            
            categories.forEach(category => {
                expect(category).toHaveProperty('slug');
                expect(category).toHaveProperty('description');
            });
        })
    });
});

describe('GET comments by review ID', () => {
    test('Should return all comments of a given review', () => {
        return request(app).get('/api/reviews/3/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.comments;
            comments.forEach(comment => {
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('body');
                expect(comment).toHaveProperty('review_id');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
            });

            expect(comments).toBeSortedBy('created_at', {descending : true});
        })
    })
});