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


describe('GET Review by ID', () => {

    test('Should return object with one entry, with the review data as the value.', () => {
        return request(app).get('/api/reviews/13')
        .expect(200)
        .then( (response) => {
            review = response.body.review;
            expect(review.review_id).toBe(13);
            expect(review.title).toBe('Settlers of Catan: Don\'t Settle For Less');
            expect(review.category).toBe('social deduction');
            expect(review.designer).toBe('Klaus Teuber');
            expect(review.owner).toBe('mallionaire');
            expect(review.review_body).toBe('You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.')
            expect(review.review_img_url).toBe('https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg');
            expect(review.created_at).toBe('1970-01-10T02:08:38.400Z');
            expect(review.votes).toBe(16);
        })
    })

    test('Valid but nonexistant review_id returns error code 404', () => {
        return request(app).get('/api/reviews/300')
        .expect(404)
        .expect('Not Found')
    })

    test('Invalid review_id returns error code 400', () => {
        return request(app).get('/api/reviews/banana')
        .expect(400)
        .expect('Bad Request')
    })
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
        username: "JaneDoe",
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

describe('Patch Review', () => {
    const changes = {
        inc_votes: 3
    }

    const invalidRequest = {
        foo: "bar"
    }

    test('Should correctly patch review', () => {
        const changes = {
            inc_votes: 3
        }
        return request(app).patch('/api/reviews/13')
        .send(changes)
        .expect(200)
        .then((response) => response.body.rows[0])
        .then((review) => {
            expect(review.votes).toBe(19);
        })
    })

    test('Should return 400 on invalid request', () => {
        return request(app).patch('/api/reviews/13')
        .send(invalidRequest)
        .expect(400)
    });

    test('Should return 404 on nonexistent review ID', () => {
        return request(app).patch('/api/reviews/130')
        .send(changes)
        .expect(404)
        .expect({msg : `No such review ID: 130`})
    })

    test('Should return 400 on invalid review ID', () => {
        return request(app).patch('/api/reviews/banana')
        .send(changes)
        .expect(400)
    })

});