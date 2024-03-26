import { registerDecorator, ValidationOptions } from 'class-validator';

export const IsUsername = (
  validationOptions?: ValidationOptions,
  propertyNameKr?: string,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isUsername',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyNameKr} 항목은 영어 소문자/숫자/언더스코어(_)만 입력 가능합니다`,
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          if (!value) {
            return false;
          }
          const regexIt = value.match(/^[a-z][a-z0-9_]*$/);
          if (!regexIt) return false;
          return true;
        },
      },
    });
  };
};
