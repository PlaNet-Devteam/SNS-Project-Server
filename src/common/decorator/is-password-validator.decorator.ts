import { registerDecorator, ValidationOptions } from 'class-validator';

export const IsPassword = (
  validationOptions?: ValidationOptions,
  propertyNameKr?: string,
) => {
  return (object: object, propertyName: string) => {
    console.log(propertyName);
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyNameKr} 항목은 알파벳으로 구성된 최소 6자 이상 (최소 한 개 이상의 특수문자 및 숫자 포함) 이여야 합니다`,
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
