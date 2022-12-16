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
            expect(comments.length).not.toBe(0);
            comments.forEach(comment => {
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('body');
                expect(comment.review_id).toBe(3);
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
            });

            expect(comments).toBeSortedBy('created_at', {descending : true});
        })
    })
})

describe('POST Comment', () => {
    const correctComment = {
        username: "philippaclaire9",
        body: "This game ruined Christmas. My whole family hate me. 5 Stars."
    }

    const incorrectUsername = {
        username: "JohnDoe",
        body: "Nice game. Would play again"
    }

    const missingField = {
        username: "philippaclaire9"
    }
    test('Should add comment to database', () => {

        return request(app).post('/api/reviews/13/comments')
        .send(correctComment)
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

    test('Should return error 404 for unknown review', () => {
        return request(app).post('/api/reviews/450/comments')
        .send(correctComment)
        .expect(404)
    });

    test('Should return error 400 for invalid review id', () => {
        return request(app).post('/api/reviews/banana/comments')
        .send(correctComment)
        .expect(400)
    });

    test('Should return error 400 for unknown username', () => {
        return request(app).post('/api/reviews/4/comments')
        .send(incorrectUsername)
        .expect(404)
    });

    test('Should return error 404 for unknown username', () => {
        return request(app).post('/api/reviews/4/comments')
        .send(incorrectUsername)
        .expect(404)
    });

    test('Should return error 400 for missing field', () => {
        return request(app).post('/api/reviews/4/comments')
        .send(missingField)
        .expect(400)
    });
});