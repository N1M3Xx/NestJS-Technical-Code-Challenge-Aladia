import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(8000),
  GATEWAY_PORT: Joi.number().default(8000),
  AUTH_PORT: Joi.number().default(3001),
  AUTH_HOST: Joi.string().default("0.0.0.0"),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.number().default(15),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
});
