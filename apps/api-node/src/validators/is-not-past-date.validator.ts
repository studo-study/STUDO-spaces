import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotPastDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return true; // laat optional toe

          const date = new Date(value);
          const now = new Date();

          return date >= now;
        },
        defaultMessage(): string {
          return 'Date cannot be in the past';
        },
      },
    });
  };
}
