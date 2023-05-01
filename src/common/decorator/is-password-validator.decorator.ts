import { registerDecorator, ValidationOptions } from 'class-validator';

export const IsPassword = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Password does not comply with password security policy',
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          if (!value) {
            return false;
          }
          const regexIt = value.match(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&+_()^%=;?`~-])[A-Za-z\d$@$!%*#?&+_()^%=;?`~-]{6,}$/,
          );
          if (!regexIt) return false;
          return true;
        },
      },
    });
  };
};
