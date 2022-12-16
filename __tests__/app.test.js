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

describe('POST Comment', () => {
    test('Should add comment to database', () => {

        const payload = {
            username: "philippaclaire9",
            body: "This game ruined Christmas. My whole family hate me. 5 Stars."
        }
        return request(app).post('/api/reviews/13/comments')
        .send(payload)
        .expect(201)
        .then((response) => {
            const comment = response.body.comment;
            expect(comment).toHaveProperty('comment_id');
            expect(comment.body).toBe("This game ruined Christmas. My whole family hate me. 5 Stars.");
            expect(comment.review_id).toBe(13);
            expect(comment.author).toBe('philippaclaire9');
            expect(comment.votes).toBe(0);
            expect(comment).toHaveProperty('created_at');

            return db.query(`
            SELECT * FROM COMMENTS WHERE review_id = 13`)
            .then((result) => {
                const databaseComment = result.rows[0];
                expect(databaseComment.review_id).toBe(comment.review_id)
                expect(databaseComment.body).toBe(comment.body)
                expect(databaseComment.comment_id).toBe(comment.comment_id)
            })
        })
    });
});