
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, serverConfig.uploadPath)
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname)
//   }
// })
// console.log("User initiated")
// router.post('/', function (req, res, next) {
//   var query = {}
//   console.log(req.query)
//   console.log("reqbody")
//   res.send(123)
//   if (req.query.userName) {
//     query.userName = req.query.userName
//     User.findOne(query, 'userId userName', (err, user) => {
//       if (err) {
//         console.log('find user error ', err)
//         res.status(500).send('unable to find user')
//       } else {
//         res.send(user)
//       }
//     })
//   } else {
//     User.find('userId userName', (err, users) => {
//       if (err) {
//         console.log('find user error ', err)
//         res.status(500).send('unable to find user')
//       } else {
//         res.send(users)
//       }
//     })
//   }
// })

// // update
// router.put('/', function (req, res, next) {
//   var query = {
//     email: req.user.email
//   }
//   var updates = _.pick(req.body, ['firstName', 'lastName'])
//   console.log('updates', updates)
//   User.findOneAndUpdate(query, updates, (err, user) => {
//     if (err) {
//       console.log('find user error ', err)
//       res.status(500).send('unable to find user')
//     } else {
//       if (!user) {
//         res.status(500).send('unable to find user')
//       } else {
//         res.send('user update success')
//       }
//     }
//   })
// })

// // logout
// router.get('/logout', function (req, res, next) {
//   res.clearCookie('auth').send('logout success')
// })
// module.exports = router