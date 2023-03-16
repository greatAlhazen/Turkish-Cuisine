import Joi from "joi";

export const foodSchema = Joi.object({
  food: Joi.object({
    title: Joi.string().required().max(25),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

export const commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(10),
  }),
});
