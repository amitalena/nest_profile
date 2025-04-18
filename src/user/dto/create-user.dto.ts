/* eslint-disable prettier/prettier */
export class CreateUserDto {
    name: string;
    email: string;
    password: string;
}


// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable prettier/prettier */
// import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// export class CreateUserDto {
//     @IsNotEmpty()
//     name: string;

//     @IsEmail()
//     email: string;

//     @MinLength(6)
//     password: string;
// }
