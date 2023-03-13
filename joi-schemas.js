import Joi from "joi";

const foodSchema = Joi.object({
  food: Joi.object({
    title: Joi.string().required().max(25),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

export default foodSchema;
