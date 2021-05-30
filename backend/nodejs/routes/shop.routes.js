const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const productModel = mongoose.model('product');

router
  .route('/products')
  .get(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
      const products = await productModel
        .find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await productModel.countDocuments();

      return res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page.toString(),
        count,
      });
    } catch (err) {
      return res.status(500).send({ successfull: false, error: err });
    }
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.brand && req.body.type) {
      if (req.user?.role != 'admin') {
        return res
          .status(403)
          .send({ successfull: false, error: 'No permission' });
      }

      productModel.findOne({ name: req.body.name }, (err, product) => {
        if (err)
          return res.status(500).send({ successfull: false, error: err });
        if (product) {
          return res.status(400).send({
            successfull: false,
            error: 'There is already a product with this name',
          });
        } else {
          const product = new productModel({ ...req.body });
          product.save((error) => {
            if (error)
              return res.status(500).send({
                successfull: false,
                error: 'There is an error durin save.',
              });
            return res
              .status(200)
              .send({ successfull: true, msg: 'Successfull save' });
          });
        }
      });
    } else {
      return res.status(400).send({
        successfull: false,
        error: 'Name, brand and type are required.',
      });
    }
  })
  .put((req, res, next) => {
    const { _id, ...productValues } = req.body;
    if (req.user?.role != 'admin') {
      return res
        .status(403)
        .send({ successfull: false, error: 'No permission' });
    }
    if (_id) {
      productModel.findByIdAndUpdate(_id, productValues, (err, product) => {
        if (err)
          return res.status(500).send({ successfull: false, error: err });
        else {
          return res
            .status(200)
            .send({ successfull: true, msg: 'Successfully saved.' });
        }
      });
    } else {
      return res
        .status(400)
        .send({ successfull: false, error: 'No id provided' });
    }
  });

router
  .route('/products/:id')
  .get((req, res, next) => {
    productModel.findById(req.params.id, (err, product) => {
      if (err)
        return res.status(500).send({
          successfull: false,
          error: 'An error happened or there is no product with this id.',
        });
      return res.status(200).send(product);
    });
  })
  .post((req, res, next) => {
    if (req.user?.role != 'admin') {
      return res
        .status(403)
        .send({ successfull: false, error: 'No permission' });
    }
    productModel.findByIdAndUpdate(req.params.id, req.body, (err, product) => {
      if (err)
        return res.status(500).send({
          successfull: false,
          error: 'An error happened on the server.',
        });
      if (!product)
        return res.status(400).send({
          successfull: false,
          error: 'There is no product with this id.',
        });
      return res
        .status(200)
        .send({ successfull: true, msg: 'Successfully saved' });
    });
  })
  .delete((req, res) => {
    if (req.user?.role != 'admin') {
      return res
        .status(403)
        .send({ successfull: false, error: 'No permission' });
    }
    productModel.findByIdAndDelete(
      req.params.id,
      { useFindAndModify: true },
      (err, product) => {
        if (err)
          return res.status(400).send({
            successfull: false,
            error: 'There is no product with this Id.',
          });
        if (!product)
          return res.status(400).send({
            successfull: false,
            error: 'There is no product with this id.',
          });
        return res
          .status(200)
          .send({ successfull: true, msg: 'Successfully deleted.' });
      }
    );
  });
module.exports = router;
