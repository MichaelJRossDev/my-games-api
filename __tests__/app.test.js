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
    })

    test('Invalid review_id returns error code 400', () => {
        return request(app).get('/api/reviews/banana')
        .expect(400)
    })

});