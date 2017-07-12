import { Router } from 'express'
import request from 'request'

const router = Router()

router.get('/load-book', function(req, res, next) {
  const url = decodeURIComponent(req.query.url)

  request(url, function (error, response, body) {
    res.send(body)
  });
})

export default router
