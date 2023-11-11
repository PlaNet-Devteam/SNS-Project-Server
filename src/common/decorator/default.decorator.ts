import { Transform } from 'class-transformer';

export const Default = (defaultValue: any): PropertyDecorator => {
  return Transform(({ value }) => value || defaultValue);
};
