export default class AuthDto {
  constructor(
    readonly id: number,
    readonly username: string,
    readonly password: string,
    readonly token: string,
    readonly roles: string[]
  ) {}
}
