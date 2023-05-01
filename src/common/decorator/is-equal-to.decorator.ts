import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsEqualTo = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: 'Do not match.',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || value === '') {
            return false;
          }
          const [retryAttempt] = args.constraints;
          let attempt = (args.object as any)[retryAttempt];
          if (attempt !== value) {
            return false;
          }
          return true;
        },
      },
    });
  };
};
