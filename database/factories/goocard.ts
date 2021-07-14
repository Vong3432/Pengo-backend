import Factory from '@ioc:Adonis/Lucid/Factory'
import GooCard from 'App/Models/GooCard';

export const GooCardFactory = Factory
  .define(GooCard, ({ faker }) => {
    return {
      pin: faker.random.alphaNumeric(5)
    }
  })
  .build()
