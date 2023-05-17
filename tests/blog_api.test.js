const supertest = require('supertest')
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const listHelper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)

// const User = require('../models/user')
const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        console.log(response.body)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.author)
        expect(contents).toContain("Edsger W. Dijkstra"
        )
    })
// })

    describe('viewing a specific blog', () => {

        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const blogToView = blogsAtStart[0]

            console.log(blogToView)
            console.log(`/api/blogs/${blogToView.id}`)

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(resultBlog.body).toEqual(blogToView)
        })
    })

    // test('fails with statuscode 404 if note does not exist', async () => {
    //   const validNonexistingId = await helper.nonExistingId()
    //
    //   await api
    //     .get(`/api/notes/${validNonexistingId}`)
    //     .expect(404)
    // })
//
//     test('fails with statuscode 400 id is invalid', async () => {
//       const invalidId = '5a3d5da59070081a82a3445'
//
//       await api
//         .get(`/api/notes/${invalidId}`)
//         .expect(400)
//     })
//   })
//
    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {

            const newBlog = {
                title: "Game of thrones",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 3,
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

            const contents = blogsAtEnd.map(n => n.title)
            expect(contents).toContain(
               newBlog.title
            )
        })

        test('if the likes property is missing from the request', async ()=>{
            const newBlog = {
                title: "Game of thrones",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                // likes: 3,
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            expect(response.body.likes).toBe(0)
        })

        test('fails with status code 400 if data invalid', async () => {
            const newBlog = {
                // title: "Game of thrones",
                author: "Robert C. Martin",
                // url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            }
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)

      // expect(helper.blogsInDb()).toHaveLength(helper.initialBlogs.length)

    })
  })
})
//

//
//   describe('deletion of a note', () => {
//     test('succeeds with status code 204 if id is valid', async () => {
//       const notesAtStart = await helper.notesInDb()
//       const noteToDelete = notesAtStart[0]
//
//       await api
//         .delete(`/api/notes/${noteToDelete.id}`)
//         .expect(204)
//
//       const notesAtEnd = await helper.notesInDb()
//
//       expect(notesAtEnd).toHaveLength(
//         helper.initialNotes.length - 1
//       )
//
//       const contents = notesAtEnd.map(r => r.content)
//
//       expect(contents).not.toContain(noteToDelete.content)
//     })
//   })
// })
//
// describe('when there is initially one user at db', () => {
//   beforeEach(async () => {
//     await User.deleteMany({})
//
//     const passwordHash = await bcrypt.hash('sekret', 10)
//     const user = new User({ username: 'root', passwordHash })
//
//     await user.save()
//   })
//
//   test('creation succeeds with a fresh username', async () => {
//     const usersAtStart = await helper.usersInDb()
//
//     const newUser = {
//       username: 'mluukkai',
//       name: 'Matti Luukkainen',
//       password: 'salainen',
//     }
//
//     await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)
//
//     const usersAtEnd = await helper.usersInDb()
//     expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
//
//     const usernames = usersAtEnd.map(u => u.username)
//     expect(usernames).toContain(newUser.username)
//   })
//
//   test('creation fails with proper statuscode and message if username already taken', async () => {
//     const usersAtStart = await helper.usersInDb()
//
//     const newUser = {
//       username: 'root',
//       name: 'Superuser',
//       password: 'salainen',
//     }
//
//     const result = await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(400)
//       .expect('Content-Type', /application\/json/)
//
//     expect(result.body.error).toContain('expected `username` to be unique')
//
//     const usersAtEnd = await helper.usersInDb()
//     expect(usersAtEnd).toHaveLength(usersAtStart.length)
//   })
// })

afterAll(async () => {
  await mongoose.connection.close()
})