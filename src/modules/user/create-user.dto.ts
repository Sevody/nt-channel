export class CreateUserDto {
    first_name: string;

    last_name: string;

    gender: string;

    avatar: string;

    locale: string;

    [platform_id: string]: string;
}
